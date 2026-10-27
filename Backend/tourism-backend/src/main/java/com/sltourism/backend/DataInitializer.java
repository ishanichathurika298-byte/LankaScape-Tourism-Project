package com.sltourism.backend;

import com.sltourism.backend.model.Destination;
import com.sltourism.backend.repository.DestinationRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DestinationRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(DestinationRepository repository, JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        // Automatically ensure bookings table has required columns
        try {
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN hotel_name VARCHAR(255)");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN payment_method VARCHAR(255)");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN travel_date VARCHAR(255)");
        } catch (Exception ignored) {}

        // Automatically ensure destinations table has category, location, and rating columns
        try {
            jdbcTemplate.execute("ALTER TABLE destinations ADD COLUMN category VARCHAR(100)");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("ALTER TABLE destinations ADD COLUMN location VARCHAR(150)");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("ALTER TABLE destinations ADD COLUMN rating DOUBLE DEFAULT 4.8");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("ALTER TABLE destinations ADD COLUMN distance_km INT DEFAULT 150");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("ALTER TABLE destinations ADD COLUMN travel_time VARCHAR(150) DEFAULT '3.5 hrs drive'");
        } catch (Exception ignored) {}

        // Ensure new tour package columns in bookings
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN pickup_location VARCHAR(255)"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN vehicle_type VARCHAR(100)"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN guide_type VARCHAR(100)"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN meal_plan VARCHAR(100)"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN ticket_cost DOUBLE"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN transport_cost DOUBLE"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN guide_cost DOUBLE"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN meal_cost DOUBLE"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN hotel_cost DOUBLE"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(50) DEFAULT 'PAID'"); } catch (Exception ignored) {}
        try { jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN transaction_id VARCHAR(100)"); } catch (Exception ignored) {}

        // Populate distance from Colombo and travel time for destinations
        updateDistancesFromColombo();

        if (repository.count() < 50) {
            repository.deleteAll();

            Destination d1 = createDest("Anuradhapura Sacred City", "Ancient first capital of Sri Lanka featuring world-renowned sacred Bodhi tree, towering white dagobas, and monastic ruins.", 4500.0, "images/Gemini_Generated_Image_4izb0w4izb0w4izb.jpg", "HERITAGE", "Cultural Triangle", 4.9);
            Destination d2 = createDest("Arugam Bay", "World-famous moon-shaped surfing bay on the sunny east coast known for right-hand point breaks and vibrant beach culture.", 2000.0, "images/Gemini_Generated_Image_bmq46ybmq46ybmq4.jpg", "BEACH", "East Coast", 4.8);
            Destination d3 = createDest("Bentota Beach & Watersports", "Golden sand coastal paradise famed for water sports, jet skiing, turtle hatcheries, and peaceful mangrove river safaris.", 2500.0, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop", "BEACH", "Southern Coast", 4.7);
            Destination d4 = createDest("Colombo Lotus Tower & City", "Iconic 350-meter lotus landmark overlooking the Indian Ocean, offering modern observation decks and urban skyline panoramas.", 3000.0, "images/Gemini_Generated_Image_ayq0ttayq0ttayq0.jpg", "URBAN", "Western Coast", 4.8);
            Destination d5 = createDest("Dambulla Royal Cave Temple", "UNESCO World Heritage rock monastery comprising five painted sanctuaries with 153 historic statues and ceiling frescoes.", 2000.0, "images/Gemini_Generated_Image_zb6g60zb6g60zb6g.jpg", "HERITAGE", "Cultural Triangle", 4.8);
            Destination d6 = createDest("Ella Nine Arches Bridge", "Colonial engineering marvel standing 24 meters high amidst emerald tea plantations, misty valleys, and waterfall hikes.", 1500.0, "Gemini_Generated_Image_hw37c2hw37c2hw37.jpg", "HILL COUNTRY", "Hill Country", 4.9);
            Destination d7 = createDest("Galle Dutch Fort & Ramparts", "Living 17th-century fortified citadel with cobblestone pathways, colonial mansions, boutiques, and an iconic lighthouse.", 2000.0, "images/Gemini_Generated_Image_dzun11dzun11dzun.jpg", "HERITAGE", "Southern Coast", 4.9);
            Destination d8 = createDest("Hikkaduwa Coral Reef Sanctuary", "Lively beach town famous for colorful shallow coral gardens, sea turtles swimming ashore, and seaside dining.", 2000.0, "images/Gemini_Generated_Image_vij1bvij1bvij1bv.jpg", "BEACH", "Southern Coast", 4.8);
            Destination d9 = createDest("Horton Plains & World's End", "Protected misty national park featuring lush cloud forests, wild sambar deer, Baker's Falls, and an 880m sheer cliff drop.", 4500.0, "images/Gemini_Generated_Image_8lo60p8lo60p8lo6.jpg", "NATURE", "Hill Country", 4.9);
            Destination d10 = createDest("Jaffna Nallur Kandaswamy Kovil", "Grand Dravidian Hindu temple complex featuring towering golden gopurams, brass lamps, and rich northern cultural festivals.", 1000.0, "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop", "HERITAGE", "Northern Peninsula", 4.8);
            Destination d11 = createDest("Kandy Temple of the Sacred Tooth", "Sri Dalada Maligawa, venerated Buddhist sanctuary in the royal hill capital enshrining the sacred relic of the Buddha.", 2000.0, "Gemini_Generated_Image_uva5fuuva5fuuva5.jpg", "HERITAGE", "Hill Country", 4.9);
            Destination d12 = createDest("Mirissa Beach & Whale Watching", "Scenic southern palm-fringed bay renowned worldwide for early morning expeditions to encounter majestic Blue Whales.", 3500.0, "images/Gemini_Generated_Image_iyt9wtiyt9wtiyt9.jpg", "BEACH", "Southern Coast", 4.8);
            Destination d13 = createDest("Nuwara Eliya Tea Country", "Charming highland plateau nicknamed Little England, enveloped by cool mountain mist, rose gardens, and Ceylon tea estates.", 1500.0, "images/Gemini_Generated_Image_fxmyi0fxmyi0fxmy.jpg", "HILL COUNTRY", "Hill Country", 4.8);
            Destination d14 = createDest("Pigeon Island National Marine Park", "Pristine coastal island sanctuary near Trincomalee offering world-class snorkeling with live coral reefs and blacktip reef sharks.", 3500.0, "images/Gemini_Generated_Image_nhd08jnhd08jnhd0.jpg", "BEACH", "East Coast", 4.8);
            Destination d15 = createDest("Polonnaruwa Ancient Kingdom", "Medieval royal capital featuring monumental stone-carved Buddha figures at Gal Vihara, lotus baths, and ancient palaces.", 4000.0, "images/gal viaharaya.jpg", "HERITAGE", "Cultural Triangle", 4.9);
            Destination d16 = createDest("Sigiriya Lion Rock Fortress", "Ancient palace fortress atop a towering 200m volcanic rock outcrop, famous for 5th-century frescoes and landscaped water gardens.", 5000.0, "Gemini_Generated_Image_bj9v1kbj9v1kbj9v.jpg", "HERITAGE", "Cultural Triangle", 5.0);
            Destination d17 = createDest("Sinharaja Rainforest Reserve", "UNESCO Biosphere Reserve safeguarding Sri Lanka's last extensive virgin tropical rainforest with rare endemic bird species.", 3000.0, "images/sinharaja.jpg", "NATURE", "Sabaragamuwa Province", 4.9);
            Destination d18 = createDest("Trincomalee Nilaveli Beach", "Stunning untouched coastline with tranquil crystal-clear waters, soft white sands, and the cliffside Koneswaram Kovil.", 2000.0, "images/Gemini_Generated_Image_rlxev5rlxev5rlxe.jpg", "BEACH", "East Coast", 4.8);
            Destination d19 = createDest("Unawatuna Beach & Jungle Bay", "Calm horseshoe bay sheltered by coral reefs, ideal for family swimming, seaside sunset dining, and hidden jungle coves.", 1500.0, "images/Unawatuna Beach & Jungle Bay.jpg", "BEACH", "Southern Coast", 4.7);
            Destination d20 = createDest("Wilpattu National Park", "Oldest and largest national park in Sri Lanka, distinguished by natural sand-rimmed lakes (Villus) and majestic leopard safaris.", 7500.0, "images/Wilpattu National Park Safari.jpg", "WILDLIFE", "North Western Province", 4.8);
            Destination d21 = createDest("Yala National Park Leopard Safari", "Premier wildlife reserve on the southern coastline boasting the highest leopard density on earth alongside wild elephants.", 8000.0, "images/Gemini_Generated_Image_gwqp6ugwqp6ugwqp.jpg", "WILDLIFE", "Southern Province", 4.9);

            repository.saveAll(Arrays.asList(
                d1, d2, d3, d4, d5, d6, d7, d8, d9, d10,
                d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21
            ));
            System.out.println("21 Curated A to Z Destinations loaded successfully!");
        }
    }

    private Destination createDest(String name, String desc, Double price, String img, String cat, String loc, Double rating) {
        Destination d = new Destination();
        d.setName(name);
        d.setDescription(desc);
        d.setTicketPrice(price);
        d.setImageUrl(img);
        d.setCategory(cat);
        d.setLocation(loc);
        d.setRating(rating);
        d.setDistanceKm(150);
        d.setTravelTime("3.5 hrs drive");
        return d;
    }

    private void updateDistancesFromColombo() {
        try {
            updateDist("Sigiriya%", 175, "3.5 hrs via Central Expressway");
            updateDist("Anuradhapura%", 205, "4.0 hrs via A28 Highway");
            updateDist("Kandy%", 115, "3.0 hrs via Colombo-Kandy Rd");
            updateDist("Galle%", 125, "2.0 hrs via Southern Expressway");
            updateDist("Bentota%", 80, "1.5 hrs via Southern Expressway");
            updateDist("Hikkaduwa%", 110, "1.8 hrs via Southern Expressway");
            updateDist("Mirissa%", 150, "2.5 hrs via Southern Expressway");
            updateDist("Unawatuna%", 130, "2.0 hrs via Southern Expressway");
            updateDist("Weligama%", 145, "2.2 hrs via Southern Expressway");
            updateDist("Tangalle%", 195, "2.8 hrs via Southern Expressway");
            updateDist("Yala%", 260, "4.0 hrs via Southern Expressway");
            updateDist("Udawalawe%", 165, "3.5 hrs via Pelmadulla");
            updateDist("Wilpattu%", 180, "3.5 hrs via Puttalam");
            updateDist("Bundala%", 245, "3.8 hrs via Southern Expressway");
            updateDist("Nuwara Eliya%", 160, "4.5 hrs via Gampola");
            updateDist("Ella%", 205, "5.0 hrs via Southern Expressway");
            updateDist("Horton Plains%", 175, "5.0 hrs via Nuwara Eliya");
            updateDist("Adam's Peak%", 140, "4.0 hrs via Hatton");
            updateDist("Ambuluwawa%", 120, "3.2 hrs via Gampola");
            updateDist("Dambulla%", 160, "3.0 hrs via Central Expressway");
            updateDist("Polonnaruwa%", 220, "4.5 hrs via Habarana");
            updateDist("Pigeon Island%", 265, "5.5 hrs via Dambulla");
            updateDist("Trincomalee%", 265, "5.5 hrs via Dambulla");
            updateDist("Arugam Bay%", 320, "6.5 hrs via Monaragala");
            updateDist("Jaffna%", 395, "7.5 hrs via A9 Highway");
            updateDist("Sinharaja%", 140, "3.5 hrs via Kalawana");
            updateDist("Colombo%", 5, "25 mins (Colombo City)");
            updateDist("Bambarakanda%", 200, "4.5 hrs via Beragala");
            updateDist("Babaragala%", 135, "3.5 hrs via Kandy");
            updateDist("Yapahuwa%", 145, "3.0 hrs via Kurunegala");
            updateDist("Kitulgala%", 90, "2.5 hrs via Avissawella");
            updateDist("Pinnawala%", 90, "2.0 hrs via Central Expressway");
            updateDist("Minneriya%", 185, "3.8 hrs via Habarana");
            updateDist("Pasikuda%", 290, "6.0 hrs via Polonnaruwa");
            updateDist("Kalpitiya%", 165, "3.5 hrs via Puttalam");
            updateDist("Mannar%", 310, "5.5 hrs via Medawachchiya");

            // Fallback for any without distance
            jdbcTemplate.execute("UPDATE destinations SET distance_km = 160, travel_time = '3.5 hrs drive' WHERE distance_km IS NULL OR distance_km = 0");
        } catch (Exception e) {
            System.err.println("Note on distance initialization: " + e.getMessage());
        }
    }

    private void updateDist(String namePattern, int km, String time) {
        try {
            jdbcTemplate.update("UPDATE destinations SET distance_km = ?, travel_time = ? WHERE name LIKE ?", km, time, namePattern);
        } catch (Exception ignored) {}
    }
}
