var app = require("express")();
var express = require("express"),
    mustacheExpress = require('mustache-express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// ----------------------- debug -----------------------------
var fs = require('fs');
var util = require('util'); 
var out = function(el){
	fs.writeFile('debug.txt', util.inspect(el, false, null));
}
// ----------------------- debug -----------------------------


app.enable('trust proxy');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/html');
app.set( "port", 8080 );

app.get('/ip', function(req, res){
	var ip = req.headers['X-Real-IP'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
	var data = { _ip: ip };
	res.render('master', data);
});

app.get('/', function(req, res){
	var data = require(__dirname+'/html/language/pt-br.json');
	res.render('index', data);
});

app.get('/en', function(req, res){
	var data = require(__dirname+'/html/language/en.json');
	out(data);
	res.render('index', data);
});

app.get('/legal', function(req, res){
	res.render('socket');
});

io.on('connection', function(socket){
  console.log('usuario conectado');

  socket.on('pos', function(data){
    io.emit('pos', data);
  });

  socket.on('disconnect', function(){
    console.log('usuario desconectado');
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});