---
title: "EKS IAM ロールの作成 | BYOC"
slug: /create-eks-role
sidebar_key: create-eks-role
sidebar_label: "EKS IAM ロールを作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud プロジェクト用に EKS クラスターをデプロイするための IAM ロールを作成・設定する方法について説明します。 | BYOC"
type: origin
token: IJBcwPCeGirLRGkVt1Vc580ynff
sidebar_position: 2
keywords: 
  - zilliz
  - byoc
  - aws
  - eks cluster
  - IAM role
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# EKS IAM ロールの作成

このページでは、Zilliz Cloud プロジェクト用に EKS クラスターをデプロイするための IAM ロールを Zilliz Cloud 用に作成および構成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud セールス](https://zilliz.com/contact-sales) までお問い合わせください。

</Admonition>

## 手順\{#procedure}

EKS ロールを作成するには AWS コンソールを使用できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、AWS 上の Zilliz Cloud プロジェクト用のインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

### ステップ 1: IAM ロールの作成\{#step-1-create-an-iam-role}

このステップでは、Zilliz Cloud がお客様に代わって EKS クラスターを管理できるように、AWS 上に IAM ロールを作成し、そのロールの ARN を Zilliz Cloud コンソールに貼り付けます。

<Supademo id="cmb7llk244s2yppkpeo4oz85z" title=""  />

<Procedures>

1. 管理者権限を持つユーザーとして AWS コンソールにログインし、IAM ダッシュボードに移動します。

1. アカウント情報を展開し、AWS アカウントID の先頭にあるコピーボタンをクリックします。

1. 左側のサイドバーで **ロール** タブをクリックし、次に **ロールの作成** をクリックします。

1. **信頼できるエンティティの選択** で、**カスタム信頼ポリシー** タイルをクリックします。**共通信頼ポリシー** に、以下の信頼 JSON を **カスタム信頼ポリシー** セクションのエディタに貼り付け、`{accountId}` を **AWS アカウントID** に置き換えます。

    ```json
    {
        "Version" : "2012-10-17",
        "Statement" : [
          {
            "Effect" : "Allow",
            "Principal" : {
              "Service" : "eks-nodegroup.amazonaws.com"
            },
            "Action" : "sts:AssumeRole"
          },
          {
            "Sid" : "EKSClusterAssumeRole",
            "Effect" : "Allow",
            "Principal" : {
              "Service" : "eks.amazonaws.com"
            },
            "Action" : "sts:AssumeRole"
          },
          {
            "Sid" : "EKSNodeAssumeRole",
            "Effect" : "Allow",
            "Principal" : {
              "Service" : "ec2.amazonaws.com"
            },
            "Action" : "sts:AssumeRole"
          },
          {
            "Effect" : "Allow",
            "Principal" : {
              "Federated" : "arn:aws:iam::{accountId}:oidc-provider/eks_oidc_url"
            },
            "Action" : "sts:AssumeRoleWithWebIdentity",
            "Condition" : {
              "StringEquals" : {
                "eks_oidc_url:aud" : "sts.amazonaws.com",
                "eks_oidc_url:sub" : "system:serviceaccount:kube-system:aws-load-balancer-controller"
              }
            }
          },
          {
            "Effect" : "Allow",
            "Principal" : {
              "Federated" : "arn:aws:iam::{accountId}:oidc-provider/eks_oidc_url"
            },
            "Action" : "sts:AssumeRoleWithWebIdentity",
            "Condition" : {
              "StringEquals" : {
                "eks_oidc_url:sub" : "system:serviceaccount:kube-system:ebs-csi-controller-sa",
                "eks_oidc_url:aud" : "sts.amazonaws.com"
              }
            }
          },
          {
            "Effect" : "Allow",
            "Principal" : {
              "Federated" : "arn:aws:iam::{accountId}:oidc-provider/eks_oidc_url"
            },
            "Action" : "sts:AssumeRoleWithWebIdentity",
            "Condition" : {
              "StringEquals" : {
                "eks_oidc_url:sub" : "system:serviceaccount:kube-system:cluster-autoscaler",
                "eks_oidc_url:aud" : "sts.amazonaws.com"
              }
            }
          }
        ]
      }
    ```

1. **次へ** をクリックし、権限の追加をスキップします。

1. **名前を付けて確認し、作成** ステップで、ロールに名前を付け、信頼できるエンティティを確認し、**Create role** をクリックします。

1. ロールが作成されたら、緑色のバーに表示される **View role** をクリックして、ロールの詳細に移動します。

1. ロールの **ARN** の前にあるコピーアイコンをクリックします。

1. Zilliz Cloud コンソールに戻り、**EKS設定** の **IAM ロール ARN** にロール ARN を貼り付けます。

</Procedures>

### ステップ 2: 権限の追加\{#step-2-add-permissions}

このステップでは、EKS ロールにいくつかの権限を追加します。ロールの詳細ページで、**Permissions** タブをクリックします。**権限ポリシー** セクションで、**Add permissions** をクリックします。このステップでは、**ポリシーのアタッチ** を選択し、次に **Create inline policy** を選択して、異なるソースから複数のポリシーを追加する必要があります。

<Supademo id="cmb7nj2tb4u69ppkptf3is7bo" title=""  />

#### AWS マネージドポリシーのアタッチ\{#attach-aws-managed-policies}

次の表は、アタッチされたポリシーとして追加する権限を一覧表示しています。表の **Permissions** 列の項目をクリックして、必要な権限を表示します。

<table>
   <tr>
     <th><p>Permissions</p></th>
     <th><p>Managed by</p></th>
     <th><p>Description</p></th>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ContainerRegistryReadOnly.html">AmazonEC2ContainerRegistryReadOnly</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Provides read-only access to Amazon EC2 Container Registry repositories.</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKS_CNI_Policy.html">AmazonEKS_CNI_Policy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Provides the Amazon VPC CNI Plugin (amazon-vpc-cni-k8s) the permissions it requires to modify the IPアドレス configuration on your EKS worker nodes.</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSWorkerNodePolicy.html">AmazonEKSWorkerNodePolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Allows Amazon EKS worker nodes to connect to Amazon EKS Clusters.</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSClusterPolicy.html">AmazonEKSClusterPolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Provides Kubernetes the permissions it requires to manage resources on your behalf.</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSVPCResourceController.html">AmazonEKSVPCResourceController</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Allows VPC Resource Controller to manage ENI and IPs for worker nodes.</p></td>
   </tr>
</table>

**ポリシーのアタッチ** を選択した後、開いたページの **その他の権限ポリシー** セクションで、上記に一覧表示されている各 AWS マネージドポリシーの名前を検索ボックスに入力し、その前にあるラジオボックスを選択します。必要なすべてのポリシーを選択したら、**Add permissions** をクリックします。

これらのポリシーが **Permissions** ポリシーリストに表示されていることが確認できます。

<Admonition type="info" icon="📘" title="Notes">

EKS クラスターの作成時に、2 つの [サービスリンクロール](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html#iam-term-service-linked-role) もクラスターとともに自動的に作成されます。これらは [AmazonEKSServiceロールPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSServiceロールPolicy.html) と [AWSServiceロールForAmazonEKSNodegroup](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSServiceロールForAmazonEKSNodegroup.html) です。これら 2 つのロールは、Amazon EKS がお客様に代わって他の AWS サービスを呼び出すために必要です。

</Admonition>

#### インラインポリシーの作成\{#create-inline-policies}

次の表は、カスタマーインラインポリシーとして追加する必要があるポリシーを一覧表示しています。表の **Permissions** 列の項目をクリックして、必要な権限を表示します。

<table>
   <tr>
     <th><p>Permissions</p></th>
     <th><p>Managed by</p></th>
     <th><p>Description</p></th>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/docs/install/iam_policy.json">AWS Load Balancer Controller</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>AWS Load Balancer Controller is a controller to help manage Elastic Load Balancers for a Kubernetes cluster.</p><p>For details on the AWS Load Balancer Controller repository, refer to the <a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/tree/main">README</a> file.</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/example-iam-policy.json">Amazon EBS CSI driver</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>The Amazon Elastic Block Store Container Storage Interface (CSI) Driver provides a CSI interface used by Container Orchestrators to manage the lifecycle of Amazon EBS volumes.</p><p>For details on the Amazon EBS CSI driver, refer to the <a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver">README</a> file.</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended">Cluster AutoScaler</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>The Cluster AutoScaler is a component that automatically adjusts the size of a Kubernetes Cluster so that all pods have a place to run and there are no unneeded nodes.</p><p>For details on the Cluster AutoScaler on AWS, refer to the <a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md">README</a> file.</p></td>
   </tr>
</table>

**Create inline policy** を選択した後、**権限の指定** ページで、**ポリシーエディター** セクションの **JSON** をクリックしてポリシーエディターを開きます。次に、上記の権限のいずれかをコピーして、ポリシーエディターに貼り付けます。

**次へ** をクリックし、**ポリシーの詳細** で **ポリシー名** を設定します。一覧表示されているすべてのインラインポリシーを追加したら、**Create policy** をクリックします。これらのポリシーが **Permissions** ポリシーリストに表示されていることが確認できます。

