---
title: "Create Cluster | Cloud"
slug: /create-cluster
sidebar_label: "Create Cluster"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "A cluster is a set of compute resources that runs your vector database workloads. Zilliz Cloud offers two types serving clusters, which run continuously for production workloads requiring always-on, low-latency access, and on-demand clusters, which spin up only when requests arrive and scale to zero when idle. | Cloud"
type: origin
token: CvD0w4z7RiQUMpkAsTucP0G9nHG
sidebar_position: 1

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Create Cluster

A cluster is a set of compute resources that runs your vector database workloads. Zilliz Cloud offers two types: **serving clusters**, which run continuously for production workloads requiring always-on, low-latency access, and **on-demand clusters**, which spin up only when requests arrive and scale to zero when idle.   

This topic describes how to create a cluster.

## Considerations\{#considerations}

Ensure:

- Ownership of the organization or project where the cluster is to be established. For details on roles and permissions, see Access Control.

- You can only create a maximum of 100 serverless serving cluster, 100 dedicated serving cluster, and 20 on-demand clusters in each project.

## Create a serving cluster\{#create-a-serving-cluster}

Zilliz Cloud provides various serving cluster deployment options to accommodate the distinct business needs. 

- **Free**: provides a starting point for learning and personal projects with limitations on storage, vCU consumption, and the number of collections.

- **Serverless**: provides a shared environment that automatically scales to match your workload - no need to provision resources. This option delivers excellent cost efficiency and elasticity for unpredictable or spiky traffic.

- **Dedicated**: provides isolated, reserved environments for production workloads that demand consistent and predictable performance. This option is ideal for sustained high-throughput and latency-sensitive applications.

