<?php
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . "/conexion.php";

// LEER RAW INPUT
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// VALIDAR JSON
if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "No se recibieron datos JSON válidos",
        "raw" => $raw
    ]);
    exit;
}

// VALIDAR CAMPOS
$required = ["ci","extension","nombre","correo","telefono","password"];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Campo faltante: $field"
        ]);
        exit;
    }
}

// LIMPIAR DATOS
$ci        = trim($data["ci"]);
$extension = trim($data["extension"]);
$nombre    = trim($data["nombre"]);
$correo    = trim($data["correo"]);
$telefono  = trim($data["telefono"]);
$password  = password_hash($data["password"], PASSWORD_DEFAULT);

// VERIFICAR SI CI EXISTE
$stmt = $db->prepare("SELECT id FROM usuarios WHERE ci = :ci");
$stmt->bindValue(":ci", $ci, SQLITE3_TEXT);
$res = $stmt->execute();

if ($res && $res->fetchArray(SQLITE3_ASSOC)) {
    echo json_encode([
        "status" => "exists"
    ]);
    exit;
}

// INSERTAR USUARIO
$insert = $db->prepare("
    INSERT INTO usuarios (ci, extension, nombre, correo, telefono, password)
    VALUES (:ci, :extension, :nombre, :correo, :telefono, :password)
");

$insert->bindValue(":ci", $ci, SQLITE3_TEXT);
$insert->bindValue(":extension", $extension, SQLITE3_TEXT);
$insert->bindValue(":nombre", $nombre, SQLITE3_TEXT);
$insert->bindValue(":correo", $correo, SQLITE3_TEXT);
$insert->bindValue(":telefono", $telefono, SQLITE3_TEXT);
$insert->bindValue(":password", $password, SQLITE3_TEXT);

if ($insert->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error al insertar en la base de datos"
    ]);
}
