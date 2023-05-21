import prisma from '../../../utils/prismadb'

export default async function RegisterStage(req, res) {
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

}