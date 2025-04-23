<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "story_portal");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

$story_id = $_GET['story_id'] ?? '';

if (!$story_id) {
    echo json_encode(["status" => "error", "message" => "Missing story_id"]);
    exit;
}

$stmt = $conn->prepare("SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE story_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $story_id);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}

echo json_encode(["status" => "success", "comments" => $comments]);
?>
