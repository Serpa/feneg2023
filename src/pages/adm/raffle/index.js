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
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const fetcher = url => axios.get(url).then(res => res.data)

export default function Adm() {
    const { data: datasPresente, error: dateError, isLoading: loadingDate } = useSWR('/api/raffle/getPresenceDate', fetcher)
    const { data: session, status } = useSession()
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
        console.log(getWinner);
    }



    const dias = datasPresente.map(dia => {
        const diaFormated = dayjs(dia.dia).utc().format('DD/MM/YYYY')
        const day = dayjs(dia.dia);
        getWinnerByDay(day)
        return (
            <Grid item xs={12} md={8} lg={4} key={dia.dia}>
                <Button onClick={() => handleRaffle(dia.dia)}>{diaFormated}</Button>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center'
                    }}
                >
                    <List>
                        { }
                    </List>
                </Paper>
            </Grid>
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

