import { Copyright } from '@mui/icons-material'
import { Alert, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Snackbar, useMediaQuery, useTheme } from '@mui/material'
import Layout from '@/components/layout'
import Head from 'next/head'
import QrCode from '@/components/card'
import ReactToPrint from 'react-to-print';
import { useRef, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import ChecklistIcon from '@mui/icons-material/Checklist';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import dayjs from 'dayjs'
import * as XLSX from "xlsx";

const fetcher = url => axios.get(url).then(res => res.data)

export default function ListaQr() {
    const qrCodeRef = useRef();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const [stageDelete, setStageDelete] = useState({})
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [hiddenButton, setHiddenButton] = useState(false)
    const [snackbars, setSnackbars] = useState(false);
    const [msg, setMsg] = useState('');
    const { data, error, isLoading } = useSWR('/api/stage/getStage', fetcher, { refreshInterval: 1000 })
    if (error) return <div>Erro ao carregar!</div>
    if (isLoading) return <Layout><CircularProgress /></Layout>

    const handleDelete = async (id, name) => {
        setOpen(true);
        setStageDelete({ id, name })
    }

    const handleList = async (id, name) => {
        try {
            const list = await axios.post('/api/getPresence/stage', { stageId: id })
            let dataUpdate = list.data.map(presence => {
                return {
                    nome: presence.user.name,
                    email: presence.user.email,
                    telefone: presence.user.phone,
                    data: dayjs(presence.data).format('DD/MM/YYYY HH:mm:ss'),
                    local: presence.stage.name,
                    foto: presence.user.image,
                }
            })
            const worksheet = XLSX.utils.json_to_sheet(dataUpdate);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, name);
            XLSX.writeFile(workbook, `${name}.xlsx`, { compression: true });
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };
    const handleSnackClose = () => {
        setSnackbars(false);
    };

    const handleConfirm = async () => {
        try {
            const result = await axios.post('/api/stage/delete', stageDelete)
            if (result.status === 200) {
                setSnackbars(true)
                setMsg('Excluido com sucesso!')
            }
            setOpen(false);
        } catch (error) {
            setOpen(false);
        }

    };

    const cards = data.map(card => {
        return (
            <Grid item xs={12} md={8} lg={4} key={card.id}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center'
                    }}
                >
                    {hiddenButton ? false : (<Button variant="contained" startIcon={<ChecklistIcon />} sx={{ m: 2 }} onClick={() => handleList(card.id, card.name)}>
                        Lista de Presença
                    </Button>)}
                    <QrCode title={card.name} qrcode={card.id} />
                    {hiddenButton ? false : (<Button variant="contained" color='error' startIcon={<DeleteIcon />} sx={{ m: 2 }} onClick={() => handleDelete(card.id, card.name)}>
                        Excluir
                    </Button>)}
                </Paper>
            </Grid>
        )
    })
    return (
        <Layout>
            <Head>
                <title>HOME - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <ReactToPrint
                    trigger={() => (
                        <Button sx={{ m: 1 }} fullWidth variant="contained" endIcon={<PrintIcon />}>
                            Imprimir
                        </Button>
                    )}
                    content={() => qrCodeRef.current}
                />
                <Button sx={{ m: 1 }} fullWidth variant="contained" endIcon={hiddenButton ? (<VisibilityIcon />) : (<VisibilityOffIcon />)} onClick={() => {
                    setHiddenButton(!hiddenButton)
                }}>
                    {hiddenButton ? 'Mostrar Botões' : 'Esconder Botões'}
                </Button>
                <Grid ref={qrCodeRef} container spacing={5}>
                    {cards}
                </Grid>
                <Copyright sx={{ pt: 4 }} />
            </Container>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {`Excluir Local?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Você deseja excluir ${stageDelete.name}`}
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
            <Snackbar open={snackbars} autoHideDuration={5000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </Layout>
    )
}
