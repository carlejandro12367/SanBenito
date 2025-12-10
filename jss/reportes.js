// reportes: envío de comentario y manejo de modal
document.addEventListener("DOMContentLoaded", () => {

    const txt = document.getElementById("txtReporte");
    const btn = document.getElementById("btnEnviar");
    const modal = document.getElementById("modal");
    const cerrar = document.getElementById("btnCerrarModal");

    const user = JSON.parse(localStorage.getItem("usuario"));

    // Habilitar botón al escribir
    txt.addEventListener("input", () => {
        btn.disabled = txt.value.trim() === "";
    });

    // Enviar reporte
    btn.addEventListener("click", async () => {
        const mensaje = txt.value.trim();

        console.log("Enviando:", mensaje);

        try {
            const res = await fetch("/SanBenito/backend/guardar_reporte.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensaje: mensaje,
                    usuario: user?.ci || "Anonimo"
                })
            });

            const raw = await res.text();
            console.log("Respuesta servidor:", raw);

            let data;
            try {
                data = JSON.parse(raw);
            } catch {
                alert("Respuesta JSON inválida del servidor");
                return;
            }

            if (data.status === "ok") {
                modal.style.display = "flex";
                txt.value = "";
                btn.disabled = true;
            } else {
                alert("Error: " + (data.message || "No se pudo guardar"));
            }

        } catch (e) {
            console.error("Error fetch:", e);
            alert("Error de conexión con el servidor");
        }
    });

    // Cerrar modal
    cerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

});
