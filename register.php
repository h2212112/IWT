<?php
include 'db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$email = $data->email;
$password = $data->password;

// Check if email already exists
$check = $conn->query("SELECT * FROM users WHERE email = '$email'");
if ($check->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already registered"
    ]);
    exit;
}

// Insert new user
$sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";
if ($conn->query($sql)) {
    $user_id = $conn->insert_id;
    echo json_encode([
        "status" => "success",
        "message" => "Registration successful",
        "user_id" => $user_id,
        "email" => $email
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Error: " . $conn->error
    ]);
}
?>
