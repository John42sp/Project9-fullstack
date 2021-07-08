const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');
const port = process.env.PORT;

const socketio = require('socket.io');
const http = require('http'); //dependência instalada pelo node por padrão
                            //separando servidor em 2 variáveis:
const app = express();  //aplicação consumida com express
const server = http.Server(app);   // servidor http: pegando servidor http e extraindo ele do express
const io = socketio(server);   // aqui o servidor passa a ouvir tambem o protocolo web socket

// const db = process.env.MONGODB_URL || 'test';
mongoose.connect("mongodb+srv://curso9:curso9@curso9-8blmb.mongodb.net/curso09?retryWrites=true&w=majority", {
    useNewUrlParser:'true',
    useUnifiedTopology:'true'
})

const connectedUsers = {};

//variavel io usada para anotar em algum lugar todos usuários logados, qual usuário logado

io.on('connection', socket => {   //toda conexão com socket terá um id unico  'socket.id'
    // console.log(socket.handshake.query);
    // console.log('Usuário logado', socket.id)   //teste p/ mostrar no terminal esta mensagem com id do socket
    // socket.emit('hello', 'world');

    // setTimeout(() => {    //função javascript para fazer demorar uma menssagem (4 segundos 4 miliseconds)
    //     socket.emit('hello', 'world');
    // }, 4000)

    // socket.on('omni', data => {
    //     console.log(data);
    // })

    const { user_id} = socket.handshake.query; //buscar usuário logado na app (id dele)

    connectedUsers[user_id] = socket.id;   //relacionar id do usuario logado com id de conexão dele
})

app.use((req, res, next) => {      //funcionalidade que não vai devolver resposta p/ usuario final: add 3º par 'fun next'
    req.io = io;                    //função next quer que o fluxo de info continue para os app.use abaixo, nao pare aqui
    req.connectedUsers = connectedUsers;  //todas rotas da app tem acesso ao io e aos usuarios conectados na aplicação

    return next();  //pra confinuar o fluxo normal da app, chamando a função next acima
})


app.use(cors());   // ou para que soment nosssa app possa: app.use(cors({ origin: 'http://localhost:4444'})); 
app.use(express.json());
app.use('/files', express.static(path.resolve( __dirname, '..', 'uploads')));
app.use(routes);

console.log("Server running on port 4444!");

//app.listen(4444);
server.listen(4444);  //trocar app.listen por server.listen()


// app.get('/', (req, res) => {
//     return res.json({'message':'Hi there!'})
// })
// app.post('/users', (req, res) => {
//     return res.json({message:"Hello thereee! What sup??"})
// })


// app.get('/users', (req, res) => {
//     return res.json({idade: req.query.idade})
// })

// app.put('/users/:id', (req, res) => {
//     return res.json({id: req.params.id})
// })


