---
title: "ロールの権限 | BYOC"
slug: /permissions-in-roles
sidebar_key: permissions-in-roles
sidebar_label: "ロールの権限"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud がお客様に代わってコントロールプレーンのセットアップを実行する際に必要な IAM 権限をすべて一覧表示しています。 | BYOC"
type: origin
token: IOPFwYrC2iJDw3k2iElcBrkMnef
sidebar_position: 5
keywords: 
  - zilliz
  - byoc
  - aws
  - 権限
  - 最小限の権限
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


# ロールの権限

このページでは、Zilliz Cloud がお客様に代わってコントロールプレーンのセットアップを実行する際に必要となるすべての IAM 権限を一覧表示します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud セールス](https://zilliz.com/contact-sales) までお問い合わせください。

</Admonition>

## ストレージロールの権限\{#storage-role-permissions}

S3 バケットとストレージロールを作成しました。Zilliz Cloud は、コントロールプレーンのセットアップ時に以下の権限を持つこのロールを引き受けます。

<table>
   <tr>
     <th><p>AWS IAM 権限</p></th>
     <th><p>AWS リソース</p></th>
     <th><p>目的</p></th>
   </tr>
   <tr>
     <td><p>s3:Listバケット</p></td>
     <td><p>バケット</p></td>
     <td><p>バケットが存在するかどうかを確認します。</p></td>
   </tr>
   <tr>
     <td><p>s3:GetObject</p></td>
     <td><p>バケットオブジェクト</p></td>
     <td><p>Milvus が S3 バケットからデータを読み取ることを許可します</p></td>
   </tr>
   <tr>
     <td><p>s3:PutObject</p></td>
     <td><p>バケットオブジェクト</p></td>
     <td><p>Milvus がバケットにデータを書き込むことを許可します</p></td>
   </tr>
   <tr>
     <td><p>s3:DeleteObject</p></td>
     <td><p>バケットオブジェクト</p></td>
     <td><p>Milvus がデータを削除することを許可します</p></td>
   </tr>
</table>

## EKS ロールの権限\{#eks-role-permissions}

Zilliz Cloud がコントロールプレーンのセットアップ時に EKS クラスターを管理できるよう、以下の権限を持つ EKS ロールを作成しました。

### AWS 管理の権限\{#aws-managed-permissions}

これらの権限は AWS によって管理されており、EKS ロールにアタッチできます。各権限の詳細については、**権限** 列の項目をクリックして詳細を確認できます。

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
     <td><p>Amazon VPC CNI プラグイン（amazon-vpc-cni-k8s）が EKS ワーカーノードの IP アドレス設定を変更するために必要な権限を提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSWorkerNodePolicy.html">AmazonEKSWorkerNodePolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Amazon EKS ワーカーノードが Amazon EKS クラスターに接続できるようにします。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSClusterPolicy.html">AmazonEKSClusterPolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Kubernetes がお客様に代わってリソースを管理するために必要な権限を提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSVPCResourceController.html">AmazonEKSVPCResourceController</a></p></td>
     <td><p>AWS</p></td>
     <td><p>VPC リソースコントローラーがワーカーノードの ENI と IP を管理できるようにします。</p></td>
   </tr>
</table>

### Kubernetes SIGs の権限\{#permissions-from-kubernetes-sigs}

これらの権限は [Kubernetes SIGs](https://github.com/kubernetes-sigs) リポジトリのコントリビューターによって管理されています。Zilliz Cloud は、AWS Load Balancer Controller、Amazon EBS CSI ドライバー、および Cluster AutoScaler のインストールにこれらの権限を参照します。

以下の表に具体的な権限セットを一覧表示します。各権限の詳細については、**権限** 列の項目をクリックして詳細を確認できます。

<table>
   <tr>
     <th><p>権限</p></th>
     <th><p>管理元</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/docs/install/iam_policy.json">AWS Load Balancer Controller</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>AWS Load Balancer Controller は、Kubernetes クラスターの Elastic Load Balancer を管理するのを支援するコントローラーです。</p><p>AWS Load Balancer Controller リポジトリの詳細については、<a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/tree/main">README</a> ファイルを参照してください。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/example-iam-policy.json">Amazon EBS CSI driver</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>Amazon Elastic Block Store Container Storage Interface（CSI）ドライバーは、コンテナオーケストレーターが Amazon EBS ボリュームのライフサイクルを管理するために使用する CSI インターフェースを提供します。</p><p>Amazon EBS CSI ドライバーの詳細については、<a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver">README</a> ファイルを参照してください。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended">Cluster AutoScaler</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>Cluster AutoScaler は、すべてのポッドが実行する場所を持ち、不要なノードが存在しないように、Kubernetes クラスターのサイズを自動的に調整するコンポーネントです。</p><p>AWS 上の Cluster AutoScaler の詳細については、<a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md">README</a> ファイルを参照してください。</p></td>
   </tr>
</table>

## クロスアカウントロールの権限\{#cross-account-role-permissions}

Zilliz Cloud がお客様の EKS クラスターに BYOC コントロールプレーンをセットアップできるよう、以下の権限を持つクロスアカウントロールを作成しました。

<table>
   <tr>
     <th><p>AWS IAM 権限</p></th>
     <th><p>AWS リソース</p></th>
     <th><p>目的</p></th>
   </tr>
   <tr>
     <td><p>iam:Getロール</p></td>
     <td><p>ロール</p></td>
     <td><p>EKS 作成時に依存ロールを読み取ります。</p></td>
   </tr>
   <tr>
     <td><p>iam:ListAttachedロールポリシー</p></td>
     <td><p>ポリシー</p></td>
     <td><p>依存ロールのポリシーを取得します。</p></td>
   </tr>
   <tr>
     <td><p>iam:Passロール</p></td>
     <td><p>ロール</p></td>
     <td><p>EKS がロールを使用できるようにします。</p></td>
   </tr>
   <tr>
     <td><p>iam:UpdateAssumeロールPolicy</p></td>
     <td><p>IAM ロール</p></td>
     <td><p>EKS OIDC プロバイダーの信頼ポリシーを更新します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:CreateLaunchTemplate</p></td>
     <td><p>起動テンプレート</p></td>
     <td><p>EKS ノードグループの起動テンプレートを作成します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:RunInstances</p></td>
     <td><p>インスタンス</p></td>
     <td><p>EKS ノードグループの AWS インスタンスを起動します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DeleteLaunchTemplate</p></td>
     <td><p>起動テンプレート</p></td>
     <td><p>起動テンプレートを削除します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:CreateLaunchTemplateVersion</p></td>
     <td><p>起動テンプレート</p></td>
     <td><p>起動テンプレートのバージョンを作成します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:Createタグ</p></td>
     <td><p>タグ</p></td>
     <td><p>すべての zilliz byoc リソースにタグを追加します</p></td>
   </tr>
   <tr>
     <td><p>ec2:Describeアカウント属性</p></td>
     <td><p>アカウント</p></td>
     <td><p>ロール使用時にアカウント ID を確認します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DescribeInstanceTypes</p></td>
     <td><p>インスタンス</p></td>
     <td><p>インスタンスのインスタンスタイプを取得します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DescribeLaunchTemplateVersions</p></td>
     <td><p>起動テンプレート</p></td>
     <td><p>起動テンプレートのバージョンを取得します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DescribeLaunchTemplates</p></td>
     <td><p>起動テンプレート</p></td>
     <td><p>起動テンプレートが正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:Describeサブネット</p></td>
     <td><p>サブネット</p></td>
     <td><p>サブネットが VPC に存在することを確認します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DescribeVpcs</p></td>
     <td><p>VPC</p></td>
     <td><p>VPC が存在することを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateCluster</p></td>
     <td><p>EKS クラスター</p></td>
     <td><p>EKS クラスターを作成します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateNodegroup</p></td>
     <td><p>EKS ノードグループ</p></td>
     <td><p>EKS ノードグループを作成します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateAddon</p></td>
     <td><p>EKS アドオン</p></td>
     <td><p>EKS アドオンを作成します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateAccessEntry</p></td>
     <td><p>EKS AccessEntry</p></td>
     <td><p>アクセスエントリにより、IAM プリンシパルがクラスターにアクセスできるようになります。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreatePodIdentityAssociation</p></td>
     <td><p>EKS PodIdentityAssociation</p></td>
     <td><p>ポッドが AWS IAM ロールを引き受けることを許可します。</p></td>
   </tr>
   <tr>
     <td><p>eks:AssociateAccessPolicy</p></td>
     <td><p>ポリシー</p></td>
     <td><p>アクセスポリシーとそのスコープをアクセスエントリに関連付けます。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateAccessEntry</p></td>
     <td><p>EKS AccessEntry</p></td>
     <td><p>EKS AccessEntry を更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateAddon</p></td>
     <td><p>EKS アドオン</p></td>
     <td><p>EKS アドオンを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateClusterConfig</p></td>
     <td><p>EKS クラスター</p></td>
     <td><p>EKS の設定を更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateClusterVersion</p></td>
     <td><p>EKS クラスター</p></td>
     <td><p>EKS のバージョンを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateNodegroupConfig</p></td>
     <td><p>EKS ノードグループ</p></td>
     <td><p>EKS ノードグループの設定を更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateNodegroupVersion</p></td>
     <td><p>EKS ノードグループ</p></td>
     <td><p>EKS ノードグループのバージョンを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdatePodIdentityAssociation</p></td>
     <td><p>ポッドアイデンティティ</p></td>
     <td><p>EKS ポッドアイデンティティを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:TagResource</p></td>
     <td><p>タグ</p></td>
     <td><p>すべての eks リソースにタグを付けます。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeCluster</p></td>
     <td><p>EKS クラスター</p></td>
     <td><p>EKS クラスターが正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeNodegroup</p></td>
     <td><p>EKS ノードグループ</p></td>
     <td><p>EKS ノードグループが正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAccessEntry</p></td>
     <td><p>EKS AccessEntry</p></td>
     <td><p>EKS accessentry が正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAddon</p></td>
     <td><p>EKS アドオン</p></td>
     <td><p>EKS クラスターが正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAddon設定</p></td>
     <td><p>EKS アドオン</p></td>
     <td><p>EKS クラスターが正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAddonVersions</p></td>
     <td><p>EKS アドオン</p></td>
     <td><p>EKS クラスターが正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribePodIdentityAssociation</p></td>
     <td><p>ポッドアイデンティティ</p></td>
     <td><p>EKS クラスターが正しく作成されたことを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListAccessEntries</p></td>
     <td><p>EKS accessentry</p></td>
     <td><p>Zilliz が作成した EKS のアクセスエントリを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListAccessポリシー</p></td>
     <td><p>EKS アクセスポリシー</p></td>
     <td><p>Zilliz が作成した EKS のアクセスポリシーを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListAddons</p></td>
     <td><p>EKS アドオン</p></td>
     <td><p>Zilliz が作成した EKS アドオンを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListNodegroups</p></td>
     <td><p>EKS ノードグループ</p></td>
     <td><p>Zilliz が作成した EKS ノードグループを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListUpdates</p></td>
     <td><p>EKS</p></td>
     <td><p>Zilliz が作成した EKS アップデートを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListPodIdentityAssociations</p></td>
     <td><p>ポッドアイデンティティ</p></td>
     <td><p>Zilliz が作成したポッドアイデンティティ関連付けを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListタグForResource</p></td>
     <td><p>タグ</p></td>
     <td><p>Zilliz が作成したリソースタグを取得します</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteAccessEntry</p></td>
     <td><p>EKS Accessentry</p></td>
     <td><p>Zilliz が作成した EKS アクセスエントリを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteAddon</p></td>
     <td><p>EKS アドオン</p></td>
     <td><p>Zilliz が作成した EKS アドオンを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteCluster</p></td>
     <td><p>EKS クラスター</p></td>
     <td><p>Zilliz が作成した EKS クラスターを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteFargateプロファイル</p></td>
     <td><p>EKS</p></td>
     <td><p>Zilliz が作成した EKS Fargate プロファイルを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteNodegroup</p></td>
     <td><p>EKS ノードグループ</p></td>
     <td><p>Zilliz が作成した EKS ノードグループを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeletePodIdentityAssociation</p></td>
     <td><p>EKS</p></td>
     <td><p>Zilliz が作成した EKS ポッドアイデンティティを削除します。</p></td>
   </tr>
   <tr>
     <td><p>s3:GetバケットLocation</p></td>
     <td><p>バケット</p></td>
     <td><p>S3 バケットの場所が正しいことを確認します。</p></td>
   </tr>
</table>
