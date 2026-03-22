-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: shoes_store
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(36) NOT NULL,
  `totalAmount` decimal(12,2) NOT NULL,
  `status` enum('pending','confirmed','shipping','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `paymentMethod` varchar(255) NOT NULL DEFAULT 'COD',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` varchar(36) DEFAULT NULL,
  `orderCode` varchar(255) NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `shippingFee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paymentStatus` enum('unpaid','paid','refunded') NOT NULL DEFAULT 'unpaid',
  `trackingCode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a97c808a83af1497276bf85e5b` (`orderCode`),
  KEY `FK_a922b820eeef29ac1c6800e826a` (`user_id`),
  CONSTRAINT `FK_a922b820eeef29ac1c6800e826a` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('5b585a16-3708-4205-95bb-3090529b2dfc',4230000.00,'confirmed','a','a','a','a','COD','2026-03-16 10:20:40.122777','2026-03-22 16:48:06.000000',NULL,'ORD-20260316-0A73',NULL,30000.00,'unpaid',NULL),('caf82ec5-5c0c-44b8-a646-d307532fa498',96030000.00,'confirmed','f','f','f','f','COD','2026-03-22 16:47:31.778004','2026-03-22 16:48:10.000000',NULL,'ORD-20260322-DIR6',NULL,30000.00,'unpaid',NULL),('e9cd3b2f-d69f-45e6-85e5-3748ff9a9b27',680000.00,'pending','a','a','a','a','COD','2026-03-23 00:47:16.987796','2026-03-23 00:47:16.000000',NULL,'ORD-20260322-04BD',NULL,30000.00,'unpaid',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23  0:55:31
