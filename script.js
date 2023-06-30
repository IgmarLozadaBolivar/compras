// Ventana emergente de Bienvenida
Swal.fire({
    title: '¡Bienvenido!',
    text: 'Cambia tu estilo, cambia tu vida!',
    icon: 'info',
    confirmButtonText: 'Aceptar'
});

// Fondo de video
var videoElement = document.getElementById("videoFondo");

function videoCarga() {
    var videoFuente = document.createElement("source");
    videoFuente.src = "./video/intro.mp4";
    videoFuente.type = "video/mp4";
    videoElement.appendChild(videoFuente);
    videoElement.load();
}
videoCarga();

class Producto {
    constructor(nombre, precio, cantidad, urlImagen, tipo) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.urlImagen = urlImagen;
        this.tipo = tipo;
    }
}

class CarritoCompras {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.total = 0;
        this.actualizarTotal();
    }

    agregarProducto(producto) {
        const productoExistente = this.buscarProductoPorNombre(producto.nombre);
        if (productoExistente) {
            // El producto ya existe, actualizar la cantidad
            productoExistente.cantidad += producto.cantidad;
        } else {
            // El producto no existe, crear uno nuevo
            this.productos.push(producto);
        }

        this.mostrarCarrito();
        this.guardarCarritoEnLocalStorage();
        this.actualizarTotal();
    }

    buscarProductoPorNombre(nombre) {
        if (this.productos && this.productos.length > 0) {
            return this.productos.find((producto) => producto.nombre === nombre);
        }
        return null;
    }

    mostrarCarrito() {
        const listaCarrito = document.getElementById('listaCarrito');
        listaCarrito.innerHTML = '';

        const barraBusqueda = document.getElementById('barraBusqueda').value.toLowerCase();

        const productosFiltrados = this.productos.filter((producto) => {
            const categoria = producto.tipo.toLowerCase();
            return categoria.includes(barraBusqueda);
        });

        if (productosFiltrados.length > 0) {
            for (const producto of productosFiltrados) {
                const itemCarrito = document.createElement('li');
                itemCarrito.classList.add('item-carrito');

                const imagen = document.createElement('img');
                imagen.src = producto.urlImagen;
                imagen.alt = producto.nombre;

                const nombre = document.createElement('h3');
                nombre.textContent = producto.nombre;

                const precio = document.createElement('p');
                precio.textContent = `Precio: $${producto.precio.toFixed(2)}`;

                const cantidad = document.createElement('p');
                cantidad.textContent = `Cantidad: ${producto.cantidad}`;

                itemCarrito.appendChild(imagen);
                itemCarrito.appendChild(nombre);
                itemCarrito.appendChild(precio);
                itemCarrito.appendChild(cantidad);

                // Agregar evento de clic al artículo
                itemCarrito.addEventListener('click', () => {
                    mostrarVentanaEmergente(producto);
                });

                listaCarrito.appendChild(itemCarrito);
            }
        } else {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'No se encontraron productos en esta categoría!';
            mensaje.classList.add('mensaje-vacio');
            listaCarrito.appendChild(mensaje);
        }
    }

    actualizarTotal() {
        if (this.productos.length > 0) {
            this.total = this.productos.reduce(
                (total, producto) => total + producto.precio,
                0
            );
        } else {
            this.total = 0;
        }
        document.getElementById('totalCarrito').textContent = `$${this.total.toFixed(2)}`;
    }

    guardarCarritoEnLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.productos));
    }
}

const carrito = new CarritoCompras();

function mostrarResumenCompra() {
    const productosAgregados = carrito.productos;

    let resumenHTML = '';
    for (const producto of productosAgregados) {
        resumenHTML += `
            <div class="producto-agregado">
                <img src="${producto.urlImagen}" alt="${producto.nombre}" class="detalle-imagen my-custom-class">
                <h3>${producto.nombre}</h3>
                <p class="p-emergente">Precio: $${producto.precio.toFixed(2)}</p>
                <p class="p-emergente">Cantidad: ${producto.cantidad}</p>
            </div>
        `;
    }

    Swal.fire({
        title: 'Resumen de compra',
        html: resumenHTML,
        showCancelButton: true,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            // Realizar la lógica de compra aquí
            carrito.productos = [];
            carrito.actualizarTotal();
            carrito.guardarCarritoEnLocalStorage();
            carrito.mostrarCarrito();

            mostrarMensajeExito();
        }
    });
}

function mostrarMensajeExito() {
    Swal.fire({
        title: '¡Compra exitosa!',
        text: 'Tu compra ha sido realizada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}


// Función para mostrar ventana emergente al hacer clic en un artículo
function mostrarVentanaEmergente(producto) {
    Swal.fire({
        title: '¿Deseas añadir este artículo al carrito?',
        html: `
        <img src="${producto.urlImagen}" alt="${producto.nombre}" class="detalle-imagen my-custom-class">
        <h3>${producto.nombre}</h3>
        <p class="p-emergente">Precio: $${producto.precio.toFixed(2)}</p>
        <input type="number" id="cantidadCompra" min="1" max="100" value="1">
      `,
        showCancelButton: true,
        confirmButtonText: 'Añadir al carrito',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const cantidadCompra = document.getElementById('cantidadCompra').value;
            if (cantidadCompra > 0) {
                producto.cantidad = parseInt(cantidadCompra);
                carrito.agregarProducto(producto);

                mostrarResumenCompra();
            }
        }
    });
}


function agregarAlCarrito() {
    const nombre = document.getElementById('nombreArticulo').value;
    const precio = parseFloat(document.getElementById('precioArticulo').value);
    const cantidad = parseInt(document.getElementById('cantidadArticulo').value);
    const urlImagen = document.getElementById('urlImagen').value;
    const tipo = document.getElementById('tipoArticulo').value;

    if (nombre && precio && cantidad && urlImagen && tipo) {
        const producto = new Producto(nombre, precio, cantidad, urlImagen, tipo);
        carrito.agregarProducto(producto);

        // Limpiar los campos de entrada
        document.getElementById('nombreArticulo').value = '';
        document.getElementById('precioArticulo').value = '';
        document.getElementById('cantidadArticulo').value = '';
        document.getElementById('urlImagen').value = '';
        document.getElementById('tipoArticulo').value = '';
    }
}

const agregarCarritoBtn = document.getElementById('agregarCarrito');
agregarCarritoBtn.addEventListener('click', agregarAlCarrito);

const barraBusqueda = document.getElementById('barraBusqueda');
barraBusqueda.addEventListener('input', () => {
    carrito.mostrarCarrito();
});

// Actualizar la lista de artículos en el carrito al inicializar
carrito.mostrarCarrito();
