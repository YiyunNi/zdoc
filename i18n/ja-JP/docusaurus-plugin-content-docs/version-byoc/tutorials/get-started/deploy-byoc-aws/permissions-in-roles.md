---
title: "ロールの権限 | BYOC"
slug: /permissions-in-roles
sidebar_label: "ロールの権限"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud がお客様に代わってコントロールプランのセットアップ中に操作を実行するために必要なすべての IAM 権限をリストします。 | BYOC"
type: origin
token: IOPFwYrC2iJDw3k2iElcBrkMnef
sidebar_position: 5
keywords: 
  - zilliz
  - byoc
  - aws
  - 権限
  - 最小権限
  - milvus
  - ベクトルデータベース
  - ハイブリッドベクトル検索
  - 動画の重複排除
  - 動画の類似性検索
  - ベクトル検索

---

import Admonition from '@theme/Admonition';


# ロールにおける権限

このページでは、Zilliz Cloudがコントロールプレーンのセットアップ中に操作を実行するために必要なすべてのIAM権限をリストアップします。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOCは現在、<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloudの営業担当</a>にお問い合わせください。</p>

</Admonition>

## ストレージロールの権限{#storage-role-permissions}

S3バケットとストレージロールを作成しました。Zilliz Cloudは、コントロールプレーンのセットアップ中に以下の権限を持つこのロールを引き受けます。

<table>
   <tr>
     <th><p>AWS IAM権限</p></th>
     <th><p>AWSリソース</p></th>
     <th><p>目的</p></th>
   </tr>
   <tr>
     <td><p>s3:ListBucket</p></td>
     <td><p>バケット</p></td>
     <td><p>バケットが存在するかどうかを確認します。</p></td>
   </tr>
   <tr>
     <td><p>s3:GetObject</p></td>
     <td><p>バケットオブジェクト</p></td>
     <td><p>MilvusがS3バケットからデータを読み取ることを許可します。</p></td>
   </tr>
   <tr>
     <td><p>s3:PutObject</p></td>
     <td><p>バケットオブジェクト</p></td>
     <td><p>Milvusがバケットにデータを書き込むことを許可します。</p></td>
   </tr>
   <tr>
     <td><p>s3:DeleteObject</p></td>
     <td><p>バケットオブジェクト</p></td>
     <td><p>Milvusがデータを削除することを許可します。</p></td>
   </tr>
</table>

## EKSロールの権限{#eks-role-permissions}

コントロールプレーンのセットアップ中にZilliz CloudがEKSクラスターを管理するために、以下の権限を持つEKSロールを作成しました。

### AWSマネージド権限{#aws-managed-permissions}

これらの権限はAWSによって管理されており、EKSロールにアタッチできます。これらの各権限の詳細については、**Permissions**列の項目をクリックして詳細を確認できます。

<table>
   <tr>
     <th><p>権限</p></th>
     <th><p>管理元</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ContainerRegistryReadOnly.html">AmazonEC2ContainerRegistryReadOnly</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Amazon EC2 Container Registryリポジトリへの読み取り専用アクセスを提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKS_CNI_Policy.html">AmazonEKS_CNI_Policy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Amazon VPC CNI Plugin (amazon-vpc-cni-k8s) がEKSワーカーノードのIPアドレス設定を変更するために必要な権限を提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSWorkerNodePolicy.html">AmazonEKSWorkerNodePolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Amazon EKSワーカーノードがAmazon EKSクラスターに接続することを許可します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSClusterPolicy.html">AmazonEKSClusterPolicy</a></p></td>
     <td><p>AWS</p></td>
     <td><p>Kubernetesがユーザーに代わってリソースを管理するために必要な権限を提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSVPCResourceController.html">AmazonEKSVPCResourceController</a></p></td>
     <td><p>AWS</p></td>
     <td><p>VPC Resource ControllerがワーカーノードのENIとIPを管理することを許可します。</p></td>
   </tr>
</table>

### Kubernetes SIGsからの権限{#permissions-from-kubernetes-sigs}

