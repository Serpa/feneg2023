import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
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
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const defaultTheme = createTheme();

const ErrorText = styled(Typography)`
  color: red;
`;

export default function ForgotPassword() {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorRecover, setErrorRecover] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onSubmit = async (data) => {
    setErrorRecover('')
    setLoading(true)
    try {
      const sendEmail = await axios.post('/api/recover/send', { email: data.email })
      setLoading(false)
      if (sendEmail.status === 200) {
        setOpen(true);
        router.push('/login')
      }
    } catch (error) {
      if (error.response.status === 404) {
        setErrorRecover('E-mail não encontrado!')
      } else {
        setErrorRecover('Erro ao enviar e-mail, procure suporte!')
      }
      setLoading(false)
    }
  };

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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
          <Image alt='Sicoob Logo' width={50} height={50} src={require('../../public/sicoob.png')} />
          <Typography component="h1" variant="h5">
            Recuperar Senha
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: '100%' }}>
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
            </Grid>
            {errorRecover ? (<Alert severity="error">{errorRecover}</Alert>) : false}
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
              Enviar
            </LoadingButton>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                E-mail enviado com sucesso, verifique sua caixa de e-mail para recuperar o acesso a sua conta!
              </Alert>
            </Snackbar>
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
