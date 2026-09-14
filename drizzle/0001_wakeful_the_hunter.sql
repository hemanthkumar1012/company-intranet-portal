CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`userId` int NOT NULL,
	`workDate` date NOT NULL,
	`checkIn` timestamp,
	`checkOut` timestamp,
	`status` enum('present','late','on_leave') NOT NULL DEFAULT 'present',
	`source` enum('biometric','whatsapp','manual') NOT NULL DEFAULT 'manual',
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `biometric_devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`deviceId` varchar(100) NOT NULL,
	`type` enum('eSSL','Matrix') NOT NULL,
	`lastSync` timestamp,
	`status` enum('online','offline','needs_sync') NOT NULL DEFAULT 'online',
	CONSTRAINT `biometric_devices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`subdomain` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_subdomain_unique` UNIQUE(`subdomain`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255),
	`role` enum('admin','employee') NOT NULL DEFAULT 'employee',
	`empId` varchar(80) NOT NULL,
	`phone` varchar(40),
	`department` varchar(120),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('sick','casual') NOT NULL,
	`fromDate` date NOT NULL,
	`toDate` date NOT NULL,
	`reason` text,
	`status` enum('pending','approved','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`fileUrl` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `policies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_attendance_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`userId` int,
	`phone` varchar(40) NOT NULL,
	`message` enum('IN','OUT') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatsapp_attendance_logs_id` PRIMARY KEY(`id`)
);
