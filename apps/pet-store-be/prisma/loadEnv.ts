import * as dotenv from 'dotenv';
import * as path from 'path';

// Configure dotenv to load environment variables from the .env file
// located at the root of the 'apps/pet-store-be' project.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
