import React, { useState, useEffect } from 'react';
import { Input, Button, message, Card } from 'antd';

const NumberGuessingGame: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(10);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // random 1-100
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  // bat dau
  const startNewGame = () => {
    setRandomNumber(generateRandomNumber());
    setAttempts(10);
    setGameOver(false);
    setGameStarted(true);
    setGuess('');
  };

  // handle submit
  const handleGuess = () => {
    const guessNumber = parseInt(guess);
    
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      message.error('Vui lòng nhập một số từ 1 đến 100');
      return;
    }

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    if (guessNumber === randomNumber) {
      message.success('Chúc mừng! Bạn đã đoán đúng!');
      setGameOver(true);
    } else {
      if (newAttempts === 0) {
        message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
        setGameOver(true);
      } else {
        message.warning(
          guessNumber > randomNumber ? 'Bạn đoán quá cao!' : 'Bạn đoán quá thấp!'
        );
      }
    }
    setGuess('');
  };

  return (
    <Card title="Trò chơi đoán số" style={{ maxWidth: 500, margin: '20px auto' }}>
      <div style={{ textAlign: 'center' }}>
        {!gameStarted ? (
          <Button type="primary" onClick={startNewGame}>
            Bắt đầu chơi
          </Button>
        ) : (
          <div>
            <p>Số lượt còn lại: {attempts}</p>
            <Input
              placeholder="Nhập số từ 1-100"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={gameOver}
              onPressEnter={handleGuess}
              style={{ marginBottom: 16 }}
            />
            <Button 
              type="primary" 
              onClick={handleGuess} 
              disabled={gameOver || !guess}
              style={{ marginRight: 8 }}
            >
              Đoán
            </Button>
            <Button onClick={startNewGame}>
              Chơi lại
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default NumberGuessingGame;