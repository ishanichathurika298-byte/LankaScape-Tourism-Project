-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: tourism_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `tourism_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `tourism_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `tourism_db`;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `destination_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `quantity` int NOT NULL,
  `total_price` double DEFAULT NULL,
  `hotel_name` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `travel_date` varchar(255) DEFAULT NULL,
  `guide_cost` double DEFAULT NULL,
  `guide_type` varchar(255) DEFAULT NULL,
  `hotel_cost` double DEFAULT NULL,
  `meal_cost` double DEFAULT NULL,
  `meal_plan` varchar(255) DEFAULT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `ticket_cost` double DEFAULT NULL,
  `transport_cost` double DEFAULT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `destination_id` (`destination_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (9,1,51,'2026-10-27',2,75000,'4-Star Deluxe Resort (Jetwing / Cinnamon)','Visa','2026-11-15',6000,'SLTDA Licensed English Guide',18000,17000,'Full Board All-Inclusive','Colombo City Hotel (Cinnamon / Shangri-La / Galle Face / Hilton)',10000,24000,'Private AC Sedan (1-3 Pax)','PAID','TXN-LS-MVQY8SNC-GQZL4D'),(10,1,1,'2026-10-27',2,32000,'4-Star Deluxe Resort (Jetwing / Cinnamon)','Visa','2026-11-03',6000,'SLTDA Licensed English Guide',18000,5000,'Bed & Breakfast','Mount Lavinia Beach Hotel',3000,0,'None','PAID','TXN-LS-2026-0010'),(12,1,15,'2026-10-27',1,25500,'3-Star Boutique Hotel','Mastercard','2026-10-27',6000,'SLTDA Licensed English Guide',10000,8500,'Full Board All-Inclusive','Mount Lavinia Beach Hotel',1000,0,'None','PAID','TXN-LS-2026-0012'),(15,1,44,'2026-10-27',1,72000,'None','Visa','2026-10-27',0,'None (Chauffeur Guide)',0,0,'No Meal Plan','Colombo City Hotel (Cinnamon / Shangri-La / Galle Face / Hilton)',3500,68500,'Private AC Sedan (1-3 Pax)','PAID','TXN-LS-MVQYIM7S-V2QGCW'),(16,1,51,'2026-10-28',1,54500,'None','Visa','2026-10-28',0,'None (Chauffeur Guide)',0,0,'No Meal Plan','Colombo City Hotel (Cinnamon / Shangri-La / Galle Face / Hilton)',5000,49500,'Private AC Sedan (1-3 Pax)','PAID','TXN-LS-MVRUBYEX-99P5EC');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `ticket_price` double DEFAULT NULL,
  `image_url` text,
  `category` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `rating` double DEFAULT '4.8',
  `distance_km` int DEFAULT NULL,
  `travel_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinations`
--

