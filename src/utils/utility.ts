import {Client} from "discord.js";
import date from "date-and-time";

export default class Utility {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Stylized print
     * Result: [TITLE (default: LOG) @ TIME] CONTENT
     * @param content Text that will be printed
     * @param title OPTIONAL title that replaces "LOG"
     */
    printLn(content: string, title?: string) {
        // This results in an error, but it's there from colors
        // It's extending the String prototype.
        // @ts-ignore
        console.log(`${"[".white + (title || "LOG").brightCyan + " @ ".brightWhite + date.format(new Date(), "HH:mm").cyan + "]".white} ${content}`);
    }


    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

}
