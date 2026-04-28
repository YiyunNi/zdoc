---
title: "Create Cluster | BYOC"
slug: /create-cluster
sidebar_label: "Create Cluster"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "A cluster is a set of compute resources that runs your vector database workloads. Zilliz Cloud offers two types serving clusters, which run continuously for production workloads requiring always-on, low-latency access, and on-demand clusters, which spin up only when requests arrive and scale to zero when idle. | BYOC"
type: origin
token: CvD0w4z7RiQUMpkAsTucP0G9nHG
sidebar_position: 1

---

import Admonition from '@theme/Admonition';


# Create Cluster

A cluster is a set of compute resources that runs your vector database workloads. Zilliz Cloud offers two types: **serving clusters**, which run continuously for production workloads requiring always-on, low-latency access, and **on-demand clusters**, which spin up only when requests arrive and scale to zero when idle.   

This topic describes how to create a cluster.

## Considerations\{#considerations}

Ensure:

- A BYOC project. Refer to [Deploy BYOC on AWS](./deploy-byoc-aws) for instructions.

- Ownership of the organization or project where the cluster is to be established. For details on roles and permissions, see Access Control.

- You can only create a maximum of 100 serverless serving cluster, 100 dedicated serving cluster, and 20 on-demand clusters in each project.

## Create a serving cluster\{#create-a-serving-cluster}

### Create a cluster\{#create-a-cluster}

- **Via RESTful API**

    Your request should resemble the following example, where  `{API_KEY}` is your API key used for authentication.

    The following `POST` request takes a request body and creates a Performance-optimized  cluster named `cluster-02` with one query [CU](./select-the-right-cluster-type).

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
         <td><p>The type of the cluster. Valid values: Performance-optimized, Capacity-optimized.</p></td>
       </tr>
       <tr>
         <td><p><code>cuSize</code></p></td>
         <td><p>The number of query CUs used for the cluster. Value range: 1 to 256.</p></td>
       </tr>
    </table>

    For further details, see [Create Dedicated Cluster](/reference/restful/create-dedicated-cluster-v2).

- **Via web console**

    1. Log in to the [Zilliz Cloud console](https://cloud.zilliz.com/login).

    1. Enter the desired organization and project.

    1. Click **Create Cluster**.

        ![create-cluster-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/create-cluster-byoc.png "create-cluster-byoc")

    1. On the **Create New Cluster** page, fill out the relevant parameters.

        ![cluster-cluster-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/cluster-cluster-byoc.png "cluster-cluster-byoc")

        - **Cluster Name**: Assign a unique identifier for your cluster.

        - **Cluster Settings**:

            - **Cluster Type**: Select a cluster type that aligns with your cluster's performance requirements. For more information, refer to [Select the Right Cluster Type](./select-the-right-cluster-type).

            - **Query CU**: Select the number of query CUs of the cluster.

            - **Topology**: A graphical representation showing the structure of your cluster. This includes the designation of roles and compute resources for various nodes:

                - **Proxy**: Stateless nodes that manage user connections and streamline service addresses with load balancers.

                - **Query Node**: Responsible for hybrid vector and scalar searches and incremental data updates.

                - **Coordinator**: The orchestration center, distributing tasks across worker nodes.

                - **Data Node**: Handles data mutations and log-to-snapshot conversions for persistence.

        - (Optional) **Backup Policy**: Decide the backup frequency for the cluster to create. Zilliz Cloud will create a backup immediately after the cluster is created. Subsequent backups will follow the specified schedule.

    1. Click **Create Cluster**. 

        You will be prompted to check the resource quota for your project. If the resources are sufficient, the dialog box will disappear after the check is complete. Otherwise, you can 

        - Click **Go To Project Resource Settings** to edit resource settings for the project, or

        - Click **Back to Last Step** to change your cluster settings.

        ![Hy3ybwYmroFAzjx0WFYcR2Qsnfd](https://zdoc-images.s3.us-west-2.amazonaws.com/hy3ybwymrofazjx0wfycr2qsnfd.png "Hy3ybwYmroFAzjx0WFYcR2Qsnfd")

        <Admonition type="info" icon="📘" title="Notes">

        <p>Some additional resources will be required for rolling; these resources will be released after use.</p>

        </Admonition>

        Then, you'll be redirected to a dialog showcasing the public endpoint and token for your cluster access. Keep these details safe.

## FAQ\{#faq}

**Can I specify the Milvus version when creating a serving cluster?**

No. Zilliz Cloud automatically provisions serving clusters on the latest supported Milvus version and keeps them up to date through managed rolling upgrades. If you need a specific version, [contact support](https://support.zilliz.com/hc/en-us/requests/new) and explain your use case.