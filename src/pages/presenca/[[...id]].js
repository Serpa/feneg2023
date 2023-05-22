import React from 'react'
import Layout from '../../components/layout'
import { useZxing } from "react-zxing";
import { useState } from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

export default function Presenca() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const [result, setResult] = useState("");

    const { ref } = useZxing({
        onResult(result) {
            setOpen(true);
            setResult(result.getText());
        },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Layout>
            <Head>
                <title>Presença - FENEG 2023 - Sicoob Frutal</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* {router.query.id} */}
                <video style={{ maxWidth: '100%' }} ref={ref} />
                <p>
                    <span>Last result:</span>
                    <span>{result}</span>
                </p>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Use Google's location service?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Let Google help apps determine location. This means sending anonymous
                            location data to Google, even when no apps are running.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Disagree
                        </Button>
                        <Button onClick={handleClose} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Layout>
    )
}
