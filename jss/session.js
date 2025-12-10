// sesión: manejo de usuario, menú y cierre de sesión
document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("usuario"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar CI
    const txtUsuario = document.getElementById("txtUsuario");
    if (txtUsuario) {
        txtUsuario.textContent = user.ci || "Usuario";
    }

    const userMenu = document.getElementById("userMenu");
    const dropdown = document.getElementById("userDropdown");
    const btnLogout = document.getElementById("btnLogout");
    const btnChange = document.getElementById("btnChangePass");

    // Abrir / cerrar menú
    userMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", () => {
        dropdown.classList.add("hidden");
    });

    // Cerrar sesión
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
    });

    // Cambiar contraseña (pendiente)
    btnChange.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Función de cambiar contraseña pendiente.");
    });
});
