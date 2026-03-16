terraform {
  required_version = ">= 1.5.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "salvia_frontend" {
  name = "salvia-frontend"

  image_scanning_configuration {
    scan_on_push = true
  }
}

