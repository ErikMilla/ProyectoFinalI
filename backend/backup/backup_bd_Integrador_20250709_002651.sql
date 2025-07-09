-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: bd_Integrador
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Higiene'),(2,'Pañalería');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_venta`
--

DROP TABLE IF EXISTS `detalle_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detalle_venta` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `cantidad` int(11) NOT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `FKe92fd2auy9ms2pvac9b4n8ttq` (`id_producto`),
  KEY `FKgds50vmwbs8lxoti80iekstyi` (`id_venta`),
  CONSTRAINT `FKe92fd2auy9ms2pvac9b4n8ttq` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `FKgds50vmwbs8lxoti80iekstyi` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_venta`
--

LOCK TABLES `detalle_venta` WRITE;
/*!40000 ALTER TABLE `detalle_venta` DISABLE KEYS */;
INSERT INTO `detalle_venta` VALUES (1,2,60,1,NULL,NULL,NULL),(2,1,61,1,NULL,NULL,NULL),(3,3,63,1,NULL,NULL,NULL),(7,4,66,3,NULL,NULL,NULL),(8,1,69,3,NULL,NULL,NULL),(9,2,70,3,NULL,NULL,NULL),(10,1,67,4,NULL,NULL,NULL),(11,3,71,4,NULL,NULL,NULL),(12,2,72,4,NULL,NULL,NULL),(13,1,73,4,NULL,NULL,NULL),(28,1,62,5,NULL,NULL,NULL),(29,1,63,5,NULL,NULL,NULL),(30,1,65,5,NULL,NULL,NULL),(31,1,60,2,0.00,NULL,NULL),(32,1,61,2,0.00,NULL,NULL),(33,1,62,2,0.00,NULL,NULL),(34,1,70,6,NULL,NULL,NULL),(37,1,70,8,0.00,12.00,12.00),(38,1,71,8,0.00,4.00,4.00),(39,1,70,9,0.00,12.00,12.00),(40,1,71,9,0.00,4.00,4.00),(41,1,70,10,0.00,12.00,12.00),(42,1,71,10,0.00,4.00,4.00),(43,1,70,11,0.00,12.00,12.00),(44,1,71,11,0.00,4.00,4.00),(45,1,70,12,0.00,12.00,12.00),(46,1,71,12,0.00,4.00,4.00),(47,1,70,13,0.00,12.00,12.00),(48,1,71,13,0.00,4.00,4.00),(49,1,70,14,0.00,12.00,12.00),(50,1,71,14,0.00,4.00,4.00),(51,1,70,15,0.00,12.00,12.00),(52,1,71,15,0.00,4.00,4.00),(53,1,70,16,0.00,12.00,12.00),(54,1,71,16,0.00,4.00,4.00),(55,1,70,17,0.00,12.00,12.00),(56,1,71,17,0.00,4.00,4.00),(57,1,70,18,0.00,12.00,12.00),(58,1,71,18,0.00,4.00,4.00),(59,1,70,19,0.00,12.00,12.00),(60,1,71,19,0.00,4.00,4.00),(61,1,70,20,0.00,12.00,12.00),(62,1,71,20,0.00,4.00,4.00),(66,1,70,21,0.00,12.00,12.00),(67,1,71,21,0.00,4.00,4.00),(68,1,72,21,0.00,14.00,14.00),(71,1,67,22,0.00,28.00,28.00),(72,1,66,22,0.00,25.00,25.00),(73,1,67,23,0.00,28.00,28.00),(74,1,66,23,0.00,25.00,25.00),(75,1,67,24,0.00,28.00,28.00),(76,1,66,24,0.00,25.00,25.00),(77,1,67,25,0.00,28.00,28.00),(78,1,66,25,0.00,25.00,25.00),(79,1,67,26,0.00,28.00,28.00),(80,1,66,26,0.00,25.00,25.00),(81,1,67,27,0.00,28.00,28.00),(82,1,66,27,0.00,25.00,25.00),(83,1,67,28,0.00,28.00,28.00),(84,1,66,28,0.00,25.00,25.00),(86,1,61,30,0.00,32.00,32.00),(87,1,61,31,0.00,32.00,32.00),(88,1,61,32,0.00,32.00,32.00),(90,1,62,33,0.00,25.00,25.00),(92,1,62,34,0.00,25.00,25.00),(94,1,61,35,0.00,32.00,32.00),(95,1,61,36,0.00,32.00,32.00),(96,1,61,37,0.00,32.00,32.00),(98,1,61,38,0.00,32.00,32.00),(99,1,63,38,0.00,14.00,14.00),(100,1,61,39,0.00,32.00,32.00),(101,1,63,39,0.00,14.00,14.00),(102,1,61,40,0.00,32.00,32.00),(103,1,63,40,0.00,14.00,14.00),(104,1,61,41,0.00,32.00,32.00),(105,1,63,41,0.00,14.00,14.00),(106,1,61,42,0.00,32.00,32.00),(107,1,63,42,0.00,14.00,14.00),(108,1,61,43,0.00,32.00,32.00),(109,1,63,43,0.00,14.00,14.00),(111,1,69,51,0.00,20.00,20.00),(115,1,62,53,0.00,25.00,25.00),(116,1,61,53,0.00,32.00,32.00),(121,1,62,56,0.00,25.00,25.00),(122,1,63,56,0.00,14.00,14.00),(125,1,63,60,0.00,14.00,14.00),(126,1,64,60,0.00,23.00,23.00),(129,1,61,62,0.00,32.00,32.00),(130,1,63,62,0.00,14.00,14.00),(133,1,60,64,0.00,23.00,23.00),(134,1,61,64,0.00,32.00,32.00),(142,1,70,67,0.00,12.00,12.00),(147,2,62,71,0.00,25.00,50.00),(148,1,61,71,0.00,32.00,32.00),(149,1,63,71,0.00,14.00,14.00),(161,2,65,73,0.00,25.00,50.00),(162,2,66,73,0.00,25.00,50.00),(163,1,61,73,0.00,32.00,32.00),(164,1,62,73,0.00,25.00,25.00),(165,1,63,73,0.00,14.00,14.00),(166,1,67,73,0.00,28.00,28.00),(167,1,70,73,0.00,12.00,12.00),(168,3,73,73,0.00,14.00,42.00),(169,2,72,73,0.00,14.00,28.00),(170,1,60,74,0.00,NULL,NULL);
/*!40000 ALTER TABLE `detalle_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marcas` (
  `id_marca` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_marca`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (4,'Pamper\'s'),(5,'Huggies'),(6,'Babysec'),(7,'Johnson');
