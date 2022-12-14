type RssFeed = {
    url: string;
    desc: string;
    cronTime: number;
    rss2json: boolean;
    template: string;
    channels: string[];
};

type Config = {
    /** discord */
    discordToken: string;
    discordGuildId: string;
    discordSelfId: string;

    /** chatGpt */
    chatGptToken: string;
    chatGptChannelId: string;
    chatGptClearanceToken: string;
    chatGptUserAgent: string;

    /** app */
    appPort: number;

    /** rss */
    feeds: RssFeed[];
};

export { RssFeed, Config };
