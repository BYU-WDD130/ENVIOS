const MI_WHATSAPP = "10000000000"; 

let carrito = [];

function actualizarInterfaz() {
    const listaElement = document.getElementById('lista-carrito');
    const contadorElement = document.getElementById('contador-productos');
    
    // Validamos que el contenedor de la lista exista en el HTML para evitar errores
    if (!listaElement || !contadorElement) return;

    listaElement.innerHTML = '';
    
    if (carrito.length === 0) {
        listaElement.innerHTML = `<p class="vacio-msg" id="carrito-vacio">Aún no has agregado productos a tu lista.</p>`;
        contadorElement.textContent = '0';
        return;
    }

    let totalArticulos = 0;

    carrito.forEach((producto, index) => {
        totalArticulos += parseInt(producto.cantidad);

        const li = document.createElement('li');
        li.className = 'producto-item';
        li.innerHTML = `
            <div style="max-width: 80%; text-align: left;">
                <strong>${producto.cantidad}x</strong> ${producto.nombre}
                <br><small style="color:#666; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${producto.nota ? producto.nota : 'Sin detalles'}
                </small>
            </div>
            <button onclick="eliminarDelCarrito(${index})" title="Eliminar producto">✕</button>
        `;
        listaElement.appendChild(li);
    });

    contadorElement.textContent = totalArticulos;
}

function agregarAlCarrito() {
    const urlInput = document.getElementById('prod-url');
    const nombreInput = document.getElementById('prod-nombre');
    const cantidadInput = document.getElementById('prod-cantidad');
    const notaInput = document.getElementById('prod-nota');

    if (!urlInput || !nombreInput || !cantidadInput || !notaInput) return;

    const url = urlInput.value.trim();
    const nombre = nombreInput.value.trim();
    const cantidad = cantidadInput.value;
    const nota = notaInput.value.trim();

    if (!url || !nombre) {
        alert('Por favor, ingresa al menos el enlace (link) y el nombre del producto.');
        return;
    }

    const nuevoProducto = { url, nombre, cantidad, nota };
    carrito.push(nuevoProducto);

    // Reseteamos el formulario
    urlInput.value = '';
    nombreInput.value = '';
    cantidadInput.value = '1';
    notaInput.value = '';

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

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${MI_WHATSAPP}?text=${mensajeCodificado}`;

    window.open(urlWhatsApp, '_blank');
}