import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputMask from 'react-input-mask';
import { useState, useRef } from 'react';
import axios from 'axios';
import Copyright from '../components/copyright'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '../utils/firebase'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';

const storage = getStorage(app);

const defaultTheme = createTheme();

export default function SignUp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (event) => {
    setLoading(false)
    event.preventDefault();
    if (name.length < 3 || phone.length < 11 || email.length < 5 || password.length < 6) {
      return false
    } else {
      console.log(name, phone, email, password);
      const user = await axios.post('/api/register', {
        name, phone, email, password
      })
      const fileRef = ref(storage, `avatars/${user.data.id}.jpg`);
      await uploadBytes(fileRef, selectedImage)
      const photo_url = await getDownloadURL(fileRef);
      const userWithPhoto = await axios.post('/api/register/photo', {
        id: user.data.id,
        photo: photo_url
      })
      const auth = await signIn("credentials", {
        email: email,
        password: password,
        callbackUrl: "/",
        redirect: false,
      })
      if (auth.ok) {
        router.push(auth.url);
      }
    }
    setLoading(false)
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    } else {
      return null
    }

  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Cadastrar
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <label htmlFor="upload-photo" style={{ padding: 10 }}>
                  <input
                    style={{ display: 'none' }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file" accept="image/png, image/gif, image/jpeg" onChange={handleFileChange}
                  />
                  <Button color="action" variant="contained" component="span">
                    Selecionar Foto
                  </Button>
                </label>
                {/* <Input type="file" accept="image/png, image/gif, image/jpeg" onChange={handleFileChange} /> */}
                {selectedImage ? (<Avatar
                  alt="Remy Sharp"
                  src={previewImage}
                  sx={{ width: 250, height: 250 }}
                />) : false}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputMask
                  mask="(99) 9 9999-9999"
                  disabled={false}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maskChar=" "
                >
                  {() => <TextField required
                    fullWidth
                    name="phone"
                    label="Celular"
                    type="text"
                    id="phone"
                    autoComplete="phone" />}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <LoadingButton
              loading={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Cadastrar
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Já tem uma conta? Clique aqui
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container >
    </ThemeProvider >
  );
}