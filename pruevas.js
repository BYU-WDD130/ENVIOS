// Arreglo global para almacenar los productos añadidos
let carrito = [];

// Escuchador de eventos cuando el HTML se carga por completo
document.addEventListener("DOMContentLoaded", () => {
    const btnPegar = document.getElementById("btn-pegar-link");
    const inputUrl = document.getElementById("prod-url");

    if (btnPegar && inputUrl) {
        btnPegar.addEventListener("click", async () => {
            try {
                // Comprobamos la compatibilidad con el navegador móvil
                if (!navigator.clipboard) {
                    alert("Tu navegador no soporta el pegado automático. Por favor, mantén presionado el cuadro de texto para pegar.");
                    return;
                }
                
                // Leemos el portapapeles de manera asíncrona
                const textoClipart = await navigator.clipboard.readText();
                
                if (textoClipart.trim() !== "") {
                    inputUrl.value = textoClipart;
                    
                    // Pequeña animación visual de éxito (Pasa temporalmente a amarillo neón)
                    btnPegar.innerHTML = '<i class="fas fa-check"></i> ¡Pegado!';
                    btnPegar.style.backgroundColor = "var(--secondary-neon)";
                    
                    setTimeout(() => {
                        btnPegar.innerHTML = '<i class="fas fa-paste"></i> Pegar';
                        btnPegar.style.backgroundColor = "";
                    }, 1800);
                } else {
                    alert("El portapapeles está vacío. Copia primero un enlace de la tienda.");
                }
            } catch (err) {
                // Si el usuario deniega los permisos de lectura de portapapeles
                alert("Para activar el pegado rápido, permite el acceso al portapapeles cuando el celular lo solicite.");
            }
        });
    }
});

// Función para actualizar la interfaz visual de la lista fija lateral sin perder el nodo base
function actualizarInterfazCarrito() {
    const listaHtml = document.getElementById('lista-carrito');
    const contadorHtml = document.getElementById('contador-productos');
    const msgVacio = document.getElementById('carrito-vacio');
    
    // Removemos únicamente los productos listados previamente, protegiendo el mensaje base
    listaHtml.querySelectorAll('.item-carrito').forEach(item => item.remove());
    
    if (carrito.length === 0) {
        msgVacio.style.display = 'block';
        contadorHtml.innerText = '0';
        return;
    }
    
    msgVacio.style.display = 'none';
    contadorHtml.innerText = carrito.length;
    
    carrito.forEach((producto, index) => {
        const itemLi = document.createElement('li');
        itemLi.className = 'item-carrito';
        
        itemLi.innerHTML = `
            <h4>${producto.nombre}</h4>
            <p><strong>Cant:</strong> ${producto.cantidad} ${producto.detalles ? `| <strong>Nota:</strong> ${producto.detalles}` : ''}</p>
            <p><a href="${producto.url}" target="_blank" style="color: #00e5ff; font-size: 0.8rem; text-decoration: underline;">Ver enlace</a></p>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})" title="Eliminar producto">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        listaHtml.appendChild(itemLi);
    });
}

// Función para capturar el formulario e integrar un nuevo elemento
function agregarAlCarrito() {
    const urlInput = document.getElementById('prod-url');
    const nombreInput = document.getElementById('prod-nombre');
    const cantidadInput = document.getElementById('prod-cantidad');
    const notaInput = document.getElementById('prod-nota');
    
    if (!urlInput.value || !nombreInput.value) {
        alert('Por favor, rellena los campos obligatorios del producto.');
        return;
    }
    
    const nuevoProducto = {
        url: urlInput.value,
        nombre: nombreInput.value,
        cantidad: cantidadInput.value || 1,
        detalles: notaInput.value
    };
    
    carrito.push(nuevoProducto);
    
    // Reseteamos valores del formulario
    urlInput.value = '';
    nombreInput.value = '';
    cantidadInput.value = '1';
    notaInput.value = '';
    
    actualizarInterfazCarrito();
}

// Función para remover un artículo seleccionado
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarInterfazCarrito();
}

// Función constructora para empaquetar el pedido y redirigir al WhatsApp
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert('Tu lista de pedidos está vacía. Añade al menos un producto antes de enviarlo.');
        return;
    }
    
    const telefonoDestino = "12018898079"; 
    
    let mensajeCompleto = "¡Hola NJ Express Ecuador! 👋\nQuiero solicitar la cotización y envío de los siguientes productos:\n\n";
    
    carrito.forEach((prod, idx) => {
        mensajeCompleto += `📦 *Producto ${idx + 1}:* ${prod.nombre}\n`;
        mensajeCompleto += `🔢 *Cantidad:* ${prod.cantidad}\n`;
        if (prod.detalles) {
            mensajeCompleto += ` *Detalles:* ${prod.detalles}\n`;
        }
        mensajeCompleto += `🔗 *Link:* ${prod.url}\n`;
        mensajeCompleto += `-----------------------------------\n`;
    });
    
    mensajeCompleto += "\nQuedo atento a los valores de cotización. ¡Muchas gracias!";
    
    const mensajeCodificado = encodeURIComponent(mensajeCompleto);
    const urlWhatsApp = `https://wa.me/${telefonoDestino}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
}