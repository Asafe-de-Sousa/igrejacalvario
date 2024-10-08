import express from 'express'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import pkg from 'whatsapp-web.js'
import QRCode from 'qrcode'
import fs from 'fs'
import mailchimp from '@mailchimp/mailchimp_marketing'
import dotenv from 'dotenv'
const { Client, LocalAuth } = pkg

dotenv.config()

const mailchimpAPIKey = process.env.MAILCHIMP_API_KEY
const serverPrefix = 'us8'

mailchimp.setConfig({
    apiKey: mailchimpAPIKey,
    server: serverPrefix
})

let currentQrCode = null

const client = new Client({
    authStrategy: new LocalAuth({
      clientId: 'meu-bot',
      dataPath: './session', 
    })
})

client.initialize()
client.on('qr', async (qr) => {
    currentQrCode = await QRCode.toDataURL(qr);
})
client.on('ready', async () => {
    console.log('Cliente conectado com sucesso!')
})
client.on('auth_failure', (msg) => {
    console.error('Erro de autenticação: ', msg)
}) 
process.on('uncaughtException', (error) => {
    console.error('Uma exceção não tratada ocorreu:', error)
})
client.on('disconnected', async (reason) => {
    console.log('Cliente desconectado:', reason);
    
    const sessionPath = path.join(__dirname, 'session');
    try {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log('Pasta de sessão deletada com sucesso.');
    } catch (error) {
        console.error('Erro ao deletar a pasta de sessão:', error);
    }
})
  
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')


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
app.get('/zap', async (req, res) => {
    res.sendFile(__dirname + '/pages/zaplogin.html')
})

/* POSTS */
app.post('/email', async (req, res) => {
    const email = req.body.email

    await addContact(email, res)
})

app.post('/volunteer', async (req, res) => {
    const name = req.body.name
    const number = req.body.number
    const option = req.body.options

    const groupId = '120363328042913669@g.us'

    const message = `
    *Novo Voluntário*

    📝 *Nome:* ${name}
    📞 *Número:* ${number}
    🔧 *Função:* ${option}
    `;

    try {
        await client.sendMessage(groupId, message)
        res.redirect('/success')
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        if (!res.headersSent) {
            res.status(500).send('Erro ao enviar mensagem.')
        }
    }

})


app.post('/zap', (req, res) => {
    const password = req.body.password;
    
    if (password === '123456') {
        if (currentQrCode) {
            res.render(__dirname + '/pages/zapqr.ejs', { qrCode: currentQrCode });
        } else {
            res.send('<h1>QR Code ainda não gerado!</h1>');
        }
    } else {
        res.send('<h1>Senha incorreta!</h1>');
    }
})

app.listen(port, () => {console.log('Servidor rodando na porta ' + port)})

async function addContact(email, serveRresponse) {
    try {
        const response = await mailchimp.lists.addListMember('e91ed5ad9b', {
            email_address: email,
            status: 'subscribed'
        })

        serveRresponse.redirect('/success')
    } catch (error) {
        serveRresponse.send('<h1>Algo deu errado. Tente novamente mais tarde</h1>')
    }
}