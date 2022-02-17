const io = require('socket.io-client');

const streamlabs = io(`https://sockets.streamlabs.com?token=${process.env.STREAMLABS_SOCKET_API}`, { transports: ['websocket'] });

console.log(process.env.STREAMLABS_SOCKET_API);

streamlabs.on('connect', () => { console.log('Connection To Server Successful...'); });

streamlabs.on('event', eventData => {
    // console.log(eventData);

    if (eventData.for === 'twitch_account' && eventData.type == 'subscription') {
        var subobj = eventData.message;
        var subname = subobj[0].name;
        var subamo = subobj[0].amount;
        console.log(subname);
        console.log(subamo);

    } else if (eventData.for === 'twitch_account' && eventData.type == 'resub') {
        var resubobj = eventData.message;
        var resubname = resubobj[0].name;
        var resubamo = resubobj[0].amount;
        console.log(resubname);
        console.log(resubamo);

    } else if (eventData.for === 'streamlabs' && eventData.type == 'donation') {
        var donobj = eventData.message;
        var dononame = donobj[0].name;
        var donoamo = donobj[0].amount;
        console.log(dononame);
        console.log(donoamo);

    } else if (eventData.for === 'twitch_account' && eventData.type == 'bits') {
        var bitsobj = eventData.message;
        var bitsname = bitsobj[0].name;
        var bitsamo = bitsobj[0].amount;
        console.log(bitsname);
        console.log(bitsamo);

    }

});