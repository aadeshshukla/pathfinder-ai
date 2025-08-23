import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// This file has one job: load the .env file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
