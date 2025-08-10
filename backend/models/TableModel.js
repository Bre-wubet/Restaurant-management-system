// models/Table.js
import { DataTypes } from 'sequelize';
import sequelize from './index.js'; // adjust path to your db config

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tableNumber: {
    type: DataTypes.INTEGER,
    unique: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Tables',
  timestamps: true
});

export default Table;
