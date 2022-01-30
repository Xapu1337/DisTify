import {
    Collection,
    CommandInteraction,
    Message,
    PermissionResolvable,
} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import DisTifyClient from "./structs/DisTifyClient";

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * run: async({ interaction }) => {
 *
 * }
 * }
 */
export interface RunOptions {
    client: DisTifyClient;
    message: Message;
    args: string[];
}

type RunFunction = (options: RunOptions) => Promise<any>;

export type CommandType = {
    name: string;
    category?: string;
    aliases?: string[];
    ownerOnly?: boolean;
    description?: string;
    run: RunFunction;
};

export type SlashCommandType = {
    builder: {
        data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    };
    category: string;
    permissions: PermissionResolvable | string;
    run: (client: DisTifyClient, interaction: CommandInteraction) => Promise<any>;
};
