import { initTower } from "./resources/tower.js";
import { login } from "./resources/login.js";
import { initStroop } from "./resources/stroop.js";
import { GoNoGoGame } from "./resources/Gono_go.js";
import { initTMT } from "./resources/tmt.js";
import { updateTestResults } from "./resources/updateResults.js";


// Definimos las rutas del SPA
const routes = {
  "/login": "./views/login.html",
  "/tower": "./views/tower.html",
  "/stroop": "./views/stroop.html",
  "/gonogo": "./views/gonogo.html",
  "/tmt": "./views/tmt.html",
  "/logout": "./views/logout.html"
};



// Variable para llevar el CSS activo
let activeCSS = null;

// Función para cargar un CSS dinámicamente
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    // Si ya existe este CSS, resolver inmediatamente
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(`Error cargando CSS: ${href}`);
    document.head.appendChild(link);
  });
}

// Función para descargar un CSS
function unloadCSS(href) {
  const link = document.querySelector(`link[href="${href}"]`);
  if (link) {
    document.head.removeChild(link);
  }
}

// Función para navegar entre rutas
export async function navigate(pathname) {
  const route = routes[pathname];
  if (!route) {
    return navigate("/login");
  }

  // Cargamos el HTML de la ruta
  const html = await fetch(route).then(res => res.text());
  document.getElementById("content").innerHTML = html;

  // Actualizamos el URL sin recargar la página
  history.pushState({}, "", pathname);

  // Mapeo de rutas a archivos CSS
  const cssMap = {
    "/tower": "./resources/tower.css",
    "/stroop": "./resources/stroop.css",
    "/gonogo": "./resources/gonogo.css",
    "/tmt": "./resources/tmt.css"
    // "/login" no carga CSS adicional
  };

  // Descargar CSS previo si es diferente al actual
  if (activeCSS && activeCSS !== cssMap[pathname]) {
    unloadCSS(activeCSS);
    activeCSS = null;
  }

  // Cargar CSS correspondiente a la ruta si no está cargado
  if (cssMap[pathname] && activeCSS !== cssMap[pathname]) {
    try {
      await loadCSS(cssMap[pathname]);
      activeCSS = cssMap[pathname];
    } catch (error) {
      console.error(error);
    }
  }

  // Ejecutar la lógica correspondiente a la ruta
  if (pathname === "/login") {
    login();
  } else if (pathname === "/tower") {
    initTower();
  } else if (pathname === "/stroop") {
    initStroop();
  } else if (pathname === "/gonogo") {
    GoNoGoGame();
  } else if (pathname === "/tmt") {
    initTMT();
  } else if (pathname === "/logout") {
    updateTestResults();
  }
}

// Manejamos los clicks en enlaces con el atributo [data-link] para navegación SPA
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    navigate(path);
  }
});

// Detectamos el botón "atrás" y navegamos sin recargar
window.addEventListener("popstate", () => {
  navigate(location.pathname);
});

// Al cargar la página, verificamos si hay un usuario en localStorage y navegamos
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("user");
  const currentPath = location.pathname;

  if (currentUser) {
    console.log("usuario vista ")
    if (currentPath === "/" || !routes[currentPath]) {
      navigate("/stroop");
    } else {
      navigate(currentPath);
    }
  } else {
    if (!routes[currentPath] || currentPath === "/" || currentPath === "/tower" || currentPath === "/stroop" || currentPath === "/gonogo" || currentPath === "/tmt" || currentPath === "/logout") {
      navigate("/login");
    } else {
      navigate(currentPath);
    }
  }
});


//Cerrar sesion

// document.addEventListener("click", (e) => {
//   if (e.target && e.target.id === "logout") {
//     logout();
//   }
// });

// function logout() {
//   localStorage.removeItem("user"); // Elimina la sesión
//   window.location.href = "./index.html";              // Redirige al login
// }

