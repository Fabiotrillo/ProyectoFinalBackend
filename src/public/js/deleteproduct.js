function eliminarProducto(cid, pid, currentTotal,) {
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Producto eliminado del carrito con éxito');
            const productElement = document.getElementById(`product-${pid}`);
            if (productElement) {
                productElement.remove();
                // Verificar si el carrito queda vacío después de eliminar el producto
                const cartEmpty = document.querySelectorAll('.cart-li').length === 0;
                // Actualizar el total del carrito
                const totalElement = document.getElementById('cart-total');
                if (totalElement) {
                    if (cartEmpty) {
                        // Si el carrito queda vacío, establecer el total en 0
                        totalElement.textContent = 'Total del carrito: $0';
                    } else {
                        // Calcular el nuevo total del carrito
                        const newTotal = currentTotal -  (productPrice * quantity);
                        totalElement.textContent = `Total del carrito: $${newTotal}`;
                    }
                }
            } else {
                console.log(`No se encontró el elemento del producto con ID ${pid}`);
            }
        } else {
            console.error('Error al eliminar el producto del carrito');
        }
    })
    .catch(error => {
        console.error('Error de red:', error);
    });
}
