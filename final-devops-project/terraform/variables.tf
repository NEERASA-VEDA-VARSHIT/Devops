variable "aws_region" {
  type        = string
  description = "AWS region for deployment"
  default     = "ap-south-1"
}

variable "cluster_name" {
  type        = string
  description = "Name of the EKS cluster"
  default     = "taskboard-eks"
}

variable "environment" {
  type        = string
  description = "Environment tier (dev/staging/prod)"
  default     = "dev"
}
