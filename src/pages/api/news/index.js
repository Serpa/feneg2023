import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function getNews(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        try {
            const news = await prisma.News.findMany({
            });
            res.status(200).json(news)
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        res.status(401)
    }
    res.end()
}