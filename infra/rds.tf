resource "aws_db_subnet_group" "rds" {
  name       = "url-shortener-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "url-shortener-db-subnet-group"
  }
}

resource "aws_db_instance" "mysql" {
  identifier             = "url-shortener-rds"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  max_allocated_storage  = 50
  storage_type           = "gp2"
  multi_az               = true
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true

  tags = {
    Name = "url-shortener-mysql-rds"
  }
}
