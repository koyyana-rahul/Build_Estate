import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load local development settings before configuring the SDK. Server imports
// initialize this module before server.js has a chance to load dotenv.
dotenv.config({ path: './.env.local' });
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;