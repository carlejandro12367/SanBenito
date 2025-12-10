<?php
header("Content-Type: application/json; charset=UTF-8");
ini_set('display_errors', 0);
error_reporting(0);

require "conexion.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió JSON"
    ]);
    exit;
}

if (
    empty($data["area"]) ||
    empty($data["fecha"]) ||
    empty($data["turno"])
) {
    echo json_encode([
        "status" => "error",
        "message" => "Datos incompletos"
    ]);
    exit;
}

$area  = $data["area"];
$fecha = $data["fecha"];
$turno = $data["turno"];

// Contar cuántas fichas ya existen
$stmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM reservas
    WHERE area = :area AND fecha = :fecha AND turno = :turno
");

$stmt->bindValue(":area", $area);
$stmt->bindValue(":fecha", $fecha);
$stmt->bindValue(":turno", $turno);
$res = $stmt->execute();
$row = $res->fetchArray(SQLITE3_ASSOC);

$total = (int)$row["total"];

if ($total >= 10) {
    echo json_encode([
        "status" => "full",
        "message" => "No hay fichas disponibles"
    ]);
    exit;
}

$ficha = $total + 1;

// Cálculo de horas por turno
$hora_inicio = 7;
if ($turno === "tarde") $hora_inicio = 13;
if ($turno === "noche") $hora_inicio = 19;

$minutos = ($hora_inicio * 60) + (($ficha - 1) * 30);
$hora = sprintf("%02d:%02d", floor($minutos / 60), $minutos % 60);

echo json_encode([
    "status" => "ok",
    "ficha" => $ficha,
    "hora" => $hora
]);