import db from '../models/index.js';
const { MenuItem } = db;
// POST /menu - Create a new menu item
export const createMenuItem = async (req, res) => {
  const { name, description, price, category, available } = req.body;

  try {
    // Check if menu item with the same name already exists
    const existing = await MenuItem.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: `Menu item '${name}' already exists.` });
    }

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      available: available ?? true
    });

    res.status(201).json({ message: 'Menu item created.', item });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Internal server error while creating menu item.' });
  }
};

// GET /menu - Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll({
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Internal server error while fetching menu items.' });
  }
};

// GET /menu/:id - Get menu item by ID
export const getMenuItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Internal server error while fetching menu item.' });
  }
};

// PUT /menu/:id - Update menu item
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, available } = req.body;

  try {
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    await item.update({
      name: name ?? item.name,
      description: description ?? item.description,
      price: price ?? item.price,
      category: category ?? item.category,
      available: available ?? item.available
    });

    res.status(200).json({ message: 'Menu item updated.', item });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Internal server error while updating menu item.' });
  }
};

// DELETE /menu/:id - Delete menu item
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    await item.destroy();

    res.status(200).json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Internal server error while deleting menu item.' });
  }
};
