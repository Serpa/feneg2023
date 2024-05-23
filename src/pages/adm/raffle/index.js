import { Copyright } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, List, ListItem, Paper, Snackbar, TextField, Typography } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

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

    const dataFormatada = datasPresente.map(dia => {
        return dayjs(dia.dia).format('DD/MM/YYYY')
    })

    const dias = dataFormatada.map(dia => {
        const day = dayjs(dia, 'DD/MM/YYYY').format('DD-MM-YYYY')
        return (
            <Button key={dia} fullWidth variant="contained" onClick={() => router.push(`/adm/raffle/day/${day}`)} sx={{ m: 1 }}>{dia}</Button>
        )
    })

    return (
        <Layout>
            <Head>
                <title>HOME - FENEG  - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography variant='h4'>
                    Dias com Presentes
                </Typography>
                {dias}
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Layout>
    )
}

