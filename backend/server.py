from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    username: str
    password: str
    role: str = "user"  # "admin" or "user"

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    role: str
    created_at: str

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    user: Optional[UserResponse] = None
    message: str

class LoginLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    success: bool
    ip_address: str
    timestamp: str
    role: Optional[str] = None

class BroadcastCreate(BaseModel):
    message: str
    title: str = "Alerte Système"

class BroadcastResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    message: str
    title: str
    created_by: str
    created_at: str
    is_active: bool

# ============== STARTUP ==============

@app.on_event("startup")
async def startup_db_client():
    # Initialize default users if not exist
    admin_exists = await db.users.find_one({"username": "SuperAdmin"})
    if not admin_exists:
        admin_user = {
            "id": str(uuid.uuid4()),
            "username": "SuperAdmin",
            "password": "AdminSuper",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logging.info("Admin user created: SuperAdmin")
    
    user_exists = await db.users.find_one({"username": "formateur1"})
    if not user_exists:
        default_user = {
            "id": str(uuid.uuid4()),
            "username": "formateur1",
            "password": "01012000",
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(default_user)
        logging.info("Default user created: formateur1")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ============== AUTH ROUTES ==============

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = await db.users.find_one(
        {"username": request.username, "password": request.password},
        {"_id": 0}
    )
    
    # Log the attempt
    log_entry = {
        "id": str(uuid.uuid4()),
        "username": request.username,
        "success": user is not None,
        "ip_address": "127.0.0.1",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "role": user["role"] if user else None
    }
    await db.login_logs.insert_one(log_entry)
    
    if user:
        return LoginResponse(
            success=True,
            user=UserResponse(
                id=user["id"],
                username=user["username"],
                role=user["role"],
                created_at=user["created_at"]
            ),
            message="Connexion réussie"
        )
    else:
        return LoginResponse(
            success=False,
            user=None,
            message="Identifiant ou mot de passe incorrect"
        )

# ============== USER MANAGEMENT (Admin) ==============

@api_router.get("/users", response_model=List[UserResponse])
async def get_users():
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return [UserResponse(
        id=u["id"],
        username=u["username"],
        role=u["role"],
        created_at=u["created_at"]
    ) for u in users]

@api_router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    # Check if username exists
    existing = await db.users.find_one({"username": user.username})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce nom d'utilisateur existe déjà"
        )
    
    new_user = {
        "id": str(uuid.uuid4()),
        "username": user.username,
        "password": user.password,
        "role": user.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(new_user)
    
    return UserResponse(
        id=new_user["id"],
        username=new_user["username"],
        role=new_user["role"],
        created_at=new_user["created_at"]
    )

@api_router.put("/users/{user_id}")
async def update_user(user_id: str, user: UserCreate):
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {
            "username": user.username,
            "password": user.password,
            "role": user.role
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {"message": "Utilisateur mis à jour"}

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    # Prevent deleting SuperAdmin
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user and user.get("username") == "SuperAdmin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer le compte SuperAdmin"
        )
    
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {"message": "Utilisateur supprimé"}

# ============== LOGS ==============

@api_router.get("/logs", response_model=List[LoginLog])
async def get_login_logs():
    logs = await db.login_logs.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    return logs

@api_router.delete("/logs")
async def clear_logs():
    await db.login_logs.delete_many({})
    return {"message": "Journaux effacés"}

# ============== BROADCAST ==============

@api_router.post("/broadcast", response_model=BroadcastResponse)
async def create_broadcast(broadcast: BroadcastCreate, created_by: str = "Admin"):
    # Deactivate all previous broadcasts
    await db.broadcasts.update_many({}, {"$set": {"is_active": False}})
    
    new_broadcast = {
        "id": str(uuid.uuid4()),
        "message": broadcast.message,
        "title": broadcast.title,
        "created_by": created_by,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True
    }
    await db.broadcasts.insert_one(new_broadcast)
    
    return BroadcastResponse(**new_broadcast)

@api_router.get("/broadcast/active")
async def get_active_broadcast():
    broadcast = await db.broadcasts.find_one({"is_active": True}, {"_id": 0})
    return broadcast

@api_router.delete("/broadcast/{broadcast_id}")
async def dismiss_broadcast(broadcast_id: str):
    await db.broadcasts.update_one(
        {"id": broadcast_id},
        {"$set": {"is_active": False}}
    )
    return {"message": "Broadcast fermé"}

# ============== STATUS ==============

@api_router.get("/")
async def root():
    return {"message": "Windows 11 Simulation API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
