import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import Table from './TableModel';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: false,
});

const db = { sequelize, Sequelize, Table };

const files = await fs.readdir(__dirname);

for (const file of files) {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const { default: defineModel } = await import(`./${file}`);
    const model = defineModel(sequelize, DataTypes);
    db[model.name] = model;
  }
}

Object.values(db).forEach(model => {
  if (model?.associate) model.associate(db);
});

export default db;
