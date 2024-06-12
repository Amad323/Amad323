import React, { useEffect, useRef, useState } from 'react';

const GamePieces = ({ setScore, onGameOver }) => {
    const canvasRef = useRef();
    const SNAKE_SPEED = 10;
    const [snake, setSnake] = useState([{ x: 100, y: 50 }, { x: 95, y: 50 }]);
    const [food, setFood] = useState({ x: 180, y: 90 });
    const [direction, setDirection] = useState(null);
// useEffect
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        function drawSnake() {
            snake.forEach(snakePart => {
                ctx.beginPath();
                ctx.arc(snakePart.x, snakePart.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "yellow";
                ctx.fill();
                ctx.closePath();
            });
        }

        function drawFood() {
            ctx.beginPath();
            ctx.arc(food.x, food.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        }

        function moveSnake() {
            if (direction) {
                setSnake((prevSnake) => {
                    const newSnake = [...prevSnake];
                    const snakeHead = { ...newSnake[0] };

                    switch (direction) {
                        case "right":
                            snakeHead.x += SNAKE_SPEED;
                            break;
                        case "left":
                            snakeHead.x -= SNAKE_SPEED;
                            break;
                        case "up":
                            snakeHead.y -= SNAKE_SPEED;
                            break;
                        case "down":
                            snakeHead.y += SNAKE_SPEED;
                            break;
                        default:
                            break;
                    }

                    newSnake.pop();
                    newSnake.unshift(snakeHead);
                    handleFoodCollision(newSnake);
                    handleWallPassing(snakeHead, newSnake);
                    handleBodyCollision(newSnake);

                    return newSnake;
                });
            }
        }

        function handleBodyCollision(newSnake) {
            const snakeHead = newSnake[0];

            for (let i = 1; i < newSnake.length; i++) {
                if (snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y) {
                    onGameOver("self");
                }
            }
        }

        function handleWallPassing(snakeHead, newSnake) {
            if (snakeHead.x >= canvas.width) {
                snakeHead.x = 0;
            } else if (snakeHead.x < 0) {
                snakeHead.x = canvas.width - SNAKE_SPEED;
            }

            if (snakeHead.y >= canvas.height) {
                snakeHead.y = 0;
            } else if (snakeHead.y < 0) {
                snakeHead.y = canvas.height - SNAKE_SPEED;
            }

            newSnake[0] = snakeHead;
        }

        function handleFoodCollision(newSnake) {
            const snakeHead = newSnake[0];

            if (snakeHead.x === food.x && snakeHead.y === food.y) {
                setScore((prevScore) => prevScore + 1);

                setFood({
                    x: Math.floor((Math.random() * canvas.width) / SNAKE_SPEED) * SNAKE_SPEED,
                    y: Math.floor((Math.random() * canvas.height) / SNAKE_SPEED) * SNAKE_SPEED
                });

                newSnake.push({
                    x: newSnake[newSnake.length - 1].x,
                    y: newSnake[newSnake.length - 1].y
                });
            }
        }

        function handlePressKey(e) {
            switch (e.key) {
                case "ArrowRight":
                    setDirection("right");
                    break;
                case "ArrowLeft":
                    setDirection("left");
                    break;
                case "ArrowUp":
                    setDirection("up");
                    break;
                case "ArrowDown":
                    setDirection("down");
                    break;
                default:
                    break;
            }
        }

        window.addEventListener("keydown", handlePressKey);

        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSnake();
            drawFood();
            moveSnake();
        }, 100);

        return () => {
            clearInterval(interval);
            window.removeEventListener("keydown", handlePressKey);
        };
    }, [snake, direction, food]);

    return (
        <div>
            <canvas className='gameCanvas' ref={canvasRef} width={750} height={420} />
        </div>
    );
}

export default GamePieces;
