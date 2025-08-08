
import db from '../models/index.js';
const { Table, Order } = db;

// POST /tables — Create a new table
export const createTable = async (req, res) => {
  const { number, capacity } = req.body;

  try {
    // Check if the table number already exists
    const existingTable = await Table.findOne({ where: { number } });
    if (existingTable) {
      return res.status(400).json({ message: `Table number ${number} already exists.` });
    }

    const table = await Table.create({
      number,
      capacity,
      status: 'available'
    });

    res.status(201).json(table);
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ message: 'Internal server error while creating table.' });
  }
};

// GET /tables — Fetch all tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.findAll({ order: [['number', 'ASC']] });
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Internal server error while fetching tables.' });
  }
};

// GET /tables/:id — Get a specific table by ID
export const getTableById = async (req, res) => {
  const { id } = req.params;

  try {
    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found.' });
    }

    res.status(200).json(table);
  } catch (error) {
    console.error('Error fetching table by ID:', error);
    res.status(500).json({ message: 'Internal server error while fetching table.' });
  }
};

// PATCH /tables/:id/status — Update table status (e.g., reserved, available)
export const updateTableStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['available', 'occupied', 'reserved', 'unavailable'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found.' });
    }

    await table.update({ status });

    res.status(200).json({ message: `Table status updated to '${status}'.`, table });
  } catch (error) {
    console.error('Error updating table status:', error);
    res.status(500).json({ message: 'Internal server error while updating table status.' });
  }
};

// DELETE /tables/:id — Delete a table if it's not in use
export const deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found.' });
    }

    // Check if there are any active orders associated
    const activeOrder = await Order.findOne({
      where: {
        tableId: id,
        status: ['pending', 'completed'] // orders still in process
      }
    });

    if (activeOrder) {
      return res.status(400).json({ message: 'Table cannot be deleted while in use by an order.' });
    }

    await table.destroy();

    res.status(200).json({ message: 'Table deleted successfully.' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ message: 'Internal server error while deleting table.' });
  }
};
