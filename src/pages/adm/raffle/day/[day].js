import { Copyright } from '@mui/icons-material'
import { Button, CircularProgress, Container, Divider, List, ListItem, Typography } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import { LoadingButton } from '@mui/lab'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const fetcher = url => axios.get(url).then(res => res.data)

export default function RaffleDay() {
    const router = useRouter();
    const dia = router.query.day;
    const day = dayjs(dia, 'DD-MM-YYYY')
    const { data: dataWinner, error: dateError, isLoading: loadingDate } = useSWR(`/api/raffle/getWinners/${router.query.day}`, fetcher, { refreshInterval: 1000 })
    const { data: session, status } = useSession()
    if (!session?.user.adm) {
        return (<Layout><Typography>Não autorizado!</Typography></Layout>)
    }

    if (dateError) return <div>Erro ao carregar!</div>
    if (loadingDate) return <Layout><CircularProgress /></Layout>

    const handleRaffle = async () => {
        try {
            const winner = await axios.post(`/api/raffle/getPresenceCount`, { dia: day.toDate() })
            console.log(winner);
        } catch (error) {
            if (error.response.status === 409) {

            }
        }

    }

    const winners = dataWinner.map(winner => {
        return (
            <React.Fragment key={winner.id}>
                <ListItem>{winner.user.name} - {dayjs(winner.data).format('DD/MM/YYYY HH:mm:ss')}</ListItem>
                <Divider />
            </React.Fragment>
        )
    })


    return (
        <Layout>
            <Head>
                <title>HOME - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography variant='h4'>
                    {dayjs(day).format('DD/MM/YYYY')}
                </Typography>
                <Button fullWidth variant="contained" onClick={handleRaffle} sx={{ m: 1 }}>Sortear</Button>
                <List>
                    {winners}
                </List>
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Layout>
    )
}

