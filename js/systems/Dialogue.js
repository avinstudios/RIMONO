class Dialogue {
    static displayDialogue(speaker, text) {
        const speakerElement = document.getElementById('speaker-name');
        const textElement = document.getElementById('dialogue-text');
        const dialogueBox = document.getElementById('dialogue-box');

        if (speakerElement) speakerElement.textContent = speaker;
        if (textElement) textElement.textContent = text;
        if (dialogueBox) dialogueBox.classList.remove('hidden');
    }

    static hideDialogue() {
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) dialogueBox.classList.add('hidden');
    }

    static getNPCDialogueVariant(npc, context = {}) {
        // Different dialogue based on game state
        if (context.hasItem) {
            return `Oh! You found it! Thank you so much!`;
        }

        if (context.playerLevel && context.playerLevel > 5) {
            return `Wow, you're very strong! Welcome, hero!`;
        }

        return npc.getCurrentDialogue();
    }

    static createDialogueTree(conversations) {
        return conversations.map(conv => ({
            speaker: conv.speaker || 'Unknown',
            text: conv.text || '',
            next: conv.next || null,
            choices: conv.choices || null
        }));
    }

    static parseDialogue(text) {
        // Support for rich text formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]/g, '<span class="highlight">$1</span>');
    }
}
