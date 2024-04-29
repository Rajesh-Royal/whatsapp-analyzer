import { Message } from '../whatsapp-parser';
import emojiRegex from 'emoji-regex';

class GetWhatsappChatInsights {
    chatInsightsVars = {
        no_of_days: 0,
        totalwords: 0,
        worddata: {},
        userdata: {},
        emojidata: {} as EmojiData,
        groupName: '',
        uniqueUserNames: [] as string[],
    }
    chatDatabase: Message[] = [];

    constructor(chatDatabase: Message[], filename: string = '') {
        this.chatDatabase = chatDatabase;
        this.chatInsightsVars.groupName = filename.slice(19, -4);

        this.chatInsightsVars.uniqueUserNames = this.getUniqueUsernames()
        this.generateEmojiData();
        this.generateWordCloud();
    }

    analysis() {
        const analysis = {
            stats: {
                emoji: this.chatInsightsVars.emojidata,
                wordcloud: this.chatInsightsVars.worddata,
                timeline: this.generateChatTimeline(),
                radarMap: this.generateRadarMap(),
                summary: this.chatSummary(),
                basedOnDays: this.generateStatsBasedOnDays(),
                userspecific: this.generateUserSpecificInformation(),
            },
            usernames: this.chatInsightsVars.uniqueUserNames,
            groupName: this.chatInsightsVars.groupName,
            isDummyData: false
        };
        return analysis;
    }

