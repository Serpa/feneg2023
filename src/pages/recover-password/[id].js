import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  CircularProgress,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/system';
import Copyright from '../../components/copyright'
import Image from 'next/image';
import useSWR from 'swr'
import axios from 'axios'
import Head from 'next/head';
import { signIn } from 'next-auth/react';

const fetcher = url => axios.get(url).then(res => res.data)

const defaultTheme = createTheme();

const ErrorText = styled(Typography)`
  color: red;
`;

export default function ForgotPassword() {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorRecovery, setErrorRecovery] = useState('');
  const { data, error, isLoading } = useSWR(`/api/recover/check/${router.query.id}`, fetcher)
  if (error) return (
    <ThemeProvider theme={defaultTheme}>
      <Head>
        <title>Esqueci a Senha - FENEG 2023 - Sicoob Frutal</title>
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
          <Image alt='Sicoob Logo' width={50} height={50} src={require('../../../public/sicoob.png')} />
          <Typography component="h1" variant="h5">
            404 - Usuário não encontrado!
          </Typography>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
  if (isLoading) return <CircularProgress />

  const onSubmit = async (dataForm) => {
    setErrorRecovery('')
    setLoading(true)
    if (dataForm.password != dataForm.password2) {
      setErrorRecovery('As senhas não conferem!')
      setLoading(false)
    } else {
      try {
        const updatePassword = await axios.post('/api/recover', { password: dataForm.password, id: data.id })
        if (updatePassword.status === 200) {
          const auth = await signIn('credentials', {
            redirect: false,
            email: updatePassword.data.email,
            password: dataForm.password,
            callbackUrl: '/',
          });
          if (auth.ok) {
            router.push(auth.url);
          }
        }
      } catch (error) {
        setLoading(false)
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Head>
        <title>Esqueci a Senha - FENEG 2023 - Sicoob Frutal</title>
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
          <Image alt='Sicoob Logo' width={50} height={50} src={require('../../../public/sicoob.png')} />
          <Typography component="h1" variant="h5">
            Recuperar Senha
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  type="password"
                  label="Senha"
                  name="password"
                  {...register('password', {
                    required: 'Este campo é obrigatório',
                    minLength: {
                      value: 6,
                      message: "Minimo de 6 caracteres"
                    }
                  })}
                />
                {errors.password?.required && <ErrorText>{errors.password?.required}</ErrorText>}
                {errors.password?.message && <ErrorText>{errors.password?.message}</ErrorText>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password2"
                  type="password"
                  label="Confirmar Senha"
                  name="password2"
                  {...register('password2', {
                    required: 'Este campo é obrigatório',
                    minLength: {
                      value: 6,
                      message: "Minimo de 6 caracteres"
                    }
                  })}
                />
                {errors.password2?.required && <ErrorText>{errors.password?.required}</ErrorText>}
                {errors.password2?.message && <ErrorText>{errors.password2?.message}</ErrorText>}
              </Grid>
            </Grid>
            {errorRecovery ? (<Alert severity="error">{errorRecovery}</Alert>) : false}
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
              Salvar
            </LoadingButton>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
