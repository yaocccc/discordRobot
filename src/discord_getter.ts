import { Client, GatewayIntentBits, Guild, TextChannel, REST, Routes, Partials, NonThreadGuildBasedChannel, Message } from 'discord.js';
import { config, runConfig } from './config';

const run = async () => {
    await runConfig();
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
    });
    client.once('ready', async () => {
        const guilds = await client.guilds.fetch();
        console.log(guilds);
        const _guild = guilds.get(config().discordGuildId);
        const guild = await _guild.fetch();
        const channels = await guild.channels.fetch();
        console.log(channels);
        channels.forEach((v, k) => {
            console.log(k, v.name);
        });
    });

    console.log(config())
    await client.login(config().discordToken);
};

run();

// 1049607633293819934 区块律动
// 1049607877255503932 panews
// 1049607943886209034 深潮
// 1049608642917302313 推特-名人
// 1049610130901176341 链上异动
// 1049612903113818122 机构持仓
// 1050296604529270824 coindesk
// 1050296682547531827 cointelegraph
// 1050296828412825631 chainfeeds
// 1050297075427983431 链捕手
// 1050299002110890025 常用工具
// 1050346402405949491 ico资讯
// 1051083126383845396 推特-交易所
// 1051084100489973851 推特-kol
// 1051088935658463232 推特-机构
