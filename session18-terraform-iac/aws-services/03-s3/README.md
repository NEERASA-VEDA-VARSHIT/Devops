# AWS S3: Simple Storage Service — Cloud Object Storage Architecture

**Course:** SST DevOps & Cloud [SWE]  
**Session:** 18 - Terraform & Infrastructure as Code  
**Module:** AWS Services Research: 03 - S3  
**Author:** Neerasa Veda Varshit (`24bcs10005`)  
**Repository:** `NEERASA-VEDA-VARSHIT/Devops` / `session18-terraform-iac/aws-services/03-s3`

---

## 1. What is Amazon S3?

**Amazon Simple Storage Service (Amazon S3)** is an object storage service offering industry-leading scalability, data availability, security, and performance. S3 is designed to deliver **99.999999999% (11 9's)** of data durability by automatically replicating objects across multiple physical Availability Zones within an AWS Region.

---

## 2. Core S3 Concepts

### 1. Buckets & Objects
- **Bucket:** A top-level container for stored files in S3. Bucket names must be **globally unique across all AWS accounts worldwide** (e.g. `veda-devops-terraform-bucket-2026`).
- **Object:** The fundamental entity stored in S3, consisting of:
  - **Key:** The unique name / path identifier (e.g. `images/profile-pic.png`).
  - **Value:** The raw binary data (up to 5TB per individual object).
  - **Metadata:** Key-value pairs describing content type, upload timestamp, or custom tags.
  - **Version ID:** Unique identifier when bucket versioning is enabled.

### 2. Storage Classes & Cost Optimization

| Storage Class | Availability | Durability | Retrieval Time | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **S3 Standard** | 99.99% | 11 9's | Milliseconds | Frequently accessed active data, web assets |
| **S3 Intelligent-Tiering**| 99.9% | 11 9's | Milliseconds | Data with unknown or unpredictable access patterns |
| **S3 Standard-IA** | 99.9% | 11 9's | Milliseconds | Infrequently accessed data requiring instant retrieval |
| **S3 One Zone-IA** | 99.5% | 11 9's (1 AZ) | Milliseconds | Re-creatable backups, non-critical secondary copies |
| **S3 Glacier Flexible** | 99.99% | 11 9's | Minutes to hours | Long-term compliance archives, annual audits |
| **S3 Glacier Deep Archive**| 99.99% | 11 9's | 12 to 48 hours | Lowest cost archive storage (pennies per TB/month) |

### 3. Bucket Versioning
- Preserves every version of every object stored in your bucket.
- Protects against accidental user deletion and malicious overwrites.
- Deleting an object creates a **Delete Marker** rather than destroying the binary, allowing instant recovery.

### 4. Lifecycle Policies
Automated rules that manage objects throughout their lifecycle:
```text
Day 0: Object created in S3 Standard
  │
  ▼ (After 30 days)
Transition to S3 Standard-IA (Save 40% storage cost)
  │
  ▼ (After 90 days)
Transition to S3 Glacier Flexible (Save 80% storage cost)
  │
  ▼ (After 365 days)
Permanent Object Expiration / Deletion
```

### 5. Server-Side Encryption (SSE)
- **SSE-S3 (`AES256`):** Encryption keys managed by Amazon S3 (default and transparent).
- **SSE-KMS (`aws:kms`):** Keys managed via AWS Key Management Service (KMS), providing audit logs and granular access controls.
- **SSE-C:** Encryption with customer-provided keys.

### 6. Bucket Policies vs Access Control Lists (ACLs)
- **Bucket Policy:** A JSON IAM-style policy attached directly to the bucket controlling permissions for cross-account users or public access.
- **Block Public Access:** Global account and bucket setting that prevents public exposure of sensitive data.

---

## 3. Production DevOps Use Cases
1. **Terraform Remote State Backend:** Storing `terraform.tfstate` with versioning and S3 state encryption.
2. **Static Website Hosting:** Hosting React/Vite single-page applications behind CloudFront CDN.
3. **Application Log Aggregation & Long-Term Retention:** Archiving ELK/Loki log files and database backup dumps.
4. **CI/CD Build Artifact Repository:** Storing compiled packages, binaries, and test coverage reports.
