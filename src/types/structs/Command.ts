import {CommandType, SlashCommandType} from "../commands";

export class Command {
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions);
    }
}

export class SlashCommand {
    constructor(commandOptions: SlashCommandType) {
        Object.assign(this, commandOptions);
    }
}
