import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import QRCode from 'react-qr-code';

export default function QrCode(props) {
    return (
        <Card sx={{ maxWidth: 345, width: '100%', height: '100%' }}>
            <CardActionArea>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={props.qrcode}
                    viewBox={`0 0 256 256`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.content}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}