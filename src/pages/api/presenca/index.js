import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dayjs from 'dayjs'
var objectSupport = require("dayjs/plugin/objectSupport");
dayjs.extend(objectSupport);

export default async function Presence(req, res) {
    const session = await getServerSession(req, res, authOptions)
    const { stageId } = req.body
    const day = dayjs(new Date().toDateString())
    const testeDia = dayjs({
        year: day.year(),
        month: day.month(),
        day: day.date(),
        hour: 3,
    })
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
                        dia: testeDia.toDate(),
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