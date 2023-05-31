import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
  Alert,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/system';
import Copyright from '../components/copyright'
import Image from 'next/image';
import Head from 'next/head';
import { useEffect } from 'react';

const defaultTheme = createTheme();

const ErrorText = styled(Typography)`
  color: red;
`;

export default function SignUp() {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorLogin('')
    const { email, password } = data;
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/',
      });
      if (result.status === 401) {
        setLoading(false);
        setErrorLogin('E-mail e/ou senha incorretos.')
      }
      if (result.ok) {
        router.push(result.url);
      }
    } catch (error) {
      setLoading(false);
      setErrorLogin('Erro ao entrar')
      console.log('Sign in error:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Head>
        <title>Entrar - FENEG 2023 - Sicoob Frutal</title>
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
          <Image alt='Sicoob Logo' width={50} height={50} src={require('../../public/sicoob.png')} />
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  {...register('email', {
                    required: 'Este campo é obrigatório',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Endereço de e-mail inválido',
                    },
                  })}
                  autoComplete="email"
                />
                {errors.email && <ErrorText>Este campo é obrigatório</ErrorText>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  {...register('password', { required: true })}
                  autoComplete="new-password"
                />
                {errors.password && <ErrorText>Este campo é obrigatório</ErrorText>}
              </Grid>
            </Grid>
            {errorLogin ? (<Alert severity="error">{errorLogin}</Alert>) : false}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/forgot-password" variant="body2">
                  Esqueceu a senha? Clique aqui!
                </Link>
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
              Entrar
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/register" variant="body2">
                  Ainda não é cadastrado? Cadastre-se
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
