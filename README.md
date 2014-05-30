# Proximity: An Estimote Beacons and Socket.IO Proof of Concept App

A lightweight PhoneGap app that calculates the device's proximity to nearby Estimote beacons and syncs this with other connected users via a Socket.IO server.

- Code for the Socket.IO server can be found below, you'll need this to be running before opening the app
- Huge thanks for Konrad Dzwinel for his Estimote Beacons PhoneGap plugin (https://github.com/kdzwinel/phonegap-estimotebeacons) and sample code

## Installation

You'll find all the project code in the /www directory for use in your PhoneGap project. To create a new project, we recommend using Phonegap's Command-line Interface (http://docs.phonegap.com/en/3.0.0/guide_cli_index.md.html):

	phonegap create proximity com.phonegap.proximity Proximity --name Proximity

Next, install the Estimote Beacons PhoneGap plugin (https://github.com/kdzwinel/phonegap-estimotebeacons). `cd` into your new proximity directory and run:

	phonegap local plugin add https://github.com/kdzwinel/phonegap-estimotebeacons

Copy the contents of this repo's www directory into your new proximity/www folder. You'll need to replace the YOUR_HOST placeholder used in two places within the app with the address of your Socket.IO server:

- index.html: `<script src="http://YOUR_HOST/socket.io/socket.io.js"></script>`

- js/app.js: `socket = io.connect('YOUR_HOST');`

Since the app will load the Socket.IO script from the host address you specify, it also needs to be whitelisted within the app's config.xml file within /www/config.xml. At present, all external hosts are whitelisted but you'll want to lock this down before you move to production. Replace * in the following line with your host address, e.g. http://127.0.0.1:

	<access origin="*" />

Now, build your app for iOS by running:

	phonegap build ios

When you're ready to run the app in the iOS simulator or on your device you'll find the .xcodeproj file within platforms/ios. If you need help with Apple's complex provisioning workflow, this tutorial by Brian J Coleman may help (http://www.brianjcoleman.com/tutorial-provision-your-app-to-run-on-a-device/)

## Node App.js

	var app = require('http').createServer(handler)
	  , io = require('socket.io').listen(app)
	  , fs = require('fs')

	app.listen(8080);

	function handler (req, res) {
	  fs.readFile(__dirname + '/index.html',
	  function (err, data) {
	    if (err) {
	      res.writeHead(500);
	      return res.end('Error loading index.html');
	    }
	    res.writeHead(200);
	    res.end(data);
	  });
	}

	// Connection established

	io.sockets.on('connection', function (socket) {

	  // Update location

	  socket.on('updateclients', function (data) { 

	    // Store current region in socket data

	    socket.beacons = data.beacons;

	    socket.join('room');
	 
	    var clientList = getClients();

	    socket.emit('updatelist', { clients: clientList });

	  });

	});

	// Get current list of connected clients

	function getClients() { 

	  var clients = io.sockets.clients();

	  var clientList = [];

	  for (var i = 0; i < clients.length; i++) {
	      clientList.push({ id: clients[i].id, beacons: clients[i].beacons });
	  }

	  return clientList;

	}
