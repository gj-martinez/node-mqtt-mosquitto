const express = require('express')
const mysql = require("mysql")
const http = require('http')
const app = express()
const server = http.createServer(app)
const { Server } = require("socket.io")
const mqtt = require('mqtt')

const connection = mysql.createConnection({
    host: 'localhost',
    database:'tesis',
    user: 'root',
    password: '1234'
})


const pool = mysql.createPool({
  host: 'localhost',
  database:'tesis',
  user: 'root',
  password: '1234'
})

const insert = require('./database')

const client  = mqtt.connect('mqtt://192.168.0.95')
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/', (req, res, next) => {
  let sql = "SELECT * FROM user";
  connection.query(sql, function (err,results){
    if (err) throw err;
    console.log(results)
  })
  res.sendFile(__dirname + '/index.html')
})

app.use(express.static(__dirname + '/public'));

client.on('connect', function () {
  client.subscribe('temperatura', function (err) {
    if (err) {
      console.log("Hubo un error")
    }
  })
})

client.on('message', function (topic, message) {
  try {
      // message is Buffer
      const fecha = new Date();
      const añoActual = fecha.getFullYear();
      const hoy = fecha.getDate();
      const mesActual = fecha.getMonth() + 1; 
      //console.log("La temperatura del dia "+hoy+"/"+mesActual+"/"+añoActual +" - "+ message.toString())

      io.emit('data',{
        value: message.toString()
      });

      insert(
        pool,
        {
          user_id: 1,
          topic:topic,
          value:message.toString(),
          created:fecha
        },
        (result) => {
          console.log(result)
        }
      );
      //client.end()
  } catch (error) {
    console.error(error)
  }

})

server.listen(3000, () => {
    console.log("server on port ", 3000)
    connection.connect(function(err) {
      if(err) throw err;
      console.log("Database connected")
    })
})

