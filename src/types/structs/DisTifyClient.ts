import {Client, ClientEvents, ClientOptions, Collection} from "discord.js";
import klaw from "klaw";
import path, { join } from "path";
import Utility from "../../utils/utility";
import Config from "../../utils/config";
import {CommandType, SlashCommandType} from "../commands";
import { Event } from "../events";
import {CommandArrayCollection} from "../global";
import SpotifyWebApi from "spotify-web-api-node";
import inquirer from "inquirer";

export default class DisTifyClient extends Client {

    /**
     * An object containing both collections for MESSAGE and SLASH
     * @example
     * client.commands["MESSAGE"].get("ping").run(...);
     */
    public commands: CommandArrayCollection = {
        "MESSAGES": new Collection<string, CommandType>(),
        "SLASH": new Collection<string, SlashCommandType>()
    };
    public aliases: Collection<string, string>;
    public utilities: Utility;
    public configuration: Config;
    public spotifyAPI: SpotifyWebApi;
    public static client: DisTifyClient;
    constructor(options: ClientOptions) {
        super(options);

        this.utilities = new Utility(this);
        this.configuration = new Config();
        this.aliases = new Collection<string, string>();
        DisTifyClient.client = this;
    }

    async run() {

        this.utilities.printLn(`Initializing...`);

        await klaw(join(__dirname, "../../commands/messages")).on("data", async (item) => {
            // Check if the file is a directory
            const cmdFile = path.parse(item.path);
            // Check if the file is a .ts file
            const category = item.path.match(/\w+(?=[\\/][\w\-.]+$)/)![0];
            if (!cmdFile.ext || cmdFile.ext !== ".ts") return;

            // Import the file
            const cmd: CommandType = await this.utilities.importFile(item.path);

            // if the command is not defined abort
            if (!cmd) return;

            // Assign the category to the command
            cmd.category = category;

            // If the command has aliases add them to the collection
            if (cmd.aliases) {
                cmd.aliases.forEach((alias) => {
                    this.aliases.set(alias, cmd.name);
                });
            }

            // Add the command to the collection
            this.commands["MESSAGES"].set(cmd.name, cmd);
        });

        await klaw(join(__dirname, "../../events")).on("data", async (item) => {
            const eventFile = path.parse(item.path);
            if (!eventFile.ext || eventFile.ext !== ".ts") return;

            const event: Event<keyof ClientEvents> = await this.utilities.importFile(item.path);
            if (!event) return;
            this.on(event.event, (...args: any) => {
                event.run(this, ...args);
            });
        });

        await klaw(join(__dirname, "../../commands/interactions")).on("data", async (item) => {
            const slshFile = path.parse(item.path);
            const category = item.path.match(/\w+(?=[\\/][\w\-.]+$)/)![0];
            if (!slshFile.ext || slshFile.ext !== ".ts") return;

            const slashCommand: SlashCommandType = await this.utilities.importFile(item.path);

            if (!slashCommand) return;

            slashCommand.category = category;

            this.commands["SLASH"].set(slashCommand.builder.data.name, slashCommand);
        });

        await this.login(this.configuration.botToken);

        await this.utilities.printLn("Successfully initialized!", "DISCORD");
        await this.utilities.printLn("Initializing...", "SPOTIFY");

        this.spotifyAPI = new SpotifyWebApi({
            clientId: this.configuration.spotifyClientID,
            clientSecret: this.configuration.spotifyClientSecret,
            redirectUri: this.configuration.spotifyRedirectURI
        });

        let authURL = this.spotifyAPI.createAuthorizeURL(this.configuration.spotifyScopes, this.configuration.spotifyState);
        let authCode: string;
        let tokenExpirationEpoch;
        await inquirer.prompt([
            {
                type: "input",
                name: "code",
                message: `Please go to the url below and enter the WHOLE url in the prompt. \n ${encodeURI(authURL)}`
            }
        ]).then(async (answers) => {
            try {
                authCode = answers.code.match(/[?&](?<key>[\w]+)(?:=|&?)(?<value>[\w+,.-]*)/g)[0].split("=")[1];
            } catch (e) {
                this.utilities.printLn("Invalid URL!", "SPOTIFY");
                return;
            }
            if(!authCode || authCode.length < 0) return this.utilities.printLn("No auth code provided!", "SPOTIFY");

            this.spotifyAPI.authorizationCodeGrant(authCode).then(
                (data) => {
                    // Set the access token and refresh token
                    this.spotifyAPI.setAccessToken(data.body['access_token']);
                    this.spotifyAPI.setRefreshToken(data.body['refresh_token']);

                    // Save the amount of seconds until the access token expired
                    tokenExpirationEpoch =
                        new Date().getTime() / 1000 + data.body['expires_in'];
                    console.log(
                        'Retrieved token. It expires in ' +
                        Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                        ' seconds!'
                    );
                },
                (err) => {
                    console.log(
                        'Something went wrong when retrieving the access token!',
                        err.message
                    );
                }
            );

            let numberOfTimesUpdated = 0;

            setInterval(function () {
                DisTifyClient.client.utilities.printLn(
                    'Time left: ' +
                    Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                    ' seconds left!'
                );

                // OK, we need to refresh the token. Stop printing and refresh.
                if (++numberOfTimesUpdated > 5) {
                    clearInterval(this);

                    // Refresh token and print the new time to expiration.
                    DisTifyClient.client.spotifyAPI.refreshAccessToken().then(
                        function(data) {
                            tokenExpirationEpoch =
                                new Date().getTime() / 1000 + data.body['expires_in'];
                            console.log(
                                'Refreshed token. It now expires in ' +
                                Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                                ' seconds!'
                            );
                        },
                        function(err) {
                            console.log('Could not refresh the token!', err.message);
                        }
                    );
                }
            }, 1000);

            await this.utilities.printLn("Successfully initialized!", "SPOTIFY");
        });




    }

}
