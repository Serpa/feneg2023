import React from 'react'
import Layout from '../../components/layout'
import { useZxing } from "react-zxing";
import { useState } from 'react';
import { Alert, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, useMediaQuery } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export default function Presenca() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const [snackbars, setSnackbars] = useState(false);
    const [msg, setMsg] = useState('');
    const [name, setName] = useState('');
    const [severity, setSeverity] = useState('');
    const { data, error, isLoading } = useSWR('/api/stage/getStage', fetcher)

    const handleClick = () => {
        setSnackbars(true);
    };

    const handleCloseSnackbars = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbars(false);
    };
    const [result, setResult] = useState("");

    const { ref } = useZxing({
        onResult(result) {
            const getname = data.filter(e => {
                return e.id == result
            })
            if (getname.length > 0) {
                setName(getname)
                setOpen(true);
                setResult(result.getText());
            }else{
                setSeverity('error')
                setSnackbars(true)
                setMsg('QrCode Inválido!')
            }

        },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = async () => {
        setOpen(false);
        try {
            const presence = await axios.post(`/api/presenca/`, {
                stageId: result
            })
            if (presence.status === 200) {
                setSeverity('success')
                setSnackbars(true)
                setMsg('Cadastrado com sucesso!')
            }
        } catch (error) {
            if (error.response.status === 409) {
                setSeverity('warning')
                setSnackbars(true)
                setMsg('Você já confirmou presença nesse local!')
            } else {
                setSeverity('error')
                setSnackbars(true)
                setMsg('Erro ao cadastrar')
            }
        }
    };

    return (
        <Layout>
            <Head>
                <title>Presença - FENEG  - Sicoob Frutal</title>
            </Head>
            {/* {router.query.id} */}
            <video style={{ width: '100%', height: '100%' }} ref={ref} />
            {/* <p>
                    <span>Last result:</span>
                    <span>{result}</span>
                </p> */}
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Confirmar Presença?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {name[0]?.name}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbars} autoHideDuration={5000} onClose={handleCloseSnackbars}>
                <Alert onClose={handleCloseSnackbars} severity={severity || 'info'} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </Layout>
    )
}
