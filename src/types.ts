type RssFeed = {
    url: string;
    desc: string;
    cronTime: number;
    rss2json: boolean;
    template: string;
    channels: string[];
};

type Config = {
    discordToken: string;
    discordGuildId: string;
    chatGptChannelId: string;
    discordSelfId: string;
    appPort: number;
    chatGptToken: string;
    feeds: RssFeed[];
};

export { RssFeed, Config };
