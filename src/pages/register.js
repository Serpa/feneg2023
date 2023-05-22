import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../utils/firebase';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import Copyright from '../components/copyright'
import { Alert } from '@mui/material';
import Image from 'next/image';
import Head from 'next/head';

const storage = getStorage(app);

const defaultTheme = createTheme();

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    selectedImage ? setImgError(false) : setImgError(true);
    setEmailError(false)
    setPhoneError(false)
    setLoading(true);
    if (selectedImage && data.name && data.phone && data.email && data.password) {
      try {
        const user = await axios.post('/api/register', data);
        const fileRef = ref(storage, `avatars/${user.data.id}.jpg`);
        await uploadBytes(fileRef, selectedImage);
        const photo_url = await getDownloadURL(fileRef);
        const userWithPhoto = await axios.post('/api/register/photo', {
          id: user.data.id,
          photo: photo_url,
        });
        const auth = await signIn('credentials', {
          email: data.email,
          password: data.password,
          callbackUrl: '/',
          redirect: false,
        });
        if (auth.ok) {
          router.push(auth.url);
        }
      } catch (error) {
        if (error.response.data.message.meta.target === 'User_email_key') {
          setEmailError(true)
        }
        if (error.response.data.message.meta.target === 'User_phone_key') {
          setPhoneError(true)
        }
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
    <ThemeProvider theme={defaultTheme}>
      <Head>
        <title>Registro - FENEG 2023 - Sicoob Frutal</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image width={50} height={50} src={require('../../public/sicoob.png')} />
          <Typography component="h1" variant="h5">
            Cadastrar
          </Typography>
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
                  <Avatar alt="Remy Sharp" src={previewImage} sx={{ width: 250, height: 250 }} />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nome"
                  autoFocus
                  {...register('name', { required: 'Este campo é obrigatório' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <InputMask
                  mask="(99) 9 9999-9999"
                  disabled={false}
                  {...register('phone', { required: 'Este campo é obrigatório' })}
                  maskChar=" "
                >
                  {() => (
                    <TextField
                      required
                      fullWidth
                      name="phone"
                      label="Celular"
                      type="text"
                      id="phone"
                      autoComplete="phone"
                      error={!!errors.phone || phoneError}
                      helperText={phoneError ? 'Celular já cadastrado' : errors.phone?.message}
                    />
                  )}
                </InputMask>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Este campo é obrigatório',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Endereço de e-mail inválido',
                    },
                  })}
                  error={!!errors.email || emailError}
                  helperText={emailError ? 'E-mail já cadastrado' : errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('password', { required: 'Este campo é obrigatório', minLength: 6 })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
            </Grid>
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Já tem uma conta? Clique aqui
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
