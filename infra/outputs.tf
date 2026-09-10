output "vpc_id" {
  description = "ID of created VPC"
  value       = aws_vpc.main.id
}

output "alb_dns_name" {
  description = "Public DNS Name of the Application Load Balancer"
  value       = aws_lb.alb.dns_name
}

output "rds_endpoint" {
  description = "RDS MySQL Database Endpoint"
  value       = aws_db_instance.mysql.endpoint
}

output "asg_name" {
  description = "Auto Scaling Group Name"
  value       = aws_autoscaling_group.app.name
}
