---
title: "外部からの移行の基本 | Cloud"
slug: /external-migration-basics
sidebar_label: "外部からの移行の基本"
beta: FALSE
notebook: FALSE
description: "外部からの移行により、ベクトルデータベースと検索システムをZilliz Cloudに移行するプロセスが簡素化されます。PineconeやQdrantのようなベクトルデータベースから移行する場合でも、ElasticsearchやOpenSearchのようなベクトル機能を備えた検索エンジンから移行する場合でも、Zilliz Cloudはデータの整合性を確保しつつ、移行の複雑さを最小限に抑えるための移行ツールを提供します。 | Cloud"
type: origin
token: WZe4w7lNji6RVHkR5alcrTw8nQ2
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 移行
  - 外部
  - データソース
  - 基本
  - サーバーレスベクトルデータベース
  - milvus オープンソース
  - milvus の仕組み
  - Zilliz ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# 外部移行の基本

外部移行により、ベクトルデータベースと検索システムをZilliz Cloudに移行するプロセスが簡素化されます。PineconeやQdrantのようなベクトルデータベースから移行する場合でも、ElasticsearchやOpenSearchのようなベクトル機能を備えた検索エンジンから移行する場合でも、Zilliz Cloudはデータの整合性を確保しつつ、移行の複雑さを最小限に抑えるための移行ツールを提供します。

## サポートされているデータソース{#supported-data-sources}

Zilliz Cloudは、主要なベクトルデータベースおよび検索プラットフォームからの移行をサポートしています。

<table>
   <tr>
     <th><p>データソース</p></th>
     <th><p>タイプ</p></th>
     <th><p>主な機能</p></th>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-pinecone">Pinecone</a></p></td>
     <td><p>ベクトルデータベース</p></td>
     <td><p>類似性検索を備えたサーバーレスインデックス</p></td>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-qdrant">Qdrant</a></p></td>
     <td><p>ベクトルデータベース</p></td>
     <td><p>オープンソースエンジン、クラウドおよびセルフホスト型</p></td>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-elasticsearch">Elasticsearch</a></p></td>
     <td><p>検索エンジン</p></td>
     <td><p>フルテキスト検索を備えた高密度ベクトルサポート</p></td>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-pgvector">PostgreSQL</a></p></td>
     <td><p>リレーショナルデータベース</p></td>
     <td><p>ベクトル拡張 (pgvector) サポート</p></td>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-tencent-cloud">Tencent Cloud VectorDB</a></p></td>
     <td><p>マネージドサービス</p></td>
     <td><p>マネージドベクトルデータベースサービス</p></td>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-opensearch">OpenSearch</a></p></td>
     <td><p>検索プラットフォーム</p></td>
     <td><p>ベクトル機能を備えたKNNプラグイン</p></td>
   </tr>
</table>

## コア機能{#core-capabilities}

当社の移行ツールは、Zilliz Cloudにデータ構造を完全に適合させるための広範な設定オプションを提供します。

<table>
   <tr>
     <th><p>機能カテゴリ</p></th>
     <th><p>機能</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td rowspan="4"><p><strong>スキーマ制御</strong></p></td>
     <td><p>フィールド名のカスタマイズ</p></td>
     <td><p>移行中にフィールド名を変更して、希望する命名スタイルに合わせる</p></td>
   </tr>
   <tr>
     <td><p>動的フィールドから固定フィールドへ</p></td>
     <td><p>柔軟なメタデータを固定された構造化フィールドに変換して、パフォーマンスを向上させます。</p><p>メタデータにテキストが含まれている場合、それを固定フィールドに変換すると、`VARCHAR`フィールドが作成されます。これにより、そのテキストに対してFull Text Searchが可能になります。詳細については、<a href="./full-text-search">Full Text Search</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>追加フィールド</p></td>
     <td><p>進化する要件に対応するために、ソースデータ以外の新しいフィールドを追加する</p></td>
   </tr>
   <tr>
     <td><p>データ型マッピング</p></td>
     <td><p>Zilliz Cloudはフィールドタイプを自動的に検出し、マッピングしますが、手動で調整するオプションもあります</p></td>
   </tr>
   <tr>
     <td rowspan="3"><p><strong>コレクション設定</strong></p></td>
     <td><p>スマートネーミング</p></td>
     <td><p>デフォルトでは、Zilliz Cloudはターゲットコレクションのソーステーブル名を保持します。重複する名前が検出された場合、システムはエラーアラートを発行し、ユーザーが名前を変更できるようにします。ソーステーブル名にハイフン (`-`) が含まれる場合など、命名規則の競合が発生した場合、Zilliz Cloudはデータソースに応じて、ハイフン (`-`) を自動的にアンダースコア (`_`) に変換するか、ユーザーに調整を促すエラーを発生させます</p></td>
   </tr>
   <tr>
     <td><p>シャード設定</p></td>
     <td><p>データのクエリ方法に合わせてデータ分散を設定する</p></td>
   </tr>
   <tr>
     <td><p>パーティション戦略</p></td>
     <td><p>自動パーティショニングまたはカスタムグループ化を使用してデータを整理する</p></td>
   </tr>
   <tr>
     <td rowspan="2"><p><strong>データの整合性</strong></p></td>
     <td><p>主キーの処理</p></td>
     <td><p>レコードの一意の識別子を作成、保持、または変更する</p></td>
   </tr>
   <tr>
     <td><p>フィールド属性</p></td>
     <td><p>フィールドがNULL値を含むことができるかどうかを設定し、デフォルト値を定義する</p></td>
   </tr>
   <tr>
     <td></td>
     <td><p>検証チェック</p></td>
     <td><p>移行の詳細を示す詳細な移行レポートにアクセスする</p></td>
   </tr>
   <tr>
     <td><p><strong>Full Text Search</strong></p></td>
     <td><p>移行中に**VARCHAR**フィールドのFull Text Searchを有効にする</p></td>
     <td><p>移行中に**VARCHAR**フィールドのFull Text Searchを有効にするには、**Advanced settings** → **Function**で設定します。</p><p>ソースにメタデータにテキストが含まれている場合は、**Convert to Fixed Field**を使用してテキストメタデータから**VARCHAR**を作成します。詳細については、<a href="./full-text-search">Full Text Search</a>を参照してください。</p></td>
   </tr>
