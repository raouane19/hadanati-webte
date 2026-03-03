-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: localhost    Database: hadanati_project
-- ------------------------------------------------------
-- Server version	8.4.8

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
-- Table structure for table `Activities`
--

DROP TABLE IF EXISTS `Activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `daycare_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `schedule` varchar(100) DEFAULT NULL,
  `age_range` varchar(50) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `daycare_id` (`daycare_id`),
  CONSTRAINT `Activities_ibfk_1` FOREIGN KEY (`daycare_id`) REFERENCES `Daycares` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Activities`
--

LOCK TABLES `Activities` WRITE;
/*!40000 ALTER TABLE `Activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `Activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superadmin','moderator') DEFAULT 'moderator',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Children`
--

DROP TABLE IF EXISTS `Children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Children` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `medical_issues` text,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `Children_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `Parents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Children`
--

LOCK TABLES `Children` WRITE;
/*!40000 ALTER TABLE `Children` DISABLE KEYS */;
/*!40000 ALTER TABLE `Children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Daycares`
--

DROP TABLE IF EXISTS `Daycares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Daycares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `lon` decimal(10,7) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `age_range` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `education_info` text,
  `healthcare_info` text,
  `social_media` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `has_activities` tinyint(1) DEFAULT '0',
  `verification_code` varchar(6) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `reset_code` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Daycares`
--

LOCK TABLES `Daycares` WRITE;
/*!40000 ALTER TABLE `Daycares` DISABLE KEYS */;
INSERT INTO `Daycares` VALUES (1,'happy','hhnan9451@gmail.com','$2b$10$cFPyhJHXK/H3g/C3Wk3/rO4KNjORFxh4HHucPhtbFzzAYjhjD3p4G','08374676',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,'332374',0,NULL);
/*!40000 ALTER TABLE `Daycares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Parents`
--

DROP TABLE IF EXISTS `Parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Parents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `Profile_image` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_code` varchar(6) DEFAULT NULL,
  `reset_code` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parents`
--

LOCK TABLES `Parents` WRITE;
/*!40000 ALTER TABLE `Parents` DISABLE KEYS */;
INSERT INTO `Parents` VALUES (1,'John','Doe','john.doe@example.com','$2b$10$V28qZk0uJmzQgSP0cYBWDuTb3EPjdI2ps9Tdmm9WLhPuqlH6V.9UO','1234567890',NULL,0,NULL,NULL),(2,'ahmed','mohamed','ahmed@example.com','$2b$10$6HDq.bEu4l7vpiJj3gdbrO9x1nWDeetj2P8PnQsd1YhCKCCasdbF2','1234585749',NULL,0,NULL,NULL),(4,'djamila','boualid','boualidjamila55@gmail.com','$2b$10$/Z9CYbqoADYXaxrHf/cZSu3W/EXavZKy2vxzVUQMPqMJAesYA9p/y','0612345678',NULL,1,NULL,NULL),(5,'rouane','difi','r.difi@esi-sba.dz','$2b$10$VKthLYDPQwuy0XHgvYfizufTMNjv2HjBojRaZ9ttFSI1mOuiMLbgu','08374676',NULL,0,'440779',NULL),(6,'chaima','djebbar','c.djebbar@esi-sba.dz','$2b$10$.u2eYwDkEJR71bYbJ2xi1OxCUEFlXN8aqO3vJHrHW9c24yrc8Ngmy','08374676',NULL,0,'898234',NULL),(9,'chaima','djebbar','chaimadjebbar916@gmail.com','$2b$10$NOMOViI9VThGuDE6EYTJ1O1boHWEJAUDa7yRYVWVwUZOtUayh7cNm','08374676',NULL,0,'424909','320169');
/*!40000 ALTER TABLE `Parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Requests`
--

DROP TABLE IF EXISTS `Requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `child_id` int NOT NULL,
  `daycare_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `request_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `schedule_type` enum('full-time','half-time') DEFAULT 'full-time',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `child_id` (`child_id`),
  KEY `daycare_id` (`daycare_id`),
  CONSTRAINT `Requests_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `Parents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Requests_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `Children` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Requests_ibfk_3` FOREIGN KEY (`daycare_id`) REFERENCES `Daycares` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Requests`
--

LOCK TABLES `Requests` WRITE;
/*!40000 ALTER TABLE `Requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `Requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `daycare_id` int NOT NULL,
  `comment` text,
  `rating` int DEFAULT NULL,
  `review_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `daycare_id` (`daycare_id`),
  CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `Parents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`daycare_id`) REFERENCES `Daycares` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reviews`
--

LOCK TABLES `Reviews` WRITE;
/*!40000 ALTER TABLE `Reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Saved_Daycares`
--

DROP TABLE IF EXISTS `Saved_Daycares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Saved_Daycares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `daycare_id` int NOT NULL,
  `saved_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `daycare_id` (`daycare_id`),
  CONSTRAINT `Saved_Daycares_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `Parents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Saved_Daycares_ibfk_2` FOREIGN KEY (`daycare_id`) REFERENCES `Daycares` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Saved_Daycares`
--

LOCK TABLES `Saved_Daycares` WRITE;
/*!40000 ALTER TABLE `Saved_Daycares` DISABLE KEYS */;
/*!40000 ALTER TABLE `Saved_Daycares` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-03  9:23:10