    private isSystemUser(username: string | null): boolean {
        return username === 'system';
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
        const totalWords = this.chatDatabase.reduce((acc, item) => acc + item.message.length, 0);
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

    /**
     * Generates radar map data based on the chat messages.
     * Radar map data provides insights into the distribution of messages
     * throughout the day, including average texts per hour, least active hour,
     * and most active hour.
     * 
     * @returns Radar map data containing statistics and usage information.
     */
    generateRadarMap(): RadarMapData {
        const radarMapData: RadarMapData = {};

        // Helper function to get hour of the day from a date string
        const getHourOfDay = (dateString: Date): number => {
            const date = new Date(dateString);
            return date.getHours();
        };

        // Count messages for each hour of the day
        const hourStats: { [hour: number]: number } = {};
        this.chatDatabase.forEach(message => {
            const hour = getHourOfDay(message.date);
            hourStats[hour] = (hourStats[hour] || 0) + 1;
        });

        // Convert hourStats to array of RadarMapUsage objects
        const radarMapUsage: RadarMapUsage = Object.entries(hourStats).map(([time, count]) => ({ count, time: parseInt(time) }));

        // Calculate average texts per hour, least active hour, and most active hour
        const totalMessages = Object.values(hourStats).reduce((total, count) => total + count, 0);
        const averageTextsPerHour = totalMessages / 24;
        const leastActiveHour = Object.entries(hourStats).reduce((prev, [hour, count]) => count < prev[1] ? [hour, count] : prev, ['0', Infinity])[0];
        const mostActiveHour = Object.entries(hourStats).reduce((prev, [hour, count]) => count > prev[1] ? [hour, count] : prev, ['0', 0])[0];

        // Store data for all users combined
        radarMapData.All = {
            radarmapStat: {
                averageTextsPerHour,
                leastActiveHour,
                mostActiveHour
            },
            radarmapUsage: radarMapUsage
        };

        // Calculate and store data for each user (excluding system)
        const users = this.chatInsightsVars.uniqueUserNames.filter(author => author !== 'system');
        users.forEach(user => {
            const userMessages = this.chatDatabase.filter(message => message.author === user);

            // Count messages for each hour of the day for the current user
            const hourStatsUser: { [hour: number]: number } = {};
            userMessages.forEach(message => {
                const hour = getHourOfDay(message.date);
                hourStatsUser[hour] = (hourStatsUser[hour] || 0) + 1;
            });

            // Convert hourStatsUser to array of RadarMapUsage objects for the current user
            const radarMapUsageUser: RadarMapUsage = Object.entries(hourStatsUser).map(([time, count]) => ({ count, time: parseInt(time) }));

            // Calculate average texts per hour, least active hour, and most active hour for the current user
            const totalMessagesUser = Object.values(hourStatsUser).reduce((total, count) => total + count, 0);
            const averageTextsPerHourUser = totalMessagesUser / 24;
            const leastActiveHourUser = Object.entries(hourStatsUser).reduce((prev, [hour, count]) => count < prev[1] ? [hour, count] : prev, ['0', Infinity])[0];
            const mostActiveHourUser = Object.entries(hourStatsUser).reduce((prev, [hour, count]) => count > prev[1] ? [hour, count] : prev, ['0', 0])[0];

            // Store data for the current user
            radarMapData[user] = {
                radarmapStat: {
                    averageTextsPerHour: averageTextsPerHourUser,
                    leastActiveHour: leastActiveHourUser,
                    mostActiveHour: mostActiveHourUser
                },
                radarmapUsage: radarMapUsageUser
            };
        });

        return radarMapData;
    }

    /**
 * Generates the chat timeline for each user and 'All'.
 * 
 * @returns The chat timeline.
 */
generateChatTimeline(): ChatTimeline {
    const chatTimeline: ChatTimeline = {};
    const allTimelineUsage: { date: string, count: number }[] = [];

    this.chatDatabase.forEach(message => {
        const author = message.author;
        if (!this.isSystemUser(author) && author !== null) {
            const messageDate = new Date(message.date);
            const formattedDate = messageDate.toUTCString();
            
            // Update timeline for the author
            chatTimeline[author] = chatTimeline[author] || { timelineStat: { mostActiveDate: '', value: 0 }, timelineUsage: [] };
            const existingUsage = chatTimeline[author].timelineUsage.find(usage => usage.date === formattedDate);
            if (existingUsage) {
                existingUsage.count++;
            } else {
                chatTimeline[author].timelineUsage.push({ date: formattedDate, count: 1 });
            }

            // Update 'All' timeline
            const existingAllUsage = allTimelineUsage.find(usage => usage.date === formattedDate);
            if (existingAllUsage) {
                existingAllUsage.count++;
            } else {
                allTimelineUsage.push({ date: formattedDate, count: 1 });
            }
        }
    });

    // Calculate statistics for 'All'
    const mostActiveDateAll = allTimelineUsage.reduce((prev, curr) => curr.count > prev.count ? curr : prev).date;
    const mostActiveCountAll = allTimelineUsage.find(usage => usage.date === mostActiveDateAll)?.count || 0;
    chatTimeline.All = { timelineStat: { mostActiveDate: mostActiveDateAll, value: mostActiveCountAll }, timelineUsage: allTimelineUsage };

    // Calculate statistics for each user
    Object.keys(chatTimeline).forEach(author => {
        if (author !== 'All') {
            const timelineUsage = chatTimeline[author].timelineUsage;
            const mostActiveDate = timelineUsage.reduce((prev, curr) => curr.count > prev.count ? curr : prev).date;
            const mostActiveCount = timelineUsage.find(usage => usage.date === mostActiveDate)?.count || 0;
            chatTimeline[author].timelineStat = { mostActiveDate, value: mostActiveCount };
        }
    });

    return chatTimeline;
}


    /**
     * Generates user-specific information based on the messages.
     * 
     * @returns The user-specific information.
     */
    generateUserSpecificInformation(): UserSpecificInfo {
        const userSpecificInfo: UserSpecificInfo = {};

         // Helper function to get day of the week from a date string
         const getDayOfWeek = (dateString: Date): string => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date(dateString);
            return days[date.getDay()];
        };

        this.chatInsightsVars.uniqueUserNames.filter((username) => !this.isSystemUser(username)).forEach(username => {
            const userMessages = this.chatDatabase.filter(message => message.author === username && !this.isSystemUser(username));
            const totalMessages = userMessages.length;
            const totalDays = new Set(userMessages.map(message => new Date(message.date).toLocaleDateString())).size;
            const totalWords = userMessages.reduce((sum, message) => sum + message.message.split(/\s+/).length, 0);
            const totalEmojis = userMessages.reduce((sum, message) => {
                const emojisInMessage = message.message.match(emojiRegex());
                return sum + (emojisInMessage ? emojisInMessage.length : 0);
            }, 0);
            const totalMedia = userMessages.filter(message => message.message.includes('<Media omitted>')).length;
            const totalLinks = userMessages.filter(message => message.message.includes('http')).length;
            const messageDates = userMessages.map(message => new Date(message.date).getTime());
            const {maxMessageDate, minMessageDate} = {
                maxMessageDate: new Date(Math.max(...messageDates)),
                minMessageDate: new Date(Math.min(...messageDates)),
            }
            const mostActiveDate = maxMessageDate.toLocaleDateString();
            const leastActiveDate = minMessageDate.toLocaleDateString();
            const mostActiveDay = getDayOfWeek(maxMessageDate);
            const leastActiveDay = getDayOfWeek(minMessageDate);
            const averageMessagePerDay = totalDays ? totalMessages / totalDays : 0;
            const averageWordsPerMessage = totalMessages ? totalWords / totalMessages : 0;

            userSpecificInfo[username] = {
                averageMessagePerDay,
                averageWordsPerMessage,
                leastActiveDate,
                leastActiveDay,
                mostActiveDate,
                mostActiveDay,
                totalDays,
                totalEmojis,
                totalLinks,
                totalMedia,
                totalMessages,
                totalWords
            };
        });

        return userSpecificInfo;
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

// radar map types

type RadarMapStat = {
    averageTextsPerHour: number;
    leastActiveHour: string;
    mostActiveHour: string;
};

type RadarMapUsage = {
    count: number;
    time: number;
}[];

type RadarMapData = {
    [username: string]: {
        radarmapStat: RadarMapStat;
        radarmapUsage: RadarMapUsage;
    };
};

// timeline
interface ChatTimeline {
    [username: string]: {
        timelineStat: {
            mostActiveDate: string;
            value: number;
        };
        timelineUsage: {
            count: number,
            date: string,
        }[];
    };
}

// userspecific information

interface UserSpecificInfo {
    [username: string]: {
        averageMessagePerDay: number;
        averageWordsPerMessage: number;
        leastActiveDate: string;
        leastActiveDay: string;
        mostActiveDate: string;
        mostActiveDay: string;
        totalDays: number;
        totalEmojis: number;
        totalLinks: number;
        totalMedia: number;
        totalMessages: number;
        totalWords: number;
    };
}

