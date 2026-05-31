// CONFIGURACIÓN: Cambia este número por tu número de WhatsApp real (con código de país, sin el "+")
const MI_WHATSAPP = "10000000000"; 

let carrito = [];

function actualizarInterfaz() {
    const listaElement = document.getElementById('lista-carrito');
    const contadorElement = document.getElementById('contador-productos');
    
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
        // Ajustado para mostrar únicamente la cantidad y el nombre de forma limpia al cliente
        li.innerHTML = `
            <div style="max-width: 80%; text-align: left;">
                <strong>${producto.cantidad}x</strong> ${producto.nombre}
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

    // Reseteamos el formulario para el siguiente producto
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

    // Encabezado del mensaje que recibirás
    let mensaje = `¡Hola NJ Express! Me gustaría cotizar los siguientes productos para enviar a Ecuador:\n\n`;

    // Aquí se genera la lista detallada con TODO lo que necesitas para cotizar
    carrito.forEach((prod, index) => {
        mensaje += `*Item #${index + 1}*\n`;
        mensaje += `▪️ Producto: ${prod.nombre}\n`;
        mensaje += `▪️ Cantidad: ${prod.cantidad}\n`;
        mensaje += `▪️ Detalles: ${prod.nota ? prod.nota : 'Ninguno'}\n`;
        mensaje += `▪️ Link: ${prod.url}\n\n`;
    });

    mensaje += `Por favor, ayúdame con el valor total del servicio. ¡Gracias!`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${MI_WHATSAPP}?text=${mensajeCodificado}`;

    window.open(urlWhatsApp, '_blank');
}