class Enemy extends Entity {
    constructor(position, health = 30, name = "Enemy") {
        super(position, 36, 44);
        this.health = health;
        this.maxHealth = health;
        this.speed = 1.5;
        this.attackPower = 10;
        this.attackCooldown = 0;
        this.attackRange = 60;
        this.sightRange = 200;
        this.name = name;
        this.state = 'idle'; // idle, chase, attack
        this.target = null;
        this.patrolDistance = 100;
        this.patrolOrigin = position.clone();
        this.experienceReward = 50;
    }

    update(deltaTime, player = null) {
        super.update(deltaTime);

        if (this.health <= 0) {
            this.isActive = false;
            return;
        }

        // Update cooldowns
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        // AI behavior
        if (player && player.isActive) {
            const distanceToPlayer = this.position.distance(player.position);

            if (distanceToPlayer < this.attackRange) {
                // Attack
                this.state = 'attack';
                this.attack(player);
            } else if (distanceToPlayer < this.sightRange) {
                // Chase
                this.state = 'chase';
                this.chaseTarget(player);
            } else {
                // Patrol
                this.state = 'idle';
                this.patrol();
            }
        } else {
            this.patrol();
        }
    }

    chaseTarget(target) {
        const direction = target.position.subtract(this.position).normalize();
        this.move(direction);
    }

    patrol() {
        const distanceFromOrigin = this.position.distance(this.patrolOrigin);

        if (distanceFromOrigin > this.patrolDistance) {
            const direction = this.patrolOrigin.subtract(this.position).normalize();
            this.move(direction);
        } else if (Math.random() < 0.02) {
            const randomAngle = Math.random() * Math.PI * 2;
            const direction = new Vector2(Math.cos(randomAngle), Math.sin(randomAngle));
            this.move(direction);
        } else {
            this.velocity = new Vector2(0, 0);
        }
    }

    attack(player) {
        if (this.attackCooldown === 0) {
            player.takeDamage(this.attackPower);
            this.attackCooldown = 60; // Attack every 60 frames
        }
    }

    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        if (this.health === 0) {
            this.isActive = false;
        }
    }

    canSeeTarget(target) {
        return this.position.distance(target.position) < this.sightRange;
    }
}
