import { Recipe } from '../types/recipe';
import { recipeService } from './recipeService';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
    products?: Recipe[]; // Keeping the type as Recipe for now as it's the model, but renaming key
}

type Listener = (messages: Message[]) => void;

class ChatService {
    private messages: Message[] = [
        { id: '1', text: "Hey! I'm your Blue Crate assistant. I can help you find fresh groceries or ready-to-eat meals for instant delivery!", sender: 'bot', timestamp: Date.now() },
    ];
    private listeners: Listener[] = [];

    // Words to ignore when extracting intent
    private stopWords = new Set([
        'i', 'want', 'need', 'show', 'me', 'find', 'some', 'for', 'the', 'a', 'an',
        'grocery', 'item', 'buy', 'order', 'please', 'can', 'you', 'help',
        'with', 'get', 'give', 'suggest', 'looking', 'searching', 'product', 'food',
        'something', 'today', 'tonight', 'dinner', 'lunch', 'breakfast', 'hey', 'hi',
        'hello', 'assistant', 'delivery', 'any', 'available', 'to', 'make', 'and', 'or',
        'of', 'is', 'it', 'my', 'in', 'on', 'at'
    ]);

    getMessages() {
        return this.messages;
    }

    addMessage(message: Message) {
        this.messages = [...this.messages, message];
        this.notifyListeners();
    }

    setMessages(messages: Message[]) {
        this.messages = messages;
        this.notifyListeners();
    }

    /**
     * Extracts meaningful keywords from a natural language query
     */
    extractKeywords(text: string): string {
        const keywords = text
            .toLowerCase()
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove punctuation
            .split(/\s+/) // Split by whitespace
            .filter(word => word.length > 1 && !this.stopWords.has(word))
            .join(" ")
            .trim();

        return keywords;
    }

    async generateBotResponse(userInput: string) {
        try {
            const trimmedInput = userInput.trim();
            const keywords = this.extractKeywords(trimmedInput);

            let recipes: Recipe[] = [];
            let usedKeywords = trimmedInput;

            // Strategy 1: For long queries, keywords are usually better than full sentences
            if (trimmedInput.split(/\s+/).length > 2 && keywords) {
                recipes = await recipeService.searchRecipes(keywords);
                if (recipes.length > 0) {
                    usedKeywords = keywords;
                }
            }

            // Strategy 2: Try searching for the exact full input if no results yet
            if (recipes.length === 0) {
                recipes = await recipeService.searchRecipes(trimmedInput);
                if (recipes.length > 0) {
                    usedKeywords = trimmedInput;
                }
            }

            // Strategy 3: Extreme fallback - search for individual words if still empty
            if (recipes.length === 0 && keywords && keywords.includes(' ')) {
                const words = keywords.split(' ');
                for (const word of words) {
                    if (word.length > 2) {
                        const wordResults = await recipeService.searchRecipes(word);
                        if (wordResults.length > 0) {
                            recipes = [...recipes, ...wordResults];
                        }
                    }
                }
                // Unique results only
                recipes = Array.from(new Map(recipes.map(r => [r.id, r])).values());
                if (recipes.length > 0) {
                    usedKeywords = keywords;
                }
            }

            // Prepare response logic
            let responseText = '';
            let responseProducts: Recipe[] = [];

            if (recipes.length > 0) {
                const responses = [
                    `I found some great options for "${usedKeywords}"!`,
                    `Check out these products matching "${usedKeywords}":`,
                    `Here's what we have for "${usedKeywords}":`
                ];
                responseText = responses[Math.floor(Math.random() * responses.length)];
                responseProducts = recipes.slice(0, 5);
            } else {
                // Determine if greeting or general talk
                const greetings = ['hi', 'hello', 'hey', 'greetings', 'yo', 'sup'];
                const firstWord = trimmedInput.toLowerCase().split(' ')[0];

                if (greetings.includes(firstWord)) {
                    responseText = "Hello! I'm your Blue Crate personal shopper. Just tell me what you're looking for!";
                } else {
                    responseText = `I couldn't find matches for "${trimmedInput}" right now. Try searching for "Fresh Milk" or "Frozen Snacks"!`;
                }
            }

            const msg: Message = {
                id: Date.now().toString(),
                text: responseText,
                sender: 'bot',
                timestamp: Date.now(),
                products: responseProducts
            };

            this.addMessage(msg);
        } catch (error) {
            console.error("Bot response error:", error);
            this.addMessage({
                id: Date.now().toString(),
                text: "I'm having a little trouble connecting to the store right now. Please try again later!",
                sender: 'bot',
                timestamp: Date.now()
            });
        }
    }

    subscribe(listener: Listener) {
        this.listeners.push(listener);
        listener(this.messages);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l(this.messages));
    }
}

export const chatService = new ChatService();
