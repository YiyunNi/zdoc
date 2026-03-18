---
title: "ストレージコスト | Cloud"
slug: /storage-cost
sidebar_label: "ストレージ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、クラスターが稼働しているかどうかに関わらず、データやバックアップファイルを保存するとストレージコストが発生します。| Cloud"
type: origin
token: PNj2w5fY9ifr82kbX8ucKgXAn0r
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ストレージ
  - コスト
  - 課金

---

import Admonition from '@theme/Admonition';


# ストレージコスト

Zilliz Cloud では、クラスターが稼働しているかどうかに関わらず、データやバックアップファイルを保存するとストレージコストが発生します。

## ストレージコストの発生源\{#sources-of-storage-costs}

以下のシナリオでストレージ料金が請求されます：

- クラスターデータストレージ：クラスターに保存される生データとインデックス。クラスタータイプがティアードストレージの場合、追加のコールドデータアクセスコストが発生する可能性があります。

- [バックアップ](./backup-and-restore) ストレージ：災害復旧用に作成したバックアップファイル。

- [ボリューム](./volume-explained) ストレージ：ボリュームに保存された構造化データ、または非構造化データファイルのコレクション。

## コスト計算\{#cost-calculation}

```plaintext
Storage Cost = Storage Unit Price x Data Size x Duration
```

- 単価（ストレージ）：クラウドリージョンとクラスタタイプによって決定されます。詳細な料金については、[Zilliz Cloud の料金](https://zilliz.com/pricing) をご参照ください。

- データサイズ：保存されているすべてのデータまたはバックアップファイルのサイズで、GB 単位で測定されます。

- 期間：データまたはバックアップファイルが Zilliz Cloud に保存されている時間です。

### コールドデータへのアクセス\{#cold-data-access}

<Admonition type="info" icon="📘" title="Note">

<p>この課金項目は、Milvus 2.6.x と互換性のあるティアードストレージクラスタにのみ適用されます。</p>

</Admonition>

クラスタタイプが**tiered-storage**の場合、追加のコールドデータアクセス費用が発生する可能性があります。以下の式は、コールドデータアクセス費用を計算する方法を示しています。

```bash
Cold Data Access Cost =  Cold Data Access Unit Price x Cold Data Size
```

- Cold データ Access 単価: クラウドリージョンによって決定されます。詳細な料金については、[Zilliz Cloud Pricing Guide](https://zilliz.com/pricing/pricing-guide) をご参照ください。

- Cold データ Size: 各読み取りリクエスト（検索またはクエリ）中にスキャンされる、オブジェクトストレージに保存されたコールドデータのサイズです。データサイズは GB で測定されます。

## 請求 rules\{#billing-rules}

クラスターおよびボリュームストレージの請求ルールは、バックアップストレージおよびコールドデータアクセスとは若干異なります。

- **Cluster データ and ボリューム Storage:** 時間単位で課金され、最低 1 時間分の料金が発生します。

- **Backup Storage:** 日単位で課金され、最低 1 日分の料金が発生します。

- **Cold データ Access**: 読み取りリクエスト（検索またはクエリ）ごとに課金され、最低 1 MB 分の料金が発生します。1 MB を超えるリクエストは、実際にスキャンされたデータサイズに基づいて課金されます。

## Examples\{#examples}

以下は、ストレージ費用の計算方法を理解するためのいくつかの例です。

### Example 1: Cluster storage cost\{#example-1-cluster-storage-cost}

クラスター構成が以下の通りであると仮定します。

- **クラウドプロバイダー & Region**: AWS us-east-1 (Virginia)

- **クラスタータイプ**: パフォーマンス最適化済み

- **データ Size**: 500 GB

- **ストレージ期間**: 29 日 23 時間 30 分

クラウドプロバイダーとリージョン、およびクラスタータイプの情報に基づき、[Pricing Page](https://zilliz.com/pricing) でストレージの単価が **&#36;0.025/GB per month** であることを確認できます。

[請求ルール](./storage-cost#billing-rules) により、1 時間未満の端数は 1 時間として切り上げられます。したがって、ストレージ期間である 29 日 23 時間 30 分は 30 日（つまり 1 か月）に切り上げられます。

合計データストレージ費用は `$0.025 x 500 × 1 = $12.50` です。

### Example 2: Backup storage cost\{#example-2-backup-storage-cost}

クラスター構成が以下の通りであると仮定します。

- **クラウドプロバイダー & Region**: AWS us-east-1 (Virginia)

- **クラスタータイプ**: パフォーマンス最適化済み

- **Backup File Size**: 20 GB

- **Backup File Retention 期間**: 44 日 6 時間

クラウドプロバイダーとリージョン、およびクラスタータイプの情報に基づき、[Pricing Page](https://zilliz.com/pricing) でストレージの単価が **&#36;0.025/GB per month** であることを確認できます。

[請求ルール](./storage-cost#billing-rules) により、1 日未満の端数は 1 日として切り上げられます。したがって、保持期間である 44 日 6 時間は 45 日（つまり 1.5 か月）に切り上げられます。

この例のクラスターの合計バックアップストレージ費用は `$0.025 x 20 x 1.5 = $0.75` です。

### Example 3: ボリューム storage cost\{#example-3-volume-storage-cost}

インポート用にボリュームへ **10 GB** のデータをアップロードし、**1 か月** 保持した場合、単価が **&#36;0.04/GB per month** であれば、費用は `$0.04 × 10 × 1 = $0.40` となります。

### Example 4: Cluster cold data access cost\{#example-4-cluster-cold-data-access-cost}

クラスター構成が以下の通りであると仮定します。

- **クラウドプロバイダー & Region**: AWS us-east-1 (Virginia)

- **クラスタータイプ**: Tiered-storage

- **Cold データ Size**: 200 GB

クラウドプロバイダーとリージョン、およびクラスタータイプの情報に基づき、[Pricing Guide](https://zilliz.com/pricing/pricing-guide) でコールドデータアクセスの単価が **&#36;0.0005/GB** であることを確認できます。

合計コールドデータアクセス費用は `$0.0005 x 200 = $0.1` です。

## FAQs\{#faqs}

1. **クラスターを一時停止しても、ストレージ料金は発生しますか？**

    はい。クラスターが一時停止されている場合でも、クラスターデータ、バックアップ、またはボリュームファイルが保持されている限り、ストレージ費用が発生します。

1. **ストレージには最低料金がありますか？**
 はい。ストレージには最低料金があります。

    - クラスターおよびボリュームストレージ：最低 1 時間分の料金。

    - バックアップストレージ：最低 1 日分の料金。

