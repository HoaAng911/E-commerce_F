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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `discountPercent` int DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `soldCount` int NOT NULL DEFAULT '0',
  `rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `reviewCount` int NOT NULL DEFAULT '0',
  `mainImage` varchar(255) NOT NULL,
  `images` text,
  `sizes` text,
  `colors` text,
  `categoryId` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isFeatured` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_464f927ae360106b783ed0b410` (`slug`),
  KEY `IDX_4c9fb58de893725258746385e1` (`name`),
  KEY `IDX_ff56834e735fa78a15d0cf2192` (`categoryId`),
  KEY `IDX_61fac54950763ae56ee51f17fd` (`brand`),
  KEY `IDX_ff39b9ac40872b2de41751eedc` (`isActive`),
  KEY `IDX_9e5b46d54cb77570fa51430ef6` (`isFeatured`),
  KEY `IDX_63fcb3d8806a6efd53dbc67430` (`createdAt`),
  KEY `IDX_c1a8cc1277dc4129c2aa80bb72` (`categoryId`,`price`),
  KEY `IDX_37ef923c42c6c0c2d886b4178e` (`isActive`,`soldCount`),
  CONSTRAINT `FK_ff56834e735fa78a15d0cf21926` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('17891032-2493-4f84-aef0-d615106e0aff','Giày Trẻ Em Adidas Disney','giay-tre-em-adidas-disney','Giày thể thao trẻ em Adidas hợp tác Disney, hình ảnh ngộ nghĩnh, chất liệu an toàn cho bé.',850000.00,1100000.00,22,65,150,4.80,42,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1773981862/shoes_store/yc4iodnrxpp5qk4i8eqd.jpg','https://res.cloudinary.com/dbvhxviqh/image/upload/v1773981894/shoes_store/fg2kikmyvdo0yfnloi2t,https://res.cloudinary.com/dbvhxviqh/image/upload/v1773982189/shoes_store/sl6wuhp4mdjyyywwisff.avif','28,29,30,31,32','Hồng,Xanh,Đỏ','e14c38c8-ad72-4448-af1a-05663e6aec8d','Adidas',1,1,'2025-12-22 00:59:55.547389','2026-03-22 16:39:13.000000'),('4b2b9c50-75db-47f8-afde-949a1b95449d','Converse Chuck Taylor All Star','converse-chuck-taylor-all-star','Giày Converse cổ điển, biểu tượng của thời trang đường phố. Chất vải canvas bền bỉ, form giày ôm chân.',1200000.00,1500000.00,20,0,400,4.60,92,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774166444/shoes_store/file_aewjoo.jpg','','37,38,39,40,41,42','Đen,Trắng,Đỏ,Xanh Navy','44c742c9-45b7-4dcb-9db6-67a9dfd9b0df','Converse',1,0,'2025-12-22 01:00:16.465135','2026-03-22 16:47:31.000000'),('4e858409-bc37-4403-8ed2-e21385e370e8','Dép Sandal Quai Ngang Crocs','dep-sandal-quai-ngang-crocs','Dép sandal Crocs thoải mái, nhẹ nhàng, chống trượt tốt. Phù hợp cho đi biển, đi chơi, ở nhà.',450000.00,600000.00,25,120,380,5.00,1,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774200812/shoes_store/file_u3ecyu.webp','','36,37,38,39,40','Đen,Xanh,Hồng,Xám','8c4a04e8-6149-4312-b42a-2021b235b2f8','Crocs',1,0,'2025-12-22 01:00:00.310827','2026-03-23 00:38:59.000000'),('57fa820e-47ea-4313-8f7c-b288a0e9f155','Giày Tây Da Bò Clarks','giay-tay-da-bo-clarks','Giày tây da bò thật cao cấp Clarks, phù hợp cho công sở, meeting quan trọng. Đế cao su chống trơn trượt.',1800000.00,2200000.00,18,30,75,4.40,22,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774200680/shoes_store/file_zraoz5.jpg','','39,40,41,42,43','Đen,Nâu','9c435c42-9c18-4c9a-bdc0-3621fd9bea77','Clarks',1,1,'2025-12-22 01:00:10.467313','2026-03-23 00:31:31.000000'),('7376e5f3-a151-456c-bd7e-7d25e3524747','Biti\'s Hunter Core','bitis-hunter-core','Giày Biti\'s Hunter Core thiết kế trẻ trung, giá cả hợp lý. Phù hợp cho học sinh, sinh viên với nhiều màu sắc đa dạng.',650000.00,750000.00,13,99,251,4.50,48,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774166361/shoes_store/file_a7srbf.webp','https://example.com/images/bitis-hunter-core-1.jpg,https://example.com/images/bitis-hunter-core-2.jpg,https://example.com/images/bitis-hunter-core-3.jpg','38,39,40,41,42','Đen,Trắng,Xanh,Đỏ','44c742c9-45b7-4dcb-9db6-67a9dfd9b0df','Biti\'s',1,0,'2025-12-22 01:00:23.092065','2026-03-23 00:47:16.000000'),('bc31821f-e0f8-45b5-8a2b-09e9d70a38d6','Vans Old Skool','vans-old-skool','Giày Vans Old Skool với sọc side stripe biểu tượng. Chất liệu canvas/suede, phong cách skateboard cổ điển.',1350000.00,1600000.00,15,70,210,4.70,58,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774200881/shoes_store/file_prfbxq.webp','','37,38,39,40,41,42','Đen Trắng,Xanh Đen,Đỏ Trắng','44c742c9-45b7-4dcb-9db6-67a9dfd9b0df','Vans',1,0,'2025-12-22 00:59:49.777506','2026-03-23 00:34:47.000000'),('c1773d5d-dff3-4d91-8c4d-c7b98fb0d628','Adidas Ultraboost 22','adidas-ultraboost-22','Giày chạy bộ Adidas Ultraboost 22 với công nghệ Boost tiên tiến, êm ái và đàn hồi tốt. Đế Continental cho độ bám đường vượt trội.',4200000.00,4500000.00,6,31,89,3.00,1,'https://photo1.i-run.fr/adidas-ultraboost-22-w-chaussures-running-femme-573876-1-sz.jpg','','40,41,42,43,44','Đen,Xanh Navy,Trắng','44c742c9-45b7-4dcb-9db6-67a9dfd9b0df','Adidas',1,1,'2025-12-22 01:00:27.303755','2026-03-22 16:39:25.000000'),('ce42eebc-6fb6-48de-9d44-02e9a13fdec2','Nike Air Max 270','nike-air-max-270','Giày Nike Air Max 270 với đệm khí lớn, thoải mái cả ngày dài. Chất liệu mesh thoáng khí, phù hợp cho đi chơi và thể thao nhẹ.',3200000.00,3500000.00,8,50,120,4.50,36,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774201023/shoes_store/file_xwyb8w.jpg','','39,40,41,42,43,44','Đen,Trắng,Xám','44c742c9-45b7-4dcb-9db6-67a9dfd9b0df','Nike',1,1,'2025-12-21 22:15:00.633236','2026-03-23 00:37:09.000000'),('f8cd6dff-ccc4-4e59-8d25-60998eb22097','Giày Tây Da Công Sở Bonia','giay-tay-da-cong-so-bonia','Giày tây da công sở Bonia, thiết kế thanh lịch, phù hợp cho nam giới đi làm, sự kiện quan trọng.',2200000.00,2800000.00,21,40,65,4.50,18,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774201071/shoes_store/file_mgenzx.jpg','https://example.com/images/bonia-dress-shoes-1.jpg,https://example.com/images/bonia-dress-shoes-2.jpg','39,40,41,42,43','Đen Bóng,Nâu Đậm','9c435c42-9c18-4c9a-bdc0-3621fd9bea77','Bonia',1,1,'2025-12-21 22:14:56.466376','2026-03-23 00:37:57.000000'),('fc48140f-c229-4696-90db-6b6c419af66b','Giày Boots Da Thật Timberland','giay-boots-da-that-timberland','Giày boots da thật Timberland, chống nước, bền bỉ. Phù hợp cho dã ngoại, đi làm, thời tiết mưa gió.',3500000.00,4200000.00,16,23,47,4.70,28,'https://res.cloudinary.com/dbvhxviqh/image/upload/v1774200776/shoes_store/file_rguhiz.avif','','40,41,42,43,44','Vàng Nâu,Đen','318656e9-d0af-41f7-b5bd-8e6e72c9e986','Timberland',1,1,'2025-12-22 01:00:05.226491','2026-03-23 00:33:02.000000');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
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
