import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function Presence(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const { data } = req.query;
        console.log(session);
        try {
            const presenca = await prisma.Presenca.create({
                data: {
                    userId: session.user.id,
                    data: new Date(),
                    stageId: data[0],
                }
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