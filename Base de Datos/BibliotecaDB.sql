-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: biblioteca
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT 'Sin descripción',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Realismo mágico','Estilo narrativo donde lo mágico o sobrenatural se presenta como partenatural de la realidad. Lo extraordinario convive con lo cotidiano sin sorprender a los personajes.'),(2,'Novela Romantica','Se centra en las relaciones amorosas, sus conflictos, emociones y desenlaces. Puede tener subgéneros como drama, comedia o incluso fantasía.'),(3,'Ciencia Ficción','Explora futuros posibles, tecnologías avanzadas, viajes espaciales, inteligencia artificial o cambios sociales, muchas veces con base científica.'),(4,'Fábula','Es una narración breve, muchas veces con animales que hablan o actúan como humanos, y suele incluir una moraleja o enseñanza.'),(5,'Fantasía','Presenta mundos imaginarios donde existen magia, criaturas míticas, hechizos y poderes sobrenaturales. No se basa en la ciencia ni en la lógica del mundo real.'),(6,'Historia','Relata y analiza hechos del pasado (reales o interpretados), ya sea de forma académica o divulgativa. Puede centrarse en culturas, guerras, civilizaciones, etc.'),(7,'Futurismo','Imagina escenarios posibles del futuro, a menudo conectados con avances tecnológicos, inteligencia artificial, evolución humana o dilemas éticos.'),(8,'Autoayuda','Busca brindar herramientas, consejos o reflexiones para mejorar aspectos personales, como autoestima, relaciones, manejo del estrés o espiritualidad.'),(9,'Misterio','Se centra en la resolución de un enigma o crimen, manteniendo la tensión e incertidumbre hasta el final. Suelen incluir detectives, pistas y giros inesperados.'),(10,'Terror','Busca provocar miedo, angustia o repulsión en el lector, a través de elementos sobrenaturales, psicológicos, o situaciones perturbadoras');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libros`
--

DROP TABLE IF EXISTS `libros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(100) DEFAULT 'Desconocido',
  `isbn` varchar(13) NOT NULL,
  `editorial` varchar(100) DEFAULT 'Desconocido',
  `categoria_id` int NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `cantidad` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `fk_categoria` (`categoria_id`),
  CONSTRAINT `fk_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `chk_cantidad` CHECK ((`cantidad` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libros`
--

LOCK TABLES `libros` WRITE;
/*!40000 ALTER TABLE `libros` DISABLE KEYS */;
INSERT INTO `libros` VALUES (1,'Cien años de soledad','Gabriel García Márquez','9780307474728','Vintage Español',1,'https://m.media-amazon.com/images/I/91TvVQS7loL._SL1500_.jpg',0),(2,'Amor en los tiempos del cólera','Gabriel García Márquez','9780307389732','Vintage Español',2,'https://m.media-amazon.com/images/I/91IxbReQwhL._SL1500_.jpg',1),(3,'1984','George Orwell','9780451524935','Signet Classics',3,'https://m.media-amazon.com/images/I/71wANojhEKL._SL1500_.jpg',0),(4,'Rebelión en la granja','George Orwell','9780451526342','Signet Classics',4,'https://acdn-us.mitiendanube.com/stores/004/088/117/products/693089-710b14616ddefb838b17285681263158-640-0.jpg',1),(5,'Harry Potter y la piedra filosofal','J.K. Rowling','9788478884452','Salamandra',5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrSbcinnTKJv6W4d-6xBPHmcL-IKfeNBEfZw&s',1),(6,'Harry Potter y la cámara secreta','J.K. Rowling','9788478885190','Salamandra',5,'https://www.pottermorepublishing.com/wp-content/covers/web/9781781101322.jpg',1),(7,'De animales a dioses','Yuval Noah Harari','9788499924214','Debate',6,'https://m.media-amazon.com/images/I/21TYksJAQtL.jpg',1),(8,'Homo Deus: Breve historia del mañana','Yuval Noah Harari','9788499926225','Debate',7,'https://acdn-us.mitiendanube.com/stores/004/088/117/products/623511-b30018be3981d655d717274599624615-1024-1024.jpg',1),(9,'El poder del ahora','Eckhart Tolle','9788497773104','Gaia Ediciones',8,'https://acdn-us.mitiendanube.com/stores/004/088/117/products/552131-a778deab79161eb58417401964073511-1024-1024.jpg',1),(10,'El código Da Vinci','Dan Brown','9780307474278','Anchor Books',9,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRP593UUrKi_Ubch0HtcQMk_7t_-ol5hNHXA&s',1),(11,'Historias del diván','Gabriel Rolón','9789501294036','Planeta Libros',8,'https://m.media-amazon.com/images/I/81Kb7pM8v7L._UF1000,1000_QL80_.jpg',1);
/*!40000 ALTER TABLE `libros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamos`
--

DROP TABLE IF EXISTS `prestamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libro_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `fecha_prestamo` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_devolucion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prestamo_libro` (`libro_id`),
  KEY `fk_prestamo_usuario` (`usuario_id`),
  CONSTRAINT `fk_prestamo_libro` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`),
  CONSTRAINT `fk_prestamo_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamos`
--

LOCK TABLES `prestamos` WRITE;
/*!40000 ALTER TABLE `prestamos` DISABLE KEYS */;
INSERT INTO `prestamos` VALUES (7,1,6,'2025-07-01 00:00:00','2025-07-24 00:00:00'),(9,3,20,'2025-07-01 00:00:00','2025-07-10 00:00:00');
/*!40000 ALTER TABLE `prestamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasenia` varchar(255) DEFAULT NULL,
  `rol` varchar(20) DEFAULT 'Cliente',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (6,'Ivan','giordvan@gmail.com','$2b$12$F8gFEfILf0aKKrb77dsioOuKtsc1O5eWjmmbw4lpq6Ny3MyuYdp4C','Cliente'),(19,'PruebaBibliotecario','testb@gmail.com','$2b$12$h2i7iQuciZK7RwJ7SYnQ8uE8jz205693tm/moNZwyUE5xf1j5VJmK','Bibliotecario'),(20,'PruebaCLiente','pruebac@gmail.com','$2b$12$zxsjmGtf3RRqQGbifEXbTeAObfYIhn7WOIbSdEvvGfT4UnZwh5hMm','Cliente');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-03  8:55:02
