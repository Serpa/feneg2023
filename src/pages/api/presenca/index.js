import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dayjs from 'dayjs'

export default async function Presence(req, res) {
    const session = await getServerSession(req, res, authOptions)
    const { stageId } = req.body
    const day = dayjs(new Date().toDateString())
    if (session) {
        try {
            const checkPresenca = await prisma.Presenca.findFirst({
                where: {
                    userId: session.user.id,
                    stageId
                },
                include: {
                    user: true,
                    stage: true
                },
            })
            if (checkPresenca) {
                res.status(409).json(checkPresenca)
            } else {
                const presenca = await prisma.Presenca.create({
                    data: {
                        userId: session.user.id,
                        data: new Date(),
                        dia: day,
                        stageId
                    }
                });
                // console.log(presenca);
                res.status(200).json(presenca)
            }
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()

}