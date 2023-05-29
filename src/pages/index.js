import { Copyright } from '@mui/icons-material'
import { CircularProgress, Container, Grid, Paper } from '@mui/material'
import Layout from '../components/layout'
import Head from 'next/head'
import News from '@/components/news'
import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/news', fetcher, { refreshInterval: 1000 })


  const news = data?.map(news => {
    return (<News {...news} />)
  })

  if (error) return <div>Erro ao carregar!</div>
  if (isLoading) return <Layout><CircularProgress /></Layout>
  return (
    <Layout>
      <Head>
        <title>HOME - FENEG 2023 - Sicoob Frutal</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap'
              }}
            >
              {news}
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Layout>
  )
}
