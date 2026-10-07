# Terraform S3 Bucket Demo

## Project Structure

```text
terraform-s3-demo/
|
|-- README.md
|-- terraform.tf
|-- providers.tf
|-- variables.tf
|-- terraform.tfvars
|-- main.tf
|-- outputs.tf
|-- .gitignore
```

## Architecture

```text
terraform.tf
     |
     v
Provider Configuration
     |
     v
variables.tf
     |
     v
terraform.tfvars
     |
     v
main.tf
     |
     v
aws_s3_bucket.yatri10005
     |
     v
AWS S3 Bucket
     |
     v
outputs.tf
```

## Prerequisites

Install:

* Terraform
* AWS CLI

Configure AWS:

```bash
aws configure
```

Verify:

```bash
aws sts get-caller-identity
```

## Terraform Workflow

### 1. Initialize

```bash
terraform init
```

Expected:

```text
Initializing provider plugins...
- Finding hashicorp/aws versions matching ">= 5.0.0"...
- Installing hashicorp/aws v5.82.2...
Terraform has been successfully initialized!
```

### 2. Format

```bash
terraform fmt
```

### 3. Validate

```bash
terraform validate
```

Expected:

```text
Success! The configuration is valid.
```

### 4. Plan

```bash
terraform plan
```

Expected:

```text
Plan: 1 to add, 0 to change, 0 to destroy.
```

### 5. Apply

```bash
terraform apply
```

Terraform asks:

```text
Do you want to perform these actions?
  Only 'yes' will be accepted to approve.
Enter a value:
```

Enter:

```text
yes
```

Expected:

```text
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
Outputs:
bucket_arn = "arn:aws:s3:::yatri10005"
bucket_name = "yatri10005"
bucket_region = "ap-south-1"
```

### 6. Check State

```bash
terraform state list
```

Expected:

```text
aws_s3_bucket.yatri10005
```

Inspect the resource:

```bash
terraform state show aws_s3_bucket.yatri10005
```

### 7. Check Output

```bash
terraform output
```

Or:

```bash
terraform output bucket_name
```

Expected:

```text
"yatri10005"
```

### 8. Verify Using AWS CLI

```bash
aws s3 ls
```

Or:

```bash
aws s3api head-bucket --bucket yatri10005
```

### 9. Destroy

After completing the demo:

```bash
terraform plan -destroy
```

Then:

```bash
terraform destroy
```

Enter:

```text
yes
```

Expected:

```text
Destroy complete! Resources: 1 destroyed.
```

## Complete Demo

Run:

```bash
aws sts get-caller-identity
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform output
terraform state list
terraform state show aws_s3_bucket.yatri10005
terraform plan -destroy
terraform destroy
```

## Screenshots & Evidence
Authentic terminal execution screenshots are archived in [`../screenshots/`](../screenshots/):
* `01-terraform-init-validate.png`: Provider initialization, code formatting and syntax validation
* `02-terraform-plan-resource.png` & `03-terraform-plan-outputs.png`: Declarative execution plan
* `04-terraform-apply-iam-troubleshooting.png`: Real-world IAM policy boundary debugging
* `05-terraform-apply-success.png`: Successful bucket creation and output exports
* `06-terraform-destroy.png`: Clean teardown of resources

## Terraform Lifecycle

```text
              .tf files
                  |
                  v
          terraform init
                  |
                  v
          terraform validate
                  |
                  v
            terraform plan
                  |
                  v
           terraform apply
                  |
                  v
             AWS S3
                  |
                  v
          terraform state
                  |
                  v
          terraform destroy
```
