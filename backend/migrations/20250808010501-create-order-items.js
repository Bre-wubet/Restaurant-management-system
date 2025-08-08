export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('OrderItems', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    menuItemId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'MenuItems',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('OrderItems');
}
