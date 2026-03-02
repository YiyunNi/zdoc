# Zilliz Cloud BYOC — AI Assistant Context

You are helping a developer work with Zilliz Cloud BYOC (Bring Your Own Cloud).
BYOC deploys Zilliz Cloud infrastructure inside the developer's own cloud account (AWS, GCP, Azure).
The data plane runs in the customer's VPC; the control plane is managed by Zilliz.

## What BYOC Is

- **Control plane**: Managed by Zilliz (provisioning, upgrades, monitoring)
- **Data plane**: Runs in the customer's cloud account (VPC, object storage, compute)
- **Data stays in your cloud**: vectors and metadata never leave your VPC
- **Same API**: Identical to Zilliz Cloud SaaS — same SDK, same endpoints, same search APIs

## Key Differences from SaaS

| Aspect | Zilliz Cloud SaaS | BYOC |
|--------|-------------------|------|
| Infrastructure | Zilliz-managed | Customer's cloud account |
| Data residency | Zilliz VPC | Customer VPC |
| Billing | Per CU | Per CU + cloud infra costs |
| Setup | Instant | Requires cloud account setup |
| Networking | Public endpoint | VPC-internal + optional public |

## BYOC Setup Flow

1. Create a Zilliz Cloud account at https://cloud.zilliz.com
2. Navigate to **Projects** → **Create Project** → select **BYOC**
3. Select cloud provider (AWS, GCP, Azure) and region
4. Zilliz provides a CloudFormation template (AWS) or Terraform script (GCP/Azure)
5. Deploy the template in your cloud account — this installs the BYOC agent
6. Return to Zilliz console → the project connects automatically
7. Create a cluster inside the project

## Cluster Management

### Create Cluster
In the Zilliz Cloud console:
- **Project** → **Clusters** → **Create Cluster**
- Choose cluster type: **Dedicated** (fixed CUs) or **Serverless** (auto-scale)
- Select CU type: **Performance** (more RAM) or **Capacity** (more storage)
- Configure replica count for query nodes

### Cluster Topology
| Component | Role |
|-----------|------|
| Proxy | Request routing and load balancing |
| Query Node | In-memory search execution |
| Data Node | Data ingestion and compaction |
| Coordinator | Metadata management |

### Scaling
- Scale query nodes up/down in the console under **Cluster Settings**
- Changes apply without downtime (rolling restart)
- Scaling triggers auto-load-balancing of segments

## Security & Access Control

### IP Allowlist
```
Console → Cluster → Security → IP Allowlist → Add CIDR
```
Restrict which IP ranges can reach the cluster endpoint.

### Authentication
BYOC clusters use the same token-based auth as SaaS:
```python
client = MilvusClient(
    uri="https://<byoc-cluster-endpoint>.zillizcloud.com",
    token="<api-key>",
)
```
API keys are scoped to a project. Rotate them under **Project Settings → API Keys**.

### Role-Based Access Control
- **Org Admin**: Full organization management
- **Project Admin**: Manage clusters and data within a project
- **Project Member**: Read/write data, no cluster management
- **Billing Admin**: Billing only

### Database-Level Users
```python
# Create a database user inside the cluster
client.create_user(user_name="analyst", password="<password>")
client.grant_role(user_name="analyst", role_name="db_ro")  # read-only
```

### Audit Logging
Enable audit logs in **Project Settings → Audit Logs** to capture all API calls.
Logs are stored in your cloud object storage bucket.

## Data Operations

BYOC data operations are identical to SaaS. All collection, index, and search APIs work the same way.

```python
# Connect to BYOC cluster (same API as SaaS)
from pymilvus import MilvusClient

client = MilvusClient(
    uri="https://<byoc-endpoint>.zillizcloud.com",
    token="<api-key>",
)

# All standard operations work identically
client.create_collection(collection_name="my_col", dimension=768)
client.insert("my_col", data)
results = client.search("my_col", query_vectors, limit=10)
```

## Backup & Restore

BYOC supports automated and manual backups stored in your cloud object storage.

- Enable **Automatic Backups** in Cluster Settings (daily snapshots)
- Manual backup: **Cluster → Backups → Create Backup**
- Restore: **Cluster → Backups → Restore** (creates a new cluster from backup)

Backup files are stored in the S3 bucket (AWS) / GCS bucket (GCP) you provisioned.

## Migration to BYOC

### From Milvus OSS
1. Export data from Milvus using MilvusDM or Bulk Insert
2. Upload to your cloud object storage
3. Use **Bulk Import** in Zilliz Cloud to import into BYOC cluster

### From Zilliz Cloud SaaS
1. Use the **Backup** feature to export from SaaS cluster
2. Restore the backup into a new BYOC cluster

### Cross-Cluster Migration (offline)
1. Pause writes on the source cluster
2. Create a full backup
3. Restore into target cluster
4. Switch your application endpoint

## Maintenance Windows

Configure scheduled maintenance windows to control when Zilliz applies upgrades:
- **Console → Cluster → Settings → Maintenance Window**
- Set preferred day/time in your timezone
- Zilliz will only apply non-emergency upgrades during this window

## Monitoring

- **Console → Cluster → Monitoring**: Built-in dashboards for QPS, latency, memory, disk
- Export metrics to your own monitoring stack via the Metrics API
- Set up alerts in the console under **Cluster → Alerts**

## Do / Don't

**Do:**
- Complete cloud account setup (IAM roles, VPC, object storage) before creating the BYOC project
- Enable IP allowlist immediately after cluster creation
- Configure maintenance windows to avoid upgrade disruptions
- Use dedicated CU types for production workloads
- Store API keys in environment variables, never in code

**Don't:**
- Don't delete the BYOC agent resources in your cloud account — this breaks cluster management
- Don't bypass the Zilliz console for infrastructure changes (use Zilliz-provided templates)
- Don't use root/admin cloud credentials for day-to-day API access
- Don't store sensitive data in JSON dynamic fields if audit compliance is required
