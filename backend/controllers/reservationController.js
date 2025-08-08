import db from '../models/index.js';
import { Op } from 'sequelize';
const { Reservation, Table } = db;

// POST /reservations — Create a new reservation
export const createReservation = async (req, res) => {
  const { name, phone, date, time, guests, tableId } = req.body;

  try {
    const table = await Table.findByPk(tableId);

    if (!table) {
      return res.status(404).json({ message: 'Table not found.' });
    }

    if (table.status !== 'available') {
      return res.status(400).json({ message: `Table ${table.number} is not available.` });
    }

    // Check for overlapping reservations at the same table, date, and time
    const conflict = await Reservation.findOne({
      where: {
        tableId,
        date,
        time,
        status: 'booked'
      }
    });

    if (conflict) {
      return res.status(409).json({ message: 'Table already reserved for the selected date and time.' });
    }

    const reservation = await Reservation.create({
      name,
      phone,
      date,
      time,
      guests,
      tableId,
      status: 'booked'
    });

    // Optionally update table status
    await table.update({ status: 'reserved' });

    res.status(201).json({ message: 'Reservation created successfully.', reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Internal server error while creating reservation.' });
  }
};

// GET /reservations — Fetch all reservations
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']],
      include: [{ model: Table, attributes: ['number', 'capacity'] }]
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Internal server error while fetching reservations.' });
  }
};

// GET /reservations/:id — Get reservation by ID
export const getReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByPk(id, {
      include: [{ model: Table, attributes: ['number', 'capacity'] }]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ message: 'Internal server error while fetching reservation.' });
  }
};

// PUT /reservations/:id — Update reservation details
export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { name, phone, date, time, guests, status } = req.body;

  try {
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    await reservation.update({
      name: name ?? reservation.name,
      phone: phone ?? reservation.phone,
      date: date ?? reservation.date,
      time: time ?? reservation.time,
      guests: guests ?? reservation.guests,
      status: status ?? reservation.status
    });

    res.status(200).json({ message: 'Reservation updated successfully.', reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Internal server error while updating reservation.' });
  }
};

// DELETE /reservations/:id — Cancel a reservation
export const cancelReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation is already cancelled.' });
    }

    await reservation.update({ status: 'cancelled' });

    // Optionally free up the table
    const activeReservations = await Reservation.count({
      where: {
        tableId: reservation.tableId,
        status: 'booked',
        id: { [Op.ne]: reservation.id }
      }
    });

    if (activeReservations === 0) {
      const table = await Table.findByPk(reservation.tableId);
      if (table) {
        await table.update({ status: 'available' });
      }
    }

    res.status(200).json({ message: 'Reservation cancelled.' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ message: 'Internal server error while cancelling reservation.' });
  }
};
