let myfrom = document.querySelector("form");
let myTabla = document.querySelector("#myData");
addEventListener("DOMContentLoaded", async () => {
    let res = await (await fetch("https://650a3b71f6553137159c8368.mockapi.io/nomina")).json();
    for (let i = 0; i < res.length; i++) {
        myTabla.insertAdjacentElement("beforeend", `
      <tr>
      <td>${res[i].id}</td>
      <td>${res[i].producto}</td>
      <td>${res[i].precio}</td>
      <td>${res[i].acciones}</td>
      </tr>
      `);

    }
})
myfrom.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const { producto } = data;
    data.producto = (typeof producto === "string") ? String(producto) : null;
    let config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    let res = (await fetch("https://650a3b71f6553137159c8368.mockapi.io/nomina" ,config)).json();
    console.log(res);

})

/*mostrar los datos*/


