import { MikroORM } from "@mikro-orm/core";
import { getMikroORMConfig } from './config.js';

/**
 * Initialize and export ORM instance
 * This is imported throughout the application
 */
export const orm = await MikroORM.init({
  ...getMikroORMConfig(),
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
});
