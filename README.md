# Production-Grade URL Shortener on AWS (Go + Terraform + GitHub Actions)

A high-performance RESTful URL shortener API written in Go, deployed on highly available AWS infrastructure using Terraform (VPC, RDS MySQL Multi-AZ, Application Load Balancer, Auto Scaling Group), and automated via GitHub Actions CI/CD.

---

## 📁 Project Structure

```
.
├── app/                      # Go Application Source Code
│   ├── go.mod                # Go module specification
│   ├── go.sum                # Dependencies lockfile
│   ├── main.go               # HTTP server entrypoint
│   ├── store/                # Database & Base62 code generator logic
│   │   ├── db.go             # MySQL schema migration & atomic queries
│   │   ├── generator.go      # Base62 random short code generator
│   │   └── generator_test.go # Generator unit tests
│   └── handlers/             # REST HTTP Handlers
│       ├── handlers.go       # Shorten, Redirect & Health handlers
│       └── handlers_test.go  # Handler unit tests (with mock store)
├── infra/                    # Terraform Infrastructure (ap-south-1)
│   ├── provider.tf           # AWS provider configuration
│   ├── variables.tf          # Configurable variables
│   ├── vpc.tf                # VPC, 2 Public + 2 Private Subnets, IGW, NAT GW
│   ├── security_groups.tf    # ALB, EC2, and RDS Security Groups
│   ├── rds.tf                # Multi-AZ RDS MySQL instance
│   ├── alb.tf                # Application Load Balancer & Target Group
│   ├── asg.tf                # Launch Template & Auto Scaling Group
│   ├── route53.tf            # Route 53 DNS record (optional)
│   ├── outputs.tf            # Terraform output values
│   └── terraform.tfvars.example # Sample variables file
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD Pipeline
└── README.md
```

---

## 🚀 Phase 1 — App Code (Go REST API)

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/shorten` | Accepts JSON `{"url": "https://example.com"}` and returns `{"code": "xYz123", "short_url": "http://<host>/xYz123"}` |
| `GET` | `/{code}` | Increments `click_count` atomically in DB and performs `302 Found` HTTP redirect |
| `GET` | `/health` | Healthcheck endpoint returning HTTP `200 OK` `{"status": "UP", "database": "connected"}` |

### Local Testing & Build Commands

```bash
# Navigate to app directory
cd app

# Run unit tests
go test -v ./...

# Build binary locally
go build -o url-shortener-app .

# Run application locally
./url-shortener-app
```

---

## 🏗️ Phase 2 — Infra as Code (Terraform)

All resources are created in AWS Region **`ap-south-1`**:

1. **VPC Architecture**: 1 VPC (`10.0.0.0/16`), 2 Public Subnets + 2 Private Subnets across 2 Availability Zones (`ap-south-1a`, `ap-south-1b`), Internet Gateway, Elastic IP & NAT Gateway.
2. **Database (RDS)**: MySQL 8.0 `db.t3.micro` Multi-AZ instance deployed in private subnets. Security group restricted strictly to port `3306` from EC2 instances.
3. **Compute (ASG)**: Launch Template with Amazon Linux 2023 systemd configuration, Auto Scaling Group (Min: 2, Desired: 2, Max: 4) across 2 AZs, health check type `ELB`.
4. **Load Balancer (ALB)**: Public Application Load Balancer listening on port `80`, target group port `8080`, health check path `/health`.
5. **Route 53**: Conditional Alias record pointing to ALB DNS.

### Running Terraform

```bash
cd infra

# Initialize Terraform plugins
terraform init

# Generate & review execution plan (DOES NOT apply)
terraform plan

# Apply infrastructure (only after human approval!)
# terraform apply
```

---

## ⚙️ Phase 3 — CI/CD Pipeline & GitHub Secrets

The `.github/workflows/deploy.yml` pipeline triggers on push to the `main` branch and performs:
1. Runs Go unit tests (`go test -v ./...`)
2. Cross-compiles Linux AMD64 binary (`GOOS=linux GOARCH=amd64`)
3. Authenticates to AWS via GitHub Secrets
4. Triggers Auto Scaling Group Instance Refresh (`aws autoscaling start-instance-refresh`)

### Required GitHub Repository Secrets

To enable CI/CD deployment, add the following secrets in your GitHub repository:
**Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:

| Secret Name | Description | Example / Default |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key ID with ASG & EC2 permissions | `AKIAUNMGAXSQUCN74G7G` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Access Key | `VyDN1lxGN0uEOHx...` |
| `AWS_REGION` | Target AWS region | `ap-south-1` |
| `ASG_NAME` | Name of the deployed Auto Scaling Group | *(Output from `terraform output asg_name`)* |
