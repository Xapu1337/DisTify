import { table } from "table";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import DisTifyClient from "../types/structs/DisTifyClient";
import { Event } from "../types/events";
export default new Event("ready", async (client: DisTifyClient) => {
    client.utilities.printLn(`\n`+
        table(
            [
                [`Guilds (Cached): ${client.guilds.cache.size.toString().cyan}`]
            ], {
                header: {
                    alignment: "center",
                    content: `${client.user.username}#${client.user.discriminator} is ready!`.blue
                }
            }
        )
    );

    const rest = new REST({ version: "9" }).setToken(client.configuration.botToken || "");

    try {
        client.utilities.printLn("Started refreshing application (/) commands.", "SLASH");
        await rest.put(Routes.applicationCommands(client.user?.id || "0"), {
            body: client.commands["SLASH"].map((value) => value.builder.data.toJSON()),
        });

        client.utilities.printLn("Successfully reloaded application (/) commands.", "SLASH");
    } catch(error) {
        client.utilities.printLn("Failed to reload application (/) commands.", "SLASH");
        console.error(error);
    }
});
