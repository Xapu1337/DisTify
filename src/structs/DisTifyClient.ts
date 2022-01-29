import {Client, ClientOptions, Collection, Message} from "discord.js";
import {table} from "table";
import {CommandArrayCollection} from "../types/global";
import Utilities from "../utils/Utilities";
import {CommandType, SlashCommandType} from "../types/commands";

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
    public utilities: Utilities;
    // public configuration: Config;


    constructor(options: ClientOptions) {
        super(options);
        this.utilities = new Utilities(this);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async initialize(){

        await this.login(process.env.BOT_TOKEN);
    }




}
