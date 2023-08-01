const socket = io();
const btnCrearProducto = document.getElementById('btnCrearProducto');
const btnQuitarProducto = document.getElementById('btnQuitarProducto');
btnCrearProducto.addEventListener('click', async () => {
    const codigo = document.getElementById('codigo').value;
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    const headers = new Headers({
       "Content-Type": "application/x-www-form-urlencoded"
    });

    const data = new URLSearchParams({
        "code": codigo,
        "title": titulo,
        "description": descripcion,
        "price": precio,
        "stock": stock
    });
    try {
        const rta = await fetch('api/products', {
            method: 'POST',
            headers: headers,
            body: data
        });
        const resultado = await rta.json();
        if (resultado.status !== 'failed') {
            socket.emit('updateRequest');
            document.getElementById('codigo').value = '';
            document.getElementById('titulo').value = '';
            document.getElementById('descripcion').value = '';
            document.getElementById('precio').value = '';
            document.getElementById('stock').value = '';
            document.getElementById('codigo').focus();
            document.getElementById('msjEstado').innerHTML = 'Producto creado exitosamente!';
        } else {
            document.getElementById('msjEstado').innerHTML = 'ERROR: Verifica los campos y vuelve a intentar.<br>Respuesta: ' + resultado.message ;
        }
    } catch (error) {
        console.log('Error: ' + error);
    }
});

btnQuitarProducto.addEventListener('click', async () => {
    const idProductoRemover = document.getElementById('idProductoRemover').value;
    console.log(idProductoRemover);
    if (!idProductoRemover || isNaN(idProductoRemover)) {
        document.getElementById('msjEstado').innerHTML = 'ERROR: No has ingresado un ID a Borrar o no es numérico';
    } else {
        document.getElementById('msjEstado').innerHTML = '';
        const headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
         });
        
         try {
            const rta = await fetch('api/products/' + idProductoRemover, {
                method: 'DELETE',
                headers: headers,
            });
            const resultado = await rta.json();
            if (resultado.status !== 'failed') {
                socket.emit('updateRequest');
                document.getElementById('msjEstado').innerHTML = 'Producto eliminado exitosamente!';
                document.getElementById('idProductoRemover').value = '';
            } else {
                document.getElementById('msjEstado').innerHTML = 'ERROR: Verifica los campos y vuelve a intentar.<br>Respuesta: ' + resultado.message ;
            }
        } catch (error) {
            console.log('Error: ' + error);
        }

    }
})

socket.on('products', products => {
    let tablaSalida = `
    <table class="table table-bordered table-striped w-75 m-auto">
        <thead>
            <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>`
    if (!products) {
        tablaSalida += "<tr><td colspan='6'><i>(No hay productos)</i></td></tr>";
    } else {
        products.forEach(producto => {
            tablaSalida += `<tr>
                                <td>${producto.id}</td>
                                <td>${producto.code}</td>
                                <td>${producto.title}</td>
                                <td>${producto.description}</td>
                                <td>${producto.price}</td>
                                <td>${producto.stock}</td>
                            </tr>`;
        })
    }
    tablaSalida += `</tbody></table>`;
    document.getElementById('tablaElementos').innerHTML = tablaSalida;
    btnQuitar = document.querySelectorAll('#btnQuitar');
    for (let i = 0; i < btnQuitar.length; i++) {
        const btn = btnQuitar[i];
        btn.addEventListener('click', (val) => {
            alert('Quitar! ' + i + " | " + val);
        });
    }
});