For a detailed explanation of each deployment option, see [Zilliz Cloud Pricing](https://zilliz.com/pricing).

### Create a Free cluster\{#create-a-free-cluster}

<Admonition type="info" icon="📘" title="Notes">

<p>Each organization can only have 1 free cluster. For additional clusters, opt for the Serverless or Dedicated.</p>

</Admonition>

- **Via RESTful API**

    Your request should resemble the following example, where `{API_KEY}` is your API key used for authentication.

    The following `POST` request takes a request body and creates a free cluster named `cluster-free` in the project with ID `proj-xxxxxxxxxxxxxxxxxxxxx`.

    ```bash
    curl --request POST \
         --url "https://api.cloud.zilliz.com/v2/clusters/createFree" \
         --header "Authorization: Bearer ${API_KEY}" \
         --header "Accept: application/json" \
         --header "Content-Type: application/json" \
         --data-raw '{
            "clusterName": "cluster-free",
            "projectId": "proj-xxxxxxxxxxxxxxxxxxxxxx",
            "regionId": "gcp-us-west1"
        }'
         
    # {
    #     "code": 0,
    #     "data": {
    #         "clusterId": "inxx-xxxxxxxxxxxxxxx",
    #         "username": "db_xxxxxxxx",
    #         "password": "*************",
    #         "prompt": "successfully submitted, cluster is being created. You can access data about the creation progress and status of your cluster by DescribeCluster API. Once the cluster status is RUNNING, you may access your vector database using the SDK with the admin account and the initial password you specified."
    #     }
    # }
    ```

    The following table explains the parameters in the code above.

    <table>
       <tr>
         <th><p><strong>Parameter</strong></p></th>
         <th><p><strong>Description</strong></p></th>
       </tr>
       <tr>
         <td><p><code>\{API_KEY\}</code></p></td>
         <td><p>The credential used to authenticate API requests. Replace the value with your own.</p></td>
       </tr>
       <tr>
         <td><p><code>clusterName</code></p></td>
         <td><p>The name of the cluster to create.</p></td>
       </tr>
       <tr>
         <td><p><code>projectId</code></p></td>
         <td><p>The ID of the project in which you want to create a cluster. To list project IDs, call the <a href="/reference/restful/list-projects-v2">List Projects</a> operation.</p></td>
       </tr>
       <tr>
         <td><p><code>regionId</code></p></td>
         <td><p>The ID of the cloud region where you want to create a cluster. Currently, free clusters can be created only on GCP. To obtain available cloud region IDs, call the <a href="/reference/restful/list-cloud-regions-v2">List Cloud Regions</a> operation.</p></td>
       </tr>
    </table>

    For further details, see [Create Free Cluster](/reference/restful/create-free-cluster-v2).

- **Via web console**

    The following demo shows how to create a **Free** cluster.

    <Supademo id="cmhixdror61dofati1xmaai6j" title=""  />

    While the cluster is being created, you need to save the cluster credentials (user and password) which will be shown only once. 

    When the cluster status turns into "Running", the cluster is created successfully. You can then copy the cluster endpoint and token and use them to connect to the cluster.

### Create a Serverless cluster\{#create-a-serverless-cluster}

- **Via RESTful API**

    Your request should resemble the following example, where `{API_KEY}` is your API key used for authentication.

    The following `POST` request takes a request body and creates a serverless cluster named `cluster-severless` in the project with ID `proj-xxxxxxxxxxxxxxxxxxxxx`.

    ```bash
    curl --request POST \
         --url "https://api.cloud.zilliz.com/v2/clusters/createServerless" \
         --header "Authorization: Bearer ${API_KEY}" \
         --header "Accept: application/json" \
         --header "Content-Type: application/json" \
         --data-raw '{
            "clusterName": "cluster-serverless",
            "projectId": "proj-xxxxxxxxxxxxxxxxxxxxxxx",
            "regionId": "gcp-us-west1"
        }'
         
    # {
    #     "code": 0,
    #     "data": {
    #         "clusterId": "inxx-xxxxxxxxxxxxxxx",
    #         "username": "db_xxxxxxxx",
    #         "password": "***********",
    #         "prompt": "successfully submitted, cluster is being created. You can access data about the creation progress and status of your cluster by DescribeCluster API. Once the cluster status is RUNNING, you may access your vector database using the SDK with the admin account and the initial password you specified."
    #     }
    # }
    ```

    The following table explains the parameters in the code above.

    <table>
       <tr>
         <th><p><strong>Parameter</strong></p></th>
         <th><p><strong>Description</strong></p></th>
       </tr>
       <tr>
         <td><p><code>\{API_KEY\}</code></p></td>
         <td><p>The credential used to authenticate API requests. Replace the value with your own.</p></td>
       </tr>
       <tr>
         <td><p><code>clusterName</code></p></td>
         <td><p>The name of the cluster to create.</p></td>
       </tr>
       <tr>
         <td><p><code>projectId</code></p></td>
         <td><p>The ID of the project in which you want to create a cluster. To list project IDs, call the <a href="/reference/restful/list-projects-v2">List Projects</a> operation.</p></td>
       </tr>
       <tr>
         <td><p><code>regionId</code></p></td>
         <td><p>The ID of the cloud region where you want to create a cluster. Currently, Serverlss clusters can be created only on GCP. To obtain available cloud region IDs, call the <a href="/reference/restful/list-cloud-regions-v2">List Cloud Regions</a> operation.</p></td>
       </tr>
    </table>

    For further details, see [Create Serverless Cluster](/reference/restful/create-serverless-cluster-v2).

- **Via web console**

    The following demo shows how to create a **Serverless** cluster.

    <Supademo id="cmhixpd150ajjvc0i1t95ihdr" title=""  />

    While the cluster is being created, you need to save the cluster credentials (user and password) which will be shown only once. 

    When the cluster status turns into "Running", the cluster is created successfully. You can then copy the cluster endpoint and token and use them to connect to the cluster.

### Create a Dedicated cluster\{#create-a-dedicated-cluster}

- **Via RESTful API**

    Your request should resemble the following example, where  `{API_KEY}` is your API key used for authentication.

    The following `POST` request takes a request body and creates a dedicated Performance-optimized  cluster named `cluster-02` with one query [CU](./select-the-right-cluster-type).

    ```bash
    curl --request POST \
         --url "https://api.cloud.zilliz.com/v2/clusters/createDedicated" \
         --header "Authorization: Bearer ${API_KEY}" \
         --header "Accept: application/json" \
         --header "Content-Type: application/json" \
         --data-raw '{
            "clusterName": "Cluster-02",
            "projectId": "proj-xxxxxxxxxxxxxxxxxxxxxx",
            "regionId": "aws-us-west-2",
            "plan": "Standard",
            "cuType": "Performance-optimized",
            "cuSize": 1
        }'
         
    # {
    #     "code": 0,
    #     "data": {
    #         "clusterId": "inxx-xxxxxxxxxxxxxxx",
    #         "username": "db_admin",
    #         "password": "****************",
    #         "prompt": "successfully submitted, cluster is being created. You can access data about the creation progress and status of your cluster by DescribeCluster API. Once the cluster status is RUNNING, you may access your vector database using the SDK with the admin account and the initial password you specified."
    #     }
    # }
    ```

    The following table explains the parameters in the code above.

    <table>
       <tr>
         <th><p><strong>Parameter</strong></p></th>
         <th><p><strong>Description</strong></p></th>
       </tr>
       <tr>
         <td><p><code>\{API_KEY\}</code></p></td>
         <td><p>The credential used to authenticate API requests. Replace the value with your own.</p></td>
       </tr>
       <tr>
         <td><p><code>clusterName</code></p></td>
         <td><p>The name of the cluster to create.</p></td>
       </tr>
       <tr>
         <td><p><code>projectId</code></p></td>
         <td><p>The ID of the project in which you want to create a cluster. To list project IDs, call the <a href="/reference/restful/list-projects-v2">List Projects</a> operation.</p></td>
       </tr>
       <tr>
         <td><p><code>regionId</code></p></td>
         <td><p>The ID of the cloud region where you want to create a cluster. To obtain available cloud region IDs, call the <a href="/reference/restful/list-cloud-regions-v2">List Cloud Regions</a> operation.</p></td>
       </tr>
       <tr>
         <td><p><code>cuType</code></p></td>
         <td><p>The type of the cluster. Valid values: Performance-optimized, Capacity-optimized, and Tiered-storage.</p></td>
       </tr>
       <tr>
         <td><p><code>cuSize</code></p></td>
         <td><p>The number of query CUs used for the cluster. Value range: 1 to 256.</p></td>
       </tr>
    </table>

    For further details, see [Create Dedicated Cluster](/reference/restful/create-dedicated-cluster-v2).

- **Via web console**

    The following demo shows how to create a **Dedicated** cluster.

    <Supademo id="cmhixsdvu030hxj0imafwl2av" title=""  />

    You need to configure the following information of the Dedicated cluster.

    - **Cluster Name**: Assign a unique identifier for your cluster.

    - **Cluster Settings**:

        - **Cluster Type**: Select a cluster type that aligns with your cluster's performance requirements. For more information, refer to [Select the Right Cluster Type](./select-the-right-cluster-type). To select a Tiered-storage cluster, your cluster must have at least 8 query CUs.

        - **Query CU**: Select the number of query CUs of the cluster.

    - (Optional) **Backup Policy**: Decide the backup frequency for the cluster to create. Once enabled, Zilliz Cloud will create a backup immediately after the cluster is created. Subsequent backups will follow the specified schedule.

    While the cluster is being created, you need to save the cluster credentials (user and password) which will be shown only once. 

    When the cluster status turns into "Running", the cluster is created successfully. You can then copy the cluster endpoint and token and use them to connect to the cluster.

### Create an encrypted cluster\{#create-an-encrypted-cluster}

To create an encrypted cluster, you need to add at least a customer-managed encryption key (CMEK) to Zilliz Cloud. For details, refer to [Customer-managed Keys for Data Encryption](./cmek).

<Admonition type="info" icon="📘" title="Notes">

<p>This feature is available only to <strong>Dedicated</strong> clusters in a <strong>Business Critical</strong> project.</p>

</Admonition>

![RGUrbElsSoc61JxikfWcoTCrnHe](https://zdoc-images.s3.us-west-2.amazonaws.com/rgurbelssoc61jxikfwcotcrnhe.png "RGUrbElsSoc61JxikfWcoTCrnHe")

Once you have added a KMS key, you can create an encrypted cluster as follows:

<Procedures>

1. Click **Dedicated** in the **Choose Deployment Option** section.

1. Choose the cloud provider and region for the cluster.

1. Enable **Encryption at Rest with CMEK** and select an existing KMS key. Only a KMS key in the same region as the cluster to create can be selected.

1. Review the summary, then click **Create Cluster**.

    ![Iy8JbR19eoBQ4YxV1PjcLfUinl7](https://zdoc-images.s3.us-west-2.amazonaws.com/iy8jbr19eobq4yxv1pjclfuinl7.png "Iy8JbR19eoBQ4YxV1PjcLfUinl7")

    On the **Overview** page of an encrypted cluster, there is a key icon to the right of the cluster name, as shown in the above figure. All collections created in an encrypted cluster are encrypted by default.

</Procedures>

## Create an on-demand cluster | PUBLIC\{#create-an-on-demand-cluster}

<Admonition type="info" icon="📘" title="Note">

<p>This feature is only available to <strong>Enterprise</strong> projects.</p>
<p>Currently, you can only create an on-demand cluster in AWS us-west-2. For other regions, <a href="http://zilliz.com/contact-sales">contact us</a>.</p>

</Admonition>

- **Via RESTful API**

    ```bash
    curl --request POST \
         --url "https://${BASE_URL}/v2/clusters/createQueryCluster" \
         --header "Authorization: Bearer ${API_KEY}" \
         --header "Accept: application/json" \
         --header "Content-Type: application/json" \
         --data-raw '{
            "projectId": "proj-09ee1f4b1151d5dd1edbc5",
            "regionId": "aws-us-west-2",
            "clusterName": "my-on-demand",
            "cu": 8,
            "sessionTTL": "5m"
          }'
         
    # {
    #   "code": 0,
    #   "data": {
    #     "clusterId": "in07-7d6ac8697204a6a",
    #     "regionId": "aws-us-west-2",
    #     "projectId": "proj-09ee1f4b1151d5dd1edbc5"
    #   }
    # }
    ```

    The following table describes the parameters.

    <table>
       <tr>
         <th><p><strong>Parameter</strong></p></th>
         <th><p><strong>Description</strong></p></th>
       </tr>
       <tr>
         <td><p><code>projectId</code></p></td>
         <td><p>ID of the project where the on-demand cluster will be created.</p></td>
       </tr>
       <tr>
         <td><p><code>regionId</code></p></td>
         <td><p>Region where the cluster is deployed. Must match the project’s region.</p></td>
       </tr>
       <tr>
         <td><p><code>cu</code></p></td>
         <td><p>The number of query CUs to allocate. The cluster automatically scales between zero and this value based on workload — it spins up to the specified CU size when requests arrive and scales back to zero when idle. </p><p>The minimum is 8 CU, the maximum is 256 CU, and sizes increase in increments of 8 (for example, 8, 16, and 24). Clusters with more than 8 CU require a payment method.</p><p>This value is fixed after creation and cannot be changed.</p></td>
       </tr>
       <tr>
         <td><p><code>clusterName</code></p></td>
         <td><p>Name of the cluster to create.</p></td>
       </tr>
       <tr>
         <td><p><code>sessionTTL</code></p></td>
         <td><p>Idle timeout before the cluster auto-suspends. When no requests are received within this period, the cluster suspends to stop incurring compute costs.  </p><ul><li><p>Examples: <code>"120s"</code>, <code>"5m"</code>, <code>"1h"</code></p></li><li><p>Minimum: <code>"120s"</code></p></li></ul></td>
       </tr>
    </table>

- **Via web console**

    The following demo shows how to create an on-demand cluster on the web console.

    <Supademo id="cmo9gv84436szl2dy975hyhsh" title=""  />

    <Procedures>

    1. Click on **On-Demand Compute > Clusters**.

    1. Click on **+ Cluster**.

    1. Configure cluster settings.

        The following table explains the parameters.

        <table>
           <tr>
             <th><p><strong>Parameter</strong></p></th>
             <th><p><strong>Description</strong></p></th>
           </tr>
           <tr>
             <td><p>Cluster Name</p></td>
             <td><p>The name of the cluster to create.</p></td>
           </tr>
           <tr>
             <td><p>Query CU</p></td>
             <td><p>The number of query CUs to allocate. The cluster automatically scales between zero and this value based on workload — it spins up to the specified CU size when requests arrive and scales back to zero when idle. </p><p>The minimum is 8 CU, the maximum is 256 CU, and sizes increase in increments of 8 (for example, 8, 16, and 24). Clusters with more than 8 CU require a payment method.</p><p>This value is fixed after creation and cannot be changed.</p></td>
           </tr>
           <tr>
             <td><p>Auto suspend</p></td>
             <td><p>The idle time (in seconds) before the cluster auto-suspends. Default is 120 seconds. When no requests are received within this period, the cluster suspends to stop incurring compute costs.</p></td>
           </tr>
        </table>

    1. Click on **Create**.

    </Procedures>

## FAQ\{#faq}

**Can I specify the Milvus version when creating a serving cluster?**

No. Zilliz Cloud automatically provisions serving clusters on the latest supported Milvus version and keeps them up to date through managed rolling upgrades. If you need a specific version, [contact support](https://support.zilliz.com/hc/en-us/requests/new) and explain your use case.