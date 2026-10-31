# 🌴 LankaScape: Sri Lanka Tourism E-Ticketing & Integrated Destination Information System

<p align="center">
  <img src="Frontend/logo.jpg" alt="LankaScape Logo" width="120" style="border-radius: 50%;" />
</p>

<p align="center">
  <b>Faculty of Engineering, University of Ruhuna</b><br>
  Department of Electrical & Information Engineering<br>
  <b>Course Module:</b> EE4207 – Web Application Development<br>
  <b>Student Name:</b> K. G. Ishani Chathurika (Chathurika K.G.I.) &nbsp;|&nbsp; <b>Reg. No:</b> EG/2023/5538 (25th Batch)
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring_Boot_3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MySQL_8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL 8.0" />
  <img src="https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript ES6+" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3_Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Architecture-3--Tier_MVC-blueviolet?style=for-the-badge" alt="3-Tier MVC" />
</p>

---

## 📖 1. Project Overview & Commercial Domain

**LankaScape** is an enterprise-grade, full-stack web application engineered to modernize destination discovery and electronic ticketing (E-Ticketing) across Sri Lanka. Developed for module **EE4207 (Web Application Development)** at the **Faculty of Engineering, University of Ruhuna**, LankaScape bridges the gap between Sri Lanka's world-renowned cultural, ecological, and coastal heritage and the modern digital expectations of travelers worldwide.

Rather than serving as a static brochure, LankaScape functions as an active digital ecosystem that enables international tourists, regional visitors, and domestic travelers to:
* **Discover 60 Curated Destinations** across all nine provinces categorized into *Heritage, Nature, Wildlife, Beach, and Hill Country*.
* **Configure Complete End-to-End Tour Packages** with dynamic real-time pricing from Colombo:
  * Dedicated Private AC Transport (Sedan, Luxury Van, Tourist Mini Coach)
  * SLTDA-Licensed Guides (Chauffeur, English Licensed, Multilingual Specialists)
  * Authentic Meal Plans (Bed & Breakfast, Half Board, Full Board All-Inclusive)
  * Accommodation Tiers (Day Tour, 3-Star Boutique, 4-Star Deluxe Resort, 5-Star Heritage Resort)
* **Execute Full Persistent CRUD Operations** (Create, Read, Update, Delete) on bookings and user reservations in a live MySQL database.
* **Experience an Authentic Payment Gateway Interface** supporting Visa, Mastercard, PayPal, and Pay on Arrival.
* **Generate Official A4 Tour E-Vouchers** featuring unique scannable verification QR codes.

<p align="center">
  <img src="docs/images/01_home_page.png" alt="LankaScape Home Page" width="95%" />
  <br>
  <em>Figure 1.1: LankaScape Landing Page demonstrating responsive UI and transparent navigation</em>
</p>

---

## 🏛️ 2. Architectural Philosophy & Core System Boundaries

LankaScape is structured on a strict **decoupled 3-tier client-server architecture**, ensuring modularity, security, and separation of concerns:

```
+-----------------------------------------------------------------------------------+
|                        PRESENTATION TIER (CLIENT LAYER - VS CODE)                 |
|   [ HTML5 Semantic Views ]  +  [ CSS3 Grid/Flexbox UI ]  +  [ ES6+ Fetch Engine ] |
|   Modules: Destination Search/Filter/Sort | CRUD Booking Wizard | My Bookings UI  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          |  HTTP / RESTful JSON (CORS Enabled)
                                          v
+-----------------------------------------+-----------------------------------------+
|              APPLICATION TIER (SPRING BOOT 3.x / JAVA JDK 17 - INTELLIJ)          |
|  [ REST Controllers ]  -->  [ Business Logic & Services ]  -->  [ Spring Data JPA ]|
|  DestinationController / BookingController / UserController     Hibernate ORM     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          |  JDBC Connection / HikariCP Pool (Port 3306)
                                          v
+-----------------------------------------+-----------------------------------------+
|                 DATA PERSISTENCE TIER (MYSQL 8.0 RDBMS - WORKBENCH)               |
|   Normalized 3NF Relational Schema (`tourism_db`):                                |
|   Tables: [users] [destinations] [bookings]                                       |
+-----------------------------------------------------------------------------------+
```

### Core Layer Responsibilities:
1. **Client-Side Presentation Layer:** Engineered with semantic HTML5, custom responsive CSS3 (Glassmorphism, Flexbox, and CSS Grid), and asynchronous Vanilla JavaScript (ES6+ Fetch API). Provides dynamic search, real-time category filtering, A-to-Z sorting, password visibility toggle, and instant DOM updates without page reloads.
2. **Server-Side Application Layer:** Powered by Java JDK 17 and Spring Boot 3.x, enforcing clean Controller-Service-Repository separation, server-side data validation, dynamic package cost computation, and RESTful JSON endpoints.
3. **Relational Persistence Layer:** Backed by an ACID-compliant MySQL 8.0 database (`tourism_db`), maintaining referential integrity with foreign key constraints, cascaded operations, and persistent storage across server restarts.

