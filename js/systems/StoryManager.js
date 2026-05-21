// Story Manager handles game progression and story events
class StoryManager {
    constructor(dialogueManager) {
        this.dialogueManager = dialogueManager;
        this.currentChapter = 1;
        this.chaptersUnlocked = [1];
        this.storyEvents = {};
        this.worldChanged = false;
        this.emotionalShift = false;
        this.storyFlags = {
            metWill: false,
            firstCombat: false,
            reachedDeepForest: false,
            discoveredTruth: false,
            finalCombat: false,
            gameEnded: false
        };

        this.initializeStoryEvents();
        this.updateChapterDisplay();
    }

    initializeStoryEvents() {
        // Chapter 1: The Forest Awakens
        this.storyEvents['chapter1_start'] = {
            chapter: 1,
            condition: () => true,
            action: () => {
                this.storyFlags.metWill = true;
                this.dialogueManager.startDialogue('willIntroduction');
            }
        };

        // Chapter 1: First encounter
        this.storyEvents['chapter1_firstCombat'] = {
            chapter: 1,
            condition: () => this.storyFlags.metWill,
            action: () => {
                this.storyFlags.firstCombat = true;
                this.dialogueManager.startDialogue('forestEncounter');
            }
        };

        // Chapter 2: Deep Forest (triggers after exploring)
        this.storyEvents['chapter2_unlock'] = {
            chapter: 2,
            condition: () => this.storyFlags.firstCombat,
            action: () => {
                this.currentChapter = 2;
                this.chaptersUnlocked.push(2);
                this.updateChapterDisplay();
                this.dialogueManager.startDialogue('chapterTransition');
            }
        };

        // Chapter 3: Deep Forest exploration
        this.storyEvents['chapter3_deepForest'] = {
            chapter: 3,
            condition: () => this.storyFlags.reachedDeepForest,
            action: () => {
                this.currentChapter = 3;
                this.chaptersUnlocked.push(3);
                this.updateChapterDisplay();
            }
        };

        // Chapter 4: Truth Discovery (emotional shift begins)
        this.storyEvents['chapter4_truth'] = {
            chapter: 4,
            condition: () => this.storyFlags.discoveredTruth,
            action: () => {
                this.currentChapter = 4;
                this.chaptersUnlocked.push(4);
                this.emotionalShift = true;
                this.worldChanged = true;
                this.updateChapterDisplay();
                this.applyEmotionalShift();
                this.dialogueManager.startDialogue('finalChapter');
            }
        };

        // Final chapter
        this.storyEvents['chapterFinal_combat'] = {
            chapter: 5,
            condition: () => this.storyFlags.finalCombat,
            action: () => {
                this.currentChapter = 5;
                this.chaptersUnlocked.push(5);
                this.updateChapterDisplay();
            }
        };
    }

    // Trigger story event
    triggerEvent(eventKey) {
        const event = this.storyEvents[eventKey];
        if (event && event.condition()) {
            event.action();
            return true;
        }
        return false;
    }

    // Unlock next chapter
    unlockNextChapter() {
        const nextChapter = this.currentChapter + 1;
        if (!this.chaptersUnlocked.includes(nextChapter)) {
            this.chaptersUnlocked.push(nextChapter);
            this.currentChapter = nextChapter;
            this.updateChapterDisplay();
        }
    }

    // Update chapter display in HUD
    updateChapterDisplay() {
        const chapterNames = {
            1: 'Chapter 1: The Forest Awakens',
            2: 'Chapter 2: Deeper Paths',
            3: 'Chapter 3: Shadow and Light',
            4: 'Chapter 4: The Truth Revealed',
            5: 'Chapter 5: Echoes of Change'
        };

        const indicator = document.getElementById('storyChapter');
        if (indicator) {
            indicator.textContent = chapterNames[this.currentChapter] || 'Unknown Chapter';
        }
    }

    // Apply emotional shift to game world
    applyEmotionalShift() {
        // This will be used to change visual effects and tone
        document.body.style.filter = 'hue-rotate(-10deg) saturate(0.8)';
    }

    // Check if should show ending sequence
    shouldShowEnding() {
        return this.storyFlags.gameEnded;
    }

    // Mark story as ending
    triggerEnding() {
        this.storyFlags.gameEnded = true;
        this.emotionalShift = true;
        this.applyEmotionalShift();
        this.dialogueManager.startDialogue('victory');
    }

    // Set story flags
    setFlag(flagName, value) {
        if (this.storyFlags.hasOwnProperty(flagName)) {
            this.storyFlags[flagName] = value;
        }
    }

    // Get story flag
    getFlag(flagName) {
        return this.storyFlags[flagName] || false;
    }

    // Get current chapter
    getCurrentChapter() {
        return this.currentChapter;
    }

    // Get emotional shift state
    isEmotionalShift() {
        return this.emotionalShift;
    }

    // Get world changed state
    isWorldChanged() {
        return this.worldChanged;
    }
}
