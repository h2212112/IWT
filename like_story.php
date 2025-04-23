<?php
// Proper CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connect to MySQL
$conn = new mysqli("localhost", "root", "", "story_portal");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    error_log("Database connection failed: " . $conn->connect_error);
    exit;
}

// Get and decode JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

$story_id = $data['story_id'] ?? '';
$user_id = $data['user_id'] ?? '';

if (!$story_id || !$user_id) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

// Check for duplicate like
$check = $conn->prepare("SELECT * FROM likes WHERE story_id = ? AND user_id = ?");
$check->bind_param("ii", $story_id, $user_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "You already liked this story"]);
    exit;
}

// Insert new like
$stmt = $conn->prepare("INSERT INTO likes (story_id, user_id) VALUES (?, ?)");
$stmt->bind_param("ii", $story_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Liked successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to like story"]);
    error_log("Error executing query: " . $stmt->error);
}

$stmt->close();
$conn->close();
?>
