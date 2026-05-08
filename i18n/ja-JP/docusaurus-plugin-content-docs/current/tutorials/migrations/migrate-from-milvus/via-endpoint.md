---
title: "Milvus から Zilliz Cloud へのエンドポイント経由での移行 | Cloud"
slug: /via-endpoint
sidebar_key: via-endpoint
sidebar_label: "エンドポイント経由"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、インフラストラクチャの管理を自分で行いたくないユーザー向けに、Milvus をフルマネージドのクラウドホスト型ソリューションとして提供しています。このトピックでは、データベースエンドポイントを介して Milvus から移行する方法について説明します。"
type: origin
token: PlX3wo82Di6oWVkg2ercRWCUnvV
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - milvus
  - エンドポイント

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# エンドポイント経由で Milvus から Zilliz Cloud へ移行

Zilliz Cloud は、インフラストラクチャの管理を自分で行う必要なく Milvus ベクトルデータベースを利用したいユーザー向けに、[Milvus](https://milvus.io/) をフルマネージドのクラウドホスト型ソリューションとして提供しています。このトピックでは、データベースエンドポイント経由で Milvus から移行する方法について説明します。

## 前提条件\{#prerequisites}

Milvus から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### Milvus の要件\{#milvus-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>バージョン互換性</p></td>
     <td><p>Milvus 2.3.6 以降</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ソース Milvus インスタンスがパブリックインターネットからアクセス可能であること</p></td>
   </tr>
   <tr>
     <td><p>認証情報</p></td>
     <td><p>認証が有効な場合はユーザー名とパスワード（<a href="https://milvus.io/docs/authenticate.md?tab=docker#Authenticate-User-Access">Authenticate User Access</a> を参照）</p></td>
   </tr>
</table>

### Zilliz Cloud の要件\{#zilliz-cloud-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザーロール</p></td>
     <td><p>組織オーナーまたはプロジェクト管理者</p></td>
   </tr>
   <tr>
     <td><p>クラスター容量</p></td>
     <td><p>十分なストレージおよびコンピューティングリソース（CU サイズの見積もりには <a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a> を使用）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、許可リストに <a href="./zilliz-cloud-ips">Zilliz Cloud IP</a> を追加してください</p></td>
   </tr>
</table>

## はじめに\{#getting-started}

以下のデモでは、エンドポイント経由で Milvus から移行を開始する方法を説明します。

<Supademo id="cmbkiuxw98p13sn1rc65tt6b0" title="Zilliz Cloud - Migrate from Milvus via Endpoint" />

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>ソースコレクションで全文検索が既に有効になっている場合、Zilliz Cloud は移行後にターゲットコレクションでその Function 設定を保持します。これらの継承された設定は変更できません。</p></li>
<li><p>移行中に他の VARCHAR フィールドの全文検索を有効にすることもできます。詳細については、<a href="./full-text-search">Full Text Search</a> を参照してください。</p></li>
</ul>

</Admonition>

## 移行プロセスの監視\{#monitor-the-migration-process}

**Migrate** をクリックすると、移行ジョブが生成されます。[ジョブ](./job-center) ページで移行の進捗状況を確認できます。ジョブのステータスが **進行中** から **成功** に変わると、移行は完了です。

![RGsvb7oFpo7uzbxjSSFc6owNn0c](https://zdoc-images.s3.us-west-2.amazonaws.com/rgsvb7ofpo7uzbxjssfc6ownn0c.png "RGsvb7oFpo7uzbxjSSFc6owNn0c")

## 移行後\{#post-migration}

移行ジョブが完了した後、以下の点に注意してください。

- **インデックス作成**: 移行プロセスでは、移行されたコレクションに対して [AUTOINDEX](./autoindex-explained) が自動的に作成されます。

- **手動ロードが必要です**: 自動インデックス作成が行われても、移行されたコレクションは検索やクエリ操作をすぐに利用できる状態にはなりません。Zilliz Cloud でコレクションを手動でロードして、検索およびクエリ機能を有効にする必要があります。詳細については、[Load & Release](./load-release-collections) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>コレクションがロードされたら、ターゲットクラスターのコレクション数およびエンティティ数がデータソースと一致していることを確認してください。不一致が見つかった場合は、エンティティが欠落しているコレクションを削除して、再度移行してください。</p>

</Admonition>

## 移行ジョブのキャンセル\{#cancel-migration-job}

移行プロセスで問題が発生した場合は、以下の手順でトラブルシューティングを行い、移行を再開できます。

<Procedures>

1. [ジョブ](./job-center) ページで、失敗した移行ジョブを特定してキャンセルします。

1. **Actions** 列の **View Details** をクリックして、エラーログにアクセスします。

</Procedures>