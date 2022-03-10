const func = (io) => {
    io.on('connection', socket => {
        console.log('WS Connected..')
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        })
        // io.emit('message', 'Welome Quesoft')
    })
}

export default func;