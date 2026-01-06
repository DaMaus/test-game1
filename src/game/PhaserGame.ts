import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

export interface IGameConfig {
    parent: string;
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e', // Dark style
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false // Set to true for debugging
        }
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

let game: Phaser.Game | null = null;

export const createGame = (parent: string) => {
    if (game) return game;

    const gameConfig = { ...config, parent };
    game = new Phaser.Game(gameConfig);
    return game;
};

export const destroyGame = () => {
    if (game) {
        game.destroy(true);
        game = null;
    }
};

export const restartPhaserScene = () => {
    if (game) {
        const scene = game.scene.getScene('MainScene');
        if (scene) {
            scene.scene.restart();
        }
    }
};
