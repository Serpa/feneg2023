import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function getPresence(req, res) {
    const session = await getServerSession(req, res, authOptions)
    const { stageId } = req.body
    if (session) {
        try {
            const presenca = await prisma.Presenca.findMany({
                where: {
                    stageId: stageId,
                },
                include: {
                    user: true,
                    stage: true,
                },
            });
            console.log(presenca);
            res.status(200).json(presenca)
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()
}