import React, { useEffect, useRef } from 'react';
import { createGame, destroyGame } from '../game/PhaserGame';

const GameCanvas: React.FC = () => {
    const gameContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gameContainer.current) {
            createGame('game-container');
        }

        return () => {
            destroyGame();
        };
    }, []);

    return (
        <div
            id="game-container"
            ref={gameContainer}
            style={{
                width: '800px',
                height: '600px',
                border: '4px solid #333',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        />
    );
};

export default GameCanvas;
