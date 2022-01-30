
import { Interaction, MessageEmbed } from "discord.js";
import { Event } from "../types/events";
import DisTifyClient from "../types/structs/DisTifyClient";


export default new Event("interactionCreate", async(client: DisTifyClient, interaction: Interaction) => {
    if(interaction.isCommand()) {
        const command = client.commands["SLASH"].get(interaction.commandName);


        if(command) {
            switch(command.permissions) {
                case "EVERYONE":
                    command.run(client, interaction);
                    break;
                case "AUTHOR":
                    if (client.configuration.isOwner(interaction.user.id)) {
                        command.run(client, interaction);
                    }
                    break;

                default:
                    //@ts-ignore
                    if(interaction.memberPermissions.has(command.permissions)) {
                        command.run(client, interaction);
                    } else {
                        await interaction.reply({embeds: [new MessageEmbed().setTitle("Invalid Permissions").setColor("RED").setDescription(`Missing permissions: \`${command.permissions}\``)]})
                    }
            }
        }
    }
})
