const io = require('socket.io-client');

const streamElements = io(`https://realtime.streamelements.com`, {
    transports: ['websocket']
});

// The JWT key from https://streamelements.com/dashboard/account/channels
console.log(process.env.STREAMELEMENTS_SOCKET_API);

// streamElements connected
streamElements.on('connect', onConnect);

// streamElements got disconnected
streamElements.on('disconnect', onDisconnect);

// streamElements is authenticated
streamElements.on('authenticated', onAuthenticated);

streamElements.on('unauthorized', console.error);

streamElements.on('event:test', (data) => {

    console.log(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
    console.log ("Cleaned: \n" + data.event.type);

});

streamElements.on('event', (data) => {

    console.log(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
    console.log ("Cleaned: \n" + data.event.type);


});

// streamElements.on('event:update', (data) => {

//     console.log(data);
//     // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update

// });

// streamElements.on('event:reset', (data) => {

//     console.log(data);
//     // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update

// });

function onConnect() {

    console.log('Successfully connected to the websocket');

    // streamElements.emit('authenticate', {method: 'oauth2',token: accessToken});
    streamElements.emit('authenticate', {method: 'jwt', token: process.env.STREAMELEMENTS_SOCKET_API});

}

function onDisconnect() {

    console.log('Disconnected from websocket');
    // Reconnect

}

function onAuthenticated(data) {

    const {
        channelId
    } = data;

    console.log(`Successfully connected to channel ${channelId}`);

}