import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Card, Statistic, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { restartPhaserScene } from '../game/PhaserGame';

const HUD: React.FC = () => {
    const { score, highScore, isPlaying, startGame } = useGameStore();

    const handleRestart = () => {
        restartPhaserScene(); // We need to implement this
        startGame();
    };

    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '20px',
            zIndex: 10
        }}>
            <Card bordered={false} bodyStyle={{ padding: '10px 20px', background: 'rgba(0,0,0,0.7)', borderRadius: 10 }}>
                <Space size="large">
                    <Statistic
                        title={<span style={{ color: '#aaa' }}>Score</span>}
                        value={score}
                        valueStyle={{ color: '#fff' }}
                    />
                    <Statistic
                        title={<span style={{ color: '#aaa' }}>High Score</span>}
                        value={highScore}
                        valueStyle={{ color: '#ffd700' }}
                    />
                    {/* Restart button visible always or only when playing? Prompt says "HUD fijo con ... Botón de reiniciar" */}
                    <Button
                        type="primary"
                        danger
                        icon={<ReloadOutlined />}
                        onClick={handleRestart}
                    >
                        Restart
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default HUD;
