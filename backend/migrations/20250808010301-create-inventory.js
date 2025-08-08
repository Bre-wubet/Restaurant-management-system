export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Inventories', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: Sequelize.STRING,
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    unit: {
      type: Sequelize.STRING,
      defaultValue: 'pcs'
    },
    threshold: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Inventories');
}
