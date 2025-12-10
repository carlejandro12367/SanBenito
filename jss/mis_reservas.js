// reservas: carga de últimas reservas del usuario
document.addEventListener("DOMContentLoaded", async () => {

    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const cuerpo = document.getElementById("cuerpoReservas");
    const noReservas = document.getElementById("noReservas");

    //Definir endpoint correctamente
    const endpoint = window.location.origin + "/SanBenito/backend/mis_reservas.php";
    console.log("Endpoint usado:", endpoint);

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ci: user.ci })
        });

        const data = await res.json();

        if (data.status !== "ok" || data.reservas.length === 0) {
            noReservas.style.display = "block";
            return;
        }

        noReservas.style.display = "none";

        data.reservas.forEach(r => {
            const fila = document.createElement("tr");

            const areaTexto = r.area.replace("_", " ").toUpperCase();
            const turnoTexto = r.turno === "manana" ? "Mañana" :
                               r.turno === "tarde" ? "Tarde" : "Noche";

            fila.innerHTML = `
                <td style="padding: 12px; border: 1px solid #ddd;">${r.ficha}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${r.fecha}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${areaTexto}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${turnoTexto}</td>
            `;

            cuerpo.appendChild(fila);
        });

    } catch (err) {
        console.error("Error cargando reservas:", err);
        noReservas.textContent = "Error cargando las reservas.";
        noReservas.style.display = "block";
    }
});
