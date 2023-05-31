import prisma from '../../../../utils/prismadb'

export default async function CheckEmailID(req, res) {
    const { id } = req.query
    try {
        const user = await prisma.User.findFirst({
            where: {
                passwordLost: id
            }
        });
        if (!user) {
            res.status(404).send()
        } else {
            res.status(200).json({ status: "OK", id: user.id })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error })
    }
}