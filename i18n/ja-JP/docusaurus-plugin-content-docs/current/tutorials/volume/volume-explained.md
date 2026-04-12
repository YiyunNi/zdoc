---
title: "ボリュームの説明 | Cloud"
slug: /volume-explained
sidebar_label: "ボリュームの説明"
beta: FALSE
notebook: FALSE
description: "ボリュームは、構造化されたテーブルまたは非構造化データファイルのコレクションを格納するオブジェクトストアです。ボリュームから、データを直接コレクションにインポートまたは移行したり、ETL パイプラインを実行して非構造化データを埋め込みベクトルに変換し、コレクションにロードしたりできます。| Cloud"
type: origin
token: H22PwQ4DxiwKrrkQxlac21WenRe
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ボリューム

---

import Admonition from '@theme/Admonition';


# ボリューム の説明

ボリューム は、構造化テーブルまたは非構造化データファイルのコレクションのいずれかを格納するオブジェクトストアです。ボリューム から、データを直接コレクションにインポートまたは移行したり、ETL パイプラインを実行して非構造化データを埋め込み（embeddings）に変換し、コレクションにロードしたりできます。

## ボリューム の種類\{#types-of-volume}

Zilliz Cloud は、2 種類の ボリューム をサポートしています。

![DKAYwcIgJhudJnbw8Sbczhttntb](https://zdoc-images.s3.us-west-2.amazonaws.com/DKAYwcIgJhudJnbw8Sbczhttntb.png)

- **Managed volume**: データを Zilliz Cloud が管理するストレージに保存します。ローカルファイルシステムからファイルをアップロードし、それをインポート、移行、または ETL パイプラインを実行してコレクションにデータを読み込みます。独自のクラウドオブジェクトストレージを維持していないユーザーに最適です。

- **External volume** (パブリックプレビュー): ユーザー自身のクラウドオブジェクトストレージバケット内のバケットにマッピングされます。データはユーザーのバケット内に残ります。データをコレクションにインポートまたは移行したり、データを直接参照する外部コレクションを作成したりできます。データを独自のストレージに保持したまま Zilliz Cloud で利用したいユーザーに最適です。

以下の表は、2 種類の ボリューム を比較したものです。

<table>
   <tr>
     <th></th>
     <th><p><strong>Managed ボリューム</strong></p></th>
     <th><p><strong>External ボリューム</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>データ location</strong></p></td>
     <td><p>Zilliz Cloud-managed storage</p></td>
     <td><p>Your own S3 or GCS bucket</p></td>
   </tr>
   <tr>
     <td><p><strong>Access control</strong></p></td>
     <td><ul><li><p>Determined by Zilliz Cloud RBAC</p></li><li><p>Authenticate via Zilliz Cloud API key</p></li></ul></td>
     <td><ul><li><p>Determined by Object Storage Service (OSS) RBAC</p></li><li><p>Authenticate via <a href="./integrate-with-aws-s3">storage integration</a></p></li></ul></td>
   </tr>
   <tr>
     <td><p><strong>請求</strong></p></td>
     <td><p>Free trial or pay-as-you-go</p></td>
     <td><p>Free</p></td>
   </tr>
   <tr>
     <td><p><strong>支払い method required</strong></p></td>
     <td><p>Yes (for pay-as-you-go)</p></td>
     <td><p>No</p></td>
   </tr>
   <tr>
     <td><p><strong>Upload files to volume</strong></p></td>
     <td><p>Yes (via SDK or console)</p></td>
     <td><p>No — data stays in your bucket. Manage files directly in your cloud storage.</p></td>
   </tr>
   <tr>
     <td><p><strong>File operations</strong></p></td>
     <td><p>Read, write, delete</p></td>
     <td><p>Read-only</p></td>
   </tr>
   <tr>
     <td><p><strong>Use cases</strong></p></td>
     <td><p>Import, migration, data ETL</p></td>
     <td><p>Import, migration,  data ETL, and external collections</p></td>
   </tr>
   <tr>
     <td><p><strong>Cloud support</strong></p></td>
     <td><p>AWS, GCP</p></td>
     <td><p>AWS, GCP</p></td>
   </tr>
</table>

## リソース階層\{#resource-hierarchy}

ボリューム は単一のクラスターではなく、プロジェクトに属します。同じプロジェクト内の任意のクラスターが ボリューム にアクセスできます。ファイルの作成、表示、削除など、ユーザーが ボリューム で実行できる操作は、[プロジェクトロール](./project-users#project-role-and-access-comparison) によって決定されます。

```bash
Organization
└─ Project
   ├─ Clusters
   │   └─ Databases
   │       └─ Collections
   ├─ Volumes
   │   ├─ Managed Volumes → Data files (Zilliz-hosted)
   │   └─ External Volumes → Maps to your cloud storage bucket (via Storage Integration)
   └─ Storage Integrations
```

## ユースケース\{#use-cases}

ボリュームは、データ import、データ migration、および外部コレクションに使用できます。

以下の図は、Zilliz Cloud ボリュームの主要な適用シナリオを示しています。

ボリュームは データ import、データ migration、および外部コレクションで使用できます。これらはすべて外部ソースからデータを取得する必要がありますが、取得したデータの使用方法は異なります。

- **データ import**

    ボリューム内で準備されたデータセットをアップロードまたは参照し、Zilliz Cloud コレクションにインポートします。マネージドボリュームと外部ボリュームの両方をインポートソースとして使用できます。詳細については、[データのインポート (コンソール)](./import-data-on-web-ui#from-a-volume)、[データのインポート (RESTful API)](./import-data-via-restful-api)、および [データのインポート (SDK)](./import-data-via-sdks) を参照してください。

- **データ migration**

    Milvus インスタンスのバックアップファイルをボリュームにアップロードし、Zilliz Cloud クラスタとして復元します。マネージドボリュームと外部ボリュームの両方を使用できます。詳細については、[バックアップファイルを介して Milvus から Zilliz Cloud へ移行する](./via-backup-files) を参照してください。

- **外部コレクション (近日公開)**

    外部ボリューム内のデータにマップする外部コレクションを作成し、最初にインポートすることなく、バケット内のファイルを Zilliz Cloud から直接クエリできるようにします。

## ボリュームの状態\{#volume-status}

<table>
   <tr>
     <th><p><strong>状態</strong></p></th>
     <th><p><strong>対象</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>実行中</strong></p></td>
     <td><p>マネージドおよび外部ボリューム</p></td>
     <td><p>ボリュームはアクティブで利用可能です。</p></td>
   </tr>
   <tr>
     <td><p><strong>フリーズ済み</strong></p></td>
     <td><p>マネージドおよび外部ボリューム</p></td>
     <td><p>未払いの請求書により組織がフリーズされています。ボリュームは新しい操作に使用できません。</p></td>
   </tr>
   <tr>
     <td><p><strong>エラー</strong></p></td>
     <td><p>外部ボリュームのみ</p></td>
     <td><p><a href="./integrate-with-aws-s3">ストレージ統合</a>の検証に失敗しました。設定を確認して再試行してください。</p></td>
   </tr>
</table>

## 請求\{#billing}

### マネージドボリューム\{#managed-volume}

マネージドボリュームを作成する際、**無料トライアル** プランまたは **pay-as-you-go** プランのいずれかを選択できます。以下の表は、それらの典型的なユースケースと 制限 を比較したものです。

<table>
   <tr>
     <th></th>
     <th><p><strong>Free Trial</strong></p></th>
     <th><p><strong>Pay-as-you-go</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>ユースケース</strong></p></td>
     <td><p>テスト環境専用。</p></td>
     <td><p>本番運用用。</p></td>
   </tr>
   <tr>
     <td><p><strong>容量</strong></p></td>
     <td><p>5 GB</p></td>
     <td><p>無制限</p></td>
   </tr>
   <tr>
     <td><p><strong>1 回あたりのアップロードファイルサイズと数</strong></p></td>
     <td><p>各アップロードで最大 1 GB のデータ、および最大 1,000 ファイル</p></td>
     <td><p>各アップロードで最大 100 GB のデータ、および無制限の数のファイル</p></td>
   </tr>
   <tr>
     <td><p><strong>ボリュームの最大数</strong></p></td>
     <td><p>1</p></td>
     <td><p>100</p></td>
   </tr>
</table>

**無料トライアル volume**

- 支払い方法は不要です。

- 各組織が保有できる 無料トライアル volume は 1 つのみです。

- 無料トライアル volume は 30 日間保持され、その後自動的に削除されます。

**従量課金ボリューム**

- 有効な支払い方法が必要です。

- 従量課金ボリューム の使用には料金が発生します。

    - マネージドボリュームが実行中の場合にのみ課金されます。

    - 定価については、[価格ガイド](http://zilliz.com/pricing/pricing-guide) を参照してください。

    - ボリューム料金の計算方法については、[ストレージコスト](./storage-cost) を参照してください。

### 外部ボリューム\{#external-volume}

外部ボリュームの作成と使用には、Zilliz Cloud からの課金は発生しません。支払い方法は不要です。

ただし、インポートまたは移行中に Zilliz Cloud がバケットから読み取る際、クラウドプロバイダーからデータリクエスト料金が課金される場合があります。詳細については、[Amazon S3 料金](https://aws.amazon.com/s3/pricing/) または [Google Cloud Storage 料金](https://cloud.google.com/storage/pricing.) を参照してください。

## 制限事項\{#limitations}

- ボリュームは **AWS** および **Google Cloud** でのみ利用可能です。**Azure** については、[サポートにお問い合わせください](https://support.zilliz.com/)。

- ボリュームは、使用する予定のクラスタと同じクラウドプロバイダーおよびリージョンにある必要があります。

- ボリュームを作成および管理するには、**プロジェクト管理者** である必要があります。

- 各組織は、最大 **100 個のマネージドボリューム** および **100 個の外部ボリューム** を作成できます。

## よくある質問\{#faqs}

**未払いの請求書により組織がフリーズされた場合、ボリュームはどうなりますか？**

組織がフリーズされると、すべてのマネージド ボリューム（無料トライアル および pay-as-you-go の両方）とそこに保存されているすべてのファイルが削除され、復元できなくなります。外部ボリュームもフリーズされ、新しい操作には使用できなくなりますが、お客様自身のバケット内のデータには影響しません。

ボリュームの使用を継続するには、まず未払いの請求書をすべて精算してください。

**なぜ Web コンソールで 無料トライアル volume オプションが表示されないのですか？**

組織用に 無料トライアル volume が 1 つ作成されると、無料トライアル volume オプションは非表示になります。各組織が作成できる 無料トライアル volume は 1 つのみです。

**外部ボリュームと外部ストレージからの直接インポートの違いは何ですか？**

どちらの方法でも、お客様自身の S3 または GCS バケットからデータをインポートできます。主な違いは以下の通りです。

- 外部ボリュームでは、認証情報管理のために [ストレージ統合](./integrate-with-aws-s3) を使用します。認証情報は 1 回設定すれば、複数のボリュームや操作で再利用できます。データエンジニアはクラウドストレージキーに直接アクセスする必要はありません。

- 直接 [外部ストレージインポート](./import-data-on-web-ui#remote-files-from-an-object-storage-bucket) では、各インポートリクエストごとに認証情報（アクセスキー、シークレットキー）をインラインで提供する必要があります。これは 1 回限りのインポートには簡単ですが、認証情報の分離や再利用性は提供されません。

**外部ボリューム作成後に、ストレージ統合またはパスを変更できますか？**

いいえ。外部ボリュームが作成された後、ストレージ統合とパスは変更できません。異なるストレージ統合またはパスを使用するには、新しい外部ボリュームを作成してください。

**アクティブなジョブまたは外部コレクションから参照されている外部ボリュームを削除できますか？**

いいえ。下流の外部コレクションまたはアクティブなジョブがボリュームを参照している場合、削除はブロックされます。

**外部ボリュームを使用すると、データ転送料金が課金されますか？**

いいえ。外部ボリュームは、クラスタと同じクラウドプロバイダーおよびリージョンにある必要があります。すべてのデータアクセスが同じリージョン内で発生するため、Zilliz Cloud 上でクロスリージョンのデータ転送料金は発生しません。 