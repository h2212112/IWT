<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// If it's a preflight OPTIONS request, stop here
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$conn = new mysqli("localhost", "root", "", "story_portal");

$data = json_decode(file_get_contents("php://input"), true);

$story_id = $data['story_id'] ?? '';
$user_id = $data['user_id'] ?? '';
$comment = $data['comment_text'] ?? '';

if (!$story_id || !$user_id || !$comment) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO comments (story_id, user_id, comment_text) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $story_id, $user_id, $comment);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Comment added"]);
} else {
    echo json_encode(["status" => "error", "message" => "Insert failed"]);
}
?>
