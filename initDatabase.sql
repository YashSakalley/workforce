DROP DATABASE IF EXISTS workforce;
CREATE DATABASE workforce;
USE workforce;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email_id VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(10) UNIQUE NOT NULL,
  address VARCHAR(255),
  profile_photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email_id VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(10) UNIQUE NOT NULL,
  shop_address VARCHAR(255) NOT NULL,
  profile_photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  average_rating FLOAT,
  total_reviews INT,
  job VARCHAR(50) UNIQUE
);
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT,
  reviews_text VARCHAR(255),
  worker_id INT,
  user_id INT,
  request_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(worker_id) REFERENCES workers(id),
  FOREIGN KEY(request_id) REFERENCES requests(id)
);
CREATE TABLE requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INT NOT NULL,
  worker_id INT NOT NULL,
  current_status VARCHAR(20),
  job VARCHAR(50),
  cost float,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(worker_id) REFERENCES workers(id)
);
CREATE TABLE temp_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  current_status VARCHAR(20),
  job VARCHAR(50) NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);