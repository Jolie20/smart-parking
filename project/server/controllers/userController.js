const { prisma } = require('../db');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
	try {
		const { email, name, phone, password } = req.body;
		if (!password) return res.status(400).json({ error: 'Password is required' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({ data: { email, name, role:'user', phone, password: passwordHash } });
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.params.id } });
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { email, name, role, phone, password } = req.body;
		if (role === 'admin') return res.status(403).json({ error: 'Not allowed to set role admin' });
		const data = { email, name, phone };
		if (role) data.role = role;
		if (password) data.password = await bcrypt.hash(password, 10);
		const user = await prisma.user.update({ where: { id: req.params.id }, data });
		res.json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		await prisma.user.delete({ where: { id: req.params.id } });
		res.status(204).end();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};


