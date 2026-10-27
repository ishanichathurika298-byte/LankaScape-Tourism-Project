# EE4207 Web Application Development — Mini Project Report

**Project Title:** LankaScape — Sri Lanka Tourism E-Ticketing and Information System  
**Module:** EE4207 Web Application Development  
**Academic Year:** 2026  
**Target Marks:** 30 / 30  

---

## 1. Introduction & Objectives
The primary objective of this project is to develop a full-stack, responsive tourism e-ticketing web application for Sri Lanka. The system allows prospective travelers to discover cultural and natural landmarks, check ticket pricing, select accommodation options, and make bookings online.

### Key Functional Requirements:
- **User Authentication:** Registration and login with password validation and persistent session storage.
- **Dynamic Catalog:** Automated retrieval and display of travel destinations with images, descriptions, and ticket prices from a persistent MySQL database.
- **Full CRUD Management:** Complete capability to **Create**, **Read**, **Update**, and **Delete** booking reservations.
- **Search, Filter & Sort:** Instant client-side filtering and sorting across active bookings.
- **Responsive & Modern UI:** Glassmorphism and Ken-Burns carousel hero slider built with modern HTML5/CSS3.

---

## 2. System Architecture & Tech Stack

The application employs a 3-tier **Model-View-Controller (MVC)** client-server architecture:

1. **Presentation Layer (Frontend):**
   - HTML5, CSS3 (Modern Flexbox, CSS Grid, Glassmorphism, CSS Transitions).
   - Vanilla JavaScript (ES6+) utilizing asynchronous `fetch()` API.
   - SweetAlert2 for modern modal dialogs and alert handling.
2. **Business Logic & Controller Layer (Backend):**
   - Spring Boot 3.x (Java 17).
   - Spring Web RESTful Controllers (`BookingController`, `UserController`, `DestinationController`).
   - Spring Data JPA with Hibernate ORM.
3. **Data Persistence Layer (Database):**
   - MySQL Server 8.0 relational database with Foreign Key constraints and cascading referential integrity.

---

## 3. Database Design & Entity Relationship Diagram (ERD)

### 3.1 Entity Relationship Diagram
```
+--------------------+              +-------------------------------+              +--------------------+
|       USERS        |              |           BOOKINGS            |              |    DESTINATIONS    |
+--------------------+              +-------------------------------+              +--------------------+
| PK  id (BIGINT)    |<--+      +-->| PK  id (BIGINT)               |       +----->| PK  id (BIGINT)    |
|     full_name      |   |      |   | FK  user_id (BIGINT) ---------+-------+      |     name           |
|     email (UNIQUE) |   +------+---| FK  destination_id (BIGINT) --+              |     description    |
|     password       |   (1 : N)    |     booking_date (DATE)       |    (1 : N)   |     ticket_price   |
|     role           |              |     travel_date (VARCHAR)     |              |     image_url      |
+--------------------+              |     quantity (INT)            |              +--------------------+
                                    |     total_price (DOUBLE)      |
                                    |     hotel_name (VARCHAR)      |
                                    |     payment_method (VARCHAR)  |
                                    +-------------------------------+
```

### 3.2 Data Dictionary
| Table | Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each user |
| `users` | `full_name` | VARCHAR(255) | NOT NULL | User's full name |
| `users` | `email` | VARCHAR(255) | NOT NULL, UNIQUE | User login email address |
| `users` | `password` | VARCHAR(255) | NOT NULL | User password |
| `destinations` | `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique destination ID |
| `destinations` | `name` | VARCHAR(255) | NOT NULL | Landmark / Place name |
| `destinations` | `description`| TEXT | NULLABLE | Detailed description |
| `destinations` | `ticket_price`| DOUBLE | NOT NULL | Admission ticket price (LKR) |
| `destinations` | `image_url` | VARCHAR(500) | NULLABLE | High-resolution image path/URL |
| `bookings` | `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique booking ID |
| `bookings` | `user_id` | BIGINT | FOREIGN KEY -> `users(id)` | User who placed the booking |
| `bookings` | `destination_id`| BIGINT | FOREIGN KEY -> `destinations(id)`| Booked destination |
| `bookings` | `booking_date`| DATE | NOT NULL | Date transaction was initiated |
| `bookings` | `travel_date` | VARCHAR(50) | NOT NULL | Date customer intends to visit |
| `bookings` | `quantity` | INT | NOT NULL, CHECK ($\ge 1$) | Number of tickets booked |
| `bookings` | `total_price`| DOUBLE | NOT NULL | Total cost ($quantity \times price$) |
| `bookings` | `hotel_name` | VARCHAR(255) | NULLABLE | Selected accommodation |
| `bookings` | `payment_method`| VARCHAR(100)| NOT NULL | Visa, Mastercard, PayPal, etc. |

---

## 4. Implementation of CRUD Operations

The core requirement of the EE4207 rubric is persistent full CRUD on a main entity. The `Booking` entity implements all four operations seamlessly:

### 4.1 CREATE (Adding New Records) — [4 Marks]
- **Client Side:** When a customer clicks "Book Now" on any destination card, an interactive modal requests:
  - Intended travel date (validated to ensure future dates).
  - Number of tickets (minimum 1).
  - Hotel accommodation tier (e.g., Cinnamon Grand, Shangri-La, or None).
  - Payment method (Visa, Mastercard, PayPal, Pay on Arrival).
