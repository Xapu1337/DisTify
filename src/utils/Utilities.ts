import DisTifyClient from "../structs/DisTifyClient";

export default class Utilities {
    private client: DisTifyClient;
    constructor(client: DisTifyClient) {
        this.client = client;
    }
}
