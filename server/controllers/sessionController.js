const Session = require('../models/Session');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ error: 'Invalid user' });

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const sessions = await Session.find({ userId: req.user._id });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
