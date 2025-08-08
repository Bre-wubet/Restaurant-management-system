export default (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  MenuItem.associate = models => {
    MenuItem.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: 'menuItemId',
    });
  };

  return MenuItem;
};
