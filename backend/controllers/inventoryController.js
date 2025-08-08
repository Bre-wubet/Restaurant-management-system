import db from '../models/index.js';
const { Inventory } = db;
// POST /inventory — Add a new inventory item
export const addInventoryItem = async (req, res) => {
  const { name, quantity, unit, threshold } = req.body;

  try {
    // Check if item already exists
    const existing = await Inventory.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: 'Inventory item with this name already exists.' });
    }

    const item = await Inventory.create({
      name,
      quantity: quantity ?? 0,
      unit,
      threshold: threshold ?? 10, // default low stock threshold
    });

    res.status(201).json({ message: 'Inventory item added successfully.', item });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Internal server error while adding inventory item.' });
  }
};

// GET /inventory — Fetch all inventory items
export const getAllInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.findAll({ order: [['name', 'ASC']] });

    const inventoryWithStatus = items.map(item => ({
      ...item.toJSON(),
      status: item.quantity <= item.threshold ? 'low' : 'sufficient'
    }));

    res.status(200).json(inventoryWithStatus);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ message: 'Internal server error while fetching inventory items.' });
  }
};

// GET /inventory/:id — Get item by ID
export const getInventoryItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Inventory.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ message: 'Internal server error while fetching inventory item.' });
  }
};

// PUT /inventory/:id — Update inventory item
export const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit, threshold } = req.body;

  try {
    const item = await Inventory.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    // Optional: prevent renaming to existing item name
    if (name && name !== item.name) {
      const existing = await Inventory.findOne({ where: { name } });
      if (existing) {
        return res.status(409).json({ message: 'Another item with this name already exists.' });
      }
    }

    await item.update({
      name: name ?? item.name,
      quantity: quantity ?? item.quantity,
      unit: unit ?? item.unit,
      threshold: threshold ?? item.threshold
    });

    res.status(200).json({ message: 'Inventory item updated successfully.', item });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Internal server error while updating inventory item.' });
  }
};

// DELETE /inventory/:id — Remove inventory item
export const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Inventory.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    await item.destroy();

    res.status(200).json({ message: 'Inventory item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Internal server error while deleting inventory item.' });
  }
};
