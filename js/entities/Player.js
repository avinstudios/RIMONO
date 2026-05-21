/**
 * Player - Player character
 */
class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 32);
        this.type = 'player';
        this.health = 100;
        this.maxHealth = 100;
        this.attackPower = 15;
        this.attackCooldown = 0;
        this.attackRange = 50;
        this.facing = 'down'; // up, down, left, right
        this.isAttacking = false;
        this.speed = 120;

        // Create simple player sprite
        this.sprite = this.createPlayerSprite();
    }

    createPlayerSprite() {
        // Simple pixel art player
        const colorData = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 15, 15, 14, 14, 15, 15, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 15, 14, 14, 14, 14, 15, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 15, 14, 14, 14, 14, 15, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 15, 15, 14, 14, 15, 15, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0,
            0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        const renderer = new RenderingEngine(document.createElement('canvas'));
        return renderer.createCharacterSprite(colorData, 32, 32);
    }

    update(deltaTime, map = null) {
        super.update(deltaTime, map);

        // Update cooldowns
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }

        this.isAttacking = false;
    }

    /**
     * Move player
     */
    move(direction) {
        if (!direction) {
            this.velocityX = 0;
            this.velocityY = 0;
            return;
        }

        this.velocityX = direction.x;
        this.velocityY = direction.y;

        // Update facing direction
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            this.facing = direction.x > 0 ? 'right' : 'left';
        } else {
            this.facing = direction.y > 0 ? 'down' : 'up';
        }
    }

    /**
     * Attack
     */
    attack() {
        if (this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackCooldown = 0.5; // 0.5 second cooldown
            return true;
        }
        return false;
    }

    /**
     * Heal player
     */
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    /**
     * Take damage
     */
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        return this.health <= 0;
    }

    /**
     * Check if alive
     */
    isAlive() {
        return this.health > 0;
    }

    /**
     * Get health percentage
     */
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
}
