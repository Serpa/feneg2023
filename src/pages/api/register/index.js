import prisma from '../../../utils/prismadb'
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default async function Register(req, res) {
    console.log(req.body);
    const { name, phone, email, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    console.log(passwordHash);
    try {
        const user = await prisma.User.create({
            data: {
                name, phone, email, password: passwordHash
            }
        });
        delete user.password
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: error })
    }
}