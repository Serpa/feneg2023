import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Termos() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Link href="#" underline="none" onClick={handleClick}>
                Termos e condições
            </Link>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    Termos e Condições e Declaração de Privacidade



                    Aceitação dos Termos e Condições

                    1.1. Ao utilizar FENEG 2023, doravante denominado "Serviço", o usuário concorda em cumprir e estar sujeito aos seguintes termos e condições.



                    1.2. O usuário reconhece que leu e compreendeu os Termos e Condições e concorda em cumprir todas as leis e regulamentos aplicáveis ao utilizar o Serviço.



                    Uso do Serviço

                    2.1. O Serviço é fornecido para uso pessoal e não comercial do usuário. Qualquer uso comercial do Serviço requer autorização prévia por escrito.



                    2.2. O usuário concorda em fornecer informações precisas e atualizadas durante o cadastro no Serviço e a mantê-las atualizadas.



                    2.3. O usuário é responsável por manter a confidencialidade de suas credenciais de acesso ao Serviço e por todas as atividades que ocorrerem em sua conta.



                    2.4. O usuário concorda em não usar o Serviço para qualquer finalidade ilegal, prejudicial, ofensiva ou que viole os direitos de terceiros.



                    Propriedade Intelectual

                    3.1. Todos os direitos de propriedade intelectual relacionados ao Serviço, incluindo software, design, marcas registradas, logotipos, conteúdo e outros materiais, são de propriedade exclusiva da FENEG 2023 ou de seus licenciadores.



                    3.2. O usuário concorda em não copiar, modificar, distribuir, transmitir, exibir, publicar ou criar trabalhos derivados do conteúdo do Serviço, a menos que tenha obtido permissão prévia por escrito da FENEG 2023.



                    Privacidade e Proteção de Dados

                    4.1. A FENEG 2023 valoriza a privacidade dos usuários e está comprometida em proteger os dados pessoais coletados durante o uso do Serviço.



                    4.2. O usuário concorda com a coleta, uso e processamento de seus dados pessoais de acordo com os termos estabelecidos na Declaração de Privacidade, disponível em [link para a Declaração de Privacidade].



                    4.3. A FENEG 2023 tomará as medidas adequadas para proteger a segurança dos dados pessoais dos usuários, seguindo as melhores práticas de segurança da informação.



                    Limitação de Responsabilidade

                    5.1. O usuário reconhece e concorda que o uso do Serviço é por sua própria conta e risco. O Serviço é fornecido "no estado em que se encontra" e a FENEG 2023 não oferece garantias de qualquer tipo, expressas ou implícitas.



                    5.2. Em nenhuma circunstância a COOPERATIVA DE CRÉDITO DE LIVRE ADMISSAO DA REGIÃO DE FRUTAL LTDA será responsável por danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da incapacidade de usar o Serviço.



                    Disposições Gerais

                    6.1. Estes Termos e Condições constituem o acordo completo entre o usuário e a FENEG 2023.
                </Typography>
            </Popover>
        </div>
    );
}