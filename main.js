//url de la mockapi donde se obtiene y se envian datos de nomina
const apiUrl = "https://650a3b71f6553137159c8368.mockapi.io";
//variable para almacenar el if del registro que se esta editando
let editingNominaId = null;
//Arreglo para almacenar los datos de las nominas obtenidas de mockapi
let nominas = [];

//funcion asincronica para crear un nuevo registro de nomina
async function createNomina(nominaData) {
  try {
    //realizar solicitudes de post a mockapi para crear registros en nomina
    const response = await fetch(`${apiUrl}/nomina`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nominaData),
    });
    //obtener la respuesta de la api y la convierte en formato JSON
    const data = await response.json();
    //retorna los datos del nuevo registro de nomina creado
    return data;
  } catch (error) {
    //en caso de error, mostrar un mensaje de error en la consola :)
    console.error("Error al crear el registro de nómina:", error);
  }
}

//funcion asincronica para obtener todos los regisrtos de nomina desde la api
async function getNominas() {
  try {
    //realizar una solicitud get a la api para obtener los registros de nomina
    const response = await fetch(`${apiUrl}/nomina`);
    //obtiene la respuesta de la api y la convierte a formato json
    const data = await response.json();
    //muestra los datos obtenidos en la consola
    console.log("Datos de nominas obtenidos:", data);
    //retorna os datos de la nomina
    return data;
  } catch (error) {
    console.error("Error al obtener los registros de nómina:", error);
  }
}

//funcion asincronica para actualizar un registro de nomina existente
async function updateNomina(nominaId, updatedData) {
  try {
    //realiza una solicitud put a la api para actualizar un registro de momina
    const response = await fetch(`${apiUrl}/nomina/${nominaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    //obtiene la respuesta de la api y la convierte en formato JSON
    const data = await response.json();
    //retorna los datos de nomina actualizados
    return data;
  } catch (error) {
    console.error("Error al actualizar el registro de nómina:", error);
  }
}

//funcion asincronica para eliminar un registro de nomina
async function deleteNomina(nominaId) {
  try {
    //realiza una solicitud DELETE a la api para eliminar un registro
    const response = await fetch(`${apiUrl}/nomina/${nominaId}`, {
      method: "DELETE",
    });
    //se verifica si la eliminacion fue exitosa codigo de respuesta 204
    if (response.status === 204) {
      return true; //exito :)
    } else {
      return false; //fallo :(
    }
  } catch (error) {
    console.error("Error al eliminar el registro de nómina:", error);
    return false;
  }
}

    

//funcion asincronica para llenar la tabla htmlcon los requisitos de nomina
async function fillNominaTable() {
  try {
    //obtiene los datos de la nominas desde la api
    nominas = await getNominas();
    //muestra datos en consola
    console.log("Nominas cargadas:", nominas);
    //selecciona el cuerpo de la tabla en el doc html
    const tableBody = document.querySelector("#nominaTable tbody");
    //limpia el contenido actual de la tabla
    tableBody.innerHTML = "";
    //interar los registros y crear filas en la tabla
    for (const nomina of nominas) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${nomina.id}</td>
                <td>${nomina.nombre}</td>
                <td>${nomina.ingreso || "-"}</td>
                <td>${nomina.salario}</td>
                <td>
                    <button data-id="${
                      nomina.id
                    }" class="edit-button" >Editar</button>
                    <button data-id="${
                      nomina.id
                    }" class="delete-button" ">Eliminar</button>
                </td>
            `;
      //agregar fila a la tabla
      tableBody.appendChild(row);
    }

    //agregar eventos de click a los botones de eliminar
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nominaId = button.getAttribute("data-id");
        deleteNominaRow(nominaId);
      });
    });

    //agregar eventos de click a los botones de editar

    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nominaId = button.getAttribute("data-id");
        console.log("Botón de edición clickeado con ID:", nominaId);
        editNomina(nominaId);
      });
    });
  } catch (error) {
    console.error("Error al obtener las nominas:", error);
  }
}

//funcion para editar registro
function editNomina(nominaId) {
  //encuentra el registro con el id
  const nomina = nominas.find((nomina) => nomina.id === nominaId);
  console.log("ID recibido para editar:", nominaId);

  if (nomina) {
    //rellena el formulario de edicion con los datos del registr
    document.querySelector("#nombre").value = nomina.nombre;
    const ingresoRadioButton = document.querySelector("#Ingreso");
    const egresoRadioButton = document.querySelector("#Egreso");

    if (nomina.ingreso === "Ingreso") {
      ingresoRadioButton.checked = true;
    } else {
      egresoRadioButton.checked = true;
    }

    document.querySelector("#salario").value = nomina.salario;
    //establece el id del registro que se esta editando
    editingNominaId = nominaId;
    //mostrar formulario de edicionn
    document.querySelector("#edit-form-container").style.display = "block";
  } else {
    console.error("Registro de nómina no encontrado");
  }
}

//funcion asincronica para eliminar un registro de nomina y actualizar la tabla
async function deleteNominaRow(nominaId) {
  const success = await deleteNomina(nominaId);
  if (success) {
    //si fue exitosa el delete actualiza la pagina
    fillNominaTable();
    console.log("Registro eliminado exitosamente!");
  } else {
    console.error("Error al eliminar el registro. Verifica nuevamente");
  }
}
//llena la tabla de nominas al cargar la apgina
fillNominaTable();

//captura el formulario de nomina y agrega un evento de submit
const nominaForm = document.querySelector("#nominaForm");
nominaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  //obtiene los valores del formulario
  const nombre = document.querySelector("#nombre").value;
  const ingreso = document.querySelector("#Ingreso").checked
    ? "Ingreso"
    : "Egreso";
  const salario = document.querySelector("#salario").value;

  //crea un objeto con los datos del nuevo registro de nomina
  const newNominaData = {
    nombre,
    ingreso,
    salario: parseFloat(salario),
  };

  if (editingNominaId) {
    //si se esta editando un registro de exitente ,actualiza
    const updatedNomina = await updateNomina(editingNominaId, newNominaData);
    if (updatedNomina) {
      //si la edicion se realizo actualiza la tabla y muestra un mensaje
      fillNominaTable();
      console.log("Registro de nómina actualizado:", updatedNomina);
    }
    //reinicia el formulario y el id de edicion
    nominaForm.reset();
    editingNominaId = null;
    //oculta formulario de edicion
    document.querySelector("#edit-form-container").style.display = "none";
  } else {
    //si esta creado un nuevo registro , rea registro
    const createdNomina = await createNomina(newNominaData);
    if (createdNomina) {
      //si se creo actualiza tabla y muestre msj por consola
      fillNominaTable();
      console.log("Registro de nómina creado:", createdNomina);
    }
    //reiniciar formulario
    nominaForm.reset();
  }
});
