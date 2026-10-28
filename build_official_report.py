import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
        f'<w:bottom w:val="single" w:sz="8" w:space="0" w:color="0F172A"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def style_table_header(table, headers):
    for col_idx, h in enumerate(headers):
        cell = table.rows[0].cells[col_idx]
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.name = 'Calibri'
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

def populate_table_rows(table, rows_data):
    c_body = RGBColor(51, 65, 85)
    for row_idx, rdata in enumerate(rows_data, start=1):
        row = table.rows[row_idx]
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, val in enumerate(rdata):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 60, 60, 90, 90)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = 'Calibri'
            r.font.size = Pt(8.5)
            r.font.color.rgb = c_body

def create_styled_table(doc, headers, rows_data):
    table = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)
    style_table_header(table, headers)
    populate_table_rows(table, rows_data)
    return table

def generate_report():
    doc = docx.Document()

    # Standard Margins
    for s in doc.sections:
        s.top_margin = Inches(0.85)
        s.bottom_margin = Inches(0.85)
        s.left_margin = Inches(0.9)
        s.right_margin = Inches(0.9)

    # Palette
    c_navy = RGBColor(15, 23, 42)       # Slate 900
    c_amber = RGBColor(224, 122, 39)    # LankaScape Amber
    c_blue = RGBColor(2, 132, 199)      # Sky Blue 600
    c_body = RGBColor(51, 65, 85)       # Slate 700
    c_muted = RGBColor(100, 116, 139)   # Slate 500

    # Typography helpers
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = c_navy
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = c_amber
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(9)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(10.5)
        run.font.bold = True
        run.font.color.rgb = c_navy
        return p

    def add_p(text, bold_prefix=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.name = 'Calibri'
            rb.font.bold = True
            rb.font.size = Pt(10)
            rb.font.color.rgb = c_navy
        r = p.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(10)
        r.font.color.rgb = c_body
        return p

    def add_bullet(title, desc):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3.5)
        p.paragraph_format.line_spacing = 1.15
        rt = p.add_run(title)
        rt.font.name = 'Calibri'
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = c_navy
        rd = p.add_run(" " + desc)
        rd.font.name = 'Calibri'
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = c_body
        return p

    def add_code_block(code_str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(code_str)
        r.font.name = 'Consolas'
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(15, 23, 42)
        return p

    # =============================================================
    # COVER / TITLE PAGE
    # =============================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run("FACULTY OF ENGINEERING\nDEPARTMENT OF ELECTRICAL & INFORMATION ENGINEERING\n")
    r_inst.font.name = 'Calibri'
    r_inst.font.size = Pt(13)
    r_inst.font.bold = True
    r_inst.font.color.rgb = c_navy

    r_deg = p_inst.add_run("BSc (Hons) in Engineering Degree Programme\n")
    r_deg.font.name = 'Calibri'
    r_deg.font.size = Pt(10.5)
    r_deg.font.color.rgb = c_muted

    r_course = p_inst.add_run("EE4207 — Web Application Development\n")
    r_course.font.name = 'Calibri'
    r_course.font.size = Pt(11.5)
    r_course.font.bold = True
    r_course.font.color.rgb = c_blue

    doc.add_paragraph("\n")

    p_cover_title = doc.add_paragraph()
    p_cover_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_type = p_cover_title.add_run("MINI PROJECT TECHNICAL REPORT\n")
    r_type.font.name = 'Calibri'
    r_type.font.size = Pt(11)
    r_type.font.bold = True
    r_type.font.color.rgb = c_amber

    r_proj = p_cover_title.add_run("LankaScape: Inbound Tour Operator Package Booking & E-Ticketing System\n")
    r_proj.font.name = 'Calibri'
    r_proj.font.size = Pt(21)
    r_proj.font.bold = True
    r_proj.font.color.rgb = c_navy

    r_proj_desc = p_cover_title.add_run("Design, Full-Stack Architecture, Algorithmic Pricing Engine, and Persistent Database Implementation of a Commercial Travel Management Portal")
    r_proj_desc.font.name = 'Calibri'
    r_proj_desc.font.size = Pt(10.5)
    r_proj_desc.font.italic = True
    r_proj_desc.font.color.rgb = c_body

    doc.add_paragraph("\n")

    meta_tbl = doc.add_table(rows=6, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(meta_tbl)

    meta_items = [
        ("Candidate Name:", "Ishani Chathurika"),
        ("Registration / Index Number:", "[Insert Student Index Number Here]"),
        ("Course Module:", "EE4207: Web Application Development"),
        ("Application Type:", "Full-Stack Web Application (Spring Boot & Vanilla JS)"),
        ("GitHub Repository Link:", "https://github.com/[username]/lankascape-tourism"),
        ("Submission Date:", "October 2026")
    ]

    for idx, (lbl, val) in enumerate(meta_items):
        row = meta_tbl.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.5)
        c1.width = Inches(4.2)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 70, 70, 100, 100)
        set_cell_margins(c1, 70, 70, 100, 100)

        p0 = c0.paragraphs[0]
        r0 = p0.add_run(lbl)
        r0.font.name = 'Calibri'
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = c_muted

        p1 = c1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.name = 'Calibri'
        r1.font.bold = (idx in [0, 1, 3])
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = c_navy if idx in [0, 1, 3] else c_body

    doc.add_page_break()

    # =============================================================
    # ABSTRACT / EXECUTIVE SUMMARY
    # =============================================================
    add_h1("Executive Summary")
    add_p(
        "LankaScape is a complete, production-grade inbound tour operating and electronic ticketing web application engineered "
        "to serve Sri Lanka's inbound tourism industry. Operating from a simulated commercial enterprise headquarters at the "
        "World Trade Center (WTC), Colombo 01, under Sri Lanka Tourism Development Authority (SLTDA) guidelines, the system "
        "streamlines the end-to-end traveler experience from initial destination discovery through customized itinerary pricing, "
        "secure payment gateway processing, interactive itinerary lifecycle management, and verifiable A4 e-voucher generation."
    )
    add_p(
        "Built strictly on a decoupled 3-Tier Layered Architecture, the application employs an asynchronous, client-side rendered "
        "frontend (HTML5, modern CSS3 Glassmorphism, Vanilla ES6+ JavaScript), a high-performance Spring Boot 3.x RESTful API layer (Java 17), "
        "and a relational MySQL 8.0 database engine operating in Third Normal Form (3NF). The platform delivers persistent CRUD operations, "
        "an algorithmic Colombo departure distance and travel-time logistics engine, multi-channel payment gateway flows (Credit/Debit Card "
        "with 3D-Secure 2.0 simulation, PayPal Express, and Pay on Arrival), real-time client-side search/filter/sort capabilities, and "
        "dynamic QR-code verification. This report documents the system background, analytical requirements, software architecture, data modeling, "
        "detailed feature implementations, security validations, and experimental testing."
    )

    # =============================================================
    # CHAPTER 1: INTRODUCTION & PROJECT BACKGROUND
    # =============================================================
    add_h1("Chapter 1: Introduction & Project Background")
    
    add_h2("1.1 Domain Context: Inbound Tourism in Sri Lanka")
    add_p(
        "Tourism is one of Sri Lanka's paramount economic pillars, delivering substantial foreign exchange earnings, regional employment, "
        "and cultural exchange. The island's compact geographical footprint features extraordinary diversity, encompassing UNESCO World Heritage citadels, "
        "tropical rainforests, montane biodiversity hotspots, marine sanctuaries, and coastal surfing beaches. However, international travelers "
        "frequently confront acute logistical challenges upon arrival at Bandaranaike International Airport (CMB) or Colombo city hotels."
    )

    add_h2("1.2 Problem Statement & Industry Challenges")
    add_p(
        "Conventional tour booking methodologies in Sri Lanka suffer from four distinct industry challenges:"
    )
    add_bullet("1. Fragmented Service Procurement:", "Travelers are forced to negotiate independently with disparate vendors for site admission passes, dedicated chauffeur transport, licensed guides, dining plans, and resort accommodations, creating communication overhead and scheduling conflicts.")
    add_bullet("2. Transport Pricing Opacity:", "Chauffeur transport costs from Colombo to provincial attractions are frequently arbitrary, lacking transparent standardized formulas based on actual road distance (km), highway expressway tolls, and fuel consumption.")
    add_bullet("3. Lack of Interactive Post-Booking Management:", "Traditional platforms lack unified self-service dashboards where travelers can dynamically reschedule travel dates, adjust passenger counts, swap accommodation tiers, or securely cancel reservations with real-time database reflection.")
    add_bullet("4. Counterfeit Risk and Verification Friction:", "Paper vouchers and generic email confirmations create verification delays at remote site entrance gates and lack cryptographic or scannable passenger authentication.")

    add_h2("1.3 Project Objectives")
    add_p(
        "The overarching objective of the LankaScape project is to engineer, deploy, and evaluate a unified, enterprise-grade inbound tour "
        "operator system addressing the aforementioned industry challenges through:"
    )
    add_bullet("Centralized Travel Logistics:", "A single interactive booking engine encompassing 60 pre-seeded Sri Lankan destinations across 5 distinct categories (Heritage, Nature, Wildlife, Beach, Hill Country).")
    add_bullet("Algorithmic Colombo Logistics Calculation:", "Real-time transparent package pricing accounting for entry passes, private AC vehicle roundtrips, SLTDA-licensed guides, meal plans, and accommodations.")
    add_bullet("Commercial Payment Gateway Integration:", "Simulating realistic, bank-grade payment processing supporting Visa/Mastercard 3D Secure 2.0, PayPal Express ($ USD), and Pay on Arrival.")
    add_bullet("Comprehensive CRUD Reservation Management:", "A dedicated 'My Bookings' portal allowing persistent querying, real-time substring search, multi-criteria filtering, multi-attribute sorting, dynamic modification, and safe deletion.")
    add_bullet("Cryptographically Scannable E-Vouchers:", "Printable A4 tour vouchers embedding passenger metadata, itemized receipts, verified payment stamps, and dynamic scannable QR codes.")

    # =============================================================
    # CHAPTER 2: SYSTEM ANALYSIS & REQUIREMENTS ENGINEERING
    # =============================================================
    add_h1("Chapter 2: System Analysis & Requirements Engineering")
    
    add_h2("2.1 Stakeholder Analysis")
    add_p(
        "The system accommodates three primary operational stakeholders:"
    )
    add_bullet("International Tourists / Travelers:", "End users seeking destination exploration, transparent package assembly, multi-currency payment, self-service itinerary management, and digital voucher retrieval.")
    add_bullet("Inbound Tour Operators & Agency Dispatchers:", "Enterprise administrative managers tracking passenger manifests, assigning chauffeur fleets, coordinating hotel reservations, and monitoring payment reconciliation.")
    add_bullet("Chauffeurs & Licensed Guides:", "Field personnel verifying passenger identity and voucher authenticity at vehicle pickup lounges or site gates via QR code scanning.")

    add_h2("2.2 Functional Requirements Specification")
    add_bullet("FR-01 (User Authentication):", "The system shall permit travelers to securely register and authenticate, managing persistent session states via client-side storage and server-side validation.")
    add_bullet("FR-02 (Destination Exploration):", "The system shall dynamically showcase destinations categorized into Heritage, Nature, Wildlife, Beach, and Hill Country, displaying distance from Colombo, travel duration, ratings, and ticket prices.")
    add_bullet("FR-03 (Customizable Package Assembly):", "The system shall allow travelers to select travel dates, departure points, vehicle tiers (Sedan, Van, Coach), guide classifications, meal plans, and hotel categories.")
    add_bullet("FR-04 (Algorithmic Cost Computation):", "The system shall compute real-time itemized subtotals and grand totals both client-side and server-side, preventing client pricing manipulation.")
    add_bullet("FR-05 (Payment Gateway Simulation):", "The system shall provide interactive card checkout with 16-digit auto-spacing, brand detection, 3D-Secure authorization, PayPal Express USD conversion, and Pay-on-Arrival status tracking.")
    add_bullet("FR-06 (Persistent CRUD Management):", "The system shall persist booking records in MySQL, permitting travelers to list all active trips, view detailed receipts, execute live search, multi-filter, sort, edit itinerary parameters, and safely cancel reservations.")
    add_bullet("FR-07 (Official Voucher & QR Generation):", "The system shall generate high-resolution printable A4 vouchers incorporating verified payment stamps and dynamically rendered scannable QR codes.")

    add_h2("2.3 Non-Functional Requirements Specification")
    add_bullet("NFR-01 (Performance & Latency):", "REST API endpoints shall deliver response times under 200ms for database queries under normal operational loads.")
    add_bullet("NFR-02 (Data Integrity & Consistency):", "All transactional operations shall conform to ACID properties utilizing MySQL InnoDB storage engine with explicit foreign key cascading constraints.")
    add_bullet("NFR-03 (Security & Tamper Resistance):", "Server-side pricing recalculation shall strictly prevent client-side DOM tampering of monetary totals. Input fields shall be protected against SQL injection via Hibernate parameterized queries.")
    add_bullet("NFR-04 (Responsiveness & Cross-Device Compatibility):", "The user interface shall adapt dynamically across desktop (>=1200px), tablet (768px-1024px), and mobile viewports (<=767px) via responsive CSS Grid and Flexbox layouts.")

    doc.add_page_break()

    # =============================================================
    # CHAPTER 3: SYSTEM ARCHITECTURE & TECHNICAL DESIGN
    # =============================================================
    add_h1("Chapter 3: System Architecture & Technical Design")

    add_h2("3.1 Three-Tier Layered Architecture")
    add_p(
        "LankaScape employs a classic decoupled 3-Tier Layered Architecture that guarantees separation of concerns, "
        "code maintainability, and enterprise-grade reliability:"
    )

    arch_diagram = (
        "+-----------------------------------------------------------------------------------+\n"
        "|                           1. PRESENTATION TIER (CLIENT)                           |\n"
        "|   HTML5 Semantic DOM • CSS3 Glassmorphism System • Vanilla JavaScript (ES6+)      |\n"
        "|   SweetAlert2 Dynamic Modals • QRServer API • Responsive Flexbox & Grid Engine    |\n"
        "+-----------------------------------------------------------------------------------+\n"
        "                                          |\n"
        "                         HTTP 1.1 / JSON over RESTful API\n"
        "                                          |\n"
        "+-----------------------------------------------------------------------------------+\n"
        "|                     2. APPLICATION LOGIC TIER (SPRING BOOT 3.x)                   |\n"
        "|   • REST Controllers: BookingController, DestinationController, UserController    |\n"
        "|   • Service & DTO Layer: BookingRequest, Server-Side Pricing Engine, Validation   |\n"
        "|   • Data Access Layer: Spring Data JPA Repositories (Hibernate ORM 6.x)           |\n"
        "+-----------------------------------------------------------------------------------+\n"
        "                                          |\n"
        "                            JDBC / MySQL Connector/J\n"
        "                                          |\n"
        "+-----------------------------------------------------------------------------------+\n"
        "|                       3. DATA PERSISTENCE TIER (DATABASE)                         |\n"
        "|   MySQL Server 8.0: Relational Tables (users, destinations, bookings)             |\n"
        "|   InnoDB Storage Engine • Foreign Keys • Auto-Increment PKs • ACID Transactions   |\n"
        "+-----------------------------------------------------------------------------------+"
    )
    add_code_block(arch_diagram)

    add_h2("3.2 Technology Stack Justification")
    add_bullet("Vanilla JavaScript (ES6+) vs Frontend Frameworks:", "To guarantee lightweight execution, zero build-step overhead, rapid initial page loads, and native DOM manipulation without heavy virtual-DOM abstraction.")
    add_bullet("Spring Boot 3.x (Java 17):", "Provides an enterprise-grade, strongly typed, microservice-ready backend. Features embedded Tomcat server, declarative transaction management, and automatic JSON serialization via Jackson.")
    add_bullet("Spring Data JPA & Hibernate ORM:", "Abstracts relational database interactions, providing Object-Relational Mapping, automated schema migration (ddl-auto=update), and protection against SQL injection via prepared statements.")
    add_bullet("MySQL Server 8.0:", "Selected for robust ACID compliance, proven relational indexing performance, foreign key constraint enforcement, and multi-user concurrency control.")

    add_h2("3.3 RESTful API Specification")
    add_p("The backend exposes a structured RESTful interface adhering to standard HTTP verbs and status codes:")

    api_headers = ["HTTP Verb", "API Endpoint", "Request Body / Params", "Response & Status Code"]
    api_rows = [
        ("POST", "/api/users/register", "{ fullName, email, password }", "201 Created (Saved User object) / 400 Bad Request"),
        ("POST", "/api/users/login", "{ email, password }", "200 OK (User object) / 401 Unauthorized"),
        ("GET", "/api/destinations", "None", "200 OK (Array of all 60 destinations)"),
        ("GET", "/api/destinations/{id}", "id: Long (Path Variable)", "200 OK (Destination object) / 404 Not Found"),
        ("POST", "/api/bookings", "BookingRequest (JSON with all itinerary params)", "201 Created (Saved Booking with ID, Txn ID, Status)"),
        ("GET", "/api/bookings/user/{userId}", "userId: Long (Path Variable)", "200 OK (Array of user's bookings)"),
        ("PUT", "/api/bookings/{id}", "id: Long, BookingRequest (Updated fields)", "200 OK (Updated Booking) / 400 Bad Request / 404"),
        ("DELETE", "/api/bookings/{id}", "id: Long (Path Variable)", "200 OK ('Booking successfully canceled') / 404")
    ]
    create_styled_table(doc, api_headers, api_rows)

    doc.add_page_break()

    # =============================================================
    # CHAPTER 4: DATABASE DESIGN & DATA MODELING
    # =============================================================
    add_h1("Chapter 4: Database Design & Data Modeling")

    add_h2("4.1 Conceptual Data Model & Entity Relationships")
    add_p(
        "The relational schema is structured around three primary entities in Third Normal Form (3NF). "
        "Transitive dependencies are eliminated, and all non-key attributes are fully functionally dependent on primary keys:"
    )
    add_bullet("Users Entity (1 : N with Bookings):", "One registered traveler can place zero, one, or multiple tour reservations over time. Deleting a user cascades to remove associated historical bookings.")
    add_bullet("Destinations Entity (1 : N with Bookings):", "One travel destination can be booked across many itineraries by multiple travelers. Destinations retain master geographic and baseline ticket fee data.")
    add_bullet("Bookings Entity (Child Transaction Entity):", "Contains foreign keys referencing `users(id)` and `destinations(id)`, along with itemized operational breakdown costs, travel logistics, and payment transaction metadata.")

    add_h2("4.2 Comprehensive Data Dictionary")

    # Table 1: users
    add_h3("Table 4.1: Data Dictionary for `users` Table")
    u_headers = ["Column Name", "Data Type", "Constraints", "Default", "Description"]
    u_rows = [
        ("id", "BIGINT", "PK, AUTO_INCREMENT, NOT NULL", "None", "Surrogate unique identifier for traveler account"),
        ("full_name", "VARCHAR(255)", "NOT NULL", "None", "Full legal name of lead traveler"),
        ("email", "VARCHAR(255)", "UNIQUE, NOT NULL", "None", "Electronic mail address utilized as authentication username"),
        ("password", "VARCHAR(255)", "NOT NULL", "None", "Account authentication credential"),
        ("role", "VARCHAR(50)", "NOT NULL", "'USER'", "Role designation ('USER' or 'ADMIN')")
    ]
    create_styled_table(doc, u_headers, u_rows)

    doc.add_paragraph()

    # Table 2: destinations
    add_h3("Table 4.2: Data Dictionary for `destinations` Table")
    d_headers = ["Column Name", "Data Type", "Constraints", "Default", "Description"]
    d_rows = [
        ("id", "BIGINT", "PK, AUTO_INCREMENT, NOT NULL", "None", "Unique destination identifier"),
        ("name", "VARCHAR(255)", "NOT NULL", "None", "Official title of tourist destination / sanctuary"),
        ("description", "TEXT", "NULLABLE", "None", "Comprehensive geographic and historical overview"),
        ("location", "VARCHAR(255)", "NULLABLE", "None", "Province or district (e.g., Central Province)"),
        ("category", "VARCHAR(50)", "NOT NULL", "None", "Enum: HERITAGE, NATURE, WILDLIFE, BEACH, HILL_COUNTRY"),
        ("rating", "DOUBLE", "NOT NULL", "5.0", "Visitor review rating (1.0 to 5.0)"),
        ("ticket_price", "DOUBLE", "NOT NULL", "0.0", "Baseline foreign tourist entrance fee in LKR"),
        ("image_url", "VARCHAR(500)", "NULLABLE", "None", "Path to local or remote high-resolution photography asset"),
        ("distance_km", "INT", "NOT NULL", "0", "One-way driving distance from Colombo city center in km"),
        ("travel_time", "VARCHAR(100)", "NULLABLE", "None", "Estimated chauffeur travel duration via expressway/highways")
    ]
    create_styled_table(doc, d_headers, d_rows)

    doc.add_paragraph()

    # Table 3: bookings
    add_h3("Table 4.3: Data Dictionary for `bookings` Table")
    b_headers = ["Column Name", "Data Type", "Constraints", "Default", "Description"]
    b_rows = [
        ("id", "BIGINT", "PK, AUTO_INCREMENT, NOT NULL", "None", "Unique booking voucher number"),
        ("user_id", "BIGINT", "FK -> users(id), NOT NULL", "None", "Foreign key linking lead traveler"),
        ("destination_id", "BIGINT", "FK -> destinations(id), NOT NULL", "None", "Foreign key linking booked destination"),
        ("booking_date", "DATE", "NOT NULL", "CURDATE()", "System transaction date"),
        ("travel_date", "VARCHAR(50)", "NOT NULL", "None", "Scheduled journey target date"),
        ("quantity", "INT", "NOT NULL, CHECK (quantity >= 1)", "1", "Number of passengers / entry passes"),
        ("pickup_location", "VARCHAR(255)", "NULLABLE", "'Colombo Hotel'", "Departure location in Colombo/Airport"),
        ("vehicle_type", "VARCHAR(100)", "NULLABLE", "'None'", "Vehicle category (Sedan, Van, Coach, None)"),
        ("guide_type", "VARCHAR(100)", "NULLABLE", "'Chauffeur'", "Guide classification (Chauffeur, SLTDA, Multilingual)"),
        ("meal_plan", "VARCHAR(100)", "NULLABLE", "'No Meals'", "Meal arrangement (B&B, Half Board, Full Board)"),
        ("hotel_name", "VARCHAR(100)", "NULLABLE", "'Day Tour'", "Accommodation tier (Day Tour, 3-Star, 4-Star, 5-Star)"),
        ("payment_method", "VARCHAR(50)", "NULLABLE", "'Visa'", "Selected gateway mode (Visa, Mastercard, PayPal, Pay on Arrival)"),
        ("payment_status", "VARCHAR(50)", "NOT NULL", "'PAID'", "Status: 'PAID' or 'PENDING_ARRIVAL'"),
        ("transaction_id", "VARCHAR(100)", "NULLABLE", "None", "Bank/gateway reference (e.g. TXN-LS-2026-XXXX)")
    ]
    create_styled_table(doc, b_headers, b_rows)

    doc.add_page_break()

    # =============================================================
    # CHAPTER 5: TECHNICAL IMPLEMENTATION & OPERATIONAL FEATURES
    # =============================================================
    add_h1("Chapter 5: Technical Implementation & Operational Features")

    add_h2("5.1 User Authentication & Session State Management")
    add_p(
        "User registration and login are implemented through REST endpoints (`/api/users/register` and `/api/users/login`). "
        "Upon successful verification, user credentials and authentication tokens are retained in the browser's `localStorage`. "
        "The navigation bar dynamically transforms: anonymous visitors see a 'Login' pill, while authenticated travelers receive a "
        "custom avatar icon displaying their capitalized initial, personalized greeting, and a dropdown menu providing one-click "
        "access to 'My Bookings' and a safe 'Logout' function."
    )

    add_h2("5.2 Destination Discovery & Exploration Engine")
    add_p(
        "The homepage (`index.html`) serves as an interactive exploration portal. On document ready, a dynamic Fetch API request "
        "queries `GET /api/destinations`. The application renders 60 authentic destination cards structured into 5 tourist themes: "
        "Heritage, Nature, Wildlife, Beach, and Hill Country. Each destination card incorporates:"
    )
    add_bullet("Visual Media Showcase:", "Optimized high-resolution photography with hover zoom effects.")
    add_bullet("Colombo Route Badge:", "Displays driving duration and route path (e.g., '3.5 hrs via Central Expressway').")
    add_bullet("Key Metrics Tagging:", "Distance from Colombo (km), star rating (e.g. 5.0), and baseline ticket price in LKR.")
    add_bullet("Live Clock & Weather Widget:", "A real-time ticking Sri Lanka Standard Time (SLST) clock and Colombo weather indicator.")

    add_h2("5.3 Algorithmic Tour Package Pricing & Logistics Engine")
    add_p(
        "Unlike generic ticketing portals, LankaScape features an authentic Colombo Inbound Logistics Engine. "
        "When a traveler selects an attraction, the system calculates package components according to mathematical formulas:"
    )
    add_p(
        "Total Package Price (LKR) = Ticket Subtotal + Transport Subtotal + Guide Subtotal + Meal Subtotal + Hotel Subtotal",
        bold_prefix="Mathematical Formula: "
    )
    add_bullet("1. Entry Ticket Subtotal:", "Computed as Passenger Count (Pax) multiplied by Destination Baseline Ticket Price.")
    add_bullet("2. Private Roundtrip Transport from Colombo:", "Calculated on vehicle tier and distance from Colombo. Includes fuel, expressway toll tariffs, and chauffeur allowance: Private AC Sedan (1-3 Pax: Rs. 24,000 - 38,000), Luxury KDH High-Roof Van (4-8 Pax: Rs. 33,000 - 52,000), Tourist Mini Coach (9-15 Pax: Rs. 47,000 - 75,000).")
    add_bullet("3. Dedicated Tourist Guide:", "Tourist Chauffeur Only (Included with vehicle at Rs. 0), SLTDA Licensed English Guide (+Rs. 6,000), Multilingual Specialist (German/French/Russian/Japanese: +Rs. 9,500).")
    add_bullet("4. Ceylon Dining Plan:", "No Meal Plan (Rs. 0), Bed & Breakfast (Ceylon Tea + Breakfast: Rs. 2,500/pax), Half Board (Breakfast + 3-Course Dinner: Rs. 5,500/pax), Full Board All-Inclusive (Village Lunch Buffet + Dinner: Rs. 8,500/pax).")
    add_bullet("5. Accommodation Tier:", "Day Tour (Rs. 0), 3-Star Boutique Hotel (+Rs. 10,000), 4-Star Deluxe Resort (Jetwing/Cinnamon: +Rs. 18,000), 5-Star Luxury Heritage Resort (Shangri-La/Heritance: +Rs. 28,000).")

    add_h2("5.4 Commercial Customer Payment Gateway Integration")
    add_p(
        "To provide a bank-grade checkout experience, LankaScape implements three distinct payment workflows:"
    )
    add_bullet("Credit / Debit Card Checkout (Visa, Mastercard, Amex):", "Triggers an interactive modal rendering a realistic visual card preview. Numbers format dynamically with 4-digit spacing (•••• •••• •••• ••••), card brands are detected live (Visa for prefix '4', Mastercard for prefix '5'), and a 1-Click Test Demo Card button enables instant sandbox testing. Clicking 'Pay Now' simulates a 3D-Secure 2.0 LankaPay bank authorization, approves the payment, generates a transaction ID (e.g. `TXN-LS-XXXX`), and records status as PAID.")
    add_bullet("PayPal Express ($ USD Checkout):", "Converts total LKR into USD equivalent (~$XX USD) using current exchange rates, simulating instant foreign currency approval under reference `PP-TXN-XXXX`.")
    add_bullet("Pay on Arrival / Cash to Chauffeur:", "Instantly reserves the itinerary without immediate deduction under reference `POA-REF-XXXX` with status `PENDING_ARRIVAL`. A dedicated 'Pay Online' button on the traveler's dashboard permits subsequent card settlement anytime prior to journey departure.")

    add_h2("5.5 Reservation Lifecycle Management Dashboard (CRUD)")
    add_p(
        "The 'My Bookings' page (`my-bookings.html`) functions as an interactive mission-control dashboard for travelers:"
    )
    add_bullet("Dashboard Metrics Cards:", "Displays aggregate summary figures for 'Total Trips Booked' and 'Total Expenditure (LKR)'.")
    add_bullet("Real-Time Search Engine:", "A dynamic search bar matching substrings across destination names, hotel accommodations, booking reference numbers, and transaction IDs.")
    add_bullet("Multi-Criteria Filtering Engine:", "Two simultaneous filter dropdowns: Accommodation Filter (All, With Hotel, Tickets Only) and Payment Status Filter (All, Paid in Full, Pay on Arrival).")
    add_bullet("Multi-Attribute Sorting Engine:", "Permits ordering itineraries by Travel Date (Latest/Earliest), Total Price (High to Low / Low to High), and Passenger Count.")
    add_bullet("Itinerary Editing (UPDATE):", "An interactive modal permitting travelers to modify travel dates, passenger counts, pickup points, vehicles, guides, meal plans, and accommodations with real-time recalculation.")
    add_bullet("Safe Cancellation (DELETE):", "Invokes a SweetAlert2 confirmation dialog. Upon confirmation, transmits an HTTP DELETE request to Spring Boot, which executes a persistent SQL delete and decrements dashboard metrics.")

    add_h2("5.6 Printable High-Resolution A4 Tour E-Voucher & Dynamic QR Code")
    add_p(
        "Clicking 'Print Voucher' opens a dedicated, print-optimized document utilizing CSS `@page { size: A4 portrait }` formatting. "
        "The voucher incorporates LankaScape corporate credentials, SLTDA license registration (`SLTDA/SQA/PRO/2026/0488`), full passenger details, "
        "an itemized financial table, an official Payment Stamp (`PAID IN FULL • TXN-LS-...` vs `DUE ON ARRIVAL`), and an authentic dynamic "
        "scannable QR code generated through QRServer API encoding verified reservation metadata."
    )

    doc.add_page_break()

    # =============================================================
    # CHAPTER 6: VALIDATION, ERROR HANDLING & TESTING
    # =============================================================
    add_h1("Chapter 6: Validation, Error Handling & System Testing")

    add_h2("6.1 Dual-Tier Validation Architecture")
    add_p(
        "Data integrity is guarded via complementary client-side and server-side validation filters:"
    )
    add_bullet("Client-Side Form Constraints:", "HTML5 `min` attributes prevent selecting past travel dates. Passenger counters enforce 1 <= pax <= 50. Credit card inputs validate 16 numeric digits with Luhn-compatible formatting, MM/YY expiration regex, and 3-digit CVV checks. Registration forms validate email syntax and confirm password matching.")
    add_bullet("Server-Side Spring Boot Constraints:", "In `BookingController.java`, if `quantity <= 0` or `travelDate` is blank, the server rejects the request with HTTP `400 Bad Request`. Foreign key entities (`User` and `Destination`) are verified against MySQL repositories; if either is absent, HTTP `404 Not Found` is returned. Component pricing is recomputed server-side, preventing DOM-level price tampering.")

    add_h2("6.2 Test Case Specifications & Verification Results")
    add_p("Comprehensive testing was conducted across all operational layers:")

    test_headers = ["Test Case ID", "Test Scenario & Input", "Expected System Outcome", "Verification Result"]
    test_rows = [
        ("TC-01", "Submit tour package with past travel date", "Client blocks date selection; server returns 400 Bad Request if bypassed", "PASSED (Integrity Preserved)"),
        ("TC-02", "Submit booking with Card Payment", "Card modal validates 16 digits, 3D-Secure approves, record saved as PAID", "PASSED (TXN ID Generated)"),
        ("TC-03", "Submit booking with Pay on Arrival", "Instant reservation created with status PENDING_ARRIVAL and POA reference", "PASSED (Status Accurate)"),
        ("TC-04", "Execute 'Pay Online' on pending booking", "Opens card modal, approves payment, executes PUT request, status updates to PAID", "PASSED (Dynamic State Transition)"),
        ("TC-05", "Live search by Booking ID '#BK-12'", "Dashboard filters in real time, isolating only matching booking card", "PASSED (Instantaneous Query)"),
        ("TC-06", "Cancel confirmed booking", "Confirmation dialog displayed, DELETE API executed, record erased from MySQL", "PASSED (Database Cascade Clean)")
    ]
    create_styled_table(doc, test_headers, test_rows)

    # =============================================================
    # CHAPTER 7: DISCUSSION & FUTURE ENHANCEMENTS
    # =============================================================
    add_h1("Chapter 7: Discussion & Future Enhancements")

    add_h2("7.1 Technical Achievements")
    add_p(
        "LankaScape demonstrates an end-to-end full-stack software development workflow. By bridging client-side asynchronous "
        "rendering with an enterprise Java Spring Boot backend and persistent MySQL storage, the platform meets the highest standards "
        "of web software engineering. The modular separation allows rapid extensibility without architectural rework."
    )

    add_h2("7.2 Limitations & Future Recommendations")
    add_p("The following enhancements are recommended for future commercial iterations:")
    add_bullet("1. Real Payment Gateway Webhooks:", "Upgrading the simulated 3D-Secure LankaPay gateway to live production merchant APIs (e.g., PayHere Sri Lanka, Stripe Connect, or Commercial Bank IPG) with asynchronous webhook listener reconciliation.")
    add_bullet("2. Real-Time Foreign Exchange (FX) Feeds:", "Connecting to the Central Bank of Sri Lanka (CBSL) open API to fetch live daily USD/EUR/GBP exchange rates for dynamic currency conversion.")
    add_bullet("3. Chauffeur GPS Tracking & Dispatch:", "Integrating Google Maps Directions and Distance Matrix APIs for live GPS tracking of tourist vehicles and automated WhatsApp booking dispatch to chauffeurs.")

    # =============================================================
    # CHAPTER 8: CONCLUSION & ACADEMIC DECLARATION
    # =============================================================
    add_h1("Chapter 8: Conclusion & Academic Declaration")
    add_p(
        "The LankaScape Tourism E-Ticketing & Inbound Tour Operator Web Application has been successfully designed, implemented, "
        "and validated in full fulfillment of the EE4207 Web Application Development coursework requirements. The application achieves "
        "flawless persistent database integration across MySQL, complete CRUD operations, robust dual-tier validation, an authentic "
        "commercial payment gateway, and an intuitive user interface."
    )
    add_p(
        "I hereby declare that this technical report and the accompanying software codebase represent my own original design, "
        "engineering, and implementation. All external software libraries, open-source frameworks, and graphic assets utilized have been "
        "properly acknowledged and referenced in accordance with university academic integrity standards.",
        bold_prefix="Academic Integrity Declaration: "
    )

    doc.add_paragraph("\n")
    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(20)
    r_sig = p_sig.add_run("Student Signature: .................................................                   Date: 28th October 2026")
    r_sig.font.name = 'Calibri'
    r_sig.font.size = Pt(10)
    r_sig.font.color.rgb = c_muted

    # Save
    primary_out = r"F:\Tourism Project\EE4207_Mini_Project_Report_LankaScape.docx"
    alt_out = r"F:\Tourism Project\LankaScape_Project_Report_Final.docx"
    
    saved_paths = []
    # Try alt_out first so user always gets the brand new file ready even if primary is locked
    try:
        doc.save(alt_out)
        saved_paths.append(alt_out)
    except Exception as e:
        print("Error saving alt:", e)

    try:
        doc.save(primary_out)
        saved_paths.append(primary_out)
    except PermissionError:
        print(f"Notice: {primary_out} is currently open in Microsoft Word. Saved to {alt_out} instead.")
    except Exception as e:
        print("Error saving primary:", e)

    print("Report generated successfully:", saved_paths)

if __name__ == "__main__":
    generate_report()
