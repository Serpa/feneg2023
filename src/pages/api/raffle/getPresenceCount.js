import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default async function getPresenceCount(req, res) {
    const { dia } = req.body
    const session = await getServerSession(req, res, authOptions)
    const day = dayjs(dia);
    if (session) {
        try {
            const presenceCount = await prisma.Presenca.groupBy({
                by: ['userId'],
                where: {
                    dia: {
                        gte: day.toDate(),
                        lt: day.add(1, 'd').toDate(),
                    },
                },
                _count: {
                    userId: true,
                }
            });

            const raffle = presenceCount.map(user => {
                if (user._count.userId >= 1) {
                    const entries = Math.floor(user._count.userId / 1)
                    return {
                        userId: user.userId,
                        entries
                    }
                }
            }).filter(e => e !== undefined)
            const entries = []
            raffle.map(user => {
                for (var i = 0; i < user.entries; i++) entries.push(user.userId);
            })

            const winners = await prisma.Winners.findMany({
                where: {
                    dia: {
                        gte: day.toDate(),
                        lt: day.add(1, 'd').toDate(),
                    },
                }
            })
            const idWinners = []
            winners.forEach(e => {
                idWinners.push(e.userId)
            });
            const filteredArray = entries.filter(e => !idWinners.includes(e))
            const random = Math.floor(Math.random() * filteredArray.length);
            if (filteredArray.length < 1) {
                res.status(409).json({ message: "Nenhum usuário se enquadra nas condições de vitória!" })
            } else {
                const getWinner = await prisma.User.findUnique({
                    where: {
                        id: filteredArray[random]
                    }
                })

                const saveWinner = await prisma.Winners.create({
                    data: {
                        userId: filteredArray[random],
                        data: new Date(),
                        dia: day.toDate(),
                    }
                })

                res.status(200).json(getWinner)
            }
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()
}