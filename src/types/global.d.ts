import {Collection} from "discord.js";

interface ArrayCollection {
    [key: string]: Collection<any, any>
}

interface CommandArrayCollection {
    ["MESSAGES"]: Collection<string, any>,
    ["SLASH"]: Collection<string, any>
}
