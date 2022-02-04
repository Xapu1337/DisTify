import { SlashCommandBuilder } from "@discordjs/builders";
import {SlashCommand} from "../../types/structs/Command";

export default new SlashCommand({
    builder: {
        data: new SlashCommandBuilder().setName("check").setDescription("Checks if provided song is in one of the playlists provided").addStringOption((arg) => arg.setRequired(true).setName("song").setDescription("The song URL to check")),
    },
    category: "check",
    permissions: "EVERYONE",
    run: async (client, interaction) => {
        const song = interaction.options.getString("song");
        const songId = song.matchAll(/^(https:\/\/open.spotify.com\/track\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$/gm).next().value[2];
        if (!songId) {
            return interaction.reply("Invalid song link");
        }
        const playlists: string[] = ["4z3WUm46kVPJ0gBfLF1PlZ", "0czJQA8T79yGLUtvjCuwpY"]
        const playlistObjects = playlists.map(async(playlist) => await client.spotifyAPI.getPlaylist(playlist).then((playlist) => playlist.body));
        const [found] = await Promise.all([Promise.all(playlistObjects).then((playlists) => {
            return {
                holds: playlists.some((playlist) => playlist.tracks.items.some((track) => track.track.id === songId)),
                song: playlists.map((playlist) => playlist.tracks.items.filter((track) => track.track.id === songId))[0][0] ?? null,
                playlist: playlists.filter((playlist) => playlist.tracks.items.some((s) => s.track.id === songId)) ?? undefined
            }
        })]);
        if (found.holds) {
            return interaction.reply(`Song \`${found.song.track.artists.map((artist) => artist.name).join(", ")} - ${found.song.track.name}\` found in ${found.playlist[0].name}`);
        } else {
            return interaction.reply(`Song not found in any of the playlists`);
        }
    },
});
