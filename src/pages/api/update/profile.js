import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
const bcrypt = require('bcrypt');

export default async function updateProfile(req, res) {
    const session = await getServerSession(req, res, authOptions)
    const { name, phone, email, password, image } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    if (session) {
        try {
            const updateProfile = await prisma.User.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    name,
                    phone,
                    email,
                    password: passwordHash,
                    image
                },
            })
            delete updateProfile.password
            res.status(200).json(updateProfile)
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()

}