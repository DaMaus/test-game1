import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };
    private speed: number = 500;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'vikingo'); // We will create the 'player' texture via Graphics in Preload or Main
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDisplaySize(130, 80); // Resize ghost wider 130x80 (Wider)

        this.setCollideWorldBounds(true);

        // Setup inputs
        if (scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
            this.wasd = scene.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            }) as any;
        }
    }

    update() {
        if (!this.active) return;

        const { left, right, up, down } = this.cursors;
        const { left: wLeft, right: wRight, up: wUp, down: wDown } = this.wasd;

        let velocityX = 0;
        let velocityY = 0;

        if (left.isDown || wLeft.isDown) {
            velocityX = -this.speed;
        } else if (right.isDown || wRight.isDown) {
            velocityX = this.speed;
        }

        if (up.isDown || wUp.isDown) {
            velocityY = -this.speed;
        } else if (down.isDown || wDown.isDown) {
            velocityY = this.speed;
        }

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        this.setVelocity(velocityX, velocityY);
    }
}
