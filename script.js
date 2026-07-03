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

function activarVideo(contenedor) {
    // 1. Inyectamos el video en el contenedor
    contenedor.innerHTML = `
        <video id="tutorial-video" controls playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px; object-fit: contain; background: #000;">
            <source src="images/tutorial.mp4" type="video/mp4">
            Tu navegador no soporta la reproducción de este video.
        </video>
    `;
    
    // 2. Quitamos el click del contenedor para liberar los controles nativos
    contenedor.removeAttribute("onclick");
    contenedor.style.cursor = "default";

    // 3. Forzamos el inicio del video mediante código para saltar bloqueos del navegador
    const video = document.getElementById("tutorial-video");
    if (video) {
        video.play().catch(error => {
            console.log("La reproducción automática fue bloqueada, intentando reproducir de nuevo:", error);
            // Si el navegador se pone muy estricto, lo reproduce silenciado primero para que no falle
            video.muted = true;
            video.play();
        });
    }
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