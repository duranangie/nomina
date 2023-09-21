// URL de la API de MockAPI (reemplaza 'YOUR_API_ID' con tu identificación de proyecto)
const apiUrl = 'https://650a3b71f6553137159c8368.mockapi.io';

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
    const nominas = await getNominas();
    const tableBody = document.querySelector('#nominaTable tbody');
    tableBody.innerHTML = '';

    for (const nomina of nominas) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nomina.id}</td>
            <td>${nomina.nombre}</td>
            <td>${nomina.fechaIngreso}</td>
            <td>${nomina.fechaEgreso || '-'}</td>
            <td>${nomina.salario}</td>
            <td>
                <button onclick="editNomina(${nomina.id})">Editar</button>
                <button onclick="deleteNominaRow(${nomina.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    }



}





// Función para editar un registro de nómina
function editNomina(nominaId) {
    console.log ("Editar registro con id");
    // Implementa la lógica para editar un registro aquí
    // Puedes usar una ventana modal o un formulario para editar
}

// Función para eliminar un registro de nómina y actualizar la tabla
async function deleteNominaRow(nominaId){
    console.log("eliminar registro con id ");
    const success = await deleteNomina(nominaId);
    if(success){
        fillNominaTable();
        console.log("Registro eliminado exitosamente!");

    }else{
        console.error("Error al eliminar el registro verifica nuevamente")
    }
}

// Llamar a la función para llenar la tabla al cargar la página
fillNominaTable();

// Agregar evento al formulario para crear registros
const nominaForm = document.getElementById('nominaForm');
nominaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const fechaIngreso = document.getElementById('fechaIngreso').value;
    const fechaEgreso = document.getElementById('fechaEgreso').value;
    const salario = document.getElementById('salario').value;

    const newNominaData = {
        nombre,
        fechaIngreso,
        fechaEgreso,
        salario: parseFloat(salario),
    };

    const createdNomina = await createNomina(newNominaData);
    if (createdNomina) {
        fillNominaTable();
        console.log('Registro de nómina creado:', createdNomina);
    }
    // Limpiar el formulario
    nominaForm.reset();
});