- **Server Side:** `POST /api/bookings` validates inputs, verifies user/destination existence in MySQL, computes total cost, and persists the record.

### 4.2 READ (Listing, Search, Filter, Sort, View Details) — [4 Marks]
- **Listing:** `GET /api/bookings/user/{userId}` returns all bookings for the authenticated user, displayed as responsive cards.
- **Search:** Real-time search bar filters cards on keystroke matching Destination Name or Hotel Name.
- **Filter:** Dropdown filter isolates bookings: *All*, *With Hotel*, or *Tickets Only*.
- **Sort:** Dynamic sorting by Travel Date (Ascending/Descending), Total Price (High to Low / Low to High), or Ticket Quantity.
- **View Details:** "View" button triggers an itemized E-Ticket modal displaying booking reference, passenger name, unit price, total paid, and gate QR code mockup.

### 4.3 UPDATE (Editing Existing Records) — [4 Marks]
- **Client Side:** Clicking "Edit" launches a pre-populated form allowing travelers to reschedule travel dates, adjust passenger count, or change accommodation.
- **Server Side:** `PUT /api/bookings/{id}` validates non-empty inputs and positive ticket count, recalculates `totalPrice = quantity * destination.ticketPrice`, and updates the persistent database record.

### 4.4 DELETE (Removing Records Safely) — [4 Marks]
- **Client Side:** Clicking "Cancel" prompts a SweetAlert confirmation warning dialog ("Are you sure you want to cancel this booking? This action cannot be undone.").
- **Server Side:** Upon confirmation, `DELETE /api/bookings/{id}` removes the entity from the MySQL database and returns a confirmation message.

---

## 5. Validation & Error Handling — [2 Marks]

- **Client-Side:** HTML5 form attributes and SweetAlert pre-confirm hooks guarantee:
  - Form fields cannot be submitted empty.
  - Dates must be future dates (`min="today"`).
  - Numerical inputs cannot be negative or zero.
- **Server-Side:**
  - Null-checks and validation in `BookingController`:
    ```java
    if (request.getQuantity() == null || request.getQuantity() <= 0) {
        return ResponseEntity.badRequest().body("Quantity must be at least 1!");
    }
    ```
  - Graceful handling of missing entities with `404 Not Found`.
  - HTTP `201 Created` returned upon successful insertion.

---

## 6. UI/UX Design & Responsiveness — [2 Marks]

- **Hero Slider:** 5-slide dynamic Ken-Burns carousel with real-time indicators and auto-play pause-on-hover capability.
- **Live Widgets Bar:** Integrated live ticking clock, current date, location tag, and weather badge.
- **Mobile Responsiveness:** Uses media queries and CSS Grid auto-fill layouts to scale effortlessly across desktop, tablet, and mobile displays.

---

## 7. Demonstration Video Script (5-Minute Limit) — [2 Marks]

*Note: Ensure your webcam/camera is turned on in the corner of your screen during the recording as required by the rubric.*

| Timestamp | Video Section | Narration & Demonstration Action |
| :--- | :--- | :--- |
| **0:00 - 0:45** | **Introduction & Architecture** | "Hello, my name is [Your Name], Index [Your Index Number]. Today I am demonstrating my EE4207 Web Application Development Mini Project: LankaScape — a full-stack Tourism E-Ticketing System. The backend is built with Spring Boot and Java 17, connected to a MySQL database, and the frontend is designed with HTML5, modern CSS, and JavaScript." |
| **0:45 - 1:30** | **Home Page & UI/UX** | *Show browser on `index.html`.* "Here is the home page. Notice our interactive 5-slide hero carousel with smooth transitions, live ticking local time, date, and weather widgets. Scrolling down, we have destination categories and dynamic top destinations loaded directly from our MySQL database via REST API." |
| **1:30 - 2:30** | **CRUD: CREATE** | "Now let's demonstrate the first CRUD operation: CREATE. I'll click 'Book Now' on Galle Fort. I select the travel date, choose 2 tickets, select Cinnamon Grand hotel, and choose Visa card. Clicking 'Confirm Booking' executes a `POST` request to `/api/bookings`. The server validates the request and confirms the booking." |
| **2:30 - 3:30** | **CRUD: READ (Search, Filter, Sort, Details)** | *Navigate to `my-bookings.html`.* "Here is our Booking Dashboard. Under READ: we see all active bookings. In the search box, I can type 'Galle' or 'Cinnamon' and it filters instantly. I can filter by 'With Hotel' or 'Tickets Only', and sort by price or travel date. Clicking 'View' displays the complete E-Ticket receipt with itemized breakdown and QR code." |
| **3:30 - 4:15** | **CRUD: UPDATE** | "Next, the UPDATE operation. Let's say I want to reschedule my trip. I click 'Edit', change the tickets from 2 to 4, and change the date. Clicking 'Save Changes' triggers a `PUT` request to `/api/bookings/{id}`. The backend recalculates the total price automatically and updates MySQL." |
| **4:15 - 4:45** | **CRUD: DELETE** | "Finally, the DELETE operation. If a customer wishes to cancel, clicking 'Cancel' brings up a safe confirmation modal. Clicking 'Yes, Cancel' sends a `DELETE` request to `/api/bookings/{id}`, removing it from MySQL cleanly." |
| **4:45 - 5:00** | **Conclusion & Database View** | *Quickly switch to MySQL/IntelliJ or conclude.* "All changes are persistently stored in MySQL across our relational tables with foreign keys. Thank you for evaluating LankaScape." |
