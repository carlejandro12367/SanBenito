// reportes: envío de reporte desde reservas (ui y modal)
document.addEventListener("DOMContentLoaded", () => {

    const txt = document.getElementById("txtReporte");
    const btn = document.getElementById("btnEnviar");
    const modal = document.getElementById("modal");
    const cerrar = document.getElementById("btnCerrarModal");

    // Usuario actual
    const user = JSON.parse(localStorage.getItem("usuario"));

    // Habilitar botón
    txt.addEventListener("input", () => {
        btn.disabled = txt.value.trim() === "";
    });

    // Enviar reporte
    btn.addEventListener("click", async () => {

        try {
            const res = await fetch("/SanBenito/backend/guardar_reporte.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensaje: txt.value.trim(),
                    usuario: user?.ci || "Anónimo"
                })
            });

            const data = await res.json();

            if (data.status === "ok") {
                modal.style.display = "flex";
                txt.value = "";
                btn.disabled = true;
            } else {
                alert("No se pudo guardar el reporte");
            }

        } catch (err) {
            console.error(err);
            alert("Error al enviar el reporte");
        }
    });

    // Cerrar modal
    cerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

});
