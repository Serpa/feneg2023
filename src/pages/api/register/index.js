import prisma from '../../../utils/prismadb'
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default async function Register(req, res) {
    const { name, phone, email, password, cpf } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    try {
        const user = await prisma.User.create({
            data: {
                name, phone, email, password: passwordHash, cpf
            }
        });
        delete user.password
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: error })
    }
}