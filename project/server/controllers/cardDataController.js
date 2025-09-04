const { prisma } = require('../db');

exports.createCardData = async (req, res) => {
  try {
    const { CardId, Balance, Parking_time } = req.body;
    const cardData = await prisma.cardData.create({ data: { CardId, Balance, Parking_time } });
    res.status(201).json(cardData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCards = async (req, res) => {
  try {
    const list = await prisma.cardData.findMany();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCardById = async (req, res) => {
  try {
    const card = await prisma.cardData.findUnique({ where: { CardId: req.params.id } });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCardData = async (req, res) => {
  try {
    const { Balance, Parking_time } = req.body;
    const card = await prisma.cardData.update({ where: { CardId: req.params.id }, data: { Balance, Parking_time } });
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCardData = async (req, res) => {
  try {
    await prisma.cardData.delete({ where: { CardId: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


