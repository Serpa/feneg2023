import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/utils/firebase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import Copyright from '@/components/copyright'
import { Alert, CircularProgress } from '@mui/material';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/layout'

const storage = getStorage(app);

export default function SignUp() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession()
  useEffect(() => {
    reset({
      name: session?.user.name,
      phone: session?.user.phone,
      email: session?.user.email,
    })
  }, [status])

  const onSubmit = async (data) => {
    setEmailError(false)
    setPhoneError(false)
    setLoading(true);
    if (data.name && data.phone && data.email && data.password) {
      try {
        if (selectedImage) {
          const fileRef = ref(storage, `avatars/${session.user.id}.jpg`);
          await uploadBytes(fileRef, selectedImage);
          const photo_url = await getDownloadURL(fileRef);
          const userUpdate = await axios.post('/api/update/profile', {
            ...data,
            image: photo_url
          });
          if (userUpdate.status === 200) {
            setLoading(false);
            update(userUpdate.data)
            router.push('/')
          }
        } else {
          const userUpdate = await axios.post('/api/update/profile', {
            ...data,
            image: session.user.image
          });
          if (userUpdate.status === 200) {
            setLoading(false);
            update(userUpdate.data)
            router.push('/')
          }
        }
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

  if (status === "loading") {
    return (<Layout><CircularProgress /></Layout>)
  }


  return (
    <Layout>
      <Head>
        <title>Registro - FENEG  - Sicoob Frutal</title>
      </Head>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Perfil
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, mx: 3 }}>
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
                <Avatar src={previewImage} sx={{ width: 250, height: 250 }} />
              )}
              {!selectedImage && (
                <Avatar src={session?.user.image} sx={{ width: 250, height: 250 }} />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
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
            Atualizar
          </LoadingButton>
        </Box>
      </Box>
    </Layout>
  );
}
