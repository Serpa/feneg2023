import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function getStage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const { data } = req.query;
        try {
            const stage = await prisma.Stage.findMany();
            res.status(200).json(stage)
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()
}