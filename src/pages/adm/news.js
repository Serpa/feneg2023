import { Copyright } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Container, Grid, Paper, Snackbar, TextField } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import axios from 'axios'
import useSWR from 'swr'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form';
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/utils/firebase';
import { v4 as uuidv4 } from 'uuid';
const storage = getStorage(app);

const fetcher = url => axios.get(url).then(res => res.data)

export default function News() {
    const { handleSubmit, register, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [errorStage, seterrorStage] = useState('');
    const [msg, setMsg] = useState('');
    const [snackbars, setSnackbars] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const { data: session, status } = useSession()
    if (!session?.user.adm) {
        return "not authenticated..."
    }

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
        console.log(data);
        selectedImage ? setImgError(false) : setImgError(true);
        setLoading(true);
        if (selectedImage && data.title && data.body) {
            try {
                const fileRef = ref(storage, `news/${uuidv4()}.jpg`);
                await uploadBytes(fileRef, selectedImage);
                const photo_url = await getDownloadURL(fileRef);
                const news = await axios.post('/api/news/register', { ...data, photo_url })
                setLoading(false);
                setMsg('Noticia cadastrada com sucesso!')
                setSnackbars(true);

            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        } else {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            const previewURL = URL.createObjectURL(file);
            setPreviewImage(previewURL);
            setImgError(false);
        } else {
            setSelectedImage(null);
            setPreviewImage(null);
        }
    };

    return (
        <Layout>
            <Head>
                <title>HOME - FENEG  - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <label htmlFor="upload-photo" style={{ padding: 10 }}>
                                <input
                                    style={{ display: 'none' }}
                                    id="upload-photo"
                                    name="upload-photo"
                                    type="file" accept="image/png, image/gif, image/jpeg" onChange={handleFileChange}
                                />
                                <Button component="span" variant="contained"
                                    sx={{
                                        mt: 3, mb: 2, backgroundColor: '#49479D', "&:hover": {
                                            backgroundColor: '#003641',
                                        },
                                    }}>
                                    Selecionar Foto
                                </Button>
                            </label>
                            {imgError ? (<Alert severity="error">É obrigatório uma foto de perfil</Alert>) : ''}
                            {selectedImage && (
                                <Image
                                    width={345}
                                    height={140}
                                    src={previewImage}
                                    alt='Preview'
                                />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="titulo"
                                label="Título"
                                name="titulo"
                                {...register('title', {
                                    required: 'Este campo é obrigatório',
                                })}
                            />
                            {errors.title && <Alert severity="error">Este campo é obrigatório</Alert>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                required
                                fullWidth
                                id="corpo"
                                label="Conteúdo"
                                name="name"
                                {...register('body', {
                                    required: 'Este campo é obrigatório',
                                })}
                            />
                            {errors.body && <Alert severity="error">Este campo é obrigatório</Alert>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="link"
                                label="Link"
                                name="link"
                                {...register('link')}
                            />
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

