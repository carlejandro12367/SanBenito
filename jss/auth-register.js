// registro: validación del formulario y llamada al backend
// jss/auth-register.js
// Registro real contra backend PHP (registro.php)
// Muestra modal de resultado y maneja errores

(async () => {
  const form = document.getElementById("formRegistro");
  const btn = document.getElementById("btnRegister");

  if (!form) return console.warn("formRegistro no encontrado en el DOM.");

  // Construye la URL hacia el endpoint PHP. Ajusta si tu carpeta tiene otro nombre.
  const endpoint = `${window.location.origin}/SanBenito/backend/registro.php`;

  // Función para mostrar modal (si no existe, lo crea)
  function showModal(title, message) {
    let modal = document.getElementById("appModalRegistro");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "appModalRegistro";
      modal.style.position = "fixed";
      modal.style.left = "0";
      modal.style.top = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      modal.style.background = "rgba(0,0,0,0.5)";
      modal.style.zIndex = "9999";

      modal.innerHTML = `
        <div style="background:#fff; padding:22px; border-radius:12px; width:90%; max-width:420px; text-align:left; box-shadow:0 8px 24px rgba(0,0,0,0.2);">
          <h3 id="appModalRegistroTitle" style="margin:0 0 10px 0;"></h3>
          <p id="appModalRegistroBody" style="margin:0 0 18px 0; color:#333;"></p>
          <div style="text-align:right;">
            <button id="appModalRegistroOk" style="background:#1273ac;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById("appModalRegistroOk").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    document.getElementById("appModalRegistroTitle").textContent = title;
    document.getElementById("appModalRegistroBody").innerHTML = message;
    modal.style.display = "flex";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Guardar valores (trim para evitar espacios)
    const ci = (document.getElementById("ci")?.value || "").trim();
    const extension = (document.getElementById("extension")?.value || "").trim();
    const nombre = (document.getElementById("nombre")?.value || "").trim();
    const correo = (document.getElementById("correo")?.value || "").trim();
    const telefono = (document.getElementById("telefono")?.value || "").trim();
    const password = (document.getElementById("pass1")?.value || "");
    const password2 = (document.getElementById("pass2")?.value || "");

    // Validaciones front-end (extra, ya tienes validación pero por seguridad)
    if (!ci || !extension || !nombre || !correo || !telefono || !password || !password2) {
      showModal("Error", "Complete todos los campos antes de registrar.");
      return;
    }
    if (password !== password2) {
      showModal("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Desactivar botón mientras se procesa
    btn.disabled = true;
    btn.textContent = "Registrando...";

    try {
      const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    ci: ci,
    extension: extension,
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    password: password
  })
});

      // Si status HTTP no es 200, mostrar error genérico
      if (!res.ok) {
        console.error("Respuesta HTTP:", res.status, await res.text());
        showModal("Error", `Error de servidor (HTTP ${res.status}). Revisa la consola.`);
        btn.disabled = false;
        btn.textContent = "Registrar";
        return;
      }

      const data = await res.json();
      // Esperamos que registro.php devuelva {status: "ok"} o {status:"exists"} u {status:"error", message:...}
      if (data.status === "ok") {
        showModal("Registro exitoso", `Su cuenta fue creada correctamente.<br>Ahora será redirigido al inicio de sesión.`);
        // Después de cerrar el modal o tras 1.8s redirigir automáticamente
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1400);
      } else if (data.status === "exists") {
        showModal("Usuario existente", "Ya existe un usuario con ese CI. Intente iniciar sesión o use otra identificación.");
      } else {
        // Mensaje personalizado del backend
        showModal("Error", data.message ? data.message : "No se pudo completar el registro.");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      showModal("Error", "No se pudo conectar al servidor. ¿Está Apache activo? Revisa la consola.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Registrar";
    }
  });
})();