/*!40000 ALTER TABLE `marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_categoria` int(11) DEFAULT NULL,
  `id_marca` int(11) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` decimal(38,2) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `id_subcategoria` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_producto`),
  KEY `fk_productos_subcategoria` (`id_subcategoria`),
  CONSTRAINT `fk_productos_subcategoria` FOREIGN KEY (`id_subcategoria`) REFERENCES `subcategorias` (`id_subcategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (60,1,6,'/uploads/761ffbfc-69fe-4c9e-b474-125bd942c45a_babysec.jpeg','Pañal Super Premiun',23.00,10,8,1),(61,1,6,'/uploads/d98c2c88-11d6-41d7-a9ee-0fd02ec1c7b7_babysec2.jpeg','Packetón XXG',32.00,108,8,1),(62,1,5,'/uploads/1ff1c365-2fc9-4008-a629-91a9dea2d899_descarga.jpeg','Pañal XXG 14-20 KG',25.00,0,8,0),(63,1,5,'/uploads/cada612c-e85c-45a9-b555-c0efa5842441_gudd.jpeg','Pañal XG',14.00,0,8,0),(64,1,6,'/uploads/6ae95767-e49d-44ae-b9e0-a5fbb7b96f6c_images.jpeg','Pañal Premiun 2',23.00,10,8,1),(65,1,4,'/uploads/818d1686-dae1-4655-ac19-35d95bf4a96a_pampers.jpeg','Pañal Premiun Care',25.00,0,8,0),(66,1,5,'/uploads/1e26571d-3502-4383-ad1e-fd009a1393a2_pañal 2.jpeg','Pañal Recien Nacido',25.00,0,8,0),(67,1,5,'/uploads/38080a21-3ecd-4eb0-b085-105c326126e9_pañal 1.jpeg','Pañal Suavecito',28.00,0,8,0),(68,2,6,'/uploads/94f0a7fe-2009-4174-b49b-a99e703849da_20182122-16402.jpg','Paquete Pañitos',30.00,5,13,1),(69,2,7,'/uploads/b1fd2e40-041c-4eeb-9679-fe1c626fa72a_20618685-800-auto.webp','Shampoo 400ml',20.00,4,12,1),(70,2,7,'/uploads/a5dd3b6a-d978-49f1-8533-abca8edd1751_descarga (1).jpeg','Jabon',12.00,17,10,1),(71,2,5,'/uploads/0bbc01f8-9606-43d0-80b0-71f7ec39c726_descarga (2).jpeg','Pañitos Micky',4.00,8,12,1),(72,2,5,'/uploads/8167f168-a9de-4bf6-b565-1ee2bbfdd95a_descarga (3).jpeg','Pañitos',14.00,21,13,1),(73,2,7,'/uploads/6e12ad1e-21cf-4bb6-9691-0ea88bc747b1_images (1).jpeg','Shampoo 100ml',14.00,21,12,1),(74,2,7,'/uploads/7a5678c9-2460-4aac-8f43-9257532ab05a_images.jpeg','Shampoo 750ml',34.00,23,12,1),(75,2,7,'/uploads/4e50bc25-f1cc-4771-b66e-5d52460baa16_descarga.jpeg','Jabon en barra',4.00,12,10,1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(255) DEFAULT NULL,
  `nombre_proveedor` varchar(255) DEFAULT NULL,
  `ruc` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'Distribuidora Pérez SAC','Juan Pérez','20123456789','987654321'),(2,'Comercial García EIRL','María García','20234567890','912345678'),(3,'Suministros Ruiz SRL','Carlos Ruiz','20345678901','945123789'),(4,'Importaciones Torres SA','Ana Torres','20456789012','967891234');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategorias`
--

DROP TABLE IF EXISTS `subcategorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcategorias` (
  `id_subcategoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id_subcategoria`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `subcategorias_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategorias`
--

LOCK TABLES `subcategorias` WRITE;
/*!40000 ALTER TABLE `subcategorias` DISABLE KEYS */;
INSERT INTO `subcategorias` VALUES (8,'Bebes',2),(9,'Cepillos',1),(10,'Jabon',1),(11,'Adultos',2),(12,'shampoo',1),(13,'paños humedos',1),(14,'Talco',1),(15,'pañal',1),(20,'Adulto',1);
/*!40000 ALTER TABLE `subcategorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `apellidos` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `fechacreacion` datetime(6) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `rol` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `verificado` bit(1) NOT NULL,
  `codigo_verificacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfsp0s1tflm1cwlj8idhqsad0` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (4,'Jose',NULL,'a','1@gmail.com','2025-05-31 17:24:38.000000','Yeiden','admin','123456789','$2a$10$G.tOUI6bcf6Kx0vcokNSreX.zhAe3T1an1vfEvl5Kuy8W30Rx7.xO','\0',NULL),(12,'Julian',NULL,'Por alla','3@gmail.com','2025-06-11 09:14:45.000000','Yeiden','admin','524354845','$2a$10$ycniGnh5o6qQNL85H5xXteS2Vt9GqI59cm15qSiw9lzutKk18zDFa','\0',NULL),(13,'Nuñes',NULL,'Jr.Lurigancho','erikmilla456@gmail.com','2025-06-11 09:24:44.000000','Gabriel','cliente','95462815a','$2a$10$YG7lrvXdCcJ70l3qtl1igOOlQytM.Zc.DQOb5AOFGXLR84NPml5YS','',NULL),(15,'Vargas',NULL,'Pro','cvillalta2209@gmail.com','2025-06-11 09:30:50.000000','Mario','cliente','965248765','$2a$10$jg7hIlCwcR94rm30bJpedOyQAG9qeJgScaCq8d23mNd12A4UImVm6','',NULL),(17,'tarazona',NULL,'hdsqddg','erikmilla456567@gmail.com','2025-07-02 09:20:30.000000','erik','cliente','936453663','$2a$10$pHtJz45I.p/IYIRU0NWYAuwq2xJWyfTFJngms4QmI4Y9g2EjMSTcW','\0','455383'),(18,'Julio',NULL,'asdasdas','vimobi5498@exitbit.com','2025-07-02 09:22:59.000000','Yeiden','cliente','984375482','$2a$10$Yw6G6LL.aXUpB7DBf4.t3O43ZJu/pscOFZeS8dKcspBXHoC3sJGTW','',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `total` decimal(38,2) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `tipo_comprobante` varchar(255) DEFAULT NULL,
  `metodo_pago` varchar(255) DEFAULT NULL,
  `fecha_venta` timestamp NOT NULL DEFAULT current_timestamp(),
  `direccion_envio` varchar(255) DEFAULT NULL,
  `codigo_postal` varchar(255) DEFAULT NULL,
  `departamento_envio` varchar(255) DEFAULT NULL,
  `direccion_fiscal` varchar(255) DEFAULT NULL,
  `distrito_envio` varchar(255) DEFAULT NULL,
  `documento_cliente` varchar(255) DEFAULT NULL,
  `email_cliente` varchar(255) DEFAULT NULL,
  `envio` decimal(38,2) DEFAULT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `fecha_cancelacion` datetime(6) DEFAULT NULL,
  `fecha_pago` datetime(6) DEFAULT NULL,
  `impuestos` decimal(38,2) DEFAULT NULL,
  `nombre_cliente` varchar(255) DEFAULT NULL,
  `provincia_envio` varchar(255) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `referencia_envio` varchar(255) DEFAULT NULL,
  `ruc` varchar(255) DEFAULT NULL,
  `subtotal` decimal(38,2) DEFAULT NULL,
  `telefono_cliente` varchar(255) DEFAULT NULL,
  `tipo_documento` varchar(255) DEFAULT NULL,
  `transaccion_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,5,0.00,'proceso',NULL,NULL,'2025-06-04 15:36:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,5,NULL,'proceso',NULL,NULL,'2025-06-05 16:24:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,10,NULL,'proceso',NULL,NULL,'2025-06-07 17:07:40',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,11,NULL,'proceso',NULL,NULL,'2025-06-07 17:18:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,15,NULL,'proceso',NULL,NULL,'2025-06-11 14:32:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,8,NULL,NULL,NULL,NULL,'2025-06-14 23:55:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,13,33.88,'PENDIENTE','boleta',NULL,'2025-06-23 20:03:21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:03:21.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(9,13,33.88,'PAGADA','boleta',NULL,'2025-06-23 20:15:42',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:15:42.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(10,13,33.88,'PENDIENTE','boleta',NULL,'2025-06-23 20:25:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:25:00.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(11,13,33.88,'PAGO_FALLIDO','boleta',NULL,'2025-06-23 20:32:53',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:32:53.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(12,13,33.88,'PAGO_FALLIDO','boleta',NULL,'2025-06-23 20:33:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:33:17.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(13,13,33.88,'PAGO_FALLIDO','boleta',NULL,'2025-06-23 20:33:46',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:33:46.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(14,13,33.88,'PAGO_FALLIDO','boleta',NULL,'2025-06-23 20:36:16',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:36:16.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(15,13,33.88,'PAGO_FALLIDO','boleta',NULL,'2025-06-23 20:37:26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:37:26.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(16,13,33.88,'PAGO_FALLIDO','boleta',NULL,'2025-06-23 20:37:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:37:38.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(17,13,33.88,'PAGO_FALLIDO','boleta',NULL,'2025-06-23 20:40:10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-23 15:40:10.000000',NULL,NULL,2.88,NULL,NULL,NULL,NULL,NULL,16.00,NULL,NULL,NULL),(18,13,33.88,'PAGADA','boleta','tarjeta','2025-06-23 20:43:06','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-23 15:43:06.000000',NULL,'2025-06-23 15:43:06.000000',2.88,'erik milla','Callao',NULL,'dewdwd',NULL,16.00,'905453404','DNI','TXN_8BFEB6A9'),(19,13,33.88,'PAGADA','boleta','tarjeta','2025-06-23 20:52:46','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-23 15:52:46.000000',NULL,'2025-06-23 15:52:47.000000',2.88,'erik milla','Callao',NULL,'dewdwd',NULL,16.00,'905453404','DNI','TXN_C5A4FA4E'),(20,13,33.88,'PAGADA','boleta','tarjeta','2025-06-23 21:07:58','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-23 16:07:58.000000',NULL,'2025-06-23 16:07:58.000000',2.88,'erik milla','Callao',NULL,'dewdwd',NULL,16.00,'905453404','DNI','TXN_EDFF17EF'),(21,13,50.40,'PAGADA','boleta','tarjeta','2025-06-23 21:27:52','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-23 16:27:52.000000',NULL,'2025-06-23 16:27:52.000000',5.40,'erik milla','Callao',NULL,'dewdwd',NULL,30.00,'905453404','DNI','TXN_A37923DE'),(22,13,77.54,'PAGADA','boleta','tarjeta','2025-06-23 21:32:44','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-23 16:32:44.000000',NULL,'2025-06-23 16:32:44.000000',9.54,'erik milla','Callao',NULL,'dewdwd',NULL,53.00,'905453404','DNI','TXN_8D34942A'),(23,13,77.54,'PAGO_FALLIDO','factura',NULL,'2025-06-24 19:59:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-24 14:59:17.000000',NULL,NULL,9.54,NULL,NULL,NULL,NULL,NULL,53.00,NULL,NULL,NULL),(24,13,77.54,'PAGO_FALLIDO','factura',NULL,'2025-06-24 19:59:25',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-24 14:59:25.000000',NULL,NULL,9.54,NULL,NULL,NULL,NULL,NULL,53.00,NULL,NULL,NULL),(25,13,77.54,'PAGADA','factura','tarjeta','2025-06-24 19:59:44','puente piedra','','Lima','sdfsdfdf','Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 14:59:44.000000',NULL,'2025-06-24 14:59:46.000000',9.54,'erik milla','Callao','adawdwdawd','dewdwd','12321312312',53.00,'905453404','DNI','TXN_E0820225'),(26,13,77.54,'PAGADA','boleta','tarjeta','2025-06-24 20:21:26','los olivos','','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 15:21:26.000000',NULL,'2025-06-24 15:21:26.000000',9.54,'erik milla','Callao',NULL,'dewdwd',NULL,53.00,'905453404','DNI','TXN_C7BFD52B'),(27,13,77.54,'PAGADA','boleta','tarjeta','2025-06-24 20:27:52','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 15:27:52.000000',NULL,'2025-06-24 15:27:52.000000',9.54,'erik sanchez','Callao',NULL,'dewdwd',NULL,53.00,'905453404','DNI','TXN_24AA4F06'),(28,13,77.54,'PAGADA','boleta','tarjeta','2025-06-24 20:37:45','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 15:37:45.000000',NULL,'2025-06-24 15:37:45.000000',9.54,'erik milla','Callao',NULL,'dewdwd',NULL,53.00,'905453404','DNI','TXN_C56BEAA8'),(30,13,52.76,'PAGADA','boleta','tarjeta','2025-06-24 20:39:53','puente piedra','','Lima',NULL,'Mi Perú','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 15:39:53.000000',NULL,'2025-06-24 15:39:53.000000',5.76,'erik milla','Callao',NULL,'dewdwd',NULL,32.00,'905453404','DNI','TXN_38DA5CC8'),(31,13,52.76,'PAGADA','boleta','tarjeta','2025-06-24 20:50:28','puente piedra','','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 15:50:28.000000',NULL,'2025-06-24 15:50:28.000000',5.76,'erik milla','Callao',NULL,'dewdwd',NULL,32.00,'905453404','DNI','TXN_C9104593'),(32,13,52.76,'PAGADA','boleta','tarjeta','2025-06-24 20:54:50','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 15:54:50.000000',NULL,'2025-06-24 15:54:50.000000',5.76,'erik milla','Callao',NULL,'dewdwd',NULL,32.00,'905453404','DNI','TXN_921E8E4A'),(33,13,44.50,'PAGADA','boleta','tarjeta','2025-06-24 21:07:53','puente piedra','9983','Lima',NULL,'Carmen de la Legua Reynoso','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 16:07:53.000000',NULL,'2025-06-24 16:07:53.000000',4.50,'angel milla','Callao',NULL,'dewdwd',NULL,25.00,'905453404','DNI',NULL),(34,13,44.50,'PAGADA','boleta','tarjeta','2025-06-24 21:49:08','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 16:49:08.000000',NULL,'2025-06-24 16:49:08.000000',4.50,'erik milla','Callao',NULL,'dewdwd',NULL,25.00,'905453404','DNI',NULL),(35,13,52.76,'PAGADA','boleta','tarjeta','2025-06-24 21:50:38','puente piedra','','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 16:50:38.000000',NULL,'2025-06-24 16:50:38.000000',5.76,'erik milla','Callao',NULL,'dewdwd',NULL,32.00,'905453404','DNI',NULL),(36,13,52.76,'PAGADA','boleta','tarjeta','2025-06-24 21:54:37','puente piedra','','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 16:54:37.000000',NULL,'2025-06-24 16:54:37.000000',5.76,'erik milla','Callao',NULL,'dewdwd',NULL,32.00,'905453404','DNI',NULL),(37,13,52.76,'PAGADA','boleta','tarjeta','2025-06-24 22:01:46','puente piedra','','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 17:01:46.000000',NULL,'2025-06-24 17:01:46.000000',5.76,'erik milla','Callao',NULL,'dewdwd',NULL,32.00,'905453404','DNI',NULL),(38,13,69.28,'PAGADA','boleta','tarjeta','2025-06-24 22:16:18','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 17:16:18.000000',NULL,'2025-06-24 17:16:18.000000',8.28,'erik milla','Callao',NULL,'dewdwd',NULL,46.00,'908503404','DNI',NULL),(39,13,69.28,'PAGADA','boleta','tarjeta','2025-06-24 22:25:34','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 17:25:34.000000',NULL,'2025-06-24 17:25:34.000000',8.28,'erik milla','Callao',NULL,'dewdwd',NULL,46.00,'905453404','DNI',NULL),(40,13,69.28,'PENDIENTE','boleta',NULL,'2025-06-24 22:32:42',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-24 17:32:42.000000',NULL,NULL,8.28,NULL,NULL,NULL,NULL,NULL,46.00,NULL,NULL,NULL),(41,13,69.28,'PENDIENTE','boleta',NULL,'2025-06-24 22:32:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-24 17:32:54.000000',NULL,NULL,8.28,NULL,NULL,NULL,NULL,NULL,46.00,NULL,NULL,NULL),(42,13,69.28,'PENDIENTE','boleta',NULL,'2025-06-24 22:35:30',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-24 17:35:30.000000',NULL,NULL,8.28,NULL,NULL,NULL,NULL,NULL,46.00,NULL,NULL,NULL),(43,13,69.28,'PAGADA','boleta','tarjeta','2025-06-24 22:40:25','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 17:40:25.000000',NULL,'2025-06-24 17:40:25.000000',8.28,'erik milla','Callao',NULL,'dewdwd',NULL,46.00,'905453404','DNI',NULL),(51,13,38.60,'PAGADA','boleta','tarjeta','2025-06-24 22:54:41','puente piedra','','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 17:54:41.000000',NULL,'2025-06-24 17:54:41.000000',3.60,'erik milla','Callao',NULL,'dewdwd',NULL,20.00,'905453404','DNI',NULL),(53,13,82.26,'PAGADA','boleta','tarjeta','2025-06-24 22:57:56','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 17:57:56.000000',NULL,'2025-06-24 17:57:56.000000',10.26,'erik milla','Callao',NULL,'dewdwd',NULL,57.00,'905453404','DNI',NULL),(56,13,61.02,'PAGO_FALLIDO','boleta',NULL,'2025-06-24 23:01:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,15.00,'2025-06-24 18:01:06.000000',NULL,NULL,7.02,NULL,NULL,NULL,NULL,NULL,39.00,NULL,NULL,NULL),(60,13,58.66,'PAGADA','boleta','tarjeta','2025-06-24 23:12:20','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 18:12:20.000000',NULL,'2025-06-24 18:12:20.000000',6.66,'erik milla','Callao',NULL,'dewdwd',NULL,37.00,'905453404','DNI',NULL),(62,13,69.28,'PAGADA','boleta','yape','2025-06-24 23:13:18','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 18:13:18.000000',NULL,'2025-06-24 18:13:18.000000',8.28,'erik milla','Callao',NULL,'dewdwd',NULL,46.00,'905453404','DNI',NULL),(64,13,79.90,'PAGADA','boleta','tarjeta','2025-06-24 23:19:20','puente piedra','9983','Lima',NULL,'Bellavista','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 18:19:20.000000',NULL,'2025-06-24 18:19:20.000000',9.90,'erik milla','Callao',NULL,'dewdwd',NULL,55.00,'905453404','DNI',NULL),(67,13,29.16,'PAGADA','boleta','tarjeta','2025-06-25 00:28:29','puente piedra','9983','Lima',NULL,'Callao','72397838','erikmilla456@gmail.com',15.00,'2025-06-24 19:28:29.000000',NULL,'2025-06-24 19:28:29.000000',2.16,'erik milla','Callao',NULL,'dewdwd',NULL,12.00,'905453404','DNI',NULL),(69,5,NULL,'PENDIENTE',NULL,NULL,'2025-06-25 01:38:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-24 20:38:50.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,5,NULL,'PENDIENTE',NULL,NULL,'2025-06-25 01:38:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-24 20:38:50.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,13,128.28,'PAGADA','boleta','tarjeta','2025-06-25 01:40:46','Hhha','75432','Lima',NULL,'Bellavista','34424524','erikmilla456@gmail.com',15.00,'2025-06-24 20:40:46.000000',NULL,'2025-06-24 20:40:46.000000',17.28,'MARTIN MILLA','Callao',NULL,'Por ahí',NULL,96.00,'987465876','DNI',NULL),(73,13,331.58,'PAGADA','boleta','tarjeta','2025-06-25 14:46:52','Hhha','8424','Lima',NULL,'Callao','85285754','erikmilla456@gmail.com',0.00,'2025-06-25 09:46:52.000000',NULL,'2025-06-25 09:46:52.000000',50.58,'Gabriel Vicente','Callao',NULL,'',NULL,281.00,'987467374','DNI',NULL),(74,13,NULL,'PENDIENTE',NULL,NULL,'2025-07-02 14:17:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-02 09:17:28.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,4,NULL,'PENDIENTE',NULL,NULL,'2025-07-09 00:07:13',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-08 19:07:13.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,4,NULL,'PENDIENTE',NULL,NULL,'2025-07-09 00:07:13',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-08 19:07:13.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'bd_Integrador'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-09  0:26:51
