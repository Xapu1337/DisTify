import {Command} from "../../types/structs/Command";
import {MessageEmbed} from "discord.js";

export default new Command({
    name: "test",
    description: "Test command",
    run: async ({client, message, args}) => {
        client.spotifyAPI.getPlaylist("4oPAFL2XQUhc60hE4C0MrW").then(playlist => {
            message.channel.send({ embeds: [new MessageEmbed().addField("Tracks", playlist.body.tracks.items.slice(playlist.body.tracks.items.length - 10, playlist.body.tracks.items.length).map((track, index) => `\`#${index}\` [${track.track.name}](https://open.spotify.com/track/${track.track.id})`).join("\n")).setDescription(playlist.body.description).setThumbnail(playlist.body.images[0].url).setTitle(playlist.body.name)] });
        }).catch(console.error);
        client.spotifyAPI.getMyDevices().then(devices => {
            message.channel.send({ embeds: [new MessageEmbed().setTitle("Devices").setDescription(devices.body.devices.map(device => `\`${device.id}\` ${device.name}`).join("\n"))] });
        }).catch(console.error);
    }
})
