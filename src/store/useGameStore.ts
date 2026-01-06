import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
    isPlaying: boolean;
    score: number;
    highScore: number;
    isGameOver: boolean;
    startGame: () => void;
    endGame: (finalScore: number) => void;
    resetGame: () => void;
    setScore: (score: number) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            isPlaying: false,
            isGameOver: false,
            score: 0,
            highScore: 0,
            startGame: () => set({ isPlaying: true, isGameOver: false, score: 0 }),
            endGame: (finalScore) =>
                set((state) => ({
                    isPlaying: false,
                    isGameOver: true,
                    highScore: Math.max(state.highScore, finalScore),
                })),
            resetGame: () => set({ isPlaying: false, isGameOver: false, score: 0 }),
            setScore: (score) => set({ score }),
        }),
        {
            name: 'arcade-game-storage',
            partialize: (state) => ({ highScore: state.highScore }), // Only persist highScore
        }
    )
);
