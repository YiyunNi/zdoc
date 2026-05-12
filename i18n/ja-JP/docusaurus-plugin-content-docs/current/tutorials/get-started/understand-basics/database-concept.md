---
title: "データベースの概要 | Cloud"
slug: /database-concept
sidebar_key: database-concept
sidebar_label: "データベースの概要"
beta: FALSE
notebook: FALSE
description: "データベースは、プロジェクト内のコレクションを論理的にまとめるコンテナです。"
type: origin
token: B7SFwbn76iUM06kkYzBcffE8nYf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データベース

---

import Admonition from '@theme/Admonition';


# データベースの概要

データベースは、プロジェクト内のコレクションを論理的にまとめるコンテナです。

Zilliz Cloud では、ホスティング方法とアクセス方法に応じて、2 種類のデータベースをサポートしています。

## サービングクラスター内のデータベース\{#database-in-serving-cluster}

クラスターデータベースは、特定のサービングクラスター内に作成されます。サービングクラスターが作成されると、デフォルトのクラスターデータベースが自動的に作成されます。必要に応じて、同じサービングクラスター内に追加のクラスターデータベースを作成できます。

クラスターデータベースは、サービングクラスターのエンドポイントを通じて、すべての操作 — DDL、DML（insert、upsert、delete）、および DQL（search、query）— に完全にアクセスできます。

クラスターデータベースのライフサイクルは、所属するサービングクラスターに紐づいています。

- サービングクラスターが**サスペンド**されると、そのクラスター内のすべてのクラスターデータベースとコレクションは、クラスターが再開されるまで利用できなくなります。

- サービングクラスターが**削除**されると、そのクラスター内のすべてのクラスターデータベースとコレクションも削除されます。

クラスターデータベースは、常時稼働かつ低レイテンシーのデータアクセスが必要な本番ワークロードに適しています。

次の図は、プロジェクト、サービングクラスター、データベース、およびコレクションの構成を示しています。

```plaintext
Project                                                                                                                                                                                                   
   └── Serving Cluster                       
        ├── Database (default)                                                                                                                                                                   
        │    ├── Collection_01
        │    └── Collection_02                                                                                                                                                                              
        │                                                       
        └── Database
             ├── Collection_03                                                                                                                                                                              
             └── Collection_04
```

## オンデマンドコンピュートのデータベース\{#database-in-on-demand-compute}

クラスター データベースに加えて、クラスターに紐づかないプロジェクトレベルのデータベースの別の種類があります。これはプラットフォームによって管理され、クラスターのプロビジョニングやメンテナンスを行う必要がありません。この種類のデータベース内のデータに対してクエリ検索を実行するために、オンデマンドコンピュートを指定します。

この種類のデータベースは以下の運用をサポートしています：

<table>
   <tr>
     <th><p><strong>運用</strong></p></th>
     <th><p><strong>サポート状況</strong></p></th>
   </tr>
   <tr>
     <td><p>データベースの作成/削除</p></td>
     <td><p>Yes</p></td>
   </tr>
   <tr>
     <td><p>コレクションの作成/削除</p></td>
     <td><p>Yes</p></td>
   </tr>
   <tr>
     <td><p>コレクションのロード/リリース</p></td>
     <td><p>不要</p></td>
   </tr>
   <tr>
     <td><p>検索、クエリ</p></td>
     <td><p>Yes</p></td>
   </tr>
   <tr>
     <td><p>インポート</p></td>
     <td><p>Yes</p><p>（インポートは、オンデマンドコンピュート データベース内のマネージドコレクションでのみサポートされています。詳細については、<a href="./external-collection-limits">External Collection 制限s</a> を参照してください。）</p></td>
   </tr>
   <tr>
     <td><p>挿入、アップサート、削除</p></td>
     <td><p>No</p></td>
   </tr>
</table>

この種類のデータベースは、クエリ頻度が低い大規模データセットに適しています。 

```plaintext
Project
 ├── Serving Cluster 
 │    └── Database (default)
 │         ├── Collection_01 
 │         └── Collection_02                                                                                                                                                            
 │                                 
 └── Databases in on-demand compute
      ├── External_Collection_01     
      └── External_Collection_02
```

## 比較\{#comparison}

次の表は、2 種類のデータベースを比較しています。

<table>
   <tr>
     <th></th>
     <th><p><strong>Serving Cluster 内のデータベース</strong></p></th>
     <th><p><strong>On-Demand Compute 内のデータベース</strong></p></th>
   </tr>
   <tr>
     <td><p>最適な用途</p></td>
     <td><p>常時稼働かつ低レイテンシーのデータアクセスが必要な本番ワークロード。</p></td>
     <td><p>バースト的な検索やクエリを行う大規模データセット。</p></td>
   </tr>
   <tr>
     <td><p>ホスト先</p></td>
     <td><p>ユーザーが作成した serving cluster</p></td>
     <td><p>プラットフォームが管理</p></td>
   </tr>
   <tr>
     <td><p>コンピュートリソース</p></td>
     <td><p>ホストとなる serving cluster が提供</p></td>
     <td><p>指定された on-demand cluster が提供</p></td>
   </tr>
   <tr>
     <td><p>Insert/upsert/delete</p></td>
     <td><p>Yes</p></td>
     <td><p>No</p></td>
   </tr>
   <tr>
     <td><p>Import/Truncate</p></td>
     <td><p>Yes</p></td>
     <td><p>Yes</p></td>
   </tr>
   <tr>
     <td><p>Search and query</p></td>
     <td><p>Yes</p></td>
     <td><p>Yes</p></td>
   </tr>
   <tr>
     <td><p>ライフサイクル</p></td>
     <td><p>serving cluster に紐付く</p></td>
     <td><p>いずれの cluster からも独立</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Note">

2 種類のデータベースには異なる接続エンドポイントを使用します。詳細については、[接続エンドポイント](./access-connection-endpoints) を参照してください。

</Admonition>

## 次のステップ\{#next-steps}

- [外部コレクションの作成](./create-external-collection)

- [コレクションの作成](./manage-collections-sdks)

