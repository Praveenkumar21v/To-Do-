const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const supabase = require('../services/supabase');
const Session = require('../models/Session');
const Token = require('../models/Token');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: { user }, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const newUser = new User({ email, password: hashedPassword, supabaseId: user.id });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    let localUser = await User.findOne({ supabaseId: user.id });
    if (!localUser) {
      localUser = new User({ email, supabaseId: user.id, password: 'N/A' });
      await localUser.save();
    }

    const token = jwt.sign({ userId: localUser._id }, JWT_SECRET, { expiresIn: '1h' });

    const newToken = new Token({
      token,
      userId: localUser._id
    });
    await newToken.save();

    const session = new Session({
      userId: localUser._id,
      sessionToken: token,
      expiresAt: new Date(Date.now() + 3600000), 
      email: localUser.email,
      signInAt: new Date()
    });
    await session.save();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: localUser._id,
        email: localUser.email,
        supabaseId: localUser.supabaseId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signOut = async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ userId: decoded.userId, sessionToken: token, signOutAt: null });
    if (session) {
      session.signOutAt = new Date();
      await Token.deleteOne({ token });
      await session.save();
    }

    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign-out error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};
