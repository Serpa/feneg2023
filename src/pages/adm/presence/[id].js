import { Copyright } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, List, ListItem, Paper, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material'
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
import { useRouter } from 'next/router';
import dayjs from 'dayjs'

const fetcher = url => axios.get(url).then(res => res.data)

export default function PresenceAdm() {
    const router = useRouter();
    const qrCodeRef = useRef();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const [stageDelete, setStageDelete] = useState({})
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [hiddenButton, setHiddenButton] = useState(false)
    const [snackbars, setSnackbars] = useState(false);
    const [msg, setMsg] = useState('');
    const { data, error, isLoading } = useSWR(`/api/stage/presenceStage/${router.query.id}`, fetcher, { refreshInterval: 1000 })
    if (error) return <div>Erro ao carregar!</div>
    if (isLoading) return <Layout><CircularProgress /></Layout>

    const handleDelete = async (id, name, stageName) => {
        setOpen(true);
        setStageDelete({ id, name, stageName })
    }


    const handleClose = () => {
        setOpen(false);
    };
    const handleSnackClose = () => {
        setSnackbars(false);
    };

    const handleConfirm = async () => {
        try {
            const result = await axios.post('/api/presenca/delete', stageDelete)
            if (result.status === 200) {
                setSnackbars(true)
                setMsg('Excluido com sucesso!')
            }
            setOpen(false);
        } catch (error) {
            setOpen(false);
        }

    };

    const presente = data?.map(stage => {
        return (<>
            <ListItem key={stage.id} secondaryAction={<IconButton aria-label="delete" size="large" color='error' onClick={() => handleDelete(stage.id, stage.user.name, stage.stage.name)}>
                <DeleteIcon />
            </IconButton>}>{stage.user.name} - {dayjs(stage.data).format('DD/MM/YYYY HH:mm:ss')}</ListItem>
            <Divider />
        </>)
    })

    return (
        <Layout>
            <Head>
                <title>HOME - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant='h5' sx={{ my: 3 }}>
                        {data[0]?.stage.name}
                    </Typography>
                    <List>
                        {presente}
                    </List>
                </Box>
            </Container>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {`Excluir presença?`}
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
