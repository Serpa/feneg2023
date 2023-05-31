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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import Copyright from '../components/copyright'
import { Alert } from '@mui/material';
import Image from 'next/image';
import Head from 'next/head';
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

const storage = getStorage(app);

const defaultTheme = createTheme();


export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();


  const onSubmit = async (data) => {
    setEmailError(false)
    setPhoneError(false)
    setLoading(true);
    if (data.name && data.phone && data.email && data.password && data.termos) {
      try {
        const user = await axios.post('/api/register', data);
        if (selectedImage) {
          const fileRef = ref(storage, `avatars/${user.data.id}.jpg`);
          await uploadBytes(fileRef, selectedImage);
          const photo_url = await getDownloadURL(fileRef);
          const userWithPhoto = await axios.post('/api/register/photo', {
            id: user.data.id,
            photo: photo_url,
          });
        }
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
        if (error.response.data.message.meta.target === 'User_cpf_key') {
          setCpfError(true)
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
          <Image alt='Sicoob Logo' width={50} height={50} src={require('../../public/sicoob.png')} />
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
                  maskChar="_"
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
                <InputMask
                  mask="999.999.999-99"
                  disabled={false}
                  {...register('cpf', { required: 'Este campo é obrigatório' })}
                  maskChar="_"
                >
                  {() => (
                    <TextField
                      required
                      fullWidth
                      name="cpf"
                      label="CPF"
                      type="text"
                      id="cpf"
                      autoComplete="cpf"
                      error={!!errors.cpf || cpfError}
                      helperText={cpfError ? 'CPF já cadastrado' : errors.cpf?.message}
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
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Checkbox {...register('termos', { required: 'Este campo é obrigatório' })} />
                <Typography >Aceito os <Link href="#" underline="none" onClick={handleClickOpen}>
                  Termos e condições
                </Link> e autorizo o uso dos meus dados.</Typography>
              </Grid>
            </Grid>
            {errors.termos ? <Alert severity="error">É preciso aceitar os termos.</Alert> : false}
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

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Termos e Condições e Declaração de Privacidade"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Termos e Condições e Declaração de Privacidade



            Aceitação dos Termos e Condições

            1.1. Ao utilizar FENEG 2023, doravante denominado &quotServiço&quot, o usuário concorda em cumprir e estar sujeito aos seguintes termos e condições.



            1.2. O usuário reconhece que leu e compreendeu os Termos e Condições e concorda em cumprir todas as leis e regulamentos aplicáveis ao utilizar o Serviço.



            Uso do Serviço

            2.1. O Serviço é fornecido para uso pessoal e não comercial do usuário. Qualquer uso comercial do Serviço requer autorização prévia por escrito.



            2.2. O usuário concorda em fornecer informações precisas e atualizadas durante o cadastro no Serviço e a mantê-las atualizadas.



            2.3. O usuário é responsável por manter a confidencialidade de suas credenciais de acesso ao Serviço e por todas as atividades que ocorrerem em sua conta.



            2.4. O usuário concorda em não usar o Serviço para qualquer finalidade ilegal, prejudicial, ofensiva ou que viole os direitos de terceiros.



            Propriedade Intelectual

            3.1. Todos os direitos de propriedade intelectual relacionados ao Serviço, incluindo software, design, marcas registradas, logotipos, conteúdo e outros materiais, são de propriedade exclusiva da FENEG 2023 ou de seus licenciadores.



            3.2. O usuário concorda em não copiar, modificar, distribuir, transmitir, exibir, publicar ou criar trabalhos derivados do conteúdo do Serviço, a menos que tenha obtido permissão prévia por escrito da FENEG 2023.



            Privacidade e Proteção de Dados

            4.1. A FENEG 2023 valoriza a privacidade dos usuários e está comprometida em proteger os dados pessoais coletados durante o uso do Serviço.



            4.2. O usuário concorda com a coleta, uso e processamento de seus dados pessoais de acordo com os termos estabelecidos na Declaração de Privacidade.



            4.3. A FENEG 2023 tomará as medidas adequadas para proteger a segurança dos dados pessoais dos usuários, seguindo as melhores práticas de segurança da informação.



            Limitação de Responsabilidade

            5.1. O usuário reconhece e concorda que o uso do Serviço é por sua própria conta e risco. O Serviço é fornecido &quotno estado em que se encontra&quot e a FENEG 2023 não oferece garantias de qualquer tipo, expressas ou implícitas.



            5.2. Em nenhuma circunstância a COOPERATIVA DE CRÉDITO DE LIVRE ADMISSAO DA REGIÃO DE FRUTAL LTDA será responsável por danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da incapacidade de usar o Serviço.



            Disposições Gerais

            6.1. Estes Termos e Condições constituem o acordo completo entre o usuário e a FENEG 2023.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleClose} autoFocus>
            Aceitar
          </Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
}
