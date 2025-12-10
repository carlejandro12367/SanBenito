<?php

$db_path = __DIR__ . "/db/sanbenito.db";

try {
    $db = new SQLite3($db_path);
    // Activar claves foráneas
    $db->exec("PRAGMA foreign_keys = ON;");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo conectar a la base de datos"
    ]);
    exit;
}