LOCK TABLES `destinations` WRITE;
/*!40000 ALTER TABLE `destinations` DISABLE KEYS */;
INSERT INTO `destinations` VALUES (1,'Adam\'s Peak (Sri Pada)','Sacred 2,243m mountain summit revered across faiths for the sacred footprint relic, ancient nocturnal pilgrimages, and sunrises above cloud oceans.',1500,'images/Gemini_Generated_Image_htcsxahtcsxahtcs.jpg','NATURE','Sabaragamuwa Province',4.9,140,'4.0 hrs via Hatton'),(2,'Ambuluwawa Biodiversity Tower','Unique multi-religious biodiversity complex in Gampola featuring a spiral narrow white summit tower offering breathtaking 360-degree mountain panoramas.',1200,'images/ambuluwawa-tower-is-the.jpg','HILL COUNTRY','Central Province',4.8,120,'3.2 hrs via Gampola'),(3,'Anuradhapura Sacred City','Ancient first capital of Sri Lanka featuring world-renowned sacred Bodhi tree, colossal white dagobas (Ruwanwelisaya), and historic monastic ruins.',4500,'images/Gemini_Generated_Image_4izb0w4izb0w4izb.jpg','HERITAGE','Cultural Triangle',4.9,205,'4.0 hrs via A28 Highway'),(4,'Arugam Bay Surf Beach','World-famous moon-shaped surfing inlet on the sunny east coast renowned internationally for right-hand point breaks, relaxed cafes, and lagoon boat safaris.',2000,'images/Gemini_Generated_Image_bmq46ybmq46ybmq4.jpg','BEACH','East Coast',4.8,320,'6.5 hrs via Monaragala'),(5,'Babaragala Rock Cave Temple','Serene ancient rock cave hermitage in Teldeniya featuring historic reclined Buddha statues, inscriptions, and quiet mountain viewpoints.',1000,'images/babaragala.jpg','HERITAGE','Central Highlands',4.7,135,'3.5 hrs via Kandy'),(6,'Bambarakanda Waterfalls','The tallest waterfall in Sri Lanka plunging 263 meters through high pine forests, mist-shrouded gorges, and scenic hiking trails.',1000,'images/babarakanda.jpg','NATURE','Badulla District',4.8,200,'4.5 hrs via Beragala'),(7,'Bentota Beach & Watersports','Golden sand coastal paradise famed for water sports, jet skiing, turtle conservation hatcheries, and peaceful Madu River mangrove safaris.',2500,'images/bentota-beach.jpg','BEACH','Southern Coast',4.7,80,'1.5 hrs via Southern Expressway'),(8,'Bundala National Wetland Park','UNESCO biosphere reserve and Ramsar wetland home to thousands of migratory greater flamingos, waterbirds, and coastal elephants.',5000,'images/bundala nati.jpg','WILDLIFE','Southern Province',4.8,245,'3.8 hrs via Southern Expressway'),(9,'Colombo Lotus Tower & City','Iconic 350-meter lotus landmark overlooking the Indian Ocean, offering modern observation decks, illuminated night displays, and urban skyline views.',3000,'images/Gemini_Generated_Image_ayq0ttayq0ttayq0.jpg','URBAN','Western Coast',4.8,5,'25 mins (Colombo City)'),(10,'Colombo National Museum','Imposing colonial Italianate palace housing historic Ceylon royal regalia, crown jewels, Kandy royal throne, and ancient art collections.',1500,'images/colombo meuseum.jpg','HERITAGE','Western Coast',4.7,5,'25 mins (Colombo City)'),(11,'Dambulla Royal Cave Temple','UNESCO World Heritage monastic rock temple comprising five painted rock sanctuaries with 153 historic Buddha statues and ceiling murals.',2000,'images/Gemini_Generated_Image_zb6g60zb6g60zb6g.jpg','HERITAGE','Cultural Triangle',4.8,160,'3.0 hrs via Central Expressway'),(12,'Diyaluma Falls & Natural Pools','Second tallest waterfall in Sri Lanka celebrated for thrilling hikes to upper natural infinity rock pools overlooking green mountain valleys.',1000,'images/Diyaluma_Falls_1.jpg','NATURE','Uva Province',4.9,160,'3.5 hrs drive'),(13,'Dunhinda Falls','Spectacular 64m cascading waterfall plunging into a smoke-like misty spray canyon, honored in historic Sri Lankan literature and folklore.',1000,'images/dunhidaa.jpg','NATURE','Badulla District',4.7,160,'3.5 hrs drive'),(14,'Ella Nine Arches Bridge','World-famous colonial railway viaduct standing 24 meters high amidst emerald Ceylon tea plantations, mountain tunnels, and misty valleys.',1500,'Gemini_Generated_Image_hw37c2hw37c2hw37.jpg','HILL COUNTRY','Hill Country',4.9,205,'5.0 hrs via Southern Expressway'),(15,'Ella Rock Mountain Trek','Popular trekking summit through eucalyptus forests and tea country rewarding hikers with dramatic views across the Ella Gap and Little Adams Peak.',1000,'images/ella rock.jpg','HILL COUNTRY','Hill Country',4.8,205,'5.0 hrs via Southern Expressway'),(16,'Gal Vihara Rock Statues','UNESCO marvel in Polonnaruwa featuring colossal Buddha figures carved from a single granite rock face with extraordinary artistic mastery.',4000,'images/gal viaharaya.jpg','HERITAGE','Cultural Triangle',4.9,160,'3.5 hrs drive'),(17,'Galle Dutch Fort & Lighthouse','Living 17th-century fortified citadel featuring cobblestone pathways, Dutch colonial villas, chic boutiques, and seaside ramparts overlooking the ocean.',2000,'images/Gemini_Generated_Image_dzun11dzun11dzun.jpg','HERITAGE','Southern Coast',4.9,125,'2.0 hrs via Southern Expressway'),(18,'Gangaramaya Buddhist Temple','Historic temple complex in central Colombo boasting a floating Seema Malaka pavilion on Beira Lake and rare Buddhist antique collections.',1000,'images/gangaramaya Temple.jpg','HERITAGE','Western Coast',4.7,160,'3.5 hrs drive'),(19,'Gregory Lake & Alpine Park','Scenic colonial-era alpine lake in Nuwara Eliya featuring swan boat cruises, horse riding, crisp mountain air, and flower gardens.',800,'images/gregary lake.jpg','HILL COUNTRY','Hill Country',4.6,160,'3.5 hrs drive'),(20,'Hakgala Botanical Gardens','Sub-tropical mountain botanical garden beneath Hakgala rock cliff, famous for exotic roses, fernery, orchids, and Sita Eliya legends.',2000,'images/haaggala.jpg','HILL COUNTRY','Hill Country',4.7,160,'3.5 hrs drive'),(21,'Hikkaduwa Coral Reef & Beach','Vibrant coastal tourist haven famous for protected coral gardens, giant sea turtles swimming ashore, surfing waves, and lively beach cafes.',2000,'images/Gemini_Generated_Image_vij1bvij1bvij1bv.jpg','BEACH','Southern Coast',4.8,110,'1.8 hrs via Southern Expressway'),(22,'Hiriketiya Horseshoe Bay','Sheltered bohemian paradise in Dikwella with turquoise water, consistent surf breaks, coastal palm trees, and cozy cafes.',1500,'images/Hiriketiya beach.jpg','BEACH','Southern Coast',4.8,160,'3.5 hrs drive'),(23,'Horton Plains & World\'s End','Protected cloud forest plateau harboring Baker\'s Falls, wild sambar deer herds, and the stunning 880m vertical World\'s End mountain drop.',4500,'images/Gemini_Generated_Image_8lo60p8lo60p8lo6.jpg','NATURE','Hill Country',4.9,175,'5.0 hrs via Nuwara Eliya'),(24,'Jaffna Dutch Fort','Historic ocean-facing limestone fortress constructed by Portuguese and expanded by Dutch colonizers overlooking the shallow northern lagoons.',1000,'images/jaffana dutch.jpg','HERITAGE','Northern Peninsula',4.7,395,'7.5 hrs via A9 Highway'),(25,'Jaffna Nallur Kandaswamy Kovil','Grand Hindu spiritual landmark with soaring gilded Dravidian gopurams, brass lamps, sacred courtyards, and grand annual festival processions.',1000,'images/jaffana nallur.jpg','HERITAGE','Northern Peninsula',4.8,395,'7.5 hrs via A9 Highway'),(26,'Kalpitiya Dolphin & Kite Lagoon','Premier marine adventure sanctuary famous for super-pods of spinner dolphins, whale watching safaris, and world-class kite-surfing.',4000,'images/kalpitiya dolphin.jpg','BEACH','North Western Province',4.8,165,'3.5 hrs via Puttalam'),(27,'Kandy Royal Botanical Gardens','World-famous botanical treasure in Peradeniya home to 4,000+ tropical plant species, giant Javan fig trees, and an extraordinary orchid pavilion.',2500,'images/Peridenya-Gardens-kandy-sri-lanka1.jpg','NATURE','Hill Country',4.9,115,'3.0 hrs via Colombo-Kandy Rd'),(28,'Kandy Temple of the Sacred Tooth','Sri Dalada Maligawa, golden-roofed sanctuary enshrining the sacred relic of the tooth of Gautama Buddha in the last royal mountain kingdom.',2000,'Gemini_Generated_Image_uva5fuuva5fuuva5.jpg','HERITAGE','Hill Country',4.9,115,'3.0 hrs via Colombo-Kandy Rd'),(29,'Knuckles Mountain Range','UNESCO World Heritage wilderness of five mist-capped peaks resembling knuckles, offering untouched mountain streams, waterfalls, and hikes.',2500,'images/knucles mountain.jpg','NATURE','Central Highlands',4.9,160,'3.5 hrs drive'),(30,'Koggala Stilt Fishermen Beach','Photogenic southern shore famous for traditional fishermen balancing gracefully on wooden stilts above the turquoise ocean waves.',1500,'images/koggala fishering.jpg','BEACH','Southern Coast',4.7,160,'3.5 hrs drive'),(31,'Kurunegala Ethagala (Elephant Rock)','Towering elephant-shaped granite rock summit crowned by an 88-foot white seated Buddha statue overseeing the royal city of Kurunegala.',800,'images/Kurunegala Ethagala (Elephant Rock).jpg','HERITAGE','North Western Province',4.6,160,'3.5 hrs drive'),(32,'Lankatilaka Vihara (Kandy)','Imposing 14th-century brick-and-granite temple built atop Panhalgala rock, combining Buddhist and Hindu shrines under ancient wooden roofs.',1200,'images/Lankatilaka Vihara (Kandy).jpg','HERITAGE','Central Highlands',4.8,160,'3.5 hrs drive'),(33,'Lipton\'s Seat (Haputale)','Celebrated mountain viewpoint where tea pioneer Sir Thomas Lipton surveyed his vast Ceylon tea estates across seven surrounding provinces.',1000,'images/lipton.jpg','HILL COUNTRY','Uva Province',4.9,160,'3.5 hrs drive'),(34,'Little Adam\'s Peak (Ella)','Gentle scenic mountain trail offering panoramic vistas of Ella Gap, Ravana Falls, and mountain ridge walks surrounded by tea bushes.',1000,'images/little adams peak.jpg','HILL COUNTRY','Hill Country',4.8,160,'3.5 hrs drive'),(35,'Madu River Mangrove Safari','Biodiversity river cruise passing 64 islets, mangrove tunnels, centuries-old island monasteries, cinnamon peeling, and fish spas.',2500,'images/madu river.jpg','NATURE','Southern Coast',4.7,160,'3.5 hrs drive'),(36,'Mihintale Sacred Mountain','Cradle of Buddhism in Sri Lanka, where King Devanampiyatissa met Arahat Mahinda, featuring 1,840 ancient stone steps and sunset rock views.',1500,'images/mihintale.jpg','HERITAGE','Cultural Triangle',4.9,160,'3.5 hrs drive'),(37,'Minneriya National Park Gathering','Renowned site of The Elephant Gathering, where hundreds of wild Asian elephants congregate around ancient reservoirs during the dry season.',6500,'images/Minneriya_Elephant_Gathering.jpg','WILDLIFE','Cultural Triangle',4.9,185,'3.8 hrs via Habarana'),(38,'Mirissa Beach & Whale Watching','Scenic southern palm-fringed bay renowned worldwide for early morning expeditions to encounter majestic Blue Whales and Coconut Tree Hill.',3500,'images/Gemini_Generated_Image_iyt9wtiyt9wtiyt9.jpg','BEACH','Southern Coast',4.8,150,'2.5 hrs via Southern Expressway'),(39,'Negombo Lagoon & Beach','Vibrant coastal haven near the international airport famed for sandy beaches, fresh seafood markets, and traditional catamaran sailings.',1000,'images/negombo lagon.jpg','BEACH','Western Coast',4.6,160,'3.5 hrs drive'),(40,'Nilaveli Beach & Pigeon Island','Stunning untouched coastline near Trincomalee offering powdery white sand, shallow crystal waters, and proximity to coral snorkeling.',2000,'images/Gemini_Generated_Image_rlxev5rlxev5rlxe.jpg','BEACH','East Coast',4.8,160,'3.5 hrs drive'),(41,'Nuwara Eliya Tea Estates & Pedro','Famous Ceylon tea country nicknamed Little England, enveloped by cool mountain mist, manicured tea gardens, and colonial hill architecture.',1500,'images/Gemini_Generated_Image_fxmyi0fxmyi0fxmy.jpg','HILL COUNTRY','Hill Country',4.8,160,'4.5 hrs via Gampola'),(42,'Pasikudah Coral Reef Bay','World-famous calm bay with an ultra-shallow coral reef shelf allowing swimmers to walk hundreds of meters into warm, turquoise ocean waters.',2000,'images/pasikuda coral.jpg','BEACH','East Coast',4.7,290,'6.0 hrs via Polonnaruwa'),(43,'Pekoe Trail Highland Trek','World-renowned 300km curated walking trail through the Central Highlands of Sri Lanka passing tea plantations, forests, and remote valleys.',2500,'images/Pekoe Trail Highland Trek.jpg','HILL COUNTRY','Central Highlands',4.9,160,'3.5 hrs drive'),(44,'Pigeon Island Marine Sanctuary','Pristine coastal island sanctuary near Trincomalee offering world-class snorkeling with live coral reefs, sea turtles, and docile reef sharks.',3500,'images/Gemini_Generated_Image_nhd08jnhd08jnhd0.jpg','BEACH','East Coast',4.8,265,'5.5 hrs via Dambulla'),(45,'Pinnawala Elephant Orphanage','Caring conservation sanctuary and captive breeding ground on the Maha Oya river where wild orphaned elephants bathe and interact daily.',3500,'images/pinnawala.jpg','WILDLIFE','Sabaragamuwa Province',4.8,90,'2.0 hrs via Central Expressway'),(46,'Polonnaruwa Ancient Kingdom','Medieval royal capital featuring monumental stone-carved Buddha figures at Gal Vihara, lotus baths, royal palaces, and ancient irrigation tanks.',4000,'images/gal viaharaya.jpg','HERITAGE','Cultural Triangle',4.9,220,'4.5 hrs via Habarana'),(47,'Ramboda Falls & Pass','Impressive 109-meter tiered mountain waterfall along the scenic highway between Kandy and Nuwara Eliya, framed by emerald tea bushes.',1000,'images/Ramboda Falls & Pass.jpg','NATURE','Central Highlands',4.7,160,'3.5 hrs drive'),(48,'Ravana Falls & Cave (Ella)','Legendary roaring waterfall and historic mountain cave steeped in the Ramayana epic where King Ravana hid Princess Sita.',1000,'images/Ravana Falls & Cave (Ella).jpg','NATURE','Hill Country',4.8,160,'3.5 hrs drive'),(49,'Ritigala Ancient Forest Monastery','Mystical ruined Buddhist monastery deeply nestled within a strict nature reserve on Ritigala mountain with stone walkways and healing ponds.',1500,'images/ritigala.jpg','HERITAGE','Cultural Triangle',4.8,160,'3.5 hrs drive'),(50,'Seetha Amman Temple (Sita Eliya)','Sacred Hindu temple believed to be the exact location where Princess Sita was held in captivity by King Ravana in the ancient Ramayana legend.',800,'images/Seetha Amman Temple (Sita Eliya).jpg','HERITAGE','Hill Country',4.7,160,'3.5 hrs drive'),(51,'Sigiriya Lion Rock Fortress','5th-century volcanic rock citadel of King Kashyapa rising 200m above the jungle with world-famous frescoes, mirror walls, and water gardens.',5000,'Gemini_Generated_Image_bj9v1kbj9v1kbj9v.jpg','HERITAGE','Cultural Triangle',5,175,'3.5 hrs via Central Expressway'),(52,'Sinharaja Rainforest Reserve','UNESCO Biosphere Reserve safeguarding Sri Lanka\'s last extensive virgin tropical rainforest with rare endemic birds, streams, and giant trees.',3000,'images/sinharaja.jpg','NATURE','Sabaragamuwa Province',4.9,140,'3.5 hrs via Kalawana'),(53,'Tangalle Silent Beach','Idyllic, secluded southern coastline fringed with swaying coconut palms, azure crashing waves, and serene tropical relaxation.',1500,'images/Tangalle Silent Beach.jpg','BEACH','Southern Coast',4.8,195,'2.8 hrs via Southern Expressway'),(54,'Trincomalee Koneswaram Temple','Revered cliffside classical medieval Hindu temple perched dramatically above the Indian Ocean at the edge of the scenic Swami Rock.',1500,'images/koneshwaram.jpg','HERITAGE','East Coast',4.9,265,'5.5 hrs via Dambulla'),(55,'Udawalawe National Safari Park','Expansive savannah-like park renowned for guaranteed sightings of wild Asian elephant herds, water buffaloes, crocodiles, and raptors.',6000,'images/Udawalawe National Safari Park.jpeg','WILDLIFE','Uva Province',4.9,165,'3.5 hrs via Pelmadulla'),(56,'Unawatuna Beach & Jungle Bay','Calm horseshoe bay sheltered by coral reefs, ideal for swimming, seaside dining, water sports, and sunset walks to the Japanese Peace Pagoda.',1500,'images/Unawatuna Beach & Jungle Bay.jpg','BEACH','Southern Coast',4.7,130,'2.0 hrs via Southern Expressway'),(57,'Weligama Bay Surf Coast','Sprawling sandy bay famous for gentle waves ideal for beginner surfers, stilt fishermen, and scenic seaside sunset dining.',1500,'images/Weligama Bay Surf Coast.jpg','BEACH','Southern Coast',4.7,145,'2.2 hrs via Southern Expressway'),(58,'Wilpattu National Park Safari','Oldest and largest national park in Sri Lanka, distinguished by natural sand-rimmed lakes (Villus) and elusive Sri Lankan leopards.',7500,'images/Wilpattu National Park Safari.jpg','WILDLIFE','North Western Province',4.8,180,'3.5 hrs via Puttalam'),(59,'Yala National Park Leopard Safari','World-famous wildlife sanctuary boasting the highest leopard density on earth alongside wild elephants, sloth bears, and crocodiles.',8000,'images/Gemini_Generated_Image_gwqp6ugwqp6ugwqp.jpg','WILDLIFE','Southern Province',4.9,260,'4.0 hrs via Southern Expressway'),(60,'Yapahuwa Ancient Rock Citadel','13th-century cliffside royal fortress featuring a monumental carved granite ornamental stairway and ancient Lion statues.',2000,'images/yapahuwa.jpg','HERITAGE','North Western Province',4.8,145,'3.0 hrs via Kurunegala');
/*!40000 ALTER TABLE `destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ishani Chathurika','ishanichathurika298@gmail.com','Chathu#28','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-28 17:13:18
