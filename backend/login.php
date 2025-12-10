<?php
header("Content-Type: application/json; charset=UTF-8");
ini_set('display_errors', 0);
error_reporting(0);

require "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data["ci"]) ||
    empty($data["extension"]) ||
    empty($data["password"])
) {
    echo json_encode([
        "status" => "error",
        "message" => "Datos incompletos"
    ]);
    exit;
}

$ci = trim($data["ci"]);
$extension = trim($data["extension"]);
$password = $data["password"];

$stmt = $db->prepare("
    SELECT id, ci, extension, nombre, password
    FROM usuarios
    WHERE ci = :ci AND extension = :extension
    LIMIT 1
");

$stmt->bindValue(":ci", $ci, SQLITE3_TEXT);
$stmt->bindValue(":extension", $extension, SQLITE3_TEXT);
$res = $stmt->execute();

$usuario = $res->fetchArray(SQLITE3_ASSOC);

if (!$usuario) {
    echo json_encode([
        "status" => "no_user"
    ]);
    exit;
}

if (!password_verify($password, $usuario["password"])) {
    echo json_encode([
        "status" => "bad_pass"
    ]);
    exit;
}

echo json_encode([
    "status" => "ok",
    "usuario" => [
        "id" => $usuario["id"],
        "ci" => $usuario["ci"],
        "extension" => $usuario["extension"],
        "nombre" => $usuario["nombre"]
    ]
]);
