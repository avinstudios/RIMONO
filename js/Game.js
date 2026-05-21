class Game {
    constructor() {
        // Core systems
        this.input = new InputHandler();
        this.renderer = new RenderingEngine('gameCanvas');
        this.map = new Map(50, 50);
        this.story = new Story();

        // Game entities
        this.player = new Player(new Vector2(512, 384));
        this.companion = new Companion(new Vector2(500, 320));
        this.companionAI = new CompanionAI(this.companion);

        this.enemies = [];
        this.npcs = [];
        this.particles = [];

        // Game state
        this.isRunning = true;
        this.isPaused = false;
        this.gameTime = 0;
        this.frameCount = 0;

        // Setup
        this.setupEntities();
        this.setupEventListeners();
        this.showInitialChapter();

        // Start game loop
        this.lastFrameTime = Date.now();
        this.gameLoop = setInterval(() => this.update(), 1000 / 60); // 60 FPS
    }

    setupEntities() {
        // Add player and companion to map
        this.map.addEntity(this.player);
        this.map.addEntity(this.companion);

        // Create NPCs
        const elder = new NPC(
            new Vector2(300, 300),
            "Village Elder",
            [
                "Welcome, brave adventurer!",
                "The darkness spreads... will you help?",
                "There's an ancient artifact in the forest.",
                "Good luck, hero..."
            ]
        );

        const merchant = new NPC(
            new Vector2(400, 400),
            "Merchant",
            [
                "Welcome to my shop!",
                "I have potions and supplies.",
                "The artifacts you find are valuable.",
                "Come again soon!"
            ]
        );

        this.npcs.push(elder, merchant);
        this.map.addEntity(elder);
        this.map.addEntity(merchant);

        // Create enemies
        this.spawnEnemies();
    }

    spawnEnemies() {
        const positions = [
            new Vector2(700, 300),
            new Vector2(750, 450),
            new Vector2(600, 500),
            new Vector2(800, 600)
        ];

        positions.forEach((pos, index) => {
            const enemy = new Enemy(pos, 30 + index * 5, `Enemy ${index + 1}`);
            this.enemies.push(enemy);
            this.map.addEntity(enemy);
        });
    }

    setupEventListeners() {
        // Interact with NPCs
        window.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.code === 'KeyE') {
                this.checkNPCInteraction();
            }
        });

        // Continue dialogue
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                this.continueDialogue();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('gameCanvas');
            this.renderer.resize(canvas.width, canvas.height);
        });
    }

    checkNPCInteraction() {
        const interactionRange = 100;

        for (const npc of this.npcs) {
            if (this.player.position.distance(npc.position) < interactionRange) {
                const dialogue = npc.interact();
                if (dialogue) {
                    this.player.disable();
                    Dialogue.displayDialogue(dialogue.speaker, dialogue.text);
                    this.currentInteractingNPC = npc;
                }
                break;
            }
        }
    }

    continueDialogue() {
        if (this.currentInteractingNPC) {
            this.currentInteractingNPC.nextDialogue();
            const dialogue = this.currentInteractingNPC.interact();
            if (dialogue) {
                Dialogue.displayDialogue(dialogue.speaker, dialogue.text);
            } else {
                Dialogue.hideDialogue();
                this.player.enable();
                this.currentInteractingNPC = null;
            }
        }
    }

    update() {
        if (!this.isRunning) return;

        // Update game time
        this.gameTime += 1 / 60;
        this.frameCount++;

        // Update map and entities
        this.map.update(1 / 60);

        // Update player
        this.player.update(1 / 60, this.input, this.map);

        // Update companion AI
        this.companionAI.update(this.player, this.enemies.filter(e => e.isActive));
        this.companion.update(1 / 60);

        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(1 / 60, this.player);
        });

        // Handle collisions
        this.handleCollisions();

        // Handle player attacks
        if (this.input.isActionPressed('attack')) {
            const enemiesHit = Combat.handlePlayerAttack(this.player, this.enemies.filter(e => e.isActive));
            enemiesHit.forEach(hit => {
                this.createHitEffect(hit.enemy.position);
            });
        }

        // Update HUD
        this.updateHUD();

        // Check game state
        this.checkGameState();

        // Render
        this.render();
    }

    handleCollisions() {
        // Entity-entity collisions
        const activeEntities = [this.player, this.companion, ...this.enemies.filter(e => e.isActive)];

        for (let i = 0; i < activeEntities.length; i++) {
            for (let j = i + 1; j < activeEntities.length; j++) {
                if (Collision.checkEntityCollision(activeEntities[i], activeEntities[j])) {
                    Collision.resolveCollision(activeEntities[i], activeEntities[j]);
                }
            }
        }

        // Enemy collision with map
        this.enemies.forEach(enemy => {
            if (!this.map.isWalkable(enemy.position, enemy.width)) {
                enemy.velocity = new Vector2(0, 0);
            }
        });
    }

    createHitEffect(position) {
        // Simple particle effect
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5;
            const particle = {
                position: position.clone(),
                velocity: new Vector2(Math.cos(angle), Math.sin(angle)).multiply(2),
                life: 30,
                maxLife: 30,
                size: 4,
                color: '#ff6b6b'
            };
            this.particles.push(particle);
        }
    }

    updateHUD() {
        // Update health bar
        const healthFill = document.getElementById('health-fill');
        const healthText = document.getElementById('health-text');

        if (healthFill) {
            const healthPercent = (this.player.health / this.player.maxHealth) * 100;
            healthFill.style.width = healthPercent + '%';
        }

        if (healthText) {
            healthText.textContent = `${Math.ceil(this.player.health)}/${this.player.maxHealth}`;
        }

        // Update companion status
        const companionStatus = document.getElementById('companion-status-text');
        if (companionStatus) {
            const distance = this.player.position.distance(this.companion.position);
            if (distance < 100) {
                companionStatus.textContent = 'With You';
            } else {
                companionStatus.textContent = 'Following';
            }
        }
    }

    checkGameState() {
        // Check if player died
        if (!this.player.isActive) {
            this.endGame(false);
        }

        // Check if all enemies defeated
        const aliveEnemies = this.enemies.filter(e => e.isActive);
        if (aliveEnemies.length === 0 && this.frameCount > 300) {
            this.spawnEnemies();
            if (this.story.currentChapter < 3) {
                this.story.advanceChapter();
            }
        }

        // Victory condition (reach chapter 3 and defeat enemies)
        if (this.story.currentChapter === 3 && aliveEnemies.length === 0) {
            this.endGame(true);
        }
    }

    render() {
        // Clear canvas
        this.renderer.clear('#1a1a1a');

        // Draw map
        this.renderer.drawMap(this.map);

        // Update camera
        this.renderer.updateCamera(this.player);

        // Draw entities
        this.renderer.drawNPC(this.companion); // Companion first (background)
        this.renderer.drawPlayer(this.player);

        // Draw NPCs
        this.npcs.forEach(npc => {
            if (this.map.entities.includes(npc)) {
                this.renderer.drawNPC(npc);
            }
        });

        // Draw enemies
        this.enemies.forEach(enemy => {
            if (enemy.isActive) {
                this.renderer.drawEnemy(enemy);
            }
        });

        // Draw particles
        this.particles = this.particles.filter(p => {
            this.renderer.drawParticle(p);
            p.life--;
            p.position = p.position.add(p.velocity);
            return p.life > 0;
        });

        // Draw FPS
        this.renderer.drawText(
            `FPS: ${Math.round(1000 / (Date.now() - this.lastFrameTime))} | Level: ${this.player.level}`,
            10, 30,
            { font: '12px Arial', color: '#0f0' }
        );

        this.lastFrameTime = Date.now();
    }

    endGame(victory) {
        this.isRunning = false;
        this.player.disable();

        const message = victory ?
            `You Win! You reached level ${this.player.level}!` :
            `Game Over! You reached level ${this.player.level}.`;

        this.story.triggerStoryEvent(message);

        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    showInitialChapter() {
        setTimeout(() => {
            this.story.displayChapterTitle();
        }, 500);
    }

    pause() {
        this.isPaused = !this.isPaused;
    }

    resume() {
        this.isPaused = false;
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new Game();
    console.log('RIMONO Game Started!');
});
