import { Copyright } from '@mui/icons-material'
import { Alert, Box, CircularProgress, Container, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

const fetcher = url => axios.get(url).then(res => res.data)

export default function Adm() {
    const { data, error, isLoading } = useSWR('/api/stage/getStage', fetcher)
    const { data: session, status } = useSession()
    if (!session?.user.adm) {
        return (<Layout><Typography>Não autorizado!</Typography></Layout>)
    }
    if (error) return <div>Erro ao carregar!</div>
    if (isLoading) return <Layout><CircularProgress /></Layout>

    return (
        <Layout>
            <Head>
                <title>HOME - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Layout>
    )
}

