import {Collection} from "discord.js";

interface ArrayCollection {
    [key: string]: Collection
}

interface CommandArrayCollection {
    ["MESSAGES"]: Collection,
    ["SLASH"]: Collection
}

