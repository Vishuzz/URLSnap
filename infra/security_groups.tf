resource "aws_security_group" "alb" {
  name        = "url-shortener-alb-sg"
  description = "Allow HTTP inbound traffic to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP from Internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "url-shortener-alb-sg"
  }
}

resource "aws_security_group" "ec2" {
  name        = "url-shortener-ec2-sg"
  description = "Allow traffic from ALB to EC2 instances"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP on 8080 from ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "url-shortener-ec2-sg"
  }
}

resource "aws_security_group" "rds" {
  name        = "url-shortener-rds-sg"
  description = "Allow MySQL traffic strictly from EC2 instances"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MySQL from EC2 SG only"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "url-shortener-rds-sg"
  }
}
