import Phaser from 'phaser';
import Player from '../objects/Player';
import Spear from '../objects/Spear';
import { DifficultyManager } from '../manager/DifficultyManager';
import { useGameStore } from '../../store/useGameStore';

// Assets
import vikingoImg from '../../assets/vikingo.png';
import asustadoImg from '../../assets/asustado.png';
import fantasmaImg from '../../assets/fantasma.png';
import miauAudio from '../../assets/miau-triste.mp3';

export default class MainScene extends Phaser.Scene {
    private player!: Player;
    private spears!: Phaser.GameObjects.Group;
    private difficultyManager!: DifficultyManager;
    private nextSpawnTime: number = 0;
    private gameActive: boolean = false;

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('vikingo', vikingoImg);
        this.load.image('asustado', asustadoImg);
        this.load.image('fantasma', fantasmaImg);
        this.load.audio('miau-triste', miauAudio);
    }

    create() {
        // Stop any playing sounds (e.g. game over music from previous run)
        this.sound.stopAll();

        // Generate Textures (Simple flat colors)
        this.createTextures();

        // Reset basics
        this.gameActive = true;
        this.nextSpawnTime = 0;

        // Create Player
        this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height / 2);

        // Spear Group
        this.spears = this.add.group({
            runChildUpdate: true
        });

        // Difficulty
        this.difficultyManager = new DifficultyManager(this);

        // Collisions
        this.physics.add.overlap(this.player, this.spears, this.handlePlayerHit, undefined, this);

        // Score Timer (1 point per 100ms? Or just use time)
        // Prompt says "score increases according to time survived". 
        // Let's count seconds or ms.
        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                if (this.gameActive) {
                    const currentScore = useGameStore.getState().score + 10;
                    useGameStore.getState().setScore(currentScore);
                }
            }
        });

        // Notify React that game started
        useGameStore.getState().startGame();
    }

    createTextures() {
        if (!this.textures.exists('player')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x00ccff);
            g.fillRect(0, 0, 32, 32);
            g.generateTexture('player', 32, 32);
        }
        if (!this.textures.exists('spear')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xffffff);
            // Pointy shape? specific orientation?
            // Spear will point to right by default (0 rads)
            g.fillTriangle(0, 0, 0, 20, 60, 10); // x1,y1, x2,y2, x3,y3 
            // Wait, Triangle coords. 
            // Tip at (40, 10). Base at (0,0) and (0, 20).
            // Let's do a simple heavy rectangle for hitbox consistency + triangle tip
            // Or just a Rect for now.
            g.fillRect(0, 0, 40, 10);
            g.generateTexture('spear', 40, 10);
        }
    }

    update(time: number, _delta: number) {
        if (!this.gameActive) return;

        this.player.update();

        // Spawning Logic
        if (time > this.nextSpawnTime) {
            this.spawnSpear(time);
        }
    }

    spawnSpear(time: number) {
        const params = this.difficultyManager.getParams(time);

        const spawn = () => {
            // Random position around the screen edges
            const { width, height } = this.cameras.main;
            const padding = 200; // Increased padding to ensure ghosts mimic appearance from "nowhere"
            let x, y;

            // 0: Top, 1: Right, 2: Bottom, 3: Left
            const edge = Phaser.Math.Between(0, 3);
            switch (edge) {
                case 0: x = Phaser.Math.Between(0, width); y = -padding; break;     // Top
                case 1: x = width + padding; y = Phaser.Math.Between(0, height); break; // Right
                case 2: x = Phaser.Math.Between(0, width); y = height + padding; break; // Bottom
                case 3: x = -padding; y = Phaser.Math.Between(0, height); break;    // Left
                default: x = 0; y = 0;
            }

            const spear = new Spear(
                this,
                x,
                y,
                this.player,
                params.telegraphDuration,
                params.spearSpeed
            );
            this.spears.add(spear);
        };

        // Spawn one immediately
        spawn();

        // Spawn extra spears with slight delay? Or same time?
        // Prompt says "see max 2 at same time".
        // Let's spawn them in a small loop or burst
        for (let i = 1; i < params.spearCount; i++) {
            spawn();
        }

        // Schedule next spawn
        this.nextSpawnTime = time + params.spawnInterval;
    }

    handlePlayerHit(_player: any, _spear: any) {
        if (!this.gameActive) return;

        // Only hit if spear is firing? Or touch is deadly always?
        // match collision logic

        // If we assume telegraph is safe (it's "appearing"):
        // Prompt says "Aparece... Gira... Apunta... Se lanza... Si toca -> Game Over".
        // It implies collision matters. Usually telegraph is safe.
        // Let's check tint or alpha, or just property.
        // I can't easily access 'state' unless I cast or make it public. 
        // Let's just make collision only active during firing? 
        // Or simpler: disable body during telegraph.

        // In Spear.ts, I should disable body logic.
        // But body is needed for rotation? No. Body needed for velocity.
        // Let's check the tint color or something public.

        // Let's assume hitting the telegraph is safe.
        // I can fix this in Spear.ts by `this.body.enable = false` initally.
        // But I will fix Spear.ts in a second pass if needed.
        // For now, let's just trigger game over only if it's red (firing).

        // Check if "FIRING" (Red tint 0xff0000)
        // Check if "FIRING" (Red tint 0xff0000)
        // Since we removed tint, we rely on body enable.
        // If overlap triggers, it means body is enabled (firing).
        this.gameOver();
    }

    gameOver() {
        this.gameActive = false;
        this.physics.pause();
        this.player.setTexture('asustado');
        // this.player.setTint(0xff0000); // Remove tint to show image colors clearly

        this.sound.play('miau-triste', { volume: 0.12 });

        const finalScore = useGameStore.getState().score;
        useGameStore.getState().endGame(finalScore);
    }
}
