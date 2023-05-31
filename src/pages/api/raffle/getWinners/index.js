import prisma from '../../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default async function getWinners(req, res) {
    const session = await getServerSession(req, res, authOptions)
    const { dia } = req.body
    const day = dayjs(dia);
    if (session) {
        try {
            const winners = await prisma.Winners.findMany({
                where: {
                    dia: day.toDate(),
                },
                include: {
                    user: true
                }
            });
            res.status(200).json(winners)
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()
}