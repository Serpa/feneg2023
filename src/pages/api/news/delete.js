import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function DeleteNews(req, res) {
    const { id } = req.body
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        if (req.method === 'POST') {
            try {
                const news = await prisma.News.delete({
                    where:{
                        id: id
                    }
                });
                res.status(200).json(news)
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