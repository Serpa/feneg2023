import { Copyright } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, List, ListItem, Paper, Snackbar, TextField, Typography } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

const fetcher = url => axios.get(url).then(res => res.data)

export default function Adm() {
    const { data: datasPresente, error: dateError, isLoading: loadingDate } = useSWR('/api/raffle/getPresenceDate', fetcher)
    const { data: session, status } = useSession()
    const router = useRouter()
    if (!session?.user.adm) {
        return (<Layout><Typography>Não autorizado!</Typography></Layout>)
    }

    if (dateError) return <div>Erro ao carregar!</div>
    if (loadingDate) return <Layout><CircularProgress /></Layout>

    const handleRaffle = async (day) => {
        const winner = await axios.post('/api/raffle/getPresenceCount', { dia: day })
    }

    const getWinnerByDay = async (dia) => {
        const getWinner = await axios.post('/api/raffle/getWinners', { dia: dia })
        console.log(getWinner.data);
        const winners = getWinner.data.map(winner => {
            return (
                <>
                    <ListItem>{winner.user.name} - {dayjs(winner.data).format('DD/MM/YYYY HH:mm:ss')}</ListItem>
                    <Divider />
                </>
            )
        })
        return winners
    }



    const dias = datasPresente.map(dia => {
        const diaFormated = dayjs(dia.dia).format('DD/MM/YYYY')
        return (
            <Button key={dia.dia} fullWidth variant="contained" onClick={() => router.push(`/adm/raffle/day/${dayjs(dia.dia).format('DD-MM-YYYY')}`)} sx={{ m: 1 }}>{diaFormated}</Button>
        )

    })

    return (
        <Layout>
            <Head>
                <title>HOME - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {dias}
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Layout>
    )
}

