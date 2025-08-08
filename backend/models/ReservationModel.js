export default (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reservedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('booked', 'cancelled', 'completed'),
      defaultValue: 'booked',
    },
  });

  Reservation.associate = models => {
    Reservation.belongsTo(models.Table, {
      foreignKey: 'tableId',
      onDelete: 'SET NULL',
    });
  };

  return Reservation;
};
