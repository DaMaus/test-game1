import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Modal, Button, Typography } from 'antd';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { restartPhaserScene } from '../game/PhaserGame';
import asustadoImg from '../assets/asustado.png';

const { Title, Text } = Typography;

const GameOverlay: React.FC = () => {
    const { isPlaying, isGameOver, score, highScore, startGame } = useGameStore();

    const handleStart = () => {
        if (isGameOver) {
            restartPhaserScene();
        }
        startGame();
    };

    // If playing, no overlay
    if (isPlaying) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            pointerEvents: isPlaying ? 'none' : 'auto'
        }}>
            <Modal
                open={!isPlaying}
                footer={null}
                closable={false}
                centered
                mask={false} // We handle mask ourselves for better style control
                bodyStyle={{ textAlign: 'center', background: '#222', padding: '40px', borderRadius: '15px', border: '2px solid #555' }}
            >
                <Title level={1} style={{ color: isGameOver ? '#ff4d4f' : '#fff', marginBottom: 0 }}>
                    {isGameOver ? 'GAME OVER' : 'ARCADE SURVIVAL'}
                </Title>
                {isGameOver && <Text style={{ color: '#ffccc7', fontSize: '16px', display: 'block', marginBottom: '10px' }}>mia mia mia miauuu...</Text>}

                {isGameOver && (
                    <div style={{ margin: '20px 0' }}>
                        <img
                            src={asustadoImg}
                            alt="Scared Cat"
                            style={{ width: '100px', borderRadius: '10px', marginBottom: '10px' }}
                        />
                        <br />
                        <Text style={{ color: '#aaa', fontSize: '18px' }}>Score: </Text>
                        <Text strong style={{ color: '#fff', fontSize: '24px' }}>{score}</Text>
                        <br />
                        <Text style={{ color: '#aaa', fontSize: '14px' }}>Best: {highScore}</Text>
                    </div>
                )}

                {!isGameOver && (
                    <div style={{ margin: '20px 0' }}>
                        <Text style={{ color: '#ccc' }}>Dodge the telegraphing spears!</Text>
                        <br />
                        <Text style={{ color: '#888' }}>WASD / Arrows to Move</Text>
                    </div>
                )}

                <Button
                    type="primary"
                    size="large"
                    icon={isGameOver ? <ReloadOutlined /> : <PlayCircleOutlined />}
                    onClick={handleStart}
                    style={{ marginTop: '20px', height: '50px', width: '200px', fontSize: '18px' }}
                >
                    {isGameOver ? 'TRY AGAIN' : 'START GAME'}
                </Button>
            </Modal>
        </div>
    );
};

export default GameOverlay;
