import React from 'react';
import { ConfigProvider, theme } from 'antd';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import GameOverlay from './components/GameOverlay';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00b96b',
        },
      }}
    >
      <div className="app-container">
        <HUD />
        <GameCanvas />
        <GameOverlay />
      </div>
    </ConfigProvider>
  );
};

export default App;
