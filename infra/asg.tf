data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_launch_template" "app" {
  name_prefix   = "url-shortener-lt-"
  image_id      = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.ec2.id]
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              set -e
              echo "Starting user_data setup..."
              yum update -y
              yum install -y golang git

              mkdir -p /opt/url-shortener
              cd /opt/url-shortener

              # Write systemd service file
              cat << 'SERVICE' > /etc/systemd/system/url-shortener.service
              [Unit]
              Description=URL Shortener Go Application
              After=network.target

              [Service]
              Type=simple
              User=root
              WorkingDirectory=/opt/url-shortener
              Environment="PORT=8080"
              Environment="DB_HOST=${aws_db_instance.mysql.address}"
              Environment="DB_PORT=3306"
              Environment="DB_USER=${var.db_username}"
              Environment="DB_PASSWORD=${var.db_password}"
              Environment="DB_NAME=${var.db_name}"
              ExecStart=/opt/url-shortener/app
              Restart=always

              [Install]
              WantedBy=multi-user.target
              SERVICE

              systemctl daemon-reload
              # Note: Binary will be deployed by CI/CD workflow into /opt/url-shortener/app
              EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "url-shortener-asg-instance"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "app" {
  name_prefix         = "url-shortener-asg-"
  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]

  min_size         = 2
  desired_capacity = 2
  max_size         = 4

  health_check_type         = "ELB"
  health_check_grace_period = 300

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
    triggers = ["tag"]
  }

  tag {
    key                 = "Name"
    value               = "url-shortener-ec2"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}
