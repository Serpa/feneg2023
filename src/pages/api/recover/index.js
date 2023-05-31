import prisma from '../../../utils/prismadb'
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default async function Recover(req, res) {
    const { password, id } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    try {
        const user = await prisma.User.update({
            where: {
                id
            },
            data: {
                password: passwordHash,
                passwordLost: null
            }
        });
        delete user.password
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error })
    }
}