</table>

## 移行プロセス{#migration-process}

移行は、データの整合性を確保し、プロセス全体を通して可視性を提供するように設計された3段階のアプローチに従います。

![TlBawqVufhMN4BbNzdXcNQjpnVb](https://zdoc-images.s3.us-west-2.amazonaws.com/TlBawqVufhMN4BbNzdXcNQjpnVb.png)

### フェーズ1: 接続と設定{#phase-1-connect-and-configure}

1. **接続の確立**: ソースシステムにアクセスするための認証情報 (APIキー、接続文字列) を提供し、接続をテストします。

1. **ソースデータの選択**: 移行する特定のインデックス、コレクション、またはテーブルを選択します。

1. **ターゲットの設定**: 宛先としてZilliz Cloudクラスターとデータベースを選択します。

### フェーズ2: マッピングの確認{#phase-2-review-mappings}

このフェーズには、2つの主要なコンポーネントが含まれます。

#### スキーママッピング{#schema-mapping}

- **自動検出**: システムはベクトルフィールド、スカラーフィールド、およびメタデータを識別します。

- **フィールドのカスタマイズ**: 必要に応じてフィールド名とタイプを調整します。

- **タイプ変換**: ソースとターゲット間のデータ型マッピングを確認し、確定します。

- **高度なオプション**: 要件に基づいてシャード、パーティションキー、およびNULL許容フィールドを設定します。

#### シャード設定{#shard-setting}

最適なパフォーマンスを得るには、データ量に基づいてシャードを設定します。

- **小規模データセット** (1億行以下): 通常、単一シャードで十分です。

- **大規模データセット** (10億行以上): 最適なシャード設定については、[サポートにお問い合わせください](https://zilliz.com/contact-sales)。

### フェーズ3: 移行と検証{#phase-3-migrate-and-verify}

設定が完了したら、移行を実行し、進行状況を追跡します。

- **リアルタイム監視**: ジョブページを通じて移行ステータスを追跡します。

- **進行状況インジケーター**: 移行された行数、エラー数、推定完了時間を表示します。

- **エラー処理**: 問題が発生した場合は、詳細なコードログを確認します。

- **検証**: 自動行数検証により、データの完全性が保証されます。

## 制限事項{#limitations}

移行を開始する前に、サポートされているすべてのデータソースに適用されるこれらの一般的な制限事項に注意してください。

<table>
   <tr>
     <th><p>考慮事項</p></th>
     <th><p>影響</p></th>
     <th><p>解決策</p></th>
   </tr>
   <tr>
     <td><p>自動インデックス作成またはロードなし</p></td>
     <td><p>コレクションはすぐにクエリできません</p></td>
     <td><p>移行後に手動でインデックスを作成し、コレクションをロードします。詳細な手順については、<a href="./index-vector-fields">ベクトルフィールドのインデックス作成</a>と<a href="./load-release-collections">ロードとリリース</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>空のソースデータ</p></td>
     <td><p>空のインデックス/テーブルは選択できません</p></td>
     <td><p>移行する前にソースにデータが含まれていることを確認してください</p></td>
   </tr>
   <tr>
     <td><p>ベクトルフィールドの要件</p></td>
     <td><p>コレクションにはベクトルデータが含まれている必要があります</p></td>
     <td><p>移行する前にソースにベクトルフィールドがあることを確認してください</p></td>
   </tr>
   <tr>
     <td><p>サポートされていないデータ型</p></td>
     <td><p>一部の特殊なデータ型は転送されない場合があります</p></td>
     <td><p>データ型マッピングについては、プラットフォーム固有のガイドを確認してください</p></td>
   </tr>
</table>

## はじめに{#getting-started}

Zilliz Cloudにデータを移行する準備はできましたか？

### 移行ポータルへのアクセス{#access-migration-portal}

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)にログインします。

1. **Migrations**に移動し、ソースプラットフォームを選択します。

1. ガイド付きワークフローに従って移行を完了します。

</Procedures>

<Supademo id="cmb7mg34n4sqrppkp8pnm8dub" title="Zilliz Cloud - Access Migration Portal Demo" />

### テキストデータのFull Text Searchを設定する{#configure-full-text-search-for-text-data}

ソースにテキストが含まれている場合、移行中にFull Text Searchを設定してテキスト検索を改善できます。詳細については、[Full Text Search](./full-text-search)を参照してください。

<Supademo id="cmhmruu9p0cp7dqxahn1vdnbb" title="Zilliz Cloud - Configure Full Text Search" />

## プラットフォーム固有の移行ガイド{#platform-specific-migration-guides}

プラットフォーム固有の詳細な手順、前提条件、およびデータマッピング情報については、以下を参照してください。

- [PineconeからZilliz Cloudへの移行](./migrate-from-pinecone)

- [QdrantからZilliz Cloudへの移行](./migrate-from-qdrant)

- [ElasticsearchからZilliz Cloudへの移行](./migrate-from-elasticsearch)

- [PostgreSQLからZilliz Cloudへの移行](./migrate-from-pgvector)

- [Tencent CloudからZilliz Cloudへの移行](./migrate-from-tencent-cloud)

- [OpenSearchからZilliz Cloudへの移行](./migrate-from-opensearch)

