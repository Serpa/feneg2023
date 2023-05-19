import prisma from '../../../utils/prismadb'
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

export default async function Register(req, res) {
    const { name, phone, email, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    try {
        const user = await prisma.User.create({
            data: {
                name, phone, email, password: passwordHash
            }
        });
        res.status(200).json({ message: user })
    } catch (error) {
        res.status(400).json({ message: error })
    }
}