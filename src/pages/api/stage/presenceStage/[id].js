import prisma from '../../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"

export default async function presenceStage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const { id } = req.query;
        try {
            const stage = await prisma.Presenca.findMany({
                where: {
                    stageId: id
                },
                include: {
                    user: true,
                    stage: true,
                }
            });
            res.status(200).json(stage)
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()
}