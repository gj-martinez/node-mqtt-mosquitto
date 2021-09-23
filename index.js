const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { Server } = require("socket.io")
const mqtt = require('mqtt')


const client  = mqtt.connect('mqtt://192.168.0.95')
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

client.on('connect', function () {
  client.subscribe('temperatura', function (err) {
    if (err) {
      console.log("Hubo un error")
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  const fecha = new Date();
  const añoActual = fecha.getFullYear();
  const hoy = fecha.getDate();
  const mesActual = fecha.getMonth() + 1; 
  console.log("La temperatura del dia "+hoy+"/"+mesActual+"/"+añoActual +" - "+ message.toString())

  io.emit('data',{
    value: message.toString()
  })

  //client.end()
})

server.listen(3000, () => {
    console.log("server on port ", 3000)
})