これらの権限は、[Kubernetes SIGs](https://github.com/kubernetes-sigs)リポジトリのコントリビューターによって管理されています。Zilliz Cloudは、AWS Load Balancer Controller、Amazon EBS CSIドライバー、およびCluster AutoScalerをインストールするための権限を参照します。

以下の表は、特定の権限セットをリストアップしています。これらの各権限の詳細については、**Permissions**列の項目をクリックして詳細を確認できます。

<table>
   <tr>
     <th><p>権限</p></th>
     <th><p>管理元</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/docs/install/iam_policy.json">AWS Load Balancer Controller</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>AWS Load Balancer Controllerは、KubernetesクラスターのElastic Load Balancerを管理するのに役立つコントローラーです。</p><p>AWS Load Balancer Controllerリポジトリの詳細については、<a href="https://github.com/kubernetes-sigs/aws-load-balancer-controller/tree/main">README</a>ファイルを参照してください。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/example-iam-policy.json">Amazon EBS CSI driver</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>Amazon Elastic Block Store Container Storage Interface (CSI) ドライバーは、コンテナオーケストレーターがAmazon EBSボリュームのライフサイクルを管理するために使用するCSIインターフェースを提供します。</p><p>Amazon EBS CSIドライバーの詳細については、<a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver">README</a>ファイルを参照してください。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended">Cluster AutoScaler</a></p></td>
     <td><p>Kubernetes SIGs</p></td>
     <td><p>Cluster AutoScalerは、すべてのPodが実行される場所を持ち、不要なノードがないように、Kubernetesクラスターのサイズを自動的に調整するコンポーネントです。</p><p>AWS上のCluster AutoScalerの詳細については、<a href="https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md">README</a>ファイルを参照してください。</p></td>
   </tr>
</table>

## クロスアカウントロールの権限{#cross-account-role-permissions}

Zilliz CloudがEKSクラスターにBYOCコントロールプレーンをセットアップするために、以下の権限を持つクロスアカウントロールを作成しました。

<table>
   <tr>
     <th><p>AWS IAM権限</p></th>
     <th><p>AWSリソース</p></th>
     <th><p>目的</p></th>
   </tr>
   <tr>
     <td><p>iam:GetRole</p></td>
     <td><p>ロール</p></td>
     <td><p>EKS作成時に依存ロールを読み取ります。</p></td>
   </tr>
   <tr>
     <td><p>iam:ListAttachedRolePolicies</p></td>
     <td><p>ポリシー</p></td>
     <td><p>依存ロールのポリシーを取得します。</p></td>
   </tr>
   <tr>
     <td><p>iam:PassRole</p></td>
     <td><p>ロール</p></td>
     <td><p>EKSがロールを使用することを許可します。</p></td>
   </tr>
   <tr>
     <td><p>iam:UpdateAssumeRolePolicy</p></td>
     <td><p>IAMロール</p></td>
     <td><p>EKS OIDCプロバイダーの信頼ポリシーを更新します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:CreateLaunchTemplate</p></td>
     <td><p>起動テンプレート</p></td>
     <td><p>EKSノードグループの起動テンプレートを作成します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:RunInstances</p></td>
     <td><p>インスタンス</p></td>
     <td><p>EKSノードグループのAWSインスタンスを起動します。</p></td>
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
     <td><p>ec2:CreateTags</p></td>
     <td><p>タグ</p></td>
     <td><p>すべてのZilliz BYOCリソースにタグを追加します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DescribeAccountAttributes</p></td>
     <td><p>アカウント</p></td>
     <td><p>ロール使用時にアカウントIDを確認します。</p></td>
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
     <td><p>起動テンプレートが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DescribeSubnets</p></td>
     <td><p>サブネット</p></td>
     <td><p>VPCにサブネットが存在することを確認します。</p></td>
   </tr>
   <tr>
     <td><p>ec2:DescribeVpcs</p></td>
     <td><p>VPC</p></td>
     <td><p>VPCが存在することを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateCluster</p></td>
     <td><p>EKSクラスター</p></td>
     <td><p>EKSクラスターを作成します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateNodegroup</p></td>
     <td><p>EKSノードグループ</p></td>
     <td><p>EKSノードグループを作成します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateAddon</p></td>
     <td><p>EKSアドオン</p></td>
     <td><p>EKSアドオンを作成します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreateAccessEntry</p></td>
     <td><p>EKS AccessEntry</p></td>
     <td><p>アクセスエントリは、IAMプリンシパルがクラスターにアクセスすることを許可します。</p></td>
   </tr>
   <tr>
     <td><p>eks:CreatePodIdentityAssociation</p></td>
     <td><p>EKS PodIdentityAssociation</p></td>
     <td><p>PodがAWS IAMロールを引き受けることを許可します。</p></td>
   </tr>
   <tr>
     <td><p>eks:AssociateAccessPolicy</p></td>
     <td><p>ポリシー</p></td>
     <td><p>アクセスポリシーとそのスコープをアクセスエントリに関連付けます。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateAccessEntry</p></td>
     <td><p>EKS AccessEntry</p></td>
     <td><p>EKS AccessEntryを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateAddon</p></td>
     <td><p>EKSアドオン</p></td>
     <td><p>EKSアドオンを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateClusterConfig</p></td>
     <td><p>EKSクラスター</p></td>
     <td><p>EKSの設定を更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateClusterVersion</p></td>
     <td><p>EKSクラスター</p></td>
     <td><p>EKSのバージョンを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateNodegroupConfig</p></td>
     <td><p>EKSノードグループ</p></td>
     <td><p>EKSノードグループの設定を更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdateNodegroupVersion</p></td>
     <td><p>EKSノードグループ</p></td>
     <td><p>EKSノードグループのバージョンを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:UpdatePodIdentityAssociation</p></td>
     <td><p>Pod ID</p></td>
     <td><p>EKS Pod IDを更新します。</p></td>
   </tr>
   <tr>
     <td><p>eks:TagResource</p></td>
     <td><p>タグ</p></td>
     <td><p>すべてのEKSリソースにタグを付けます。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeCluster</p></td>
     <td><p>EKSクラスター</p></td>
     <td><p>EKSクラスターが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeNodegroup</p></td>
     <td><p>EKSノードグループ</p></td>
     <td><p>EKSノードグループが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAccessEntry</p></td>
     <td><p>EKS AccessEntry</p></td>
     <td><p>EKSアクセスエントリが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAddon</p></td>
     <td><p>EKSアドオン</p></td>
     <td><p>EKSクラスターが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAddonConfiguration</p></td>
     <td><p>EKSアドオン</p></td>
     <td><p>EKSクラスターが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribeAddonVersions</p></td>
     <td><p>EKSアドオン</p></td>
     <td><p>EKSクラスターが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DescribePodIdentityAssociation</p></td>
     <td><p>Pod ID</p></td>
     <td><p>EKSクラスターが正しく作成されていることを確認します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListAccessEntries</p></td>
     <td><p>EKSアクセスエントリ</p></td>
     <td><p>Zillizによって作成されたEKSアクセスエントリを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListAccessPolicies</p></td>
     <td><p>EKSアクセスポリシー</p></td>
     <td><p>Zillizによって作成されたEKSアクセスポリシーを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListAddons</p></td>
     <td><p>EKSアドオン</p></td>
     <td><p>Zillizによって作成されたEKSアドオンを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListNodegroups</p></td>
     <td><p>EKSノードグループ</p></td>
     <td><p>Zillizによって作成されたEKSノードグループを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListUpdates</p></td>
     <td><p>EKS</p></td>
     <td><p>Zillizによって作成されたEKSの更新を取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListPodIdentityAssociations</p></td>
     <td><p>Pod ID</p></td>
     <td><p>Zillizによって作成されたPod ID関連付けを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:ListTagsForResource</p></td>
     <td><p>タグ</p></td>
     <td><p>Zillizによって作成されたリソースタグを取得します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteAccessEntry</p></td>
     <td><p>EKS AccessEntry</p></td>
     <td><p>Zillizによって作成されたEKSアクセスエントリを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteAddon</p></td>
     <td><p>EKSアドオン</p></td>
     <td><p>Zillizによって作成されたEKSアドオンを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteCluster</p></td>
     <td><p>EKSクラスター</p></td>
     <td><p>Zillizによって作成されたEKSクラスターを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteFargateProfile</p></td>
     <td><p>EKS</p></td>
     <td><p>Zillizによって作成されたEKS Fargateプロファイルを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeleteNodegroup</p></td>
     <td><p>EKSノードグループ</p></td>
     <td><p>Zillizによって作成されたEKSノードグループを削除します。</p></td>
   </tr>
   <tr>
     <td><p>eks:DeletePodIdentityAssociation</p></td>
     <td><p>EKS</p></td>
     <td><p>Zillizによって作成されたEKS Pod IDを削除します。</p></td>
   </tr>
   <tr>
     <td><p>s3:GetBucketLocation</p></td>
     <td><p>バケット</p></td>
     <td><p>S3バケットの場所が正しいことを確認します。</p></td>
   </tr>
</table>
