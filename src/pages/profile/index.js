import { Copyright } from '@mui/icons-material'
import { Box, CircularProgress, Container, Divider, Grid, List, ListItem, Paper, Typography } from '@mui/material'
import Layout from '../../components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import dayjs from 'dayjs'

const fetcher = url => axios.get(url).then(res => res.data)
export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/getPresence', fetcher)


  const presente = data?.map(stage => {
    return (<>
      <ListItem>{stage.stage.name} - {dayjs(stage.data).format('DD/MM/YYYY HH:mm:ss')}</ListItem>
      <Divider />
    </>)
  })

  if (error) return <div>Erro ao carregar!</div>
  if (isLoading) return <Layout><CircularProgress /></Layout>
  return (
    <Layout>
      <Head>
        <title>Perfil - FENEG  - Sicoob Frutal</title>
      </Head>
      <Container>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant='h5' sx={{ my: 3 }}>
            Lista de Presença
          </Typography>
          <List>
            {presente}
          </List>
        </Box>
      </Container>
    </Layout>
  )
}
