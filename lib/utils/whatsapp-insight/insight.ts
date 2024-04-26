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
        this.generateWordCloud();
    }

    analysis() {
        const analysis = {
            stats: {
                emoji: this.chatInsightsVars.emojidata,
                wordcloud: this.chatInsightsVars.worddata,
                timeline: null, // we will implement it later
                radarMap: null, // we will implement it later
                summary: this.chatSummary(),
                basedOnDays: this.generateStatsBasedOnDays(),
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

    /**
     * Generate word cloud of all the chat messages.
     */
    generateWordCloud() {
        const wordCloudData: WordCloudData = {};

        // Helper function to tokenize messages into words
        const tokenizeMessage = (message: string): string[] => {
            // Use regex to split message into words
            return message.toLowerCase().match(/\b\w+\b/g) || [];
        };

        // Count word usage for each user
        this.chatDatabase.forEach(message => {
            const author = message.author as string;
            if (!wordCloudData[author]) {
                wordCloudData[author] = {
                    wordStat: {
                        leastUsedWord: '',
                        mostUsedWord: ''
                    },
                    wordUsage: []
                };
            }
            const words = tokenizeMessage(message.message);
            words.forEach(word => {
                // Skip "<Media omitted>" and similar words
                if (!word.includes('<media') && !word.includes('omitted>')) {
                    const existingWordIndex = wordCloudData[author].wordUsage.findIndex(item => item.text === word);
                    if (existingWordIndex !== -1) {
                        wordCloudData[author].wordUsage[existingWordIndex].value++;
                    } else {
                        wordCloudData[author].wordUsage.push({ text: word, value: 1 });
                    }
                }
            });
        });

        // Calculate most and least used words for each user
        Object.keys(wordCloudData).forEach(username => {
            const userWordUsage = wordCloudData[username].wordUsage;
            const sortedWords = userWordUsage.sort((a, b) => b.value - a.value);
            wordCloudData[username].wordStat.mostUsedWord = sortedWords[0]?.text || '';
            wordCloudData[username].wordStat.leastUsedWord = sortedWords[sortedWords.length - 1]?.text || '';
        });

        // Calculate word usage for all users combined
        const allWordUsage: { [word: string]: number } = {};
        Object.values(wordCloudData).forEach(userWordData => {
            userWordData.wordUsage.forEach(({ text, value }) => {
                allWordUsage[text] = (allWordUsage[text] || 0) + value;
            });
        });

        // Find most and least used words for all users combined
        const sortedAllWords = Object.keys(allWordUsage).sort((a, b) => allWordUsage[b] - allWordUsage[a]);
        const mostUsedWordAll = sortedAllWords[0] || '';
        const leastUsedWordAll = sortedAllWords[sortedAllWords.length - 1] || '';

        // Add word cloud data for all users combined
        wordCloudData.All = {
            wordStat: {
                mostUsedWord: mostUsedWordAll,
                leastUsedWord: leastUsedWordAll
            },
            wordUsage: sortedAllWords.map(word => ({ text: word, value: allWordUsage[word] }))
        };

        // Assign word cloud data to class variable
        this.chatInsightsVars.worddata = wordCloudData;
    }

    /**
     * Chat insights based on days
     */
    generateStatsBasedOnDays(): BasedOnDaysData {
        const basedOnDaysData: BasedOnDaysData = {};

        // Helper function to get day of the week from a date string
        const getDayOfWeek = (dateString: Date): string => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date(dateString);
            return days[date.getDay()];
        };

        // Count messages for each day of the week
        const dayStats: { [day: string]: number } = {};
        this.chatDatabase.forEach(message => {
            const day = getDayOfWeek(message.date);
            dayStats[day] = (dayStats[day] || 0) + 1;
        });

        // Convert dayStats to array of DayStats objects
        const dayStatsArray: DayStats[] = Object.entries(dayStats).map(([day, count]) => ({ DAY: day, MESSAGE: count }));

        // Calculate average texts, least active day, and most active day
        const totalMessages = Object.values(dayStats).reduce((total, count) => total + count, 0);
        const averageTexts = totalMessages / 7;
        const leastActiveDay = Object.entries(dayStats).reduce((prev, [day, count]) => count < prev[1] ? [day, count] : prev, ['Sunday', Infinity])[0];
        const mostActiveDay = Object.entries(dayStats).reduce((prev, [day, count]) => count > prev[1] ? [day, count] : prev, ['Sunday', 0])[0];

        // Store data for all users combined
        basedOnDaysData.All = [dayStatsArray, {
            averageTexts,
            leastActiveDay,
            mostActiveDay
        }];

        // Store data for each user (excluding system)
        const users = new Set(this.chatDatabase.filter(message => message.author !== 'system').map(message => message.author as string));
        users.forEach(user => {
            basedOnDaysData[user] = [dayStatsArray, {
                averageTexts,
                leastActiveDay,
                mostActiveDay
            }];
        });

        return basedOnDaysData;
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

interface WordCloudData {
    [username: string]: {
        wordStat: {
            mostUsedWord: string;
            leastUsedWord: string;
        };
        wordUsage: {
            text: string;
            value: number;
        }[];
    };
};

interface DayStats {
    DAY: string;
    MESSAGE: number;
};

interface BasedOnDaysData {
    [username: string]: [DayStats[], {
        averageTexts: number;
        leastActiveDay: string;
        mostActiveDay: string;
    }];
};
