-- Database එක සෑදීම
CREATE DATABASE IF NOT EXISTS tourism_db;
USE tourism_db;

-- Users (පරිශීලකයින්) Table එක
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' -- 'USER' හෝ 'ADMIN'
);

-- Destinations (සංචාරක ස්ථාන) Table එක
CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    ticket_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255)
);

-- Bookings (ටිකට් බුකින්) Table එක
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    booking_date DATE NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

-- උදාහරණ දත්ත (Sample Data) කිහිපයක් ඇතුලත් කිරීම
INSERT INTO destinations (name, description, ticket_price, image_url) VALUES 
('Sigiriya', 'Ancient rock fortress and palace ruin', 5000.00, 'sigiriya.jpg'),
('Yala National Park', 'Wildlife sanctuary famous for leopards', 8000.00, 'yala.jpg'),
('Temple of the Tooth', 'Sacred Buddhist temple in Kandy', 2000.00, 'kandy.jpg');
