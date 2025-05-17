import prisma from '../../../utils/prismadb'

export default async function RegisterPhoto(req, res) {
    const { id, photo } = req.body
    try {
        const user = await prisma.User.update({
            where: {
                id: id
            },
            data: {
                image: photo
            }
        });
        delete user.password
        res.status(200).json({ message: user })
    } catch (error) {
        res.status(400).json({ message: error })
    }
}