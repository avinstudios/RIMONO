class Story {
    constructor() {
        this.currentChapter = 1;
        this.chapters = this.initializeChapters();
        this.events = [];
        this.flags = {};
    }

    initializeChapters() {
        return [
            {
                number: 1,
                title: "The Beginning",
                description: "Your adventure starts in the peaceful village of Rimono...",
                events: [
                    "You wake up in the village",
                    "Meet Will, your companion",
                    "First enemies appear"
                ]
            },
            {
                number: 2,
                title: "The Dark Forest",
                description: "A sinister darkness spreads through the ancient forest...",
                events: [
                    "You venture into the forest",
                    "Encounter stronger enemies",
                    "Discover an ancient artifact"
                ]
            },
            {
                number: 3,
                title: "The Final Battle",
                description: "The moment of truth has arrived...",
                events: [
                    "Face the dark lord",
                    "Ultimate battle begins",
                    "Victory or defeat"
                ]
            }
        ];
    }

    getCurrentChapter() {
        return this.chapters[this.currentChapter - 1];
    }

    advanceChapter() {
        if (this.currentChapter < this.chapters.length) {
            this.currentChapter++;
            return this.displayChapterTitle();
        }
        return null;
    }

    displayChapterTitle() {
        const chapter = this.getCurrentChapter();
        const chapterDisplay = document.getElementById('chapter-display');
        const chapterTitle = document.getElementById('chapter-title');

        if (chapterDisplay && chapterTitle) {
            chapterTitle.textContent = `Chapter ${chapter.number}: ${chapter.title}`;
            chapterDisplay.classList.remove('hidden');

            setTimeout(() => {
                chapterDisplay.classList.add('hidden');
            }, 3000);
        }

        return chapter;
    }

    triggerStoryEvent(eventName) {
        const storyOverlay = document.getElementById('story-overlay');
        const storyText = document.getElementById('story-event-text');

        if (storyOverlay && storyText) {
            storyText.textContent = eventName;
            storyOverlay.classList.remove('hidden');

            setTimeout(() => {
                storyOverlay.classList.add('hidden');
            }, 2000);
        }
    }

    setFlag(flagName, value = true) {
        this.flags[flagName] = value;
    }

    getFlag(flagName) {
        return this.flags[flagName] || false;
    }

    checkAchievement(condition) {
        // Check if player meets achievement condition
        return condition();
    }
}
