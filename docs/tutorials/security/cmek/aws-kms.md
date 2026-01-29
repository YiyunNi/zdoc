---
title: "AWS KMS | Cloud"
slug: /aws-kms
sidebar_label: "AWS KMS"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "AWS Key Management Service (KMS) is an AWS-managed service that makes it easy for you to create and control the keys used to encrypt and sign your data. | Cloud"
type: origin
token: FOamwIi07ia7kpkBPW8cEuIpniu
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - cloud
  - cmek
  - aws kms
  - hallucinations llm
  - Multimodal search
  - vector search algorithms
  - Question answering system

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# AWS KMS

AWS Key Management Service (KMS) is an AWS-managed service that makes it easy for you to create and control the keys used to encrypt and sign your data. 

<Admonition type="info" icon="📘" title="Notes">

<p>This feature is available only to <strong>Dedicated</strong> clusters in a <strong>Business Critical</strong> project.</p>

</Admonition>

## Overview\{#overview}

In typical cases, you do not use your KMS key to encrypt your data in a Zilliz Cloud cluster. Instead, you use the KMS key to encrypt an encryption zone key (EZK), use the EZK to encrypt a data encryption key (DEK), and use the DEK to encrypt your data.

![YJRcwu5BLhm8Hub1eiZcDiIdnDh](https://zdoc-images.s3.us-west-2.amazonaws.com/YJRcwu5BLhm8Hub1eiZcDiIdnDh.png)

For details on how encryption works and its scope, refer to [this section](./cmek#how-encryption-works). For more information on the CMEK feature's limitations, refer to [this section](./cmek#limitations). To use the CMEK feature, follow the procedure on this page.

## Before you start\{#before-you-start}

- You have installed AWS CLI. 

    For details, refer to [this page](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

- You have sufficient permissions to run KMS-related commands.

## Add a KMS key\{#add-a-kms-key}

Each project allows up to **20** keys, regardless of the KMS providers. Follow the steps in this section to add your AWS KMS key to Zilliz Cloud.

Log in to the [Zilliz Cloud console](https://cloud.zilliz.com/login), go into one of your **Business Critical** projects, choose **Network** > **CMEK** from the left navigation pane, click **+ CMEK**, and follow the steps in the **Add CMEK (AWS KMS)** dialog box to complete the process. 

There are three steps, and they are:

<Procedures>

1. Create an IAM role and add Zilliz Cloud to the role's trust relationships.

    <Supademo id="cmkxdx3yy00txru0hopj1eiwg" title=""  />

    1. Copy the file name of the trust policy in **Step 1**, and run the `vi` command to create the trust policy file.

        ```bash
        vi role-trust-policy.json
        ```

    1. Press **I** to enter insert mode.

    1. Copy the trust policy JSON in **Step 1**, and paste it into the terminal.

    1. Press **ESC** and enter `:wq` to save the JSON file.

    1. Enter the name of the role to create in **Step 2**.

    1. Copy the command in **Step 3**, and paste it into the terminal.

    1. Press **Enter** to run the command.

    1. In the command output, copy the role's ARN and paste it into the text box in **Step 4**.

    1. Click **Next**.

1. Create a KMS key.

    <Supademo id="cmkxdwufl000isl0i5nfkxzvy" title=""  />

    1. Select a cloud region in **Step 1**.

    1. Copy the command in **Step 2**, and paste it into the terminal.

    1. Press **Enter** to run the command.

    1. In the command output, copy the key's ARN and paste it into the text box in **Step 3**.

    1. Click **Next**.

1. Associate the KMS key with the IAM role.

    <Supademo id="cmkxdx8eu00szs50igvo0f2ti" title=""  />

    1. Run the `vi` command to create the required role policy JSON file in **Step 1**.

    1. Copy the command in Step 2, and paste it into the terminal.

    1. Press **Enter** to run the command.

    1. Once the command is executed, click **Validate** at the end of the dialog box.

    1. Once the validation succeeds, click **Add**.

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>When you use a KMS key to encrypt a Zilliz Cloud cluster, the cluster checks the key's availability every 10 minutes and becomes available only after it detects that the key is available.</p>

</Admonition>

## Manage AWS KMS keys\{#manage-aws-kms-keys}

You can view the added AWS KMS keys on the Zilliz Cloud console.

![D9Kbb8Bwno6Y8oxrJAOcjdienrh](https://zdoc-images.s3.us-west-2.amazonaws.com/d9kbb8bwno6y8oxrjaocjdienrh.png "D9Kbb8Bwno6Y8oxrJAOcjdienrh")

When a KMS key is no longer needed, you can delete it if any clusters do not use it.

## Use AWS KMS keys\{#use-aws-kms-keys}

Once you have added a KMS key to Zilliz Cloud, you can use it to create encrypted clusters and to back up and restore them.

### Create an encrypted cluster\{#create-an-encrypted-cluster}

You can select a KMS key available in the region where you want to create the cluster to encrypt it.

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

### Restore from an encrypted backup file\{#restore-from-an-encrypted-backup-file}

When you restore an encrypted backup to a new cluster, Zilliz Cloud will use the KMS key associated with the backup file to decrypt the data before restoration. Therefore, you can restore the backup to a new cluster with or without encryption. 

![WaApbDlaYoywaMxxUMxcQLAOnDe](https://zdoc-images.s3.us-west-2.amazonaws.com/waapbdlayoywamxxumxcqlaonde.png "WaApbDlaYoywaMxxUMxcQLAOnDe")

The restoration procedure from an encrypted backup is almost the same as a normal restoration, except for whether to enable **Encryption at Rest with CMEK**.

- When this option is enabled, the cluster created after the restoration is encrypted using the KMS key specified below.

    ![V1QJb3SK1oGa11xLljhcxKQEnkc](https://zdoc-images.s3.us-west-2.amazonaws.com/v1qjb3sk1oga11xlljhcxkqenkc.png "V1QJb3SK1oGa11xLljhcxKQEnkc")

- When this option is disabled, the cluster created after the restoration is unencrypted.

