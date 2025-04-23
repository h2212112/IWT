<?php
// CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DEBUG: Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Connect to database
$host = "localhost";
$user = "root";
$password = "";
$database = "story_portal";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Read raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate inputs
if (!isset($data['title'], $data['content'], $data['category'], $data['created_by'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

// Escape and assign
$title = $conn->real_escape_string($data['title']);
$content = $conn->real_escape_string($data['content']);
$category = $conn->real_escape_string($data['category']);
$user_id = intval($data['created_by']);

// Insert into DB
$sql = "INSERT INTO stories (user_id, title, content, category, created_at) 
        VALUES ($user_id, '$title', '$content', '$category', NOW())";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Story posted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "SQL error: " . $conn->error]);
}

$conn->close();
?>
