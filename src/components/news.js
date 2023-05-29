import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import axios from 'axios';

export default function News(props) {
    const { data: session, status } = useSession()

    const handleDelete = async () => {
        try {
            const deleteNews = await axios.post('/api/news/delete', { id: props.id })
            console.log(deleteNews);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Card sx={{ maxWidth: 345, mb: 2 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={props.image ? props.image : '/sicoob_bg.png'}
                title="Image"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.body}
                </Typography>
            </CardContent>
            <CardActions>
                {props.link ? <Button size="small" href={props.link}>Saiba mais</Button> : false}
                {session?.user.adm ? <IconButton color='error' aria-label="delete" onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton> : false}
            </CardActions>
        </Card>
    );
}