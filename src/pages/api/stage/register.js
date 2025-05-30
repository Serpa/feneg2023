import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function RegisterStage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        if (req.method === 'POST') {
            const { name } = req.body
            try {
                const stage = await prisma.Stage.create({
                    data: {
                        name
                    }
                });
                res.status(200).json(stage)
            } catch (error) {
                res.status(400).json({ message: error })
            }
        } else {
            res.status(400).json({ message: 'Only accept post method' })
        }
    } else {
        res.status(401)
    }
    res.end()

}