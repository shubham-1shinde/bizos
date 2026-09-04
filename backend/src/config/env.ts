// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join(__dirname, '../../../.env') });

// export const env = {
//   PORT: process.env.PORT || '5000',
//   MONGODB_URI: process.env.MONGODB_URI,
//   JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_bizos_2026',
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
//   AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
//   FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
// };

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env');
}

export const env = {
  PORT: process.env.PORT,
  MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  AI_SERVICE_URL: process.env.AI_SERVICE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
};