export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Reservations', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customerName: Sequelize.STRING,
    reservedAt: Sequelize.DATE,
    status: {
      type: Sequelize.ENUM('booked', 'cancelled', 'completed'),
      defaultValue: 'booked'
    },
    tableId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Tables',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Reservations');
}
