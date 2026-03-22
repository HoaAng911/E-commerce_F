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
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `authorId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1123ff6815c5b8fec0ba9fec37` (`slug`),
  KEY `FK_65d9ccc1b02f4d904e90bd76a34` (`authorId`),
  CONSTRAINT `FK_65d9ccc1b02f4d904e90bd76a34` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES ('15ab2bc1-5a5e-493e-ba72-7b8fc1c2fb8a','5 Cách Phối Đồ Với Giày Jordan 1 Cho Mùa Hè','5-cach-phoi-do-voi-giay-jordan-1-cho-mua-he-1772966126948','<h3>1. Phối cùng quần Short thể thao</h3><p>Sự kết hợp năng động giữa Jordan 1 High và quần short giúp bạn thoải mái xuống phố.</p><h3>2. Phong cách Oversize</h3><p>Áo thun rộng cùng quần ống suông là lựa chọn không bao giờ lỗi mốt.</p>','https://images.unsplash.com/photo-1597044711673-9ef346d03f0b?q=80&w=1000&auto=format&fit=crop',2,1,'2024-03-05 17:30:00.000000','2026-03-09 01:51:45.000000','d789410a-8139-4ae7-be48-a02d2bc8836f'),('4123a0e2-f1d4-4d5a-b889-b57ad0ed85f2','Nike Air Max Dn: Kỷ Nguyên Mới Của Công Nghệ Đệm Air','nike-air-max-dn:-ky-nguyen-moi-cua-cong-nghe-dem-air-1772966081543','<h2>Sự&nbsp;đột&nbsp;phá&nbsp;từ&nbsp;Dynamic&nbsp;Air</h2><p><strong>HEHEHE</strong></p>','https://images.unsplash.com/photo-1542291026-7eec264c27ff',7,1,'2026-03-08 17:34:41.551056','2026-03-15 04:53:56.000000','d789410a-8139-4ae7-be48-a02d2bc8836f'),('58178957-1277-4f22-81fd-d1f65c1f0fb2','Sự Hồi Sinh Của Dòng Giày Retro: Xu Hướng 2024','su-hoi-sinh-cua-dong-giay-retro:-xu-huong-2024-1772966137475','<p>Vào năm 2024, chúng ta chứng kiến sự quay trở lại mạnh mẽ của các thiết kế thập niên 90. Những đôi giày như Cortez hay Vomero 5 đang thống lĩnh các bảng xếp hạng thời trang đường phố toàn cầu.</p>','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop',0,1,'2024-03-08 22:45:00.000000','2026-03-08 17:35:37.476835','d789410a-8139-4ae7-be48-a02d2bc8836f'),('9d85a9a1-d297-4237-a6f8-0dc8d6e73676','Tại Sao Nike Pegasus 40 Là Đôi Giày Chạy Quốc Dân?','tai-sao-nike-pegasus-40-la-doi-giay-chay-quoc-dan-1772966154294','<p>Bền bỉ, êm ái và mức giá hợp lý. Pegasus 40 tiếp tục khẳng định vị thế là người bạn đồng hành tin cậy cho cả những vận động viên chuyên nghiệp lẫn người mới bắt đầu chạy bộ.</p>','https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000&auto=format&fit=crop',4,1,'2024-03-12 21:10:00.000000','2026-03-09 02:32:14.000000','d789410a-8139-4ae7-be48-a02d2bc8836f'),('cc394cf5-a3f6-4b14-b36c-9ffd69e28282','Hướng Dẫn Vệ Sinh Giày Suede Tại Nhà Đúng Cách','huong-dan-ve-sinh-giay-suede-tai-nha-dung-cach-1772966147517','<p>Da lộn (Suede) là chất liệu khó chiều nhất. Đừng bao giờ dùng nước trực tiếp! Hãy sử dụng bàn chải chuyên dụng và gôm tẩy vết bẩn khô để bảo quản đôi giày của bạn bền đẹp nhất.</p>','https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',0,1,'2024-03-10 16:20:00.000000','2026-03-08 17:35:47.518775','d789410a-8139-4ae7-be48-a02d2bc8836f');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
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
