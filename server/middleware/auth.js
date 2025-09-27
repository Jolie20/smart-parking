const jwt = require('jsonwebtoken')
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'Mysecretjwt';


exports.authenticate = function (req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.AdminLogin= async(req,res)=>{
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // find user by email
    const user = await prisma.admin.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
   const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // create JWT (make sure JWT_SECRET is set in env)
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    // remove password from returned user object
    const { password: _pw, ...userSafe } = user;

    // return user + token (or set cookie if you prefer)
    return res.status(200).json({
      message: 'Login successful',
      user: payload,
      token
    });
  } catch (err) {
    console.error('AdminLogin error:', err);
    return res.status(500).json({ error: 'Server error' });
  }

};

//userlogin 
exports.UserLogin= async(req,res)=>{
  const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    // basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    } 
  try {
    
    // find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email ' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid  password' });
    }
    // create JWT (make sure JWT_SECRET is set in env)
    const payload = { id: user.id, email: user.email, role: user.role, rfidCard: user.rfidno };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    // remove password from returned user object
    const { password: _pw, ...userSafe } = user;
    // return user + token (or set cookie if you prefer)
    return res.status(200).json({
      message: 'Login successful',
      user: payload,
      token
    });
  } catch (err) {
    console.error('UserLogin error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.requireRole = function (...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

exports.ManagerLogin= async(req,res)=>{
  const { email, password } = req.body;
  const user = await prisma.manager.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  try {
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
  return res.status(200).json({ message: 'Login successful', user: payload, token });
  } catch (err) {
    console.error('ManagerLogin error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.quicklogout = function (req, res, next) {
  const logoutToken = req.headers['x-logout-token'];
  if (!logoutToken) {
    return res.status(400).json({ error: 'Missing logout token' });
  }
  blacklistedTokens.add(logoutToken);
  res.json({ message: 'Logged out successfully' });
}

exports.JWT_SECRET = JWT_SECRET;


