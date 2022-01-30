import "@titanium/colors";
import dotenv from 'dotenv';
import DisTifyClient from "./types/structs/DisTifyClient";
dotenv.config();
new DisTifyClient({ intents: 32767 }).run();
