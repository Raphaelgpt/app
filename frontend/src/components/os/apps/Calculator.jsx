import React, { useState } from 'react';
import { Delete, Divide, X, Minus, Plus, Equal, Percent } from 'lucide-react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let newValue;

    switch (operation) {
      case '+':
        newValue = previousValue + inputValue;
        break;
      case '-':
        newValue = previousValue - inputValue;
        break;
      case '*':
        newValue = previousValue * inputValue;
        break;
      case '/':
        newValue = previousValue / inputValue;
        break;
      default:
        newValue = inputValue;
    }

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const Button = ({ onClick, className = '', children }) => (
    <button
      onClick={onClick}
      className={`h-14 rounded-md text-lg font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div data-testid="calculator" className="h-full bg-[#1a1a1a] flex flex-col p-3">
      {/* Display */}
      <div className="mb-3 text-right">
        <div className="text-white/50 text-sm h-6">
          {previousValue !== null && `${previousValue} ${operation}`}
        </div>
        <div 
          data-testid="calc-display"
          className="text-white text-4xl font-light truncate"
        >
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1 flex-1">
        <Button onClick={percentage} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          <Percent className="w-5 h-5 mx-auto" />
        </Button>
        <Button onClick={clear} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          CE
        </Button>
        <Button onClick={clear} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          C
        </Button>
        <Button onClick={backspace} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          <Delete className="w-5 h-5 mx-auto" />
        </Button>

        <Button onClick={() => inputDigit(7)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">7</Button>
        <Button onClick={() => inputDigit(8)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">8</Button>
        <Button onClick={() => inputDigit(9)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">9</Button>
        <Button onClick={() => performOperation('/')} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          <Divide className="w-5 h-5 mx-auto" />
        </Button>

        <Button onClick={() => inputDigit(4)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">4</Button>
        <Button onClick={() => inputDigit(5)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">5</Button>
        <Button onClick={() => inputDigit(6)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">6</Button>
        <Button onClick={() => performOperation('*')} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          <X className="w-5 h-5 mx-auto" />
        </Button>

        <Button onClick={() => inputDigit(1)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">1</Button>
        <Button onClick={() => inputDigit(2)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">2</Button>
        <Button onClick={() => inputDigit(3)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">3</Button>
        <Button onClick={() => performOperation('-')} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          <Minus className="w-5 h-5 mx-auto" />
        </Button>

        <Button onClick={toggleSign} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">+/-</Button>
        <Button onClick={() => inputDigit(0)} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">0</Button>
        <Button onClick={inputDot} className="bg-[#3b3b3b] hover:bg-[#454545] text-white">,</Button>
        <Button onClick={() => performOperation('+')} className="bg-[#323232] hover:bg-[#3c3c3c] text-white">
          <Plus className="w-5 h-5 mx-auto" />
        </Button>

        <Button onClick={calculate} className="col-span-4 bg-[#60CDFF] hover:bg-[#4CC2FF] text-black">
          <Equal className="w-5 h-5 mx-auto" />
        </Button>
      </div>
    </div>
  );
};
