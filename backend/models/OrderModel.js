export default (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  });

  Order.associate = models => {
    Order.belongsTo(models.Table, {
      foreignKey: 'tableId',
      onDelete: 'SET NULL',
    });

    Order.belongsToMany(models.MenuItem, {
      through: models.OrderItem,
      foreignKey: 'orderId',
    });
  };

  return Order;
};
