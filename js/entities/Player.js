/**
 * Player - Sunny, the main character
 * Sunny is a brave adventurer exploring the magical forest with his friend Will the Hero
 */
class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 32);
        this.type = 'player';
        this.name = 'Sunny';
        
        // Health system
        this.health = 100;
        this.maxHealth = 100;
        
        // Combat
        this.attackPower = 15;
        this.attackCooldown = 0;
        this.attackRange = 50;
        this.facing = 'down'; // up, down, left, right
        this.isAttacking = false;
        this.speed = 120;

        // Friendship system with Will the Hero
        this.willTheBond = 100; // Starting bond level
        this.maxBond = 100;
        
        // Story progression
        this.personalityShift = 0; // 0 = normal, 1 = completely changed by journey
        this.storiesExperienced = []; // Track major story events
        this.hasWill = false; // Whether Will the Hero has joined
        
        // Create simple player sprite
        this.sprite = this.createPlayerSprite();
    }

    createPlayerSprite() {
        // Simple pixel art player (Sunny)
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
     * Move Sunny
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
     * Heal Sunny
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

    /**
     * Friendship/Bond System with Will the Hero
     */
    
    /**
     * Strengthen bond with Will
     */
    strengthenBond(amount) {
        this.willTheBond = Math.min(this.willTheBond + amount, this.maxBond);
    }

    /**
     * Weaken bond with Will (used during emotional story events)
     */
    weakenBond(amount) {
        this.willTheBond = Math.max(this.willTheBond - amount, 0);
    }

    /**
     * Get bond percentage with Will
     */
    getBondPercent() {
        return this.willTheBond / this.maxBond;
    }

    /**
     * Get bond status description
     */
    getBondStatus() {
        const percent = this.getBondPercent();
        if (percent >= 0.9) return 'Unbreakable';
        if (percent >= 0.7) return 'Strong';
        if (percent >= 0.5) return 'Stable';
        if (percent >= 0.3) return 'Fragile';
        return 'Damaged';
    }

    /**
     * Recruit Will as companion
     */
    recruitWill() {
        this.hasWill = true;
        this.strengthenBond(10);
    }

    /**
     * Story progression tracking
     */
    addStoryEvent(eventName) {
        if (!this.storiesExperienced.includes(eventName)) {
            this.storiesExperienced.push(eventName);
        }
    }

    /**
     * Trigger personality shift (emotional transformation)
     */
    shiftPersonality(amount) {
        this.personalityShift = Math.min(this.personalityShift + amount, 1);
    }

    /**
     * Get personality shift state
     * 0 = Normal Sunny
     * 0.5 = Starting to change
     * 1 = Completely transformed
     */
    getPersonalityShift() {
        return this.personalityShift;
    }

    /**
     * Check if Sunny has been fundamentally changed
     */
    hasBeenTransformed() {
        return this.personalityShift >= 1;
    }
}
