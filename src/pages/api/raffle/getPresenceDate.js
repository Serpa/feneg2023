import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function getPresenceDate(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        try {
            const presenceDate = await prisma.Presenca.findMany({
                distinct: ['data'],
            });
            res.status(200).json(presenceDate)
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()
}