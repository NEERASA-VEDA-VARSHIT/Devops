output "vpc_id" {
  value = aws_vpc.main.id
}

output "vpc_cidr" {
  value = aws_vpc.main.cidr_block
}

output "subnet_id" {
  value = aws_subnet.public.id
}

output "security_group_id" {
  value = aws_security_group.web.id
}

output "ec2_instance_id" {
  value = aws_instance.web_server.id
}

output "ec2_public_ip" {
  value = aws_instance.web_server.public_ip
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.app_storage.arn
}
