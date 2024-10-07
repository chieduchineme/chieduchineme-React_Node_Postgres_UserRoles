// src/config/db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
// Create a new Sequelize instance
const sequelize = new Sequelize( 
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: 'localhost', // Default host
    dialect: 'postgres',                      
    port: parseInt(process.env.DB_PORT!, 10), 
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the PostgreSQL database with Sequelize');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;
