---
title: "ボリュームの説明 | Cloud"
slug: /volume-explained
sidebar_label: "ボリュームの説明"
beta: FALSE
notebook: FALSE
description: "ボリュームは、構造化データまたは非構造化データファイルのコレクションを格納するオブジェクトストアです。これらのデータ資産にアクセス、保存、管理、整理するための統一された場所を提供します。ローカルファイルシステムやクラウドオブジェクトストレージからの構造化データおよび非構造化データは、まず Zilliz Cloud のボリュームにアップロードされます。そこから、構造化データを直接コレクションにインポートまたは移行したり、ETL パイプラインを実行して非構造化データを埋め込みベクトルに変換し、その後それらの埋め込みベクトルをコレクションに読み込んだりすることができます。 | Cloud"
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


# ボリュームの説明

ボリュームは、構造化データまたは非構造化データファイルのコレクションを格納するオブジェクトストアです。これらのデータ資産にアクセス、保存、管理、整理するための統一された場所を提供します。ローカルファイルシステムやクラウドオブジェクトストレージにある構造化データおよび非構造化データは、まず Zilliz Cloud のボリュームにアップロードされます。その後、構造化データを直接コレクションにインポートまたは移行したり、ETL パイプラインを実行して非構造化データを埋め込みベクトルに変換し、その埋め込みベクトルをコレクションにロードしたりできます。

![DKAYwcIgJhudJnbw8Sbczhttntb](https://zdoc-images.s3.us-west-2.amazonaws.com/DKAYwcIgJhudJnbw8Sbczhttntb.png)

ボリュームは単一のクラスターではなく、プロジェクトに属します。同じプロジェクト内の任意のクラスターは、[プロジェクトロール](./project-users#invite-a-user-to-a-project) に従って、そのボリュームを読み書きできます。

```bash
Organization
└─ Project
   ├─ Clusters
   │   └─ Databases
   │       └─ Collections
   └─ Volumes
       └─ Data files
```

## ボリュームのユースケース\{#use-cases-for-volumes}

ボリュームを使用すると、データ処理が容易になります。以下の図は、Zilliz Cloud ボリュームの主な適用シナリオを示しています。

![NRlhw8PMBhszdybIu6mcQro9npv](https://zdoc-images.s3.us-west-2.amazonaws.com/NRlhw8PMBhszdybIu6mcQro9npv.png)

ボリュームは、データ import、データ migration、データ merging で使用できます。これらはすべて外部ソースからデータを取得する必要がありますが、取得したデータの使用方法は異なります。

- **データ import**

    データ import では、準備されたデータセットをボリュームにアップロードし、そのボリュームから Zilliz Cloud コレクションにインポートできます。詳細については、[データのインポート（コンソール）](./import-data-on-web-ui#files-uploaded-to-a-volume)、[データのインポート（RESTful API）](./import-data-via-restful-api)、および [データのインポート（SDK）](./import-data-via-sdks) を参照してください。

- **データ migration**

    データ migration では、Milvus インスタンスのバックアップファイルをボリュームにアップロードし、ボリューム内のデータを使用して Milvus インスタンスを Zilliz Cloud クラスタとして復元します。詳細については、[バックアップファイルを介して Milvus から Zilliz Cloud へ移行する](./via-backup-files) を参照してください。

- **データ merging**

    既存の Zilliz Cloud コレクションからのデータと、ボリュームにアップロードされたローカルファイルからのデータをマージして、両方のソースからのデータを結合したコレクションを作成できます。詳細については、[データのマージ](./merge-data) を参照してください。

## 請求\{#billing}

ボリュームを作成する際、**無料トライアルボリューム**または**従量課金ボリューム**のいずれかを選択できます。以下の表は、それらの典型的なユースケースと制限を比較したものです。

<table>
   <tr>
     <th></th>
     <th><p>Free Trial</p></th>
     <th><p>Pay-as-you-go</p></th>
   </tr>
   <tr>
     <td><p>Use case</p></td>
     <td><p>For testing environments only.</p></td>
     <td><p>For production usage.</p></td>
   </tr>
   <tr>
     <td><p>Capacity</p></td>
     <td><p>5 GB</p></td>
     <td><p>Unlimited</p></td>
   </tr>
   <tr>
     <td><p>File size & amount per upload</p></td>
     <td><p>Up to 1 GB of data and no more than 1,000 files in each upload</p></td>
     <td><p>Up to 100 GB of data and unlimited number of files in each upload</p></td>
   </tr>
   <tr>
     <td><p>Max. numbers volumes</p></td>
     <td><p>1</p></td>
     <td><p>100</p></td>
   </tr>
</table>

### 無料トライアルボリューム\{#free-trial-volume}

- 支払い方法は不要です。
- 各組織で保有できる無料トライアルボリュームは 1 つのみです。
- 無料トライアルボリュームは 30 日間保持され、その後自動的に削除されます。

### 従量課金ボリューム\{#pay-as-you-go-volume}

- 有効な支払い方法が必要です。
- 従量課金ボリュームの使用には料金が発生します。

    - 定価については、[価格ガイド](http://zilliz.com/pricing/pricing-guide) を参照してください。
    - ボリューム料金の計算方法については、[ストレージコスト](./storage-cost) を参照してください。

## よくある質問\{#faqs}

1. **請求書の未払いにより組織が凍結された場合、ボリュームはどうなりますか？**

    組織が凍結されると、無料トライアルボリュームと従量課金ボリュームの両方を含むすべてのボリューム、およびそこに保存されているすべてのファイルが削除され、復元できなくなります。

    ボリュームを引き続き使用するには、まず未払いの請求書をすべて精算し、その後新しいボリュームを作成してファイルを再アップロードしてください。

1. **なぜ Web コンソールで無料トライアルボリュームのオプションが表示されないのですか？**

    組織に対して無料トライアルボリュームが 1 つ作成されると、無料トライアルボリュームのオプションは非表示になります。各組織で作成できる無料トライアルボリュームは 1 つのみです。

