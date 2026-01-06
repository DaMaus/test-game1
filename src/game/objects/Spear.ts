import Phaser from 'phaser';

export default class Spear extends Phaser.Physics.Arcade.Sprite {
    private target: Phaser.GameObjects.Components.Transform;
    private spearState: 'TELEGRAPH' | 'FIRING' = 'TELEGRAPH';
    private telegraphTimer: Phaser.Time.TimerEvent;
    private speed: number = 400;
    private attackAngle: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        target: Phaser.GameObjects.Components.Transform,
        telegraphDuration: number,
        speed: number
    ) {
        super(scene, x, y, 'fantasma'); // Created via graphics
        this.target = target;
        this.speed = speed;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDisplaySize(110, 70); // Resize ghost slightly smaller than player

        // Initial state
        // this.setTint(0xffff00); // Removed tint
        this.setAlpha(0.6);

        // Start telegraph timer
        this.telegraphTimer = scene.time.delayedCall(telegraphDuration, () => {
            this.fire();
        });

        // Disable collision during telegraph
        if (this.body) (this.body as Phaser.Physics.Arcade.Body).enable = false;
    }

    update() {
        if (this.spearState === 'TELEGRAPH') {
            // Track player
            this.attackAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);

            // Orient sprite (Flip X if target is to the left)
            // If target.x < this.x, flip
            this.setFlipX(this.target.x < this.x);
        }

        // Cleanup if out of bounds
        if (this.spearState === 'FIRING') {
            const bounds = this.scene.physics.world.bounds;
            // extended bounds to ensure it leaves screen completely
            if (
                this.x < bounds.x - 300 ||
                this.x > bounds.right + 300 ||
                this.y < bounds.y - 300 ||
                this.y > bounds.bottom + 300
            ) {
                this.destroy();
            }
        }
    }

    private fire() {
        this.spearState = 'FIRING';
        // this.setTint(0xff0000); // Removed tint
        this.setAlpha(1);

        if (this.body) (this.body as Phaser.Physics.Arcade.Body).enable = true;

        // Calculate velocity vector from stored attack angle
        this.scene.physics.velocityFromRotation(this.attackAngle, this.speed, this.body!.velocity);
    }

    destroy(fromScene?: boolean) {
        if (this.telegraphTimer) this.telegraphTimer.remove(false);
        super.destroy(fromScene);
    }
}
