-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 13, 2022 at 08:16 PM
-- Server version: 10.2.44-MariaDB-cll-lve
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `solutio8_martplast`
--

-- --------------------------------------------------------

--
-- Table structure for table `CLIENTES`
--

CREATE TABLE `CLIENTES` (
  `NumeroDeCliente` int(10) UNSIGNED NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Provincia` varchar(50) DEFAULT '-',
  `Localidad` varchar(50) DEFAULT '-',
  `Direccion` text DEFAULT '-',
  `Telefono` int(15) DEFAULT NULL,
  `Rubro` varchar(50) DEFAULT '-',
  `ArticulosDeInteres` varchar(200) DEFAULT '-',
  `Potencial` enum('SI','NO') DEFAULT 'NO',
  `Observaciones` text DEFAULT '-'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `DETALLES_PEDIDO`
--

CREATE TABLE `DETALLES_PEDIDO` (
  `NumeroPedido` int(10) UNSIGNED NOT NULL,
  `Producto` int(10) UNSIGNED NOT NULL,
  `Cantidad` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PEDIDOS`
--

CREATE TABLE `PEDIDOS` (
  `NumeroDePedido` int(10) UNSIGNED NOT NULL,
  `Fecha` date DEFAULT NULL,
  `NumeroDeCliente` int(10) UNSIGNED DEFAULT NULL,
  `Pedido` text DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Direccion` text DEFAULT '-',
  `Zona` enum('ZonaOeste','ZonaSur','ZonaNorte','CABA','Deposito','Expreso') DEFAULT 'ZonaOeste',
  `Entregado` enum('SI','NO') DEFAULT 'NO',
  `Observaciones` text DEFAULT '-'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PRODUCTOS`
--

CREATE TABLE `PRODUCTOS` (
  `NumeroDeProducto` int(10) UNSIGNED NOT NULL,
  `Producto` varchar(200) DEFAULT NULL,
  `Stock` int(10) UNSIGNED DEFAULT NULL,
  `Precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `USUARIOS`
--

CREATE TABLE `USUARIOS` (
  `NumeroDeUsuario` int(10) UNSIGNED NOT NULL,
  `Username` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USUARIOS`
--

INSERT INTO `USUARIOS` (`NumeroDeUsuario`, `Username`, `Password`) VALUES
(1, 'Martplast', '$2b$10$mTLikYRIcT4v6.LoYVB8P.9boxMkPU2Rakt16Q79o8bh.7wm.9VES');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CLIENTES`
--
ALTER TABLE `CLIENTES`
  ADD PRIMARY KEY (`NumeroDeCliente`);

--
-- Indexes for table `DETALLES_PEDIDO`
--
ALTER TABLE `DETALLES_PEDIDO`
  ADD PRIMARY KEY (`NumeroPedido`,`Producto`),
  ADD KEY `Producto` (`Producto`);

--
-- Indexes for table `PEDIDOS`
--
ALTER TABLE `PEDIDOS`
  ADD PRIMARY KEY (`NumeroDePedido`),
  ADD KEY `NumeroDeCliente` (`NumeroDeCliente`);

--
-- Indexes for table `PRODUCTOS`
--
ALTER TABLE `PRODUCTOS`
  ADD PRIMARY KEY (`NumeroDeProducto`);

--
-- Indexes for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  ADD PRIMARY KEY (`NumeroDeUsuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `CLIENTES`
--
ALTER TABLE `CLIENTES`
  MODIFY `NumeroDeCliente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PEDIDOS`
--
ALTER TABLE `PEDIDOS`
  MODIFY `NumeroDePedido` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PRODUCTOS`
--
ALTER TABLE `PRODUCTOS`
  MODIFY `NumeroDeProducto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  MODIFY `NumeroDeUsuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `DETALLES_PEDIDO`
--
ALTER TABLE `DETALLES_PEDIDO`
  ADD CONSTRAINT `DETALLES_PEDIDO_ibfk_1` FOREIGN KEY (`NumeroPedido`) REFERENCES `PEDIDOS` (`NumeroDePedido`),
  ADD CONSTRAINT `DETALLES_PEDIDO_ibfk_2` FOREIGN KEY (`Producto`) REFERENCES `PRODUCTOS` (`NumeroDeProducto`);

--
-- Constraints for table `PEDIDOS`
--
ALTER TABLE `PEDIDOS`
  ADD CONSTRAINT `PEDIDOS_ibfk_1` FOREIGN KEY (`NumeroDeCliente`) REFERENCES `CLIENTES` (`NumeroDeCliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
