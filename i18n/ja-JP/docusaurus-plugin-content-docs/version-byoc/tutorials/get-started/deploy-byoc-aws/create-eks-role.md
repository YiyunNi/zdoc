---
title: "EKS IAM ロールの作成 | BYOC"
slug: /create-eks-role
sidebar_label: "EKS IAM ロールの作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud プロジェクト用の EKS クラスターをデプロイするために、Zilliz Cloud 用の IAM ロールを作成および設定する方法について説明します。 | BYOC"
type: origin
token: IJBcwPCeGirLRGkVt1Vc580ynff
sidebar_position: 2
keywords: 
  - zilliz
  - byoc
  - aws
  - eks クラスター
  - IAM ロール
  - milvus
  - ベクトルデータベース
  - knn アルゴリズム
  - HNSW
  - 非構造化データとは
  - ベクトル埋め込み

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# EKS IAM ロールの作成

このページでは、Zilliz Cloud が Zilliz Cloud プロジェクト用の EKS クラスターをデプロイするために、IAM ロールを作成および設定する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在、<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud の営業担当者</a>にお問い合わせください。</p>

</Admonition>

## 手順{#procedure}

AWS コンソールを使用して EKS ロールを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、AWS 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform プロバイダー](./terraform-provider)を参照してください。

### ステップ 1: IAM ロールの作成{#step-1-create-an-iam-role}

このステップでは、Zilliz Cloud がユーザーに代わって EKS クラスターを管理するための IAM ロールを AWS で作成し、そのロールの ARN を Zilliz Cloud コンソールに貼り付けます。

<Supademo id="cmb7llk244s2yppkpeo4oz85z" title=""  />

<Procedures>

1. 管理者権限を持つユーザーとして AWS コンソールにログインし、IAM ダッシュボードに移動します。

1. アカウント情報を展開し、AWS アカウント ID の先頭にあるコピーボタンをクリックします。

1. 左側のサイドバーで **Roles** タブをクリックし、**Create Role** をクリックします。

1. **Select trusted entity** で、**Custom trust policy** タイルをクリックします。**Common trust policy** で、以下の信頼 JSON を **Custom trust policy** セクションのエディターに貼り付け、`{accountId}` を **AWS アカウント ID** に置き換えます。

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

1. **Next** をクリックし、権限の追加をスキップします。

1. **名前、確認、作成** ステップで、ロールに名前を付け、信頼されたエンティティを確認し、**ロールの作成** をクリックします。

1. ロールが作成されたら、緑色のバーにある **ロールの表示** をクリックして、ロールの詳細に移動します。

1. ロールの **ARN** の前にあるコピーアイコンをクリックします。

1. Zilliz Cloud コンソールに戻り、**EKS 設定** の **IAM ロール ARN** にロール ARN を貼り付けます。

</Procedures>

### ステップ2: 権限の追加{#step-2-add-permissions}

このステップでは、EKS ロールにいくつかの権限を追加します。ロールの詳細ページで、**権限** タブをクリックします。**権限ポリシー** セクションで、**権限の追加** をクリックします。このステップでは、**ポリシーのアタッチ** を選択し、次に **インラインポリシーの作成** を選択して、異なるソースから複数のポリシーを追加する必要があります。

<Supademo id="cmb7nj2tb4u69ppkptf3is7bo" title="" />

#### AWS管理ポリシーのアタッチ{#attach-aws-managed-policies}

以下の表は、アタッチされたポリシーとして追加する権限をリストしています。必要な権限を表示するには、表の **権限** 列の項目をクリックしてください。

<table>
   <tr>
     <th><p>権限</p></th>
     <th><p>管理元</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ContainerRegistryReadOnly.html">AmazonEC2ContainerRegistryReadOnly</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Amazon EC2 Container Registry リポジトリへの読み取り専用アクセスを提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKS_CNI_Policy.html">AmazonEKS_CNI_Policy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Amazon VPC CNI プラグイン (amazon-vpc-cni-k8s) が EKS ワーカーノードの IP アドレス設定を変更するために必要な権限を提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSWorkerNodePolicy.html">AmazonEKSWorkerNodePolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Amazon EKS ワーカーノードが Amazon EKS クラスターに接続することを許可します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSClusterPolicy.html">AmazonEKSClusterPolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Kubernetes がユーザーに代わってリソースを管理するために必要な権限を提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSVPCResourceController.html">AmazonEKSVPCResourceController</a></p></td>
     <td><p>AWS</p></td>
     <td><p>VPC リソースコントローラーがワーカーノードの ENI と IP を管理することを許可します。</p></td>
   </tr>
</table>

**ポリシーのアタッチ** を選択した後、開いたページの **その他の権限ポリシー** セクションで、上記の各AWS管理ポリシーの名前を検索ボックスに入力し、その前のラジオボックスを選択します。必要なすべてのポリシーを選択したら、**権限の追加** をクリックします。

これらのポリシーが **権限** ポリシーリストに表示されます。

<Admonition type="info" icon="📘" title="Notes">

<p>EKS クラスターの作成時に、2つの <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html#iam-term-service-linked-role">サービスにリンクされたロール</a> もクラスターとともに自動的に作成されます。これらは <a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSServiceRolePolicy.html">AmazonEKSServiceRolePolicy</a> と <a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSServiceRoleForAmazonEKSNodegroup.html">AWSServiceRoleForAmazonEKSNodegroup</a> です。これらの2つのロールは、Amazon EKS がユーザーに代わって他の AWS サービスを呼び出すために必要です。</p>

</Admonition>

#### インラインポリシーの作成{#create-inline-policies}

以下の表は、顧客インラインポリシーとして追加する必要があるポリシーをリストしています。必要な権限を表示するには、表の **権限** 列の項目をクリックしてください。

<table>
   <tr>
     <th><p>権限</p></th>
     <th><p>管理元</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/docs/install/iam_policy.json">AWS Load Balancer Controller</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>AWS Load Balancer Controller は、Kubernetes クラスターの Elastic Load Balancer を管理するのに役立つコントローラーです。</p><p>AWS Load Balancer Controller リポジトリの詳細については、<a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/tree/main">README</a> ファイルを参照してください。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/example-iam-policy.json">Amazon EBS CSI driver</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>Amazon Elastic Block Store Container Storage Interface (CSI) ドライバーは、コンテナオーケストレーターが Amazon EBS ボリュームのライフサイクルを管理するために使用する CSI インターフェースを提供します。</p><p>Amazon EBS CSI ドライバーの詳細については、<a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver">README</a> ファイルを参照してください。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended">Cluster AutoScaler</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>Cluster AutoScaler は、すべてのポッドが実行できる場所を持ち、不要なノードがないように、Kubernetes クラスターのサイズを自動的に調整するコンポーネントです。</p><p>AWS 上の Cluster AutoScaler の詳細については、<a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md">README</a> ファイルを参照してください。</p></td>
   </tr>
</table>

**インラインポリシーの作成** を選択した後、**権限の指定** ページで、**ポリシーエディター** セクションの **JSON** をクリックしてポリシーエディターを開きます。次に、上記の権限のいずれかをコピーしてポリシーエディターに貼り付けます。

**次へ** をクリックし、**ポリシーの詳細** で **ポリシー名** を設定します。リストされているすべてのインラインポリシーを追加したら、**ポリシーの作成** をクリックします。これらのポリシーが **権限** ポリシーリストに表示されます。

