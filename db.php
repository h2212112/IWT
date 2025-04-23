<?php
$host = "localhost";
$user = "root"; // Default XAMPP user
$pass = ""; // Default password is empty
$dbname = "story_portal";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
