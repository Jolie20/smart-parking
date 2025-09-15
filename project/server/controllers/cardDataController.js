const prisma = require('../generated/prisma');

exports.createCard = async (req, res) => {
  try {
    const { CardId, Balance, Parking_time } = req.body;
    const card = await prisma.cardData.create({ data: { CardId, Balance, Parking_time } });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCards = async (req, res) => {
  try {
    const cards = await prisma.cardData.findMany();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
