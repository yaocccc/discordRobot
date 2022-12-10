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
