import {Snowflake, User} from "discord.js";

export default class Config {
    public botToken: string = process.env.BOT_TOKEN;
    public prefix: string = process.env.PREFIX;
    public spotifyClientID: string = process.env.SPOTIFY_AUTH_CLIENT_ID;
    public spotifyClientSecret: string = process.env.SPOTIFY_AUTH_CLIENT_SECRET;
    public spotifyRedirectURI: string = process.env.SPOTIFY_AUTH_REDIRECT_URI;
    public spotifyScopes: string[] = process.env.SPOTIFY_AUTH_SCOPES.split(",");
    public spotifyState: string = process.env.SPOTIFY_AUTH_STATE;

    /**
     * Array containing all the owner id's
     */
    public botOwner: Snowflake[] = ["188988455554908160"];

    /**
     * Somewhat redundant but this just gives a nice readability to check if someone is the owner.
     * @param id Snowflake of the user that is going to be checked
     */
    public isOwner(id: Snowflake): boolean {
        return this.botOwner.includes(id)
    }
}
