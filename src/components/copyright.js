import { Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react'

export default function copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.sicoob.com.br/web/sicoobfrutal">
                Sicoob Frutal
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}