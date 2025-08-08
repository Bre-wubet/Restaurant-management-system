export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('MenuItems', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    price: Sequelize.DECIMAL(10, 2),
    available: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('MenuItems');
}
