---
title: "Volume Explained | Cloud"
slug: /volume-explained
sidebar_label: "Volume Explained"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "A volume is an object store that holds either structured tables or collections of unstructured data files. From a volume, you can import or migrate data directly into collections, or run ETL pipelines to transform unstructured data into embeddings and load them into collections. | Cloud"
type: origin
token: H22PwQ4DxiwKrrkQxlac21WenRe
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - cloud
  - volume

---

import Admonition from '@theme/Admonition';


# Volume Explained

A volume is an object store that holds either structured tables or collections of unstructured data files. From a volume, you can import or migrate data directly into collections, or run ETL pipelines to transform unstructured data into embeddings and load them into collections.

## Types of volume\{#types-of-volume}

Zilliz Cloud supports two types of volumes:

![DKAYwcIgJhudJnbw8Sbczhttntb](https://zdoc-images.s3.us-west-2.amazonaws.com/DKAYwcIgJhudJnbw8Sbczhttntb.png)

- **Managed volume**: Stores data in Zilliz Cloud-managed storage. You upload files from your local file system, then import, migrate, or run ETL pipelines to load the data into collections. Best for users who do not maintain their own cloud object storage.

- **External volume** (Public Preview): Maps to a bucket in your own cloud object storage bucket - your data stays in your bucket. You can import or migrate data into collections, or create external collections that reference the data directly. Best for users who want to keep data in their own storage while using it with Zilliz Cloud.

The following table compares the two types of volumes.

<table>
   <tr>
     <th></th>
     <th><p><strong>Managed Volume</strong></p></th>
     <th><p><strong>External Volume</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>Data location</strong></p></td>
     <td><p>Zilliz Cloud-managed storage</p></td>
     <td><p>Your own S3 or GCS bucket</p></td>
   </tr>
   <tr>
     <td><p><strong>Access control</strong></p></td>
     <td><ul><li><p>Determined by Zilliz Cloud RBAC</p></li><li><p>Authenticate via Zilliz Cloud API key</p></li></ul></td>
     <td><ul><li><p>Determined by Object Storage Service (OSS) RBAC</p></li><li><p>Authenticate via <a href="./integrate-with-aws-s3">storage integration</a></p></li></ul></td>
   </tr>
   <tr>
     <td><p><strong>Billing</strong></p></td>
     <td><p>Free trial or pay-as-you-go</p></td>
     <td><p>Free</p></td>
   </tr>
   <tr>
     <td><p><strong>Payment method required</strong></p></td>
     <td><p>Yes (for pay-as-you-go)</p></td>
     <td><p>No</p></td>
   </tr>
   <tr>
     <td><p><strong>Upload files to volume</strong></p></td>
     <td><p>Yes (via SDK or console)</p></td>
     <td><p>No — data stays in your bucket. Manage files directly in your cloud storage.</p></td>
   </tr>
   <tr>
     <td><p><strong>File operations</strong></p></td>
     <td><p>Read, write, delete</p></td>
     <td><p>Read-only</p></td>
   </tr>
   <tr>
     <td><p><strong>Use cases</strong></p></td>
     <td><p>Import, migration, data ETL</p></td>
     <td><p>Import, migration,  data ETL, and external collections</p></td>
   </tr>
   <tr>
     <td><p><strong>Cloud support</strong></p></td>
     <td><p>AWS, GCP</p></td>
     <td><p>AWS, GCP</p></td>
   </tr>
</table>

## Resource hierarchy\{#resource-hierarchy}

A volume belongs to a project, not to a single cluster. Any cluster in the same project can access the volume. What each user can do with the volume — such as creating, viewing, or deleting files — is determined by their [project roles](./project-users#project-role-and-access-comparison).

```bash
Organization
└─ Project
   ├─ Clusters
   │   └─ Databases
   │       └─ Collections
   ├─ Volumes
   │   ├─ Managed Volumes → Data files (Zilliz-hosted)
   │   └─ External Volumes → Maps to your cloud storage bucket (via Storage Integration)
   └─ Storage Integrations
```

## Use cases\{#use-cases}

You can use volumes for data import, data migration, and external collections. 

The following diagram shows the major application scenarios of Zilliz Cloud volumes.

You can use volumes in data import, data migration, and external collections, all of which need to fetch data from external sources but use the fetched data in different ways. 

- **Data import**

    Upload or reference prepared datasets in a volume and import them into a Zilliz Cloud collection. Both managed and external volumes can be used as an import source. For details, refer to [Import Data (Console)](./import-data-on-web-ui#from-a-volume), [Import Data (RESTful API)](./import-data-via-restful-api) and [Import Data (SDK)](./import-data-via-sdks).

- **Data migration**

    Upload backup files of your Milvus instance into a volume and restore them as a Zilliz Cloud cluster. Both managed and external volumes can be used. For details, refer to [Migrate from Milvus to Zilliz Cloud Via Backup Files](./via-backup-files).

- **External collections (Coming Soon)**

    Create external collections that map to data in an external volume, enabling you to query files in your own bucket directly from Zilliz Cloud without importing them first.

## Volume status\{#volume-status}

<table>
   <tr>
     <th><p><strong>Status</strong></p></th>
     <th><p><strong>Applies to</strong></p></th>
     <th><p><strong>Description</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>Running</strong></p></td>
     <td><p>Managed & external volumes</p></td>
     <td><p>The volume is active and usable.</p></td>
   </tr>
   <tr>
     <td><p><strong>Frozen</strong></p></td>
     <td><p>Managed & external volumes</p></td>
     <td><p>The organization is frozen due to overdue invoices. The volume cannot be used for new operations.</p></td>
   </tr>
   <tr>
     <td><p><strong>Error</strong></p></td>
     <td><p>External volumes only</p></td>
     <td><p>The <a href="./integrate-with-aws-s3">storage integration</a> validation failed. Check the configuration and retry.</p></td>
   </tr>
</table>

## Billing\{#billing}

### Managed volume\{#managed-volume}

When you create a managed volume, you can choose either a **free trial** or **pay-as-you-go** plan. The table below compares their typical use cases and limits.

<table>
   <tr>
     <th></th>
     <th><p><strong>Free Trial</strong></p></th>
     <th><p><strong>Pay-as-you-go</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>Use case</strong></p></td>
     <td><p>For testing environments only.</p></td>
     <td><p>For production usage.</p></td>
   </tr>
   <tr>
     <td><p><strong>Capacity</strong></p></td>
     <td><p>5 GB</p></td>
     <td><p>Unlimited</p></td>
   </tr>
   <tr>
     <td><p><strong>File size & amount per upload</strong></p></td>
     <td><p>Up to 1 GB of data and no more than 1,000 files in each upload</p></td>
     <td><p>Up to 100 GB of data and unlimited number of files in each upload</p></td>
   </tr>
   <tr>
     <td><p><strong>Max. numbers volumes</strong></p></td>
     <td><p>1</p></td>
     <td><p>100</p></td>
   </tr>
</table>

**Free trial volume**

- No payment method is required.

- Each organization can have only one free trial volume.

- The free trial volume is retained for 30 days and is then deleted automatically.

**Pay-as-you-go volume**

- A valid payment method is required.

- Using a pay-as-you-go volume incurs charges.

    - You will only be charged when the managed volume is running.

    - For list prices, see [Pricing Guide](http://zilliz.com/pricing/pricing-guide).

    - To understand how volume charges are calculated, see [Storage Cost](./storage-cost).

### External volume\{#external-volume}

Creating and using an external volume incurs no Zilliz Cloud charges. No payment method is required.

However, your cloud provider may charge data request fees when Zilliz Cloud reads from your bucket during import or migration. For details, see [Amazon S3 Pricing](https://aws.amazon.com/s3/pricing/) or [Google Cloud Storage Pricing](https://cloud.google.com/storage/pricing.)

## Limitations\{#limitations}

- Volumes are available on **AWS** and **Google Cloud** only. For **Azure**, [contact support](https://support.zilliz.com/).

- A volume must be in the same cloud provider and region as the cluster you plan to use it with.

- To create and manage volumes, you need to be a **Project Admin**.

- Each organization can create a maximum of **100 managed volumes** and **100 external volumes**.

## FAQs\{#faqs}

**What happens to my volumes if my organization is frozen due to overdue invoices?**

If an organization is frozen, all managed Volumes — both free trial and pay-as-you-go — and all files stored in them are deleted and cannot be restored. External volumes are also frozen and cannot be used for new operations, but your data in your own bucket is not affected.

To continue using volumes, first settle all outstanding invoices.

**Why can't I see the free trial volume option on the web console?**

The free trial volume option is hidden once a free trial volume has been created for your organization. Each organization can create only one free trial volume.

**What is the difference between an external volume and importing directly from external storage?**

Both allow you to import data from your own S3 or GCS bucket. The key differences are:

- External volume uses a [storage integration](./integrate-with-aws-s3) for credential management. Credentials are set up once and reused across multiple volumes and operations. Data engineers do not need direct access to cloud storage keys.

- Direct [external storage import](./import-data-on-web-ui#remote-files-from-an-object-storage-bucket) requires you to provide credentials (access key, secret key) inline with each import request. This is simpler for one-time imports but does not offer credential separation or reusability.

**Can I modify the storage integration or path of an external volume after creation?**

No. The storage integration and path cannot be changed after an external volume is created. To use a different storage integration or path, create a new external volume.

**Can I delete an external volume that is referenced by an active job or external collection?**

No. Deletion is blocked if downstream external collections or active jobs reference the volume.

**Will I be charged for data transfer fees when I use an external volume?**

No. External volumes must be in the same cloud provider and region as your cluster. Since all data access occurs within the same region, no cross-region data transfer fees are incurred on Zilliz Cloud. 