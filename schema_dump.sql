mysqldump: [Warning] Using a password on the command line interface can be insecure.
Warning: A partial dump from a server that has GTIDs will by default include the GTIDs of all transactions, even those that changed suppressed parts of the database. If you don't want to restore GTIDs, pass --set-gtid-purged=OFF. To make a complete dump, pass --all-databases --triggers --routines --events. 
Warning: A dump from a server that has GTIDs enabled will by default include the GTIDs of all transactions, even those that were executed during its extraction and might not be represented in the dumped data. This might result in an inconsistent data dump. 
In order to ensure a consistent backup of the database, pass --single-transaction or --lock-all-tables or --source-data. 
-- MySQL dump 10.13  Distrib 9.5.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: CocherasUTN
-- ------------------------------------------------------
-- Server version	9.5.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '183ac386-0ea9-11f0-a8ef-527969a2f2d5:1-31';

--
-- Table structure for table `garage`
--

DROP TABLE IF EXISTS `garage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `garage` (
  `cuit` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `location_id` int unsigned NOT NULL,
  PRIMARY KEY (`cuit`),
  KEY `garage_location_id_index` (`location_id`),
  CONSTRAINT `garage_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garage`
--

LOCK TABLES `garage` WRITE;
/*!40000 ALTER TABLE `garage` DISABLE KEYS */;
/*!40000 ALTER TABLE `garage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_space`
--

DROP TABLE IF EXISTS `parking_space`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_space` (
  `number` int unsigned NOT NULL,
  `garage_cuit` int unsigned NOT NULL,
  `type_vehicle_id` int unsigned NOT NULL,
  PRIMARY KEY (`number`,`garage_cuit`),
  KEY `parking_space_garage_cuit_index` (`garage_cuit`),
  KEY `parking_space_type_vehicle_id_index` (`type_vehicle_id`),
  CONSTRAINT `parking_space_garage_cuit_foreign` FOREIGN KEY (`garage_cuit`) REFERENCES `garage` (`cuit`) ON UPDATE CASCADE,
  CONSTRAINT `parking_space_type_vehicle_id_foreign` FOREIGN KEY (`type_vehicle_id`) REFERENCES `type_vehicle` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_space`
--

LOCK TABLES `parking_space` WRITE;
/*!40000 ALTER TABLE `parking_space` DISABLE KEYS */;
/*!40000 ALTER TABLE `parking_space` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date_time_reservation` datetime NOT NULL,
  `check_in_at` datetime NOT NULL,
  `check_out_at` datetime NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'activa',
  `amount` int NOT NULL,
  `vehicle_license_plate` varchar(255) NOT NULL,
  `garage_cuit` int unsigned NOT NULL,
  `parking_space_number` int unsigned NOT NULL,
  `parking_space_garage_cuit` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_vehicle_license_plate_index` (`vehicle_license_plate`),
  KEY `reservation_garage_cuit_index` (`garage_cuit`),
  KEY `reservation_parking_space_number_parking_space_garage_cuit_index` (`parking_space_number`,`parking_space_garage_cuit`),
  CONSTRAINT `reservation_garage_cuit_foreign` FOREIGN KEY (`garage_cuit`) REFERENCES `garage` (`cuit`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_parking_space_number_parking_space_ga_29ed8_foreign` FOREIGN KEY (`parking_space_number`, `parking_space_garage_cuit`) REFERENCES `parking_space` (`number`, `garage_cuit`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_vehicle_license_plate_foreign` FOREIGN KEY (`vehicle_license_plate`) REFERENCES `vehicle` (`license_plate`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_type`
--

DROP TABLE IF EXISTS `reservation_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_type` (
  `description` varchar(255) NOT NULL,
  `garage_cuit` int unsigned NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`description`,`garage_cuit`),
  KEY `reservation_type_garage_cuit_index` (`garage_cuit`),
  CONSTRAINT `reservation_type_garage_cuit_foreign` FOREIGN KEY (`garage_cuit`) REFERENCES `garage` (`cuit`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_type`
--

LOCK TABLES `reservation_type` WRITE;
/*!40000 ALTER TABLE `reservation_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_vehicle`
--

DROP TABLE IF EXISTS `type_vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_vehicle` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_vehicle`
--

LOCK TABLES `type_vehicle` WRITE;
/*!40000 ALTER TABLE `type_vehicle` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dni` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_dni_unique` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `license_plate` varchar(255) NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `type_id` int unsigned NOT NULL,
  PRIMARY KEY (`license_plate`),
  KEY `vehicle_owner_id_index` (`owner_id`),
  KEY `vehicle_type_id_index` (`type_id`),
  CONSTRAINT `vehicle_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `vehicle_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `type_vehicle` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-21 19:15:54
