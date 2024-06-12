import React, { useEffect, useState } from 'react'
import GamePieces from './GamePieces';

const GameState = () => {
    const [score, setScore] = useState(0);
    const [highscore, SetHighScore] = useState(parseInt(localStorage.getItem("highscore")) || 0);
    const [gameOver, SetGameOver] = useState(false);
    const [collision, SetCollision] = useState("");

function handleGameOver(type){
    SetGameOver(true);

    if(score > highscore){
        SetHighScore(score);

        localStorage.setItem("highScore", score.toString());
    }

    SetCollision(type);
}

function hanleResetGame(){
    setScore(0);
    SetGameOver(false);
}

useEffect(() => {
  const handlePressKey = (e) => {
    if (gameOver && e.key === "Enter") {
        hanleResetGame();
    }
  }

  window.addEventListener("keydown", handlePressKey);
}, [gameOver]);

    return (
        <div className='game_container'>
            <p className='score'>Score: {score}</p>
            <p className='high_socre'>High Score: {highscore}</p>

            {
                gameOver && (
                    <div className='game_over'>
                        <p>Game Over! {collision === "wall" ? "You Hit The Wall" : "You Ate YourSelf"}</p>
                        <p className='start_again'>Press Enter To Reset The Game</p>
                    </div>
                )
            }
            {
                    !gameOver && (
                    <GamePieces 
                    score={score}
                    setScore={setScore}
                    onGameOver={(type)=>handleGameOver(type)}
                     />
                    )
            }
        </div>
    )
}

export default GameState
