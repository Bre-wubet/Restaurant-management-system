export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Orders', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    total: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0
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
  await queryInterface.dropTable('Orders');
}
