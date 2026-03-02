---
title: "共有責任 | BYOC"
slug: /shared-responsibilities
sidebar_label: "共有責任"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz CloudとBYOCユーザーの責任を明確にし、クラウド管理、アップグレード、セキュリティ、アクセス制御、サービス可用性、技術サポートに関連するタスクの分担を明確にすることで、安全で効率的な運用環境を維持しながらスムーズなコラボレーションを保証します。 | BYOC"
type: origin
token: QqtGwq7lSimnHJk6IuXcM9synWg
sidebar_position: 11
keywords: 
  - zilliz
  - byoc
  - milvus
  - ベクトルデータベース
  - 共有責任
  - llm-as-a-judge
  - ハイブリッドベクトル検索
  - ビデオ重複排除
  - ビデオ類似性検索

---

import Admonition from '@theme/Admonition';


# 共有責任

このページでは、Zilliz CloudとBYOCユーザーの責任を概説し、クラウド管理、アップグレード、セキュリティ、アクセス制御、サービス可用性、およびテクニカルサポートに関連するタスクの分担を明確にすることで、安全で効率的な運用環境を維持しながらスムーズなコラボレーションを保証します。

## クラウド管理{#cloud-management}

<table>
   <tr>
     <th><p>タスク</p></th>
     <th><p>Zilliz BYOC</p></th>
     <th><p>顧客</p></th>
   </tr>
   <tr>
     <td><p>VPCのセットアップ</p></td>
     <td></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>EC2インスタンスの管理</p></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>Kubernetesクラスターの管理</p></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>S3バケットの管理</p></td>
     <td></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>Milvusインスタンスのプロビジョニング</p></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
</table>

## アップグレードとセキュリティ{#upgrade-and-security}

<table>
   <tr>
     <th><p>タスク</p></th>
     <th><p>Zilliz BYOC</p></th>
     <th><p>顧客</p></th>
   </tr>
   <tr>
     <td><p>Milvusインスタンスのアップグレード</p></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>ソフトウェアの脆弱性のパッチ適用</p></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>インフラストラクチャの脆弱性のパッチ適用</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>リソースのスケーリング</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

## アクセス制御{#access-control}

<table>
   <tr>
     <th><p>タスク</p></th>
     <th><p>Zilliz BYOC</p></th>
     <th><p>顧客</p></th>
   </tr>
   <tr>
     <td><p>IAMロールとサービスアカウントの管理</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>アクセス制御と監査の実装</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

## サービス可用性{#service-availability}

<table>
   <tr>
     <th><p>タスク</p></th>
     <th><p>Zilliz BYOC</p></th>
     <th><p>顧客</p></th>
   </tr>
   <tr>
     <td><p>災害復旧 (DR)</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>サービスレベル契約 (SLA)</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

## テクニカルサポート{#technical-support}

<table>
   <tr>
     <th><p>タスク</p></th>
     <th><p>Zilliz BYOC</p></th>
     <th><p>顧客</p></th>
   </tr>
   <tr>
     <td><p>ロギング</p></td>
     <td></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>監査ロギング</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>モニタリング</p></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>ブレークグラスアクセス</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

