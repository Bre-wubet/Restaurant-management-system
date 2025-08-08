// import { Order, OrderItem, MenuItem, Table } from '../models/index.js';
import db from '../models/index.js';
const { Order, OrderItem, MenuItem, Table, sequelize } = db;

export const createOrder = async (req, res) => {
  const { tableId, items } = req.body;

  if (!tableId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order payload.' });
  }

  const transaction = await sequelize.transaction();

  try {
    // Check if table exists and is available
    const table = await Table.findByPk(tableId);
    if (!table) {
      throw new Error('Table not found.');
    }

    // Optional: mark table as unavailable
    if (table.status === 'occupied') {
      throw new Error('Table is currently occupied.');
    }

    await table.update({ status: 'occupied' }, { transaction });

    // Create order
    const order = await Order.create(
      { tableId, status: 'pending', total: 0 },
      { transaction }
    );

    let total = 0;

    // Process each item in the order
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) throw new Error(`MenuItem ID ${item.menuItemId} not found.`);

      const lineTotal = parseFloat(menuItem.price) * item.quantity;
      total += lineTotal;

      await OrderItem.create(
        {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
        },
        { transaction }
      );
    }

    // Update order total
    await order.update({ total }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order.id,
      total,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Order creation error:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};


// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, include: [MenuItem] },
        { model: Table }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id, {
      include: [
        { model: OrderItem, include: [MenuItem] },
        { model: Table }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });

    // Optional: Free the table if order is completed or cancelled
    if (['completed', 'cancelled'].includes(status)) {
      const table = await Table.findByPk(order.tableId);
      if (table) {
        await table.update({ status: 'available' });
      }
    }

    res.status(200).json({ message: `Order status updated to ${status}` });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete related order items
    await OrderItem.destroy({ where: { orderId: id } });

    await order.destroy();

    // Optional: Free up table
    const table = await Table.findByPk(order.tableId);
    if (table) {
      await table.update({ status: 'available' });
    }

    res.status(200).json({ message: 'Order and related items deleted successfully' });
  } catch (error) {
    console.error('Failed to delete order:', error);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
};