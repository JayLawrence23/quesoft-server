const func = (io) => {
  io.on('connection', (socket) => {
    console.log(`WS ${socket.id} Connected..`);
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    // io.emit('message', 'Welome Quesoft')
  });
};

export default func;