<p align="center">
  <img src="docs/images/02_user_login.png" alt="Authentication Module" width="95%" />
  <br>
  <em>Figure 1.2: Authentication Module – Secure User Login and Registration interface with password show/hide feature</em>
</p>

---

## 🗄️ 3. Database Design & Entity-Relationship Architecture

The relational schema is normalized to **Third Normal Form (3NF)** and operates on the InnoDB storage engine within MySQL 8.0.

### 📊 Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "places (1:N)"
    DESTINATIONS ||--o{ BOOKINGS : "reserved_for (1:N)"

    USERS {
        int id PK "Auto Increment"
        varchar full_name "User Full Name"
        varchar email UK "Unique, Not Null"
        varchar password "Encrypted Password"
        varchar role "USER / ADMIN"
    }

    DESTINATIONS {
        int id PK "Auto Increment"
        varchar name "Attraction Name"
        text description "Full Tourism Description"
        double ticket_price "Base Ticket Fee (LKR)"
        varchar image_url "Relative Image Path"
        varchar category "HERITAGE, NATURE, WILDLIFE, BEACH, HILL COUNTRY"
        varchar location "Province / District"
        double rating "Star Rating (1.0 - 5.0)"
        int distance_km "Distance from Colombo (km)"
        varchar travel_time "Drive Duration via Expressways"
    }

    BOOKINGS {
        bigint id PK "Auto Increment"
        int user_id FK "References users(id)"
        int destination_id FK "References destinations(id)"
        date booking_date "Reservation Timestamp"
        varchar travel_date "Scheduled Tour Date"
        int quantity "Passenger Count (Pax)"
        varchar pickup_location "Colombo Hotel / Airport"
        varchar vehicle_type "Sedan, Luxury Van, Mini Coach"
        varchar guide_type "Chauffeur, English, Multilingual"
        varchar meal_plan "No Meals, B&B, Half/Full Board"
        varchar hotel_name "Day Tour, 3-Star, 4-Star, 5-Star"
        double ticket_cost "Ticket Total (LKR)"
        double transport_cost "Chauffeur Vehicle Total (LKR)"
        double guide_cost "Guide Total (LKR)"
        double meal_cost "Meals Total (LKR)"
        double hotel_cost "Accommodation Total (LKR)"
        double total_price "Grand Total Price (LKR)"
        varchar payment_method "Visa, Mastercard, PayPal, Pay on Arrival"
        varchar payment_status "PAID, PENDING_ARRIVAL"
        varchar transaction_id "Unique Reference / Bank Hash"
    }
```

### Relational Schema Specifications:
* **`users` Table:** Stores authenticated user accounts. The `email` field is indexed with a `UNIQUE` constraint to prevent duplicate registrations.
* **`destinations` Table:** Contains 60 pre-seeded Sri Lankan tourist attractions with category tags, provinces, ticket costs, ratings, distances, and travel durations from Colombo.
* **`bookings` Table:** Stores confirmed e-tickets and customized tour packages. Enforces `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE` and `FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE`.

---

## ⚡ 4. Full-Stack CRUD Architecture & System Workflows

LankaScape implements full persistent Create, Read, Update, and Delete capabilities through integrated REST APIs:

### 1️⃣ CREATE Operation: Tour Package Booking Wizard
Tourists configure their journey dynamically on `destination-detail.html`. As passengers select their travel date, group size, transport fleet, guide expertise, meal preference, and hotel grade, the UI recalculates both **LKR and USD live totals**. Upon submitting, a `POST /api/bookings` request atomically saves the reservation in MySQL.

<p align="center">
  <img src="docs/images/04_booking_wizard.png" alt="CREATE Booking Wizard" width="95%" />
  <br>
  <em>Figure 3.1: CREATE Operation – Interactive Tour Booking Wizard with dynamic price calculation</em>
</p>

### 2️⃣ Mock Payment Gateway & Checkout Validation
Before finalizing the reservation, a bank-grade checkout modal allows payment via Visa, Mastercard, PayPal, or Pay on Arrival. It includes 16-digit card validation, MM/YY expiry checks, CVV verification, and a 1-click test auto-fill shortcut.

<p align="center">
  <img src="docs/images/05_payment_gateway.png" alt="Payment Gateway Checkout" width="95%" />
  <br>
  <em>Figure 3.2: Payment Gateway Checkout Interface with validation and LankaPay simulation</em>
</p>

### 3️⃣ READ Operations: Exploration Catalog & My Bookings Dashboard
* **Public Exploration (`index.html`):** Retrieves all 60 destinations via `GET /api/destinations`. Users can perform instant keyword searches, category pill filtering (*All, Beaches, Heritage, Hill Country, Wildlife, Nature*), and alphabetical A-to-Z sorting.
* **Personal Bookings (`my-bookings.html`):** Authenticated users view their active and past tour reservations retrieved via `GET /api/bookings/user/{userId}` with live dashboard summary statistics (*Total Trips, Total Spent*).

<p align="center">
  <img src="docs/images/03_destination_catalog.png" alt="READ Catalog" width="95%" />
  <br>
  <em>Figure 2.1: READ Operations – 60 Curated Destinations with Live Search, Filter, and Sort Controls</em>
</p>

<p align="center">
  <img src="docs/images/06_my_bookings_dashboard.png" alt="My Bookings Dashboard" width="95%" />
  <br>
  <em>Figure 3.3: READ Operations – User Dashboard displaying persistent booking records from MySQL</em>
</p>

### 4️⃣ E-Voucher Generation & Verification QR Pass
Each booking generates an official printable tour voucher with an itemized payment breakdown and a dynamic QR code (`https://api.qrserver.com/v1/create-qr-code/`) encoding the booking reference, lead traveler name, destination, date, and transaction hash.

<p align="center">
  <img src="docs/images/07_voucher_modal.png" alt="E-Voucher Modal" width="95%" />
  <br>
  <em>Figure 3.4: Official Tour E-Voucher Modal with itemized breakdown and dynamic QR pass</em>
</p>

<p align="center">
  <img src="docs/images/10_official_e_voucher_pass.png" alt="Official Printable E-Voucher" width="75%" />
  <br>
  <em>Figure 3.5: Printable A4 Tour E-Voucher Pass with cryptographic verification hash</em>
</p>

### 5️⃣ UPDATE Operation: Modifying Existing Bookings
Travelers can reschedule dates, change passenger quantities, or upgrade their transport/hotel through an interactive modal on `my-bookings.html`. This dispatches a `PUT /api/bookings/{id}` request, updating the record in MySQL and recalculating totals in real-time.

<p align="center">
  <img src="docs/images/08_edit_booking_modal.png" alt="UPDATE Booking Modal" width="95%" />
  <br>
  <em>Figure 3.6: UPDATE Operation – Interactive modal allowing users to safely edit and reschedule bookings</em>
</p>

### 6️⃣ DELETE Operation: Safe Reservation Cancellation
To prevent accidental data loss, clicking **Cancel** triggers a SweetAlert2 confirmation modal. When confirmed, a `DELETE /api/bookings/{id}` request executes, removing the record from the database and updating dashboard metrics dynamically.

<p align="center">
  <img src="docs/images/09_cancel_booking_modal.png" alt="DELETE Cancellation Prompt" width="95%" />
  <br>
  <em>Figure 3.7: DELETE Operation – Safe cancellation confirmation prompt with instant UI synchronization</em>
</p>

---

## 📡 5. RESTful API Endpoints Specification

| HTTP Method | Endpoint URI | Access Role | Description & Data Handling |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/destinations` | Public | Retrieves all 60 destinations sorted in A-to-Z alphabetical order. |
| `GET` | `/api/destinations/{id}` | Public | Fetches detailed information for a single destination by ID. |
| `POST` | `/api/users/register` | Public | Registers a new user account with duplicate email validation. |
| `POST` | `/api/users/login` | Public | Authenticates credentials and returns user profile session payload. |
| `POST` | `/api/bookings` | Authenticated | **CREATE:** Validates inputs, saves tour reservation in MySQL, and returns `201 Created`. |
| `GET` | `/api/bookings/user/{userId}` | Authenticated | **READ:** Retrieves all persistent reservations for the specified user. |
| `PUT` | `/api/bookings/{id}` | Authenticated | **UPDATE:** Modifies travel date, pax, vehicle, or hotel details and updates price. |
| `DELETE` | `/api/bookings/{id}` | Authenticated | **DELETE:** Safely removes a booking record from the MySQL database. |

---

## 🧪 6. Software Verification & Test Suite Matrix

| Test ID | Evaluation Criterion | Test Input / Action | Observed System Output | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | **CREATE Operation** | Submit booking for Sigiriya (2 Pax + Sedan + Guide + Full Board). | `201 Created`; record saved in MySQL; printable voucher & QR generated. | **PASSED** |
| **TC-02** | **READ: Search & Filter** | Search "Beach", filter by "Southern Coast", sort A-to-Z. | Real-time DOM filtering within <15ms; accurate destination matches shown. | **PASSED** |
| **TC-03** | **UPDATE Operation** | Edit Booking #9 travel date to `2026-11-20` and change to Mini Coach. | `200 OK`; updated in MySQL; total price recalculated and card refreshed. | **PASSED** |
| **TC-04** | **DELETE Operation** | Click Cancel on booking card and confirm SweetAlert2 prompt. | Record removed from MySQL; dashboard trip count and total spent updated. | **PASSED** |
| **TC-05** | **Input Validation** | Submit booking with empty date, 0 quantity, or invalid card number. | Client/server validation halts submission and displays clear error feedback. | **PASSED** |

---

## 🚀 7. Step-by-Step Project Setup & Execution Guide

### 📋 Prerequisites
* **Java Development Kit (JDK 17 or higher)**
* **MySQL Server 8.0** (running locally on port `3306`)
* **Modern Web Browser** (Google Chrome, Microsoft Edge, Mozilla Firefox)

---

### ⚡ Option A: 1-Click Launch (Windows - Recommended)
1. Ensure your local MySQL service is running on port 3306.
2. In the project root directory, double-click **`RUN_PROJECT.bat`**.
3. The launcher will automatically:
   * Auto-detect your installed Java 17 runtime (`C:\Program Files\Java\jdk-17`).
   * Start the Spring Boot REST API backend on port 8080 in a dedicated console window.
   * Open `Frontend/index.html` in your default web browser.

---

### 🛠️ Option B: Step-by-Step Manual Setup

#### Step 1 — Clone the Repository
```bash
git clone https://github.com/ishanichathurika298-byte/LankaScape-Tourism-Project.git
cd LankaScape-Tourism-Project
```

#### Step 2 — Initialize the MySQL 8.0 Database
1. Open **MySQL Workbench** and connect to your local instance (`localhost:3306`).
2. Open and execute the script located at **`Backend/database.sql`** (or run via CLI):
   ```bash
   mysql -u root -p < Backend/database.sql
   ```
   *This automatically creates the `tourism_db` schema, generates `users`, `destinations`, and `bookings` tables, and pre-seeds all 60 destinations with distances and sample bookings.*

3. Verify your database credentials in `Backend/tourism-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/tourism_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=Chathu#28
   ```
   *(If your local MySQL root password differs, update the `spring.datasource.password` line accordingly).*

#### Step 3 — Configure & Run the Spring Boot Backend
Open a terminal, navigate to the backend folder, and start the server:
```bash
cd Backend/tourism-backend

# Windows:
mvnw.cmd spring-boot:run

# Linux / macOS:
./mvnw spring-boot:run
```
The REST API server will initialize on **`http://localhost:8080`**.

#### Step 4 — Launch the Frontend Application
Simply open **`Frontend/index.html`** in any modern web browser, or launch it with the **VS Code Live Server** extension.

---

### 🔑 Demonstration Accounts

| Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **Primary User** | `ishanichathurika298@gmail.com` | `Chathu#28` | Pre-configured account with active persistent bookings. |
| **New Traveler** | *Any valid email* | *User choice* | Register instantly on `register.html` to create a new profile. |

---

## 💻 8. Core Code Artifacts

### Spring Boot Controller (`BookingController.java`)
```java
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DestinationRepository destinationRepository;

    // CREATE: Persist new tour reservation with server-side validation
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1!");
        }
        if (request.getTravelDate() == null || request.getTravelDate().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Travel date is required!");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.saveBooking(request));
    }

    // READ: Retrieve bookings for authenticated user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingRepository.findByUserIdOrderByIdDesc(userId));
    }

    // UPDATE: Modify reservation parameters and recalculate total
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    // DELETE: Safely cancel and remove reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
        return ResponseEntity.ok("Booking deleted successfully!");
    }
}
```

---

## 📚 9. Conclusion & References

The **LankaScape Tourism Project** demonstrates how modern web engineering principles can address key challenges in national tourism digitisation. By unifying comprehensive destination discovery, transparent multi-component pricing, and full persistent CRUD operations within a single decoupled platform, the system eliminates information asymmetry, middleman dependency, and operational overhead.

### References:
1. **Sri Lanka Tourism Development Authority (SLTDA):** *Annual Statistical Report of Sri Lanka Tourism*, Colombo, Sri Lanka.
2. **Spring Framework Documentation:** *Spring Boot 3.x Reference Guide & Spring Data JPA*, [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot).
3. **Mozilla Developer Network (MDN):** *JavaScript ES6+, Fetch API, and Responsive CSS Grid/Flexbox Specifications*, [https://developer.mozilla.org](https://developer.mozilla.org).
4. **Faculty of Engineering, University of Ruhuna:** *EE4207 Web Application Development Course Specifications*, Hapugala, Galle, Sri Lanka.

---

<p align="center">
  <b>Developed by K. G. Ishani Chathurika (EG/2023/5538)</b><br>
  Faculty of Engineering, University of Ruhuna &copy; 2026. All rights reserved.
</p>
