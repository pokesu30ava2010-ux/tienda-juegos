// ===============================
// REVISION DE ARCHIVOS (version 2)
// ===============================
console.log("Main.js v2 cargado");

const idsNecesarios = [
  "Dinero", "contador", "btnCarrito", "cerrarCarrito", "fondoCarrito",
  "panelCarrito", "listaCarrito", "totalCarrito", "btnComprarTodo",
  "btnVaciar", "btnReiniciar", "aviso"
];
const idsFaltantes = idsNecesarios.filter(id => !document.getElementById(id));
const hayJuegos = document.querySelectorAll(".juego").length;

if (idsFaltantes.length > 0 || hayJuegos === 0) {
  alert("El index.html no es la version nueva.\nFalta: " + idsFaltantes.join(", ") + "\nTarjetas .juego encontradas: " + hayJuegos);
  throw new Error("index.html y Main.js no coinciden");
}


// ===============================
// CATALOGO (se lee del HTML)
// ===============================
const juegos = {};

document.querySelectorAll(".juego").forEach(el => {
  juegos[el.dataset.id] = {
    id: el.dataset.id,
    nombre: el.dataset.nombre,
    precio: parseInt(el.dataset.precio),
    url: el.dataset.juego,
    boton: el.querySelector(".btn-juego"),
    etiqueta: el.querySelector(".precio")
  };
});


// ===============================
// DATOS GUARDADOS
// ===============================
function leerLista(clave) {
  try {
    const lista = JSON.parse(localStorage.getItem(clave)) || [];
    return lista.filter(id => juegos[id]);
  } catch (e) {
    return [];
  }
}

let dinero = parseInt(localStorage.getItem("dinero"));
if (isNaN(dinero)) {
  dinero = 1500; // dinero inicial (solo la primera vez)
}

let comprados = leerLista("comprados");
let carrito = leerLista("carrito").filter(id => !comprados.includes(id));

function guardar() {
  localStorage.setItem("dinero", dinero);
  localStorage.setItem("comprados", JSON.stringify(comprados));
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


// ===============================
// UTILIDADES
// ===============================
function formatear(n) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function totalCarrito() {
  return carrito.reduce((suma, id) => suma + juegos[id].precio, 0);
}

let temporizadorAviso;
function aviso(texto) {
  const el = document.getElementById("aviso");
  el.textContent = texto;
  el.classList.add("visible");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => el.classList.remove("visible"), 2600);
}


// ===============================
// PANTALLA
// ===============================
function actualizar() {
  document.getElementById("Dinero").textContent = formatear(dinero);
  document.getElementById("contador").textContent = carrito.length;
}

function renderBotones() {
  Object.values(juegos).forEach(j => {
    j.etiqueta.textContent = formatear(j.precio);
    j.boton.className = "btn-juego";

    if (comprados.includes(j.id)) {
      j.boton.textContent = "▶ Jugar";
      j.boton.classList.add("jugar");
      j.boton.onclick = () => jugar(j.url);
    } else if (carrito.includes(j.id)) {
      j.boton.textContent = "Quitar del carrito";
      j.boton.classList.add("en-carrito");
      j.boton.onclick = () => quitar(j.id);
    } else {
      j.boton.textContent = "Agregar al carrito";
      j.boton.onclick = () => agregar(j.id);
    }
  });
}

function renderCarrito() {
  const lista = document.getElementById("listaCarrito");

  if (carrito.length === 0) {
    lista.innerHTML = '<li class="vacio">Tu carrito está vacío</li>';
  } else {
    lista.innerHTML = carrito.map(id => `
      <li>
        <div>
          <div class="nombre">${juegos[id].nombre}</div>
          <div class="precio-item">${formatear(juegos[id].precio)}</div>
        </div>
        <button class="quitar" data-id="${id}" title="Quitar">✕</button>
      </li>
    `).join("");
  }

  document.getElementById("totalCarrito").textContent = formatear(totalCarrito());
}

function refrescarTodo() {
  guardar();
  actualizar();
  renderBotones();
  renderCarrito();
}


// ===============================
// ACCIONES
// ===============================
function agregar(id) {
  if (comprados.includes(id) || carrito.includes(id)) {
    return;
  }
  carrito.push(id);
  refrescarTodo();
  aviso(juegos[id].nombre + " agregado al carrito");
}

function quitar(id) {
  carrito = carrito.filter(x => x !== id);
  refrescarTodo();
}

function vaciar() {
  carrito = [];
  refrescarTodo();
}

function comprarTodo() {
  if (carrito.length === 0) {
    aviso("El carrito está vacío");
    return;
  }

  const total = totalCarrito();
  if (dinero < total) {
    aviso("No alcanza el dinero. Te faltan " + formatear(total - dinero));
    return;
  }

  dinero -= total;
  comprados = comprados.concat(carrito);
  carrito = [];
  refrescarTodo();
  cerrarCarrito();
  aviso("¡Compra realizada! Ya puedes jugar");
}

function jugar(url) {
  window.location.href = url;
}


// ===============================
// PANEL DEL CARRITO
// ===============================
function abrirCarrito() {
  document.getElementById("panelCarrito").classList.add("abierto");
  document.getElementById("fondoCarrito").classList.add("abierto");
}

function cerrarCarrito() {
  document.getElementById("panelCarrito").classList.remove("abierto");
  document.getElementById("fondoCarrito").classList.remove("abierto");
}

document.getElementById("btnCarrito").onclick = abrirCarrito;
document.getElementById("cerrarCarrito").onclick = cerrarCarrito;
document.getElementById("fondoCarrito").onclick = cerrarCarrito;
document.getElementById("btnComprarTodo").onclick = comprarTodo;
document.getElementById("btnVaciar").onclick = vaciar;

document.getElementById("listaCarrito").addEventListener("click", (e) => {
  const boton = e.target.closest(".quitar");
  if (boton) {
    quitar(boton.dataset.id);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarCarrito();
  }
});

document.getElementById("btnReiniciar").onclick = () => {
  if (confirm("¿Reiniciar dinero, carrito y compras?")) {
    localStorage.removeItem("dinero");
    localStorage.removeItem("comprados");
    localStorage.removeItem("carrito");
    location.reload();
  }
};


// ===============================
// INICIO
// ===============================
refrescarTodo();