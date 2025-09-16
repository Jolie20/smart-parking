const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'Mysecretjwt';


// exports.authenticate = function (req, res, next) {
//   const header = req.headers.authorization || '';
//   const token = header.startsWith('Bearer ') ? header.slice(7) : null;
//   if (!token) return res.status(401).json({ error: 'Missing token' });
//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

exports.AdminLogin= async(res,req)=>{
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // find user by email
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
   const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // create JWT (make sure JWT_SECRET is set in env)
    const payload = { id: admin.id, email: admin.email, role: admin.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    // remove password from returned user object
    const { password: _pw, ...userSafe } = admin;

    // return user + token (or set cookie if you prefer)
    return res.status(200).json({
      message: 'Login successful',
      user: userSafe,
      token
    });
  } catch (err) {
    console.error('AdminLogin error:', err);
    return res.status(500).json({ error: 'Server error' });
  }

};

// exports.requireRole = function (...roles) {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     next();
//   };
// };

exports.JWT_SECRET = JWT_SECRET;


