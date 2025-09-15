
const prisma = require('../generated/prisma');

exports.createPayment = async (req, res) => {
  try {
    const { sessionId, amount, method, status, timestamp } = req.body;
    const payment = await prisma.payment.create({ data: { sessionId, amount, method, status, timestamp } });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
