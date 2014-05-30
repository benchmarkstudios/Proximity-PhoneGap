var app = {
    // Application Constructor
    initialize: function() {

          this.bindEvents();

    },
    update: function() { 
 
        window.EstimoteBeacons.getBeacons(function (beacons) {
                    
            socket.emit('updateclients', { beacons: beacons });

        });
    
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        socket = io.connect('YOUR_HOST');

        // Refresh the beacons on an interval

        window.EstimoteBeacons.startRangingBeaconsInRegion(function () { setInterval(app.update, 5000); });

        // Triggered when the app receives an updatelist event from the server

        socket.on('updatelist', function (data) {

            $( 'ul.clients' ).html('');

            for (var i = 0; i < data.clients.length; i++) { 

            var client = data.clients[i];
            
            var html = '<li><h3>' + client.id + '</h3><ul>';

            if (client.beacons) { 

                for (var x = 0; x < client.beacons.length; x++) {

                    var beacon = client.beacons[x];

                    var html = html + '<li>' + formatDistance(beacon.distance) + ' from ' + beacon.minor + '/' + beacon.major + '</li>';

                }

            }

            var html = html + '</ul></li>';

            $( 'ul.clients' ).append( html );

            }

          });  

    }    
};

function formatDistance(meters) {
    if(meters > 1) {
        return meters.toFixed(3) + ' m';
    } else {
        return (meters * 100).toFixed(3) + ' cm';
    }
}