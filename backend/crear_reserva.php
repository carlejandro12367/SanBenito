<?php
header("Content-Type: application/json; charset=UTF-8");
ini_set('display_errors', 1);
error_reporting(E_ALL);

require "conexion.php";

// Leer entrada
$raw = file_get_contents("php://input");
if (!$raw) {
    echo json_encode(["status"=>"error","message"=>"No llegó contenido"]);
    exit;
}

$data = json_decode($raw, true);
if (!$data) {
    echo json_encode(["status"=>"error","message"=>"JSON inválido","raw"=>$raw]);
    exit;
}

// Variables
$ci    = $data["ci"] ?? "";
$area  = $data["area"] ?? "";
$fecha = $data["fecha"] ?? "";
$turno = $data["turno"] ?? "";
$ficha = $data["ficha"] ?? "";
$hora  = $data["hora"] ?? "";

// Validación básica
if (!$ci || !$area || !$fecha || !$turno || !$ficha || !$hora) {
    echo json_encode(["status"=>"error","message"=>"Campos incompletos"]);
    exit;
}

// Obtener usuario ID
$u = $db->prepare("SELECT id FROM usuarios WHERE ci = :ci");
if (!$u) {
    echo json_encode(["status"=>"error","message"=>"Error prepare usuario: ".$db->lastErrorMsg()]);
    exit;
}

$u->bindValue(":ci", $ci, SQLITE3_TEXT);
$resU = $u->execute();
$rowU = $resU->fetchArray(SQLITE3_ASSOC);

if (!$rowU) {
    echo json_encode(["status"=>"error","message"=>"Usuario no encontrado"]);
    exit;
}

$usuario_id = (int)$rowU["id"];

// Verificar reserva por día
$chk = $db->prepare("SELECT COUNT(*) as total FROM reservas WHERE usuario_id = :uid AND fecha = :fecha");
if (!$chk) {
    echo json_encode(["status"=>"error","message"=>"Error prepare check: ".$db->lastErrorMsg()]);
    exit;
}

$chk->bindValue(":uid", $usuario_id, SQLITE3_INTEGER);
$chk->bindValue(":fecha", $fecha, SQLITE3_TEXT);
$chkRes = $chk->execute();
$chkRow = $chkRes->fetchArray(SQLITE3_ASSOC);

if ($chkRow["total"] > 0) {
    echo json_encode(["status"=>"exists","message"=>"Ya tienes una reserva"]);
    exit;
}

// Insertar reserva
$stmt = $db->prepare("
    INSERT INTO reservas
    (usuario_id, area, fecha, turno, ficha, hora_estimada)
    VALUES
    (:uid, :area, :fecha, :turno, :ficha, :hora)
");

if (!$stmt) {
    echo json_encode(["status"=>"error","message"=>"Error prepare insert: ".$db->lastErrorMsg()]);
    exit;
}

$stmt->bindValue(":uid", $usuario_id, SQLITE3_INTEGER);
$stmt->bindValue(":area", $area, SQLITE3_TEXT);
$stmt->bindValue(":fecha", $fecha, SQLITE3_TEXT);
$stmt->bindValue(":turno", $turno, SQLITE3_TEXT);
$stmt->bindValue(":ficha", (int)$ficha, SQLITE3_INTEGER);
$stmt->bindValue(":hora", $hora, SQLITE3_TEXT);

$ok = $stmt->execute();

if (!$ok) {
    echo json_encode(["status"=>"error","message"=>"Error al ejecutar insert: ".$db->lastErrorMsg()]);
    exit;
}

echo json_encode([
    "status" => "ok",
    "ficha" => $ficha,
    "hora" => $hora
]);