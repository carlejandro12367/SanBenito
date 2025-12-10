<?php
header("Content-Type: application/json; charset=UTF-8");

// Ruta del archivo
$archivo = __DIR__ . "/../report/logs.txt";

// Leer JSON del frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data["mensaje"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Mensaje vacío"
    ]);
    exit;
}

$mensaje = trim($data["mensaje"]);
$usuario = isset($data["usuario"]) ? $data["usuario"] : "Anónimo";
$fecha = date("Y-m-d H:i:s");

// Formato del log
$linea = "[$fecha] ($usuario) $mensaje" . PHP_EOL;

// Guardar en el archivo
if (file_put_contents($archivo, $linea, FILE_APPEND)) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo escribir en el archivo"
    ]);
}
