import { Client, Message, GatewayIntentBits, Guild, OAuth2Guild, TextChannel, REST, Routes, Partials, NonThreadGuildBasedChannel } from 'discord.js';
import { config } from './config';
import { sendChatGpt } from './chatgpt';
import {sleep} from './utils';

const runState = {
    runtime: Date.now(),
    channels: new Map<string, NonThreadGuildBasedChannel>(),
    sended: new Map<string, number>(),
};

const send = async (channelIds: string[], msgs: string[]) => {
    let count = 0;
    for (const channelId of channelIds) {
        const channel = runState.channels.get(channelId) as TextChannel;
        if (!channel) {
            continue;
        }

        for (const msg of msgs) {
            const key = `${channelId}-${msg}`;
            if (runState.sended.has(key)) continue;
            Date.now() - runState.runtime > 1000 * 60 && (await channel.send(msg)); // 启动后1分钟内不发送 避免启动时发送大量消息
            runState.sended.set(key, Date.now());
            count++;
        }
    }
    count && console.log('total sended count:', runState.sended.size, '| this time:', count);
};

// msg to chatGPT
const msgConsumer = async (msg: Message) => {
    if (msg.channelId != config().chatGptChannelId) return; // is robot chat
    if (msg.author.id == config().discordSelfId) return; // is self
    if (!['!', '！'].includes(msg.content.trim()[0])) return; // must start with "!" or "！"

    try {
        console.log(msg.content.trim().slice(1));
        const res = await sendChatGpt(msg.content.trim().slice(1));
        msg.reply(res);
    } catch (e) {
        console.log(e);
        msg.reply('好像出了点问题' + e);
    }
};

const run = async () => {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
    });
    client.once('ready', async () => {
        console.log('discord logined');
        const guilds = await client.guilds.fetch();
        const _guild = guilds.get(config().discordGuildId);
        while (1) { // 10分钟更新一次频道列表
            const guild = await _guild.fetch();
            runState.channels = await guild.channels.fetch();
            await sleep(1000 * 60 * 10);
        }
    });
    client.on('messageCreate', async (msg) => {
        msgConsumer(msg);
    });
    await client.login(config().discordToken);
};

const getChannelById = (id: string) => runState.channels.get(id) as TextChannel;

export { run as runDiscord, send as send, getChannelById };
