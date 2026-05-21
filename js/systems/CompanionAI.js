class CompanionAI {
    constructor(companion) {
        this.companion = companion;
        this.player = null;
        this.followDistance = 60;
        this.separationDistance = 80;
        this.attackRange = 80;
    }

    update(player, enemies = []) {
        this.player = player;

        if (!this.player || !this.player.isActive) {
            this.companion.velocity = new Vector2(0, 0);
            return;
        }

        // Follow player
        this.followPlayer();

        // Attack enemies
        this.attackEnemies(enemies);

        // Update status
        this.updateStatus();
    }

    followPlayer() {
        const distanceToPlayer = this.companion.position.distance(this.player.position);

        if (distanceToPlayer > this.followDistance) {
            const direction = this.player.position.subtract(this.companion.position).normalize();
            this.companion.move(direction);
        } else if (distanceToPlayer < this.separationDistance) {
            // Separate to avoid overlapping
            const direction = this.companion.position.subtract(this.player.position).normalize();
            this.companion.move(direction.multiply(0.5));
        } else {
            this.companion.velocity = new Vector2(0, 0);
        }
    }

    attackEnemies(enemies) {
        if (!enemies || enemies.length === 0) return;

        // Find closest enemy
        let closestEnemy = null;
        let closestDistance = Infinity;

        enemies.forEach(enemy => {
            if (enemy.isActive) {
                const distance = this.companion.position.distance(enemy.position);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });

        if (closestEnemy && closestDistance < this.attackRange) {
            // Attack the enemy
            const damage = 8 + Math.random() * 4;
            closestEnemy.takeDamage(damage);
        }
    }

    updateStatus() {
        const statusText = document.getElementById('companion-status-text');
        if (!statusText) return;

        if (!this.player) {
            statusText.textContent = 'Lost';
        } else {
            const distance = this.companion.position.distance(this.player.position);
            if (distance < 150) {
                statusText.textContent = 'Nearby';
            } else {
                statusText.textContent = 'Following';
            }
        }
    }

    getCompanionHealth() {
        return this.companion.health;
    }

    setCompanionHealth(health) {
        this.companion.health = Math.max(0, health);
    }
}

// Companion entity
class Companion extends Entity {
    constructor(position = new Vector2(500, 384)) {
        super(position, 30, 38);
        this.name = "Will the Hero";
        this.health = 60;
        this.maxHealth = 60;
        this.speed = 2.8;
        this.role = 'warrior'; // warrior, healer, mage
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
    }
}
