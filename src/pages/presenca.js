import React from 'react'
import Layout from '../components/layout'
import { useZxing } from "react-zxing";
import { useState } from 'react';
import { Container, CardMedia } from '@mui/material';

export default function Presenca() {
    const [result, setResult] = useState("");
    const { ref } = useZxing({
        onResult(result) {
            setResult(result.getText());
        },
    });
    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                
                <video style={{maxWidth:'100%'}} ref={ref} />
                <p>
                    <span>Last result:</span>
                    <span>{result}</span>
                </p>
            </Container>
        </Layout>
    )
}
