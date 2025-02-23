// Cargar el carrito desde localStorage al inicio
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    let producto = carrito.find(p => p.nombre === nombre);
    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

// Función para mostrar el carrito en el modal
function verCarrito() {
    let modal = document.getElementById("modal-carrito");
    let contenidoCarrito = document.getElementById("contenido-carrito");
    contenidoCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        carrito.forEach((p, index) => {
            contenidoCarrito.innerHTML += `
                <div class="item-carrito">
                    <span>${p.cantidad} x ${p.nombre} (€${p.precio})</span>
                    <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
                </div>
            `;
        });

        // Botón de "Comprar Ahora"
        contenidoCarrito.innerHTML += `
            <button onclick="finalizarCompra()">Comprar Ahora</button>
        `;
    }
    modal.style.display = "block";
}

// Función para cerrar el carrito
function cerrarCarrito() {
    document.getElementById("modal-carrito").style.display = "none";
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1); // Elimina el producto del array
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guarda el carrito actualizado
    actualizarCarrito(); // Actualiza el número en el icono
    verCarrito(); // Muestra el carrito actualizado
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    verCarrito();
}

// Función para actualizar el contador del carrito en el icono
function actualizarCarrito() {
    let contador = document.getElementById("contador-carrito");
    let totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contador.innerText = totalItems;
}

// Función para finalizar la compra y redirigir a compra.html
function finalizarCompra() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de comprar.");
        return;
    }

    let confirmacion = confirm("¿Estás seguro de que deseas finalizar la compra?");
    if (!confirmacion) return;

    // Guardar el carrito en localStorage para usarlo en compra.html
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Redirigir a la página de compra
    window.location.href = "compra.html";
}


// Función para cargar el carrito en compra.html
function cargarCompra() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("No hay productos en el carrito. Redirigiendo a la tienda...");
        window.location.href = "index.html";
        return;
    }

    // Mostrar productos en el resumen de compra
    let resumenCarrito = document.getElementById("resumen-carrito");
    carrito.forEach(p => {
        let item = document.createElement("p");
        item.textContent = `${p.cantidad} x ${p.nombre} (€${p.precio})`;
        resumenCarrito.appendChild(item);
    });

    // Manejar el envío del formulario
    document.getElementById("formulario-compra").addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Compra realizada con éxito. ¡Gracias por tu compra!");

        localStorage.removeItem("carrito"); // Vaciar el carrito
        window.location.href = "index.html"; // Volver a la tienda
    });
}

// Ejecutar cuando se cargue la página
window.onload = function () {
    actualizarCarrito();

    // Si estamos en compra.html, cargar los datos del carrito
    if (window.location.pathname.includes("compra.html")) {
        cargarCompra();
    }
};
