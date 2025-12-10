// login: envío de credenciales y manejo de sesión
// jss/auth-login.js

console.log("auth-login.js CARGADO OK");

document.getElementById("btnLogin")?.addEventListener("click", async () => {
  const ci = document.getElementById("ci").value.trim();
  const extension = document.getElementById("extension").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!ci || !extension || !password) {
    alert("Complete todos los campos");
    return;
  }

  const endpoint = "http://localhost/SanBenito/backend/login.php";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ci, extension, password })
    });

    if (!res.ok) {
      alert("Error del servidor (HTTP " + res.status + ")");
      return;
    }

    const data = await res.json();

if (data.status === "ok") {

  // Guardar sesión del usuario
  // data.usuario viene desde el backend (ci, nombre, etc.)
  localStorage.setItem("usuario", JSON.stringify(data.usuario));

  // Redirigir al inicio
  window.location.href = "index.html";
}

else if (data.status === "no_user") {
  alert("Usuario no registrado");
}

else if (data.status === "bad_pass") {
  alert("Contraseña incorrecta");
}

else {
  alert(data.message || "Error desconocido");
}

} catch (err) {
  console.error(err);
  alert("Error de conexión con el servidor");
}

});
