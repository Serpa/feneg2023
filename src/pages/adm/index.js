import { Copyright } from '@mui/icons-material'
import { Alert, Box, CircularProgress, Container, Grid, Paper, Snackbar, TextField } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form';
import { useState } from 'react'

const fetcher = url => axios.get(url).then(res => res.data)

export default function Adm() {
    const { handleSubmit, register, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [errorStage, seterrorStage] = useState('');
    const [msg, setMsg] = useState('');
    const [snackbars, setSnackbars] = useState(false);
    const { data, error, isLoading } = useSWR('/api/stage/getStage', fetcher)

    const handleClick = () => {
        setSnackbars(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbars(false);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        seterrorStage('')
        const { name } = data;
        try {
            const stage = await axios.post('/api/stage/register', {
                name
            });
            if (stage.status === 200) {
                setSnackbars(true)
                setMsg('Cadastrado com sucesso!')
                reset({
                    name: ''
                })
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            seterrorStage('Nome já cadastrado!', error)
        }
    };

    if (error) return <div>Erro ao carregar!</div>
    if (isLoading) return <Layout><CircularProgress /></Layout>

    return (
        <Layout>
            <Head>
                <title>HOME - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Nome"
                                name="name"
                                {...register('name', {
                                    required: 'Este campo é obrigatório',
                                })}
                                autoComplete="name"
                            />
                            {errors.name && <Alert severity="error">Este campo é obrigatório</Alert>}
                        </Grid>
                    </Grid>
                    {errorStage ? (<Alert severity="error">{errorStage}</Alert>) : false}
                    <LoadingButton
                        loading={loading}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3, mb: 2, backgroundColor: '#49479D', "&:hover": {
                                backgroundColor: '#003641',
                            },
                        }}
                    >
                        Cadastrar
                    </LoadingButton>
                </Box>
                <Copyright sx={{ pt: 4 }} />
            </Container>
            <Snackbar open={snackbars} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </Layout>
    )
}

