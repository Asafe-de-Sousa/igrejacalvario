import express from 'express'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal'
import WebSocket from 'ws';

// Configura o cliente usando LocalAuth para gerenciar a sessão localmente
const client = new Client({
    authStrategy: new LocalAuth({
      clientId: 'meu-bot', // Isso define um ID para diferenciar sessões
      dataPath: './session', // Diretório personalizado para armazenar a sessão
    })
})

const wss = new WebSocket.Server({ noServer: true })

client.on('qr', (qr) => {
    console.log('QR Code gerado! Escaneie com o WhatsApp:');
    qrcode.generate(qr, { small: true });
    
    // Envia o QR Code para todos os clientes conectados via WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(qr);
        }
    });
});


// Gera o QR Code no terminal para conexão inicial
/*client.on('qr', (qr) => {
    console.log('QR Code gerado! Escaneie com o WhatsApp:')
    qrcode.generate(qr, { small: true })
})*/

// Notifica quando o cliente está pronto para ser usado
client.on('ready', async () => {
    console.log('Cliente conectado com sucesso!')
})

// Exibe qualquer erro
client.on('auth_failure', (msg) => {
    console.error('Erro de autenticação: ', msg)
})

// Inicia o cliente
client.initialize()

// Inicia o WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
  
  
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/home.html')
})

/* Routes in the navbar */
app.get('/contribuition', (req, res) => {
    res.sendFile(__dirname + '/pages/contribuition.html')
})
app.get('/getinvolved', (req, res) => {
    res.sendFile(__dirname + '/pages/get-involved.html')
})
app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/pages/contact.html')
})


/* Routes in the header of the home page */
app.get('/volunteers', (req, res) => {
    res.sendFile(__dirname + '/pages/volunteers.html')
})
app.get('/socialassistence', (req, res) => {
    res.sendFile(__dirname + '/pages/social-assistence.html')
})


/* Routes of the locations */
app.get('/maluche', (req, res) => {
    res.sendFile(__dirname + '/pages/locations/maluche.html')
})
app.get('/domjoaquim', (req, res) => {
    res.sendFile(__dirname + '/pages/locations/domjoaquim.html')
})
app.get('/claraiba', (req, res) => {
    res.sendFile(__dirname + '/pages/locations/claraiba.html')
})
app.get('/gaspar', (req, res) => {
    res.sendFile(__dirname + '/pages/locations/gaspar.html')
})
app.get('/novatrento', (req, res) => {
    res.sendFile(__dirname + '/pages/locations/trento.html')
})

/* Routes from Get Involved page */
app.get('/cursos', (req, res) => {
    res.sendFile(__dirname + '/pages/cursos.html')
})
app.get('/retiros', (req, res) => {
    res.sendFile(__dirname + '/pages/retiros.html')
})
app.get('/celulas', (req, res) => {
    res.sendFile(__dirname + '/pages/celulas.html')
})
app.get('/eventos', (req, res) => {
    res.sendFile(__dirname + '/pages/eventos.html')
})

/* Other Routes */
app.get('/privacity', (req, res) => {
    res.sendFile(__dirname + '/pages/privacidade.html')
})
app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/pages/success.html')
})
app.get('/zap', (req, res) => {
    res.sendFile(__dirname + '/pages/zaplogin.html')
})

/* POSTS */
app.post('/email', (req, res) => {
    const email = req.body

    res.redirect('/success')
    console.log(email)
})

app.post('/volunteer', async (req, res) => {
    const name = req.body.name
    const number = req.body.number
    const option = req.body.options

    console.log(req.body)

    const groupId = '120363328042913669@g.us'; // Substitua pelo ID do seu grupo

    // Monta a mensagem
    const message = `
    *Novo Voluntário*

    📝 *Nome:* ${name}
    📞 *Número:* ${number}
    🔧 *Função:* ${option}
    `;

    try {
        // Envia a mensagem para o grupo
        await client.sendMessage(groupId, message);
        console.log('Mensagem enviada para o grupo:', message);
        res.redirect('/success'); // Envia a resposta apenas se a mensagem for enviada com sucesso
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        // Apenas envie uma resposta de erro se a resposta ainda não tiver sido enviada
        if (!res.headersSent) {
            res.status(500).send('Erro ao enviar mensagem.');
        }
    }

})


app.post('/zap', (req, res) => {
    const password = req.body.password;
    
    // Substitua 'sua-senha' pela senha que você deseja usar
    if (password === '123456') {
        res.send(`
            <h1>QR Code:</h1>
            <pre id="qrcode"></pre>
            <script>
                const ws = new WebSocket('ws://localhost:3000'); // Altere a porta se necessário
                ws.onmessage = function(event) {
                    document.getElementById('qrcode').innerText = event.data;
                };
            </script>
        `);
    } else {
        res.send('<h1>Senha incorreta!</h1>');
    }
})

app.listen(port, () => {console.log('Servidor rodando na porta ' + port)})