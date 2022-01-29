import dotenv from 'dotenv';
dotenv.config();
import DisTifyClient from "./structs/DisTifyClient";
new DisTifyClient({ intents: 32767 }).initialize();
