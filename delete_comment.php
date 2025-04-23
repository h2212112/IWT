<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "story_portal");

$data = json_decode(file_get_contents("php://input"), true);

$comment_id = $data['comment_id'] ?? '';
$user_id = $data['user_id'] ?? '';

if (!$comment_id || !$user_id) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

// Check ownership
$stmt = $conn->prepare("DELETE FROM comments WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $comment_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Delete failed"]);
}
?>
