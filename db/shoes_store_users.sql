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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `addresses` text,
  `wishlist` text,
  `role` varchar(255) NOT NULL DEFAULT 'CUSTOMER',
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `refreshToken` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('25a1db02-636c-416d-b608-d5ea25756af6','hoang104094@donga.edu.vn','$2b$10$fC7xIst3s/KvwG39gXc8g.t.D4w.r4w/WWnJO1osGmUhbDJM3PJCC','ST23A Trần Ngọc Hoàng',NULL,'https://lh3.googleusercontent.com/a/ACg8ocIjzFMpl2lzVHP79aLznIIKIPM0lqr3j-q6tIZL0HGKJM6TcQ=s96-c','','','CUSTOMER',0,'2026-03-02 17:41:10.745544','2026-03-22 15:01:20.000000','$2b$10$NGFgtr8hOiJpbeckPM2PCegF3/.YUeKOsJhaG8gi6.ix2ADM7Qu1S',NULL,NULL,NULL),('38006cce-cd85-43d7-9fbd-27fcdd54b316','mayanh279@gmail.com','$2b$10$laY3XfE1EmfyEJ4QzS8jTO9/94uRIdhha97ALbMEK9WEH6v7WJmbW','TNgọc Hoàng',NULL,'https://lh3.googleusercontent.com/a/ACg8ocIyWXzwXGNxs5f3oEgWHH5rfikpOss8UGxI8VMfDMtEudxKedY=s96-c','','','CUSTOMER',1,'2025-12-23 20:34:15.495998','2026-03-15 04:36:30.000000','$2b$10$406DKcA6FrZ8QdRCbNV.UuXASDe3BndKOUUbp.PxcTwGgZKKJkw8.',NULL,NULL,'2026-03-15 04:36:30.000000'),('65bafe99-dd8c-48ea-b03d-50ae07d00df5','anhne@gmail.com','$2b$10$QgCmpWDo3a/sdT3HCBH8D.3./sIoI0mBkyhY9URVLFRYq65p1y/Dq',NULL,NULL,NULL,NULL,NULL,'CUSTOMER',1,'2025-12-22 17:55:20.007450','2026-03-15 04:36:27.000000','$2b$10$z9DAyK/3wSeXdJDSUwx2w.hmDLyi8rbzeJaNX8jkcZWvITeoWQA3e',NULL,NULL,'2026-03-15 04:36:27.000000'),('d789410a-8139-4ae7-be48-a02d2bc8836f','hoangdtntaluoi@gmail.com','$2b$10$mPmOEO8bcNiPv4Vrm7kPBOgdQklcYRJ4/1W83QR5n8TrrqXEubvSu',' Tran Ngoc Hoang','0987180041',NULL,'35 Nguyen Quy Duc,12 Nguyen Dinh Chieu',NULL,'ADMIN',1,'2025-12-21 22:19:08.222215','2026-03-23 00:38:48.000000','$2b$10$nYPQCPEH34wAK41sTae3g.24xS2m94m1N0dsD6TqrGDJQkt.qxaZK',NULL,NULL,NULL);
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

-- Dump completed on 2026-03-23  0:55:31
