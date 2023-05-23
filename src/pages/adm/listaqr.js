import { Copyright } from '@mui/icons-material'
import { Button, CircularProgress, Container, Grid, Paper } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import QrCode from '@/components/card'
import ReactToPrint from 'react-to-print';
import { useRef } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import PrintIcon from '@mui/icons-material/Print';

const fetcher = url => axios.get(url).then(res => res.data)

export default function ListaQr() {
    const qrCodeRef = useRef();
    const { data, error, isLoading } = useSWR('/api/stage/getStage', fetcher)
    if (error) return <div>Erro ao carregar!</div>
    if (isLoading) return <Layout><CircularProgress /></Layout>
    const cards = data.map(card => {
        return (
            <Grid item xs={12} md={8} lg={4} key={card.id}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center'
                    }}
                >
                    <QrCode title={card.name} qrcode={card.id} />
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
                <ReactToPrint
                    trigger={() => (
                        <Button sx={{m:5}} variant="contained" endIcon={<PrintIcon />}>
                            Imprimir
                        </Button>
                    )}
                    content={() => qrCodeRef.current}
                />
                <Grid ref={qrCodeRef} container spacing={5}>
                    {cards}
                </Grid>
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Layout>
    )
}
