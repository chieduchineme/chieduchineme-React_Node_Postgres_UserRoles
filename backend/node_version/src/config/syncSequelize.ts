// src/config/syncWithDb.ts
import sequelize from './db';

export const syncSequelize = async () => {
  try {
    await sequelize.sync(); // This will create tables if they don't exist
  } catch (error) {
    console.error('Database synchronization failed:', error);
  }
};