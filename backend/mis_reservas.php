<?php
header("Content-Type: application/json; charset=UTF-8");
require "conexion.php";

// Leer JSON
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Validar
if (!$data || empty($data["ci"])) {
    echo json_encode([
        "status" => "error",
        "message" => "CI no recibido"
    ]);
    exit;
}

$ci = $data["ci"];

// Buscar reservas directamente por CI desde la tabla reservas
$reservas = [];

$q = $db->prepare("
    SELECT r.ficha, r.fecha, r.area, r.turno
    FROM reservas r
    INNER JOIN usuarios u ON r.usuario_id = u.id
    WHERE u.ci = :ci
    ORDER BY r.creada_en DESC
    LIMIT 10
");

$q->bindValue(":ci", $ci);
$r = $q->execute();

while ($row = $r->fetchArray(SQLITE3_ASSOC)) {
    $reservas[] = $row;
}

echo json_encode([
    "status" => "ok",
    "reservas" => $reservas
]);
