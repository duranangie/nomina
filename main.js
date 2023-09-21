// URL de la API de MockAPI (reemplaza 'YOUR_API_ID' con tu identificación de proyecto)
const apiUrl = 'https://650a3b71f6553137159c8368.mockapi.io';

// Variable para almacenar el ID del registro que se está editando
let editingNominaId = null;
let nominas = [];
// Función para crear un nuevo registro en la nómina
async function createNomina(nominaData) {
    try {
        const response = await fetch(`${apiUrl}/nomina`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nominaData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear el registro de nómina:', error);
    }
}

// Función para obtener todos los registros de la nómina
async function getNominas() {
    try {
        const response = await fetch(`${apiUrl}/nomina`);
        const data = await response.json();
        console.log('Datos de nominas obtenidos:', data); // Agregar esta línea para depurar
        return data;
    } catch (error) {
        console.error('Error al obtener los registros de nómina:', error);
    }
}

// Función para actualizar un registro de nómina
async function updateNomina(nominaId, updatedData) {
    try {
        const response = await fetch(`${apiUrl}/nomina/${nominaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar el registro de nómina:', error);
    }
}

// Función para eliminar un registro de nómina
async function deleteNomina(nominaId) {
    try {
        const response = await fetch(`${apiUrl}/nomina/${nominaId}`, {
            method: 'DELETE',
        });
        if (response.status === 204) {
            return true; // Éxito
        } else {
            return false; // Falló la eliminación
        }
    } catch (error) {
        console.error('Error al eliminar el registro de nómina:', error);
        return false;
    }
}

// Función para llenar la tabla con los registros de nómina
async function fillNominaTable() {
    try {
        nominas = await getNominas();
        console.log('Nominas cargadas:', nominas);
        const tableBody = document.querySelector('#nominaTable tbody');
        tableBody.innerHTML = '';

        for (const nomina of nominas) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nomina.id}</td>
                <td>${nomina.nombre}</td>
                <td>${nomina.ingreso || '-'}</td>
                <td>${nomina.salario}</td>
                <td>
                <button data-id="${nomina.id}" class="edit-button" style="background-color: blue; color: white;">Editar</button>
                <button data-id="${nomina.id}" class="delete-button" style="background-color: red; color: white;">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        }

        // Agregar evento a los botones de eliminar
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const nominaId = button.getAttribute('data-id');
                deleteNominaRow(nominaId);
            });
        });

   
        // Agregar evento a los botones de editar
        const editButtons = document.querySelectorAll(".edit-button");
        editButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const nominaId = button.getAttribute('data-id');
                console.log('Botón de edición clickeado con ID:', nominaId);
                editNomina(nominaId);
            });
        });


    } catch (error) {
        console.error('Error al obtener las nominas:', error);
    }
}




// Función para editar un registro de nómina
function editNomina(nominaId) {
    // Busca el registro con el ID correspondiente en el array de nominas
    const nomina = nominas.find((nomina) => nomina.id === nominaId);
    console.log('ID recibido para editar:', nominaId); // Agregar esta línea para depurar


    if (nomina) {
        // Rellena el formulario de edición con los detalles del registro
        document.getElementById('nombre').value = nomina.nombre;

        // Verifica y marca el radio button adecuado en función de si es Ingreso o Egreso
        if (nomina.ingreso === "Ingreso") {
            document.getElementById('Ingreso').checked = true;
        } else {
            document.getElementById('Egreso').checked = true;
        }

        document.getElementById('salario').value = nomina.salario;

        // Guarda el ID del registro que se está editando
        editingNominaId = nominaId;

        // Muestra el formulario de edición
        document.getElementById('edit-form-container').style.display = 'block';
    } else {
        console.error('Registro de nómina no encontrado');
    }

}

// Función para eliminar un registro de nómina y actualizar la tabla
async function deleteNominaRow(nominaId) {
    const success = await deleteNomina(nominaId);
    if (success) {
        fillNominaTable();
        console.log("Registro eliminado exitosamente!");
    } else {
        console.error("Error al eliminar el registro. Verifica nuevamente");
    }
}

// Llamar a la función para llenar la tabla al cargar la página
fillNominaTable();

// Agregar evento al formulario para crear registros
const nominaForm = document.getElementById('nominaForm');
nominaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const ingreso = document.getElementById('Ingreso').checked ? "Ingreso" : "Egreso";
    const salario = document.getElementById('salario').value;

    const newNominaData = {
        nombre,
        ingreso,
        salario: parseFloat(salario),
    };

    if (editingNominaId) {
        // Si estamos editando, actualizamos el registro
        const updatedNomina = await updateNomina(editingNominaId, newNominaData);
        if (updatedNomina) {
            fillNominaTable();
            console.log('Registro de nómina actualizado:', updatedNomina);
        }
        // Limpiar el formulario y restablecer el ID de edición
        nominaForm.reset();
        editingNominaId = null;
        document.getElementById('edit-form-container').style.display = 'none';
    } else {
        // Si no estamos editando, creamos un nuevo registro
        const createdNomina = await createNomina(newNominaData);
        if (createdNomina) {
            fillNominaTable();
            console.log('Registro de nómina creado:', createdNomina);
        }
        // Limpiar el formulario
        nominaForm.reset();
    }
});
