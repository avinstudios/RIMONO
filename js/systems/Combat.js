class Combat {
    static resolveCombat(attacker, defender, damage) {
        if (!defender.isActive) return 0;

        // Add some variance to damage
        const variance = damage * 0.2 * (Math.random() - 0.5);
        const totalDamage = Math.max(1, damage + variance);

        defender.takeDamage(totalDamage);

        return totalDamage;
    }

    static handlePlayerAttack(player, enemies) {
        const attack = player.attack();
        const enemiesHit = [];

        enemies.forEach(enemy => {
            const distance = player.position.distance(enemy.position);
            if (distance < attack.range) {
                const damage = this.resolveCombat(player, enemy, attack.power);
                enemiesHit.push({
                    enemy: enemy,
                    damage: damage
                });

                // Give experience for hitting
                player.gainExperience(Math.floor(damage * 2));
            }
        });

        return enemiesHit;
    }

    static handleEnemyAttack(enemy, player) {
        const distance = enemy.position.distance(player.position);
        if (distance < enemy.attackRange && enemy.attackCooldown === 0) {
            const damage = this.resolveCombat(enemy, player, enemy.attackPower);
            enemy.attackCooldown = 60;
            return damage;
        }
        return 0;
    }

    static calculateDamage(attacker, defender) {
        const baseDamage = attacker.attackPower || 10;
        const defense = defender.defense || 0;
        const variance = baseDamage * 0.3 * (Math.random() - 0.5);

        return Math.max(1, baseDamage - defense + variance);
    }

    static handleDefeatedEnemy(player, enemy) {
        player.gainExperience(enemy.experienceReward);
    }
}
