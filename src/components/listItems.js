import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Link from 'next/link';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NewspaperIcon from '@mui/icons-material/Newspaper';


export const mainListItems = (
  <React.Fragment>
    <Link href="/" style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: 30,
    }}>
      <ListItemButton>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Início" />
      </ListItemButton>
    </Link>

    <Link href="/presenca" style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: 30,
    }}>
      <ListItemButton>
        <ListItemIcon>
          <QrCode2Icon />
        </ListItemIcon>
        <ListItemText primary="Presença" />
      </ListItemButton>
    </Link>

    <Link href="/profile" style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: 30,
    }}>
      <ListItemButton>
        <ListItemIcon>
          <ManageAccountsIcon />
        </ListItemIcon>
        <ListItemText primary="Perfil" />
      </ListItemButton>
    </Link>

  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>

    <Link href="/adm" style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: 30,
    }}>
      <ListItemButton>
        <ListItemIcon>
          <AssuredWorkloadIcon />
        </ListItemIcon>
        <ListItemText primary="Cadastrar QrCode" />
      </ListItemButton>
    </Link>

    <Link href="/adm/news" style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: 30,
    }}>
      <ListItemButton>
        <ListItemIcon>
          <NewspaperIcon />
        </ListItemIcon>
        <ListItemText primary="Cadastrar Notícia" />
      </ListItemButton>
    </Link>

    <Link href="/adm/listaqr" style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: 30,
    }}>
      <ListItemButton>
        <ListItemIcon>
          <QrCode2Icon />
        </ListItemIcon>
        <ListItemText primary="Listar QrCodes" />
      </ListItemButton>
    </Link>

    <Link href="/adm/raffle" style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: 30,
    }}>
      <ListItemButton>
        <ListItemIcon>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="Sorteio" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);