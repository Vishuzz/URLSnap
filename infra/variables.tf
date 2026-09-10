variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "availability_zones" {
  description = "AZs for subnets"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "db_name" {
  description = "RDS Database Name"
  type        = string
  default     = "urlshortener"
}

variable "db_username" {
  description = "RDS Master Username"
  type        = string
  default     = "urluser"
}

variable "db_password" {
  description = "RDS Master Password"
  type        = string
  sensitive   = true
  default     = "UrlShortenerSecurePass123!"
}

variable "instance_type" {
  description = "EC2 Instance Type for ASG"
  type        = string
  default     = "t3.micro"
}

variable "domain_name" {
  description = "Custom domain name (optional for Route 53)"
  type        = string
  default     = ""
}

variable "hosted_zone_id" {
  description = "Route 53 Hosted Zone ID (optional)"
  type        = string
  default     = ""
}
