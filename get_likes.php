<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$story_id = $_GET['story_id'];
$result = $conn->query("SELECT COUNT(*) as count FROM likes WHERE story_id = $story_id");
$count = $result->fetch_assoc()['count'];
echo json_encode(["count" => $count]);
?>
