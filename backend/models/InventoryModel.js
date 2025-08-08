export default (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: 'pcs',
    },
    threshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  });

  return Inventory;
};
