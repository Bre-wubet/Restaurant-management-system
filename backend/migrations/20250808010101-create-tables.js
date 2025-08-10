export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Tables', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tableNumber: {
      type: Sequelize.INTEGER,
      unique: true
    },
     capacity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 4
    },
    isAvailable: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Tables');
}
