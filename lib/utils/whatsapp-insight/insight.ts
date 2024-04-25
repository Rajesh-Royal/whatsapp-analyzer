import { Message } from '../whatsapp-parser';
import emojiRegex from 'emoji-regex';

class GetWhatsappChatInsights {
    chatInsightsVars = {
        no_of_days: 0,
        totalwords: 0,
        worddata: {},
        userdata: {},
        emojidata: {} as EmojiData,
        fileName: '',
    }
    chatDatabase: Message[] = [];

    constructor(chatDatabase: Message[], filename: string = '') {
        this.chatDatabase = chatDatabase;
        this.chatInsightsVars.fileName = filename.slice(19, -4);

        this.generateEmojiData();
    }

    analysis() {
        const analysis = {
            stats: {
                emoji: this.chatInsightsVars.emojidata,
                wordcloud: this.chatInsightsVars.worddata,
                timeline: null, // we will implement it later
                radarMap: null, // we will implement it later
                summary: this.chatSummary(),
                basedOnDays: null, // we will implement it later
                userspecific: this.chatInsightsVars.userdata
            },
            usernames: this.getUniqueUsernames(),
            filename: this.chatInsightsVars.fileName,
            isDummyData: false
        };
        return analysis;
    }

    /**
     * Process all messages and return unique usernames.
     */
    getUniqueUsernames(): string[] {
        // Extract all usernames from messages
        const allUsernames: string[] = this.chatDatabase.map(message => message.author).filter(author => author !== null) as string[];
        // Use Set to get unique usernames
        const uniqueUsernames: string[] = [...new Set(allUsernames)];
        return uniqueUsernames;
    }

    /**
     * Generate emoji data based on the messages.
     */
    generateEmojiData() {
        const emojiData: EmojiData = {
            All: {
                emojiStat: {
                    emojiPerText: 0,
                    totalEmojis: 0,
                    totalUniqueEmojis: 0
                },
                emojiUsage: []
            }
        };
        const totalMessagesByUser: { [username: string]: number } = {};

        this.chatDatabase.forEach(message => {
            totalMessagesByUser[message.author as string] = (totalMessagesByUser[message.author as string] || 0) + 1;

            const emojisInMessage = message.message.match(emojiRegex());
            if (emojisInMessage) {
                emojisInMessage.forEach(emoji => {
                    const author = message.author as string;
                    if (!emojiData[author]) {
                        emojiData[author] = {
                            emojiStat: {
                                emojiPerText: 0,
                                totalEmojis: 0,
                                totalUniqueEmojis: 0
                            },
                            emojiUsage: []
                        };
                    }
                    const userEmojiData = emojiData[author];
                    userEmojiData.emojiStat.totalEmojis++;
                    const existingEmoji = userEmojiData.emojiUsage.find(e => e.emoji === emoji);
                    if (existingEmoji) {
                        existingEmoji.value++;
                    } else {
                        userEmojiData.emojiUsage.push({ emoji, value: 1 });
                    }
                });
            }
        });

        const totalMessagesForEachUser: Record<string, number> = {};

        // Calculate emoji statistics for each user
        Object.keys(emojiData).forEach(username => {
            const userEmojiData = emojiData[username];
            const totalMessages = totalMessagesByUser[username];
            userEmojiData.emojiStat.emojiPerText = userEmojiData.emojiStat.totalEmojis / totalMessages;
            userEmojiData.emojiStat.totalUniqueEmojis = userEmojiData.emojiUsage.length;
        });

        // Calculate emoji statistics for All users
        Object.values(emojiData).forEach(userEmojiData => {
            emojiData.All.emojiStat.totalEmojis += userEmojiData.emojiStat.totalEmojis;
            emojiData.All.emojiUsage.push(...userEmojiData.emojiUsage);
        });
        emojiData.All.emojiStat.emojiPerText = emojiData.All.emojiStat.totalEmojis / this.chatDatabase.length;
        emojiData.All.emojiStat.totalUniqueEmojis = [...new Set(emojiData.All.emojiUsage.map(emoji => emoji.emoji))].length;

        this.chatInsightsVars.emojidata = emojiData;
    }

    /**
     * Generate a summary of the whatsapp chat.
     */
    chatSummary(): { leastTexts: string; mostTexts: string; noOfLinks: number; totalDays: number; totalMedia: number; totalMessageExchanged: number; totalUsers: number; totalWords: number } {
        const messageCountByUser: { [username: string]: number } = {};
        let totalLinks = 0;
        let totalMedia = 0;
    
        // Count messages and links (excluding system messages)
        this.chatDatabase.forEach(message => {
            if (message.author !== "system") {
                const author = message.author as string;
                messageCountByUser[author] = (messageCountByUser[author] || 0) + 1;
                if (message.message.includes('http')) {
                    totalLinks++;
                }
                if (message.message.includes('<Media omitted>')) {
                    totalMedia++;
                }
            }
        });
    
        // Find user with least and most texts
        let leastTextsUser = '';
        let mostTextsUser = '';
        let leastTextsCount = Infinity;
        let mostTextsCount = 0;
        Object.entries(messageCountByUser).forEach(([user, count]) => {
            if (count < leastTextsCount) {
                leastTextsCount = count;
                leastTextsUser = user;
            }
            if (count > mostTextsCount) {
                mostTextsCount = count;
                mostTextsUser = user;
            }
        });
    
        // Calculate total days, total messages, total words, and total users
        const totalDays = Math.ceil((new Date(this.chatDatabase[this.chatDatabase.length - 1].date).getTime() - new Date(this.chatDatabase[0].date).getTime()) / (1000 * 60 * 60 * 24));
        const totalMessageExchanged = this.chatDatabase.filter(message => message.author !== "system").length;
        const totalWords = this.chatInsightsVars.totalwords;
        const totalUsers = Object.keys(messageCountByUser).length;
    
        return {
            leastTexts: leastTextsUser,
            mostTexts: mostTextsUser,
            noOfLinks: totalLinks,
            totalDays,
            totalMedia,
            totalMessageExchanged,
            totalUsers,
            totalWords
        };
    }

}

export default GetWhatsappChatInsights;


interface EmojiData {
    [username: string]: {
        emojiStat: {
            emojiPerText: number;
            totalEmojis: number;
            totalUniqueEmojis: number;
        };
        emojiUsage: {
            emoji: string;
            value: number;
        }[];
    };
}
