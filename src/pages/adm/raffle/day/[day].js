import { Copyright } from '@mui/icons-material'
import { Alert, Badge, Button, CircularProgress, Container, Divider, List, ListItem, Paper, Typography } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import { LoadingButton } from '@mui/lab'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import WinnerCard from '@/components/winnerCard'
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
dayjs.extend(customParseFormat)

const fetcher = url => axios.get(url).then(res => res.data)

export default function RaffleDay() {
    const router = useRouter();
    const [alertError, setAlertError] = useState(false)
    const [loading, setLoading] = useState(false)
    const dia = router.query.day;
    const [winner, setWinner] = useState()
    const day = dayjs(dia, 'DD-MM-YYYY')
    const { data: users, error: userError, isLoading: loadingUser } = useSWR(`/api/raffle/getUserEntries/${router.query.day}`, fetcher, { refreshInterval: 1000 })
    const { data: session, status } = useSession()
    if (!session?.user.adm) {
        return (<Layout><Typography>Não autorizado!</Typography></Layout>)
    }

    if (userError) return <div>Erro ao carregar!</div>
    if (loadingUser) return <Layout><CircularProgress /></Layout>

    const handleRaffle = async () => {
        setLoading(true)
        try {
            const getWinner = await axios.post(`/api/raffle/getPresenceCount`, { dia: day.toDate(), stands: 1 })
            console.log(getWinner);
            setWinner(getWinner.data)
            setLoading(false)

        } catch (error) {
            if (error.response.status === 409) {
                setAlertError(true)
                setLoading(false)
            }
        }

    }

    // const winners = dataWinner.map(winner => {
    //     return (
    //         <React.Fragment key={winner.id}>
    //             <ListItem>{winner.user.name} - {dayjs(winner.data).format('DD/MM/YYYY HH:mm:ss')}</ListItem>
    //             <Divider />
    //         </React.Fragment>
    //     )
    // })


    return (
        <Layout>
            <Head>
                <title>HOME - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography variant='h4'>
                    Sorteio do dia {dayjs(day).format('DD/MM/YYYY')}
                </Typography>
                <Paper elevation={6} sx={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
                    <Typography variant='h5'  sx={{m: 2}}>
                        Concorrentes
                    </Typography>
                    <Typography variant='h6'>
                        {users.users}
                    </Typography>

                </Paper>
                <LoadingButton
                    sx={{ m: 1 }}
                    onClick={handleRaffle}
                    endIcon={<LocalActivityIcon />}
                    loading={loading}
                    loadingPosition="end"
                    variant="contained"
                >
                    Sortear
                </LoadingButton>
                {alertError ? <Alert severity="error">Não há mais nenhum usuário que cumpra os requisitos para ser sorteado nesse dia!</Alert> : null}
                {winner ? <WinnerCard name={winner.name} phone={winner.phone} photo={winner.image} /> : false}
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Layout>
    )
}

