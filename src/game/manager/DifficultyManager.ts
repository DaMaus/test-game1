export interface DifficultyParams {
    spearSpeed: number;
    telegraphDuration: number;
    spawnInterval: number;
    spearCount: number;
}

export class DifficultyManager {
    private startTime: number;

    // Config
    private readonly MAX_DIFFICULTY_TIME = 60 * 1000; // 1 minute to max difficulty

    // Min/Max values
    private readonly MIN_SPEED = 300;
    private readonly MAX_SPEED = 900;

    private readonly MAX_TELEGRAPH = 1500;
    private readonly MIN_TELEGRAPH = 400; // Reaction time limit

    private readonly MAX_INTERVAL = 1500;
    private readonly MIN_INTERVAL = 250;

    private readonly MIN_COUNT = 1;
    private readonly MAX_COUNT = 4; // Up to 4 spears at once

    constructor(scene: Phaser.Scene) {
        this.startTime = scene.time.now;
    }

    getParams(currentTime: number): DifficultyParams {
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.MAX_DIFFICULTY_TIME, 1); // 0 to 1

        // Ease functions? Linear is okay for now.
        // Maybe Quadratic for speed to make it ramp up faster at end?
        // Let's use Linear.

        const spearSpeed = Phaser.Math.Linear(this.MIN_SPEED, this.MAX_SPEED, progress);
        const telegraphDuration = Phaser.Math.Linear(this.MAX_TELEGRAPH, this.MIN_TELEGRAPH, progress);
        const spawnInterval = Phaser.Math.Linear(this.MAX_INTERVAL, this.MIN_INTERVAL, progress);
        const spearCount = Math.floor(Phaser.Math.Linear(this.MIN_COUNT, this.MAX_COUNT, progress));

        return {
            spearSpeed,
            telegraphDuration,
            spawnInterval,
            spearCount
        };
    }
}
