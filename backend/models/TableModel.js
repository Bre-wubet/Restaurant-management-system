export default (sequelize, DataTypes) => {
  const Table = sequelize.define('Table', {
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Table.associate = models => {
    Table.hasMany(models.Order, { foreignKey: 'tableId' });
    Table.hasMany(models.Reservation, { foreignKey: 'tableId' });
  };

  return Table;
};
