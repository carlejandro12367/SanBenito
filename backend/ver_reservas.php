<?php
header("Content-Type: application/json; charset=UTF-8");
require "conexion.php";

$res = $db->query("SELECT * FROM reservas ORDER BY creada_en DESC");

$data = [];

while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $data[] = $row;
}

echo json_encode($data, JSON_PRETTY_PRINT);
