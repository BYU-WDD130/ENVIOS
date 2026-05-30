const MI_WHATSAPP = "10000000000"; 

let carrito = [];

function actualizarInterfaz() {
    const listaElement = document.getElementById('lista-carrito');
    const vacioMsg = document.getElementById('carrito-vacio');
    const contadorElement = document.getElementById('contador-productos');
    
    // Limpiamos el contenedor visual
    listaElement.innerHTML = '';
    
    if (carrito.length === 0) {
        listaElement.appendChild(vacioMsg);
        vacioMsg.style.display = 'block';
        contadorElement.textContent = '0'; // Si está vacío, el contador es 0
        return;
    }

    vacioMsg.style.display = 'none';

    // Calculamos el número total de artículos sumando las cantidades
    let totalArticulos = 0;

    // Generamos cada elemento de la lista de compras
    carrito.forEach((producto, index) => {
        totalArticulos += parseInt(producto.cantidad);

        const li = document.createElement('li');
        li.className = 'producto-item';
        li.innerHTML = `
            <div style="max-width: 80%;">
                <strong>${producto.cantidad}x</strong> ${producto.nombre}
                <br><small style="color:#666; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${producto.nota ? producto.nota : 'Sin detalles'}
                </small>
            </div>
            <button onclick="eliminarDelCarrito(${index})" title="Eliminar producto">✕</button>
        `;
        listaElement.appendChild(li);
    });

    // Actualizamos el número en el círculo verde del HTML
    contadorElement.textContent = totalArticulos;
}

    vacioMsg.style.display = 'none';

    // Generamos cada elemento de la lista de compras
    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.className = 'producto-item';
        li.innerHTML = `
            <div>
                <strong>${producto.cantidad}x</strong> ${producto.nombre}
                <br><small style="color:#666;">${producto.nota ? producto.nota : 'Sin detalles adicionales'}</small>
            </div>
            <button onclick="eliminarDelCarrito(${index})">X</button>
        `;
        listaElement.appendChild(li);
    });


function agregarAlCarrito() {
    const url = document.getElementById('prod-url').value.trim();
    const nombre = document.getElementById('prod-nombre').value.trim();
    const cantidad = document.getElementById('prod-cantidad').value;
    const nota = document.getElementById('prod-nota').value.trim();

    // Validación básica de campos obligatorios
    if (!url || !nombre) {
        alert('Por favor, ingresa al menos el enlace (link) y el nombre del producto.');
        return;
    }

    const nuevoProducto = { url, nombre, cantidad, nota };
    carrito.push(nuevoProducto);

    // Resetear los inputs del formulario para el siguiente producto
    document.getElementById('prod-url').value = '';
    document.getElementById('prod-nombre').value = '';
    document.getElementById('prod-cantidad').value = '1';
    document.getElementById('prod-nota').value = '';

    actualizarInterfaz();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarInterfaz();
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert('Tu lista de pedido está vacía. Agrega algún producto primero.');
        return;
    }

    // Estructura del mensaje de texto que recibirás en tu WhatsApp
    let mensaje = `¡Hola NJ Express! Me gustaría cotizar el envío de los siguientes productos a Ecuador:\n\n`;

    carrito.forEach((prod, index) => {
        mensaje += `*Producto ${index + 1}:* ${prod.nombre}\n`;
        mensaje += `- Cantidad: ${prod.cantidad}\n`;
        if(prod.nota) {
            mensaje += `- Detalles: ${prod.nota}\n`;
        }
        mensaje += `- Link: ${prod.url}\n\n`;
    });

    mensaje += `Por favor, ayúdame con el valor total del servicio y las formas de pago. ¡Gracias!`;

    // Codificamos el mensaje de texto para que sea compatible con una URL de navegador
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Armamos la URL final hacia la API de WhatsApp
    const urlWhatsApp = `https://wa.me/${MI_WHATSAPP}?text=${mensajeCodificado}`;

    // Abre el chat en una nueva pestaña
    window.open(urlWhatsApp, '_blank');
}