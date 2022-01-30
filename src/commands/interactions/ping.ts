import { SlashCommandBuilder } from "@discordjs/builders";
import {SlashCommand} from "../../types/structs/Command";

export default new SlashCommand({
    builder: {
        data: new SlashCommandBuilder().setName("ping").setDescription("ping pong"),
    },
    category: "ping",
    permissions: "EVERYONE",
    run: async (client, interaction) => {

    },
});
