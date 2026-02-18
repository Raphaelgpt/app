#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

# Use the public endpoint from frontend .env
BASE_URL = "https://fluent-os-demo.preview.emergentagent.com/api"

class Windows11SimulationTester:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_user = None
        self.regular_user = None

    def run_test(self, name, func):
        """Run a single test and track results"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            success = func()
            if success:
                self.tests_passed += 1
                print(f"✅ Passed")
            else:
                print(f"❌ Failed")
            return success
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False

    def test_api_health(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            return response.status_code == 200 and "Windows 11 Simulation API" in response.text
        except Exception as e:
            print(f"API Health check failed: {e}")
            return False

    def test_admin_login(self):
        """Test admin login with SuperAdmin/AdminSuper"""
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"username": "SuperAdmin", "password": "AdminSuper"},
                timeout=10
            )
            data = response.json()
            if response.status_code == 200 and data.get("success"):
                self.admin_user = data.get("user")
                print(f"Admin user logged in: {self.admin_user.get('username')} ({self.admin_user.get('role')})")
                return True
            else:
                print(f"Admin login failed: {data.get('message', 'Unknown error')}")
                return False
        except Exception as e:
            print(f"Admin login error: {e}")
            return False

    def test_user_login(self):
        """Test regular user login with formateur1/01012000"""
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"username": "formateur1", "password": "01012000"},
                timeout=10
            )
            data = response.json()
            if response.status_code == 200 and data.get("success"):
                self.regular_user = data.get("user")
                print(f"Regular user logged in: {self.regular_user.get('username')} ({self.regular_user.get('role')})")
                return True
            else:
                print(f"User login failed: {data.get('message', 'Unknown error')}")
                return False
        except Exception as e:
            print(f"User login error: {e}")
            return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"username": "invalid", "password": "wrong"},
                timeout=10
            )
            data = response.json()
            # Should return 200 but success=false for invalid credentials
            return response.status_code == 200 and not data.get("success")
        except Exception as e:
            print(f"Invalid login test error: {e}")
            return False

    def test_get_users(self):
        """Test fetching users list"""
        try:
            response = requests.get(f"{self.base_url}/users", timeout=10)
            if response.status_code == 200:
                users = response.json()
                print(f"Found {len(users)} users")
                # Should have at least SuperAdmin and formateur1
                usernames = [u.get('username') for u in users]
                return 'SuperAdmin' in usernames and 'formateur1' in usernames
            return False
        except Exception as e:
            print(f"Get users error: {e}")
            return False

    def test_create_user(self):
        """Test creating a new user"""
        try:
            test_username = f"testuser_{datetime.now().strftime('%H%M%S')}"
            response = requests.post(
                f"{self.base_url}/users",
                json={
                    "username": test_username,
                    "password": "testpass123",
                    "role": "user"
                },
                timeout=10
            )
            if response.status_code == 200:
                user = response.json()
                print(f"Created user: {user.get('username')}")
                # Try to delete the user to clean up
                user_id = user.get('id')
                if user_id:
                    requests.delete(f"{self.base_url}/users/{user_id}")
                return user.get('username') == test_username
            return False
        except Exception as e:
            print(f"Create user error: {e}")
            return False

    def test_get_logs(self):
        """Test fetching login logs"""
        try:
            response = requests.get(f"{self.base_url}/logs", timeout=10)
            if response.status_code == 200:
                logs = response.json()
                print(f"Found {len(logs)} login log entries")
                # Should have logs from our previous login tests
                return len(logs) >= 2  # At least admin and user login
            return False
        except Exception as e:
            print(f"Get logs error: {e}")
            return False

    def test_broadcast_system(self):
        """Test broadcast creation and retrieval"""
        try:
            # Create broadcast
            broadcast_data = {
                "title": "Test Alert",
                "message": "This is a test broadcast message"
            }
            create_response = requests.post(
                f"{self.base_url}/broadcast?created_by=TestAdmin",
                json=broadcast_data,
                timeout=10
            )
            if create_response.status_code != 200:
                return False
            
            broadcast = create_response.json()
            print(f"Created broadcast: {broadcast.get('title')}")
            
            # Check active broadcast
            get_response = requests.get(f"{self.base_url}/broadcast/active", timeout=10)
            if get_response.status_code == 200:
                active = get_response.json()
                if active and active.get('id') == broadcast.get('id'):
                    # Clean up - dismiss broadcast
                    requests.delete(f"{self.base_url}/broadcast/{broadcast.get('id')}")
                    return True
            return False
        except Exception as e:
            print(f"Broadcast test error: {e}")
            return False

    def test_user_deletion_protection(self):
        """Test that SuperAdmin cannot be deleted"""
        try:
            # First get SuperAdmin's ID
            users_response = requests.get(f"{self.base_url}/users", timeout=10)
            if users_response.status_code != 200:
                return False
            
            users = users_response.json()
            superadmin = next((u for u in users if u.get('username') == 'SuperAdmin'), None)
            if not superadmin:
                return False
            
            # Try to delete SuperAdmin
            delete_response = requests.delete(f"{self.base_url}/users/{superadmin.get('id')}", timeout=10)
            # Should fail with 400 status
            return delete_response.status_code == 400
        except Exception as e:
            print(f"SuperAdmin deletion protection test error: {e}")
            return False

def main():
    print("🚀 Starting Windows 11 Simulation API Tests")
    print(f"Testing API at: {BASE_URL}")
    
    tester = Windows11SimulationTester()
    
    # Run all tests
    test_results = []
    
    # Basic connectivity
    test_results.append(tester.run_test("API Health Check", tester.test_api_health))
    
    # Authentication tests
    test_results.append(tester.run_test("Admin Login (SuperAdmin/AdminSuper)", tester.test_admin_login))
    test_results.append(tester.run_test("User Login (formateur1/01012000)", tester.test_user_login))
    test_results.append(tester.run_test("Invalid Login Rejection", tester.test_invalid_login))
    
    # User management tests
    test_results.append(tester.run_test("Get Users List", tester.test_get_users))
    test_results.append(tester.run_test("Create New User", tester.test_create_user))
    test_results.append(tester.run_test("SuperAdmin Deletion Protection", tester.test_user_deletion_protection))
    
    # Logs and broadcast tests
    test_results.append(tester.run_test("Get Login Logs", tester.test_get_logs))
    test_results.append(tester.run_test("Broadcast System", tester.test_broadcast_system))
    
    # Print summary
    print(f"\n📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"Success Rate: {success_rate:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())