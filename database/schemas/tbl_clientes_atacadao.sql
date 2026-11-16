CREATE TABLE `tbl_clientes_atacadao` (
  `id` bigint(20) unsigned NOT NULL,
  `display_name` varchar(250) NOT NULL,
  `user_login` varchar(60) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `flag_delete` tinyint(4) DEFAULT 0,
  `full_name` text DEFAULT NULL COMMENT 'Name Completo',
  `document_number` varchar(32) DEFAULT NULL COMMENT 'CNPJ ou CPF',
  `company_name` varchar(255) DEFAULT NULL COMMENT 'Nome da Empresa',
  `mobile_phone` varchar(32) DEFAULT NULL COMMENT 'Telefone Celular',
  `postal_code` varchar(16) DEFAULT NULL COMMENT 'CEP',
  `address` text DEFAULT NULL COMMENT 'Endereco',
  `city` varchar(150) DEFAULT NULL COMMENT 'Cidade',
  `state` varchar(150) DEFAULT NULL COMMENT 'Estado',
  `neighborhood` varchar(150) DEFAULT NULL COMMENT 'Bairro',
  `salesperson` varchar(255) DEFAULT NULL COMMENT 'Informe o Vendedor',
  `base_purchase_store` varchar(255) DEFAULT NULL COMMENT 'Loja base de compra',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
