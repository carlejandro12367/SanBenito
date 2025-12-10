// registro: validación de contraseña y habilitación del botón
// VALIDACIÓN DE CONTRASEÑA
const pass1 = document.getElementById("pass1");
const pass2 = document.getElementById("pass2");
const barra = document.getElementById("barra");
const btnRegister = document.getElementById("btnRegister");

// Mostrar / ocultar contraseña
function togglePassword(id, toggleId) {
    const input = document.getElementById(id);
    const toggle = document.getElementById(toggleId);

    toggle.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            toggle.textContent = "🙈";
        } else {
            input.type = "password";
            toggle.textContent = "👁️";
        }
    });
}

togglePassword("pass1", "togglePass1");
togglePassword("pass2", "togglePass2");

// Nivel de seguridad de contraseña
pass1.addEventListener("input", () => {
    const val = pass1.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (val.length >= 12) score++;

    barra.style.width = (score * 20) + "%";

    if (score <= 1) barra.style.background = "red";
    else if (score === 2) barra.style.background = "orange";
    else if (score === 3) barra.style.background = "yellow";
    else if (score >= 4) barra.style.background = "green";

    validarFormulario();
});

// Habilitar botón si todo es válido
function validarFormulario() {
    const ci = document.getElementById("ci").value.trim();
    const ext = document.getElementById("extension").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    const passOk = pass1.value.length >= 8 &&
                   /[a-z]/.test(pass1.value) &&
                   /[A-Z]/.test(pass1.value) &&
                   /[0-9]/.test(pass1.value) &&
                   pass1.value === pass2.value;

    if (ci !== "" && ext !== "" && nombre !== "" && correo !== "" && telefono !== "" && passOk) {
        btnRegister.disabled = false;
    } else {
        btnRegister.disabled = true;
    }
}

pass2.addEventListener("input", validarFormulario);
document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", validarFormulario);
});
