import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = 10;

// ✅ REGISTER
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    return res.status(201).json({ message: 'User registered successfully.', user: {
      id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role
    }});
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};
