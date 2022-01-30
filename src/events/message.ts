import DisTifyClient from "../types/structs/DisTifyClient";
import {Message} from "discord.js";
import { Event } from "../types/events";
import {Command} from "../types/structs/Command";
import {CommandType} from "../types/commands";

export default new Event('messageCreate', (client: DisTifyClient, message: Message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;
    if (!message.content.startsWith(client.configuration.prefix)) return;

    const args = message.content.slice(client.configuration.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!client.commands["MESSAGES"].has(command)) return;

    const cmd: CommandType = client.commands["MESSAGES"].get(command);

    try {
        cmd.run({client, message, args});
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});
