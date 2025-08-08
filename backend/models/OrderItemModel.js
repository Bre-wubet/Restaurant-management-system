export default (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 },
    },
  });

  return OrderItem;
};
