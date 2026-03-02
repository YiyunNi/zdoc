---
title: "エンドポイント経由でMilvusからZilliz Cloudへ移行する | Cloud"
slug: /via-endpoint
sidebar_label: "エンドポイント経由"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、Milvusをフルマネージドのクラウドホスト型ソリューションとして提供しており、ユーザーはインフラストラクチャを自分で管理することなくMilvusベクトルデータベースを利用できます。このトピックでは、データベースエンドポイントを介してMilvusから移行する方法について説明します。 | Cloud"
type: origin
token: PlX3wo82Di6oWVkg2ercRWCUnvV
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 移行
  - milvus
  - エンドポイント
  - セマンティック検索とは
  - Embedding model
  - 画像類似性検索
  - Context Window

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# エンドポイント経由でMilvusからZilliz Cloudへ移行する

Zilliz Cloudは、Milvusベクトルデータベースを自分でインフラを管理することなく利用したいユーザー向けに、フルマネージドのクラウドホスト型ソリューションとして[Milvus](https://milvus.io/)を提供しています。このトピックでは、データベースエンドポイントを介してMilvusからZilliz Cloudへ移行する方法について説明します。

## 前提条件{#prerequisites}

MilvusからZilliz Cloudへの移行を開始する前に、以下の要件を満たしていることを確認してください。

### Milvusの要件{#milvus-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>バージョン互換性</p></td>
     <td><p>Milvus 2.3.6以降</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ソースMilvusインスタンスはパブリックインターネットからアクセス可能であること</p></td>
   </tr>
   <tr>
     <td><p>認証情報</p></td>
     <td><p>認証が有効な場合はユーザー名とパスワード（<a href="https://milvus.io/docs/authenticate.md?tab=docker#Authenticate-User-Access">ユーザーアクセス認証</a>を参照）</p></td>
   </tr>
</table>

### Zilliz Cloudの要件{#zilliz-cloud-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザーロール</p></td>
     <td><p>Organization OwnerまたはProject Admin</p></td>
   </tr>
   <tr>
     <td><p>クラスター容量</p></td>
     <td><p>十分なストレージとコンピューティングリソース（CUサイズの推定には<a href="https://zilliz.com/pricing#calculator">CU計算機</a>を使用）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IP</a>を許可リストに追加</p></td>
   </tr>
</table>

## はじめに{#getting-started}

以下のデモでは、エンドポイントを介してMilvusから移行を開始する方法を説明します。

<Supademo id="cmbkiuxw98p13sn1rc65tt6b0" title="Zilliz Cloud - Migrate from Milvus via Endpoint" />

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>ソースcollectionでfull text searchがすでに有効になっている場合、Zilliz Cloudは移行後もターゲットcollectionでそのFunction設定を保持します。これらの継承された設定は変更できません。</p></li>
<li><p>移行中に他のVARCHARフィールドに対してfull text searchを有効にすることもできます。詳細については、<a href="./full-text-search">Full Text Search</a>を参照してください。</p></li>
</ul>

</Admonition>

## 移行プロセスの監視{#monitor-the-migration-process}

**Migrate**をクリックすると、移行ジョブが生成されます。[Jobs](./job-center)ページで移行の進行状況を確認できます。ジョブのステータスが**In Progress**から**Successful**に切り替わると、移行は完了です。

![RGsvb7oFpo7uzbxjSSFc6owNn0c](https://zdoc-images.s3.us-west-2.amazonaws.com/rgsvb7ofpo7uzbxjssfc6ownn0c.png "RGsvb7oFpo7uzbxjSSFc6owNn0c")

## 移行後{#post-migration}

移行ジョブが完了したら、以下の点に注意してください。

- **インデックス作成**: 移行プロセスは、移行されたcollectionに対して自動的に[AUTOINDEX](./autoindex-explained)を作成します。

- **手動ロードが必要**: 自動インデックス作成にもかかわらず、移行されたcollectionは検索またはクエリ操作にすぐに利用できるわけではありません。検索およびクエリ機能を有効にするには、Zilliz Cloudでcollectionを手動でロードする必要があります。詳細については、[Load & Release](./load-release-collections)を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>collectionがロードされたら、ターゲットクラスター内のcollectionとentityの数がデータソースと一致することを確認してください。不一致が見つかった場合は、entityが不足しているcollectionを削除し、再移行してください。</p>

</Admonition>

## 移行ジョブのキャンセル{#cancel-migration-job}

移行プロセスで問題が発生した場合は、以下の手順でトラブルシューティングを行い、移行を再開できます。

<Procedures>

1. [Jobs](./job-center)ページで、失敗した移行ジョブを特定し、キャンセルします。

1. **Actions**列の**View Details**をクリックして、エラーログにアクセスします。

</Procedures>