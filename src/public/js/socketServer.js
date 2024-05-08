
const socket = io();

// Escuchar el evento 'productRemoved'
socket.on('productRemoved', ({ cid, pid }) => {
    console.log(`Producto eliminado del carrito ${cid}: ${pid}`);
});