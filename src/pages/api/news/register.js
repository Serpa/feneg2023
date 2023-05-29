import prisma from '../../../utils/prismadb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function RegisterNews(req, res) {
    const { title, body, link, photo_url } = req.body
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        if (req.method === 'POST') {
            try {
                const news = await prisma.News.create({
                    data: {
                        userId: session.user.id,
                        data: new Date(),
                        title,
                        body,
                        link,
                        image: photo_url
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