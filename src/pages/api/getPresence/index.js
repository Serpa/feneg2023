import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function getPresence(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const { data } = req.query;
        try {
            const presenca = await prisma.Presenca.findMany({
                where: {
                    userId: session.user.id,
                },
                include: {
                    stage: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            image: true
                        }
                    }
                },
            });
            res.status(200).json(presenca)
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()

}