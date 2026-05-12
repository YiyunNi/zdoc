---
title: "オフライン移行 | Cloud"
slug: /offline-migration
sidebar_key: offline-migration
sidebar_label: "オフライン移行"
beta: FALSE
notebook: FALSE
description: "オフライン移行は、ソースの Zilliz Cloud クラスターからターゲットの Zilliz Cloud クラスターへ、既存のすべてのデータを転送します。この方法は、同じ組織内および異なる組織間の両方の移行をサポートします。計画的なメンテナンスや小規模なデータベース移行など、一時的な書き込み中断が許容されるシナリオに最適です。"
type: origin
token: MTqjwwUKhiyns4kGV7Lc7PRlnwb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - クラスター
  - offline

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# オフラインマイグレーション

オフラインマイグレーションは、ソースの Zilliz Cloud クラスターからターゲットの Zilliz Cloud クラスターに既存のすべてのデータを転送します。この方法は、同じ組織内でのマイグレーションと異なる組織間でのマイグレーションの両方をサポートします。計画的なメンテナンス時や小規模なデータベース移行など、一時的な書き込み中断が許容されるシナリオに最適です。

## マイグレーション機能\{#migration-capabilities}

### クラスター互換性\{#cluster-compatibility}

次の表は、異なるデプロイメントオプションのクラスター間のマイグレーション機能と制約を示しています。

<table>
   <tr>
     <th rowspan="2"><p><strong>ソース</strong></p></th>
     <th colspan="3"><p><strong>ターゲット</strong></p></th>
   </tr>
   <tr>
     <td><p>Free cluster</p></td>
     <td><p>Serverless cluster</p></td>
     <td><p>専用クラスター</p></td>
   </tr>
   <tr>
     <td><p>Free cluster</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされていません</p><p>（Free cluster は Serverless cluster にのみアップグレードできます。詳細については、<a href="./manage-cluster#upgrade-deployment-option">クラスターの管理</a>を参照してください。）</p></td>
     <td><p>サポートされています</p><p>（Free cluster を 専用クラスター にアップグレードすることもできます。詳細については、<a href="./manage-cluster#upgrade-deployment-option">クラスターの管理</a>を参照してください。）</p></td>
   </tr>
   <tr>
     <td><p>Serverless cluster</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされています</p></td>
     <td><p>サポートされています</p></td>
   </tr>
   <tr>
     <td><p>専用クラスター</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされています</p></td>
   </tr>
</table>

### マイグレーション範囲のオプション\{#migration-scope-options}

<table>
   <tr>
     <th><p>マイグレーションタイプ</p></th>
     <th><p>説明</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p>同一プロジェクト内</p></td>
     <td><p>同じ Zilliz Cloud プロジェクト内の既存クラスター間でのマイグレーション</p></td>
     <td><p>クラスターのアップグレード、パフォーマンス最適化、データ統合</p></td>
   </tr>
   <tr>
     <td><p>プロジェクトまたは組織をまたがる</p></td>
     <td><p>異なる Zilliz Cloud プロジェクトまたは組織内の既存クラスター間でのマイグレーション</p></td>
     <td><p>企業の合併、部門間の移管、マルチテナントシナリオ</p></td>
   </tr>
</table>

### 直接データ転送\{#direct-data-transfer}

オフラインマイグレーションは、Zilliz Cloud クラスター間で直接データレプリケーションを実行し、以下の特性を持ちます。

- **スキーマの保持**: ソースのスキーマが変更されずにターゲットクラスターに転送されます

- **フィールドの変更なし**: マイグレーション中にフィールドの名前変更、データ型の変更、フィールド属性の変更はできません

- **自動インデックス作成**: ターゲットクラスターのベクトルフィールドに対して AUTOINDEX が自動的に作成されます

## 前提条件\{#prerequisites}

オフラインマイグレーションを開始する前に、以下の要件を満たしていることを確認してください。

### 一般 requirements\{#general-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザーの権限</p></td>
     <td><p>組織オーナー または プロジェクト管理者 ロール</p></td>
   </tr>
   <tr>
     <td><p>ソースクラスターへのアクセス</p></td>
     <td><p>ソースクラスターはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>ターゲットクラスターの容量</p></td>
     <td><p>ソースデータを収容するのに十分な CU サイズ（<a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a>を使用してください）</p></td>
   </tr>
</table>

### プロジェクトまたは組織をまたがるマイグレーションの要件\{#cross-project-or-organization-migration-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>接続資格情報</p></td>
     <td><p>ソースクラスターのパブリックエンドポイント、API キー、またはクラスターのユーザー名とパスワード</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ターゲット組織からソースクラスターに接続できること</p></td>
   </tr>
</table>

## はじめに\{#getting-started}

次のデモでは、オフラインマイグレーションの完全なプロセスを説明します。

<Supademo id="cmb91ow5v0me4sn1rzlbzqi8x" title=""  />

<Admonition type="info" icon="📘" title="Notes">

マイグレーションされたコレクションは、すぐに検索やクエリ操作に使用できません。Zilliz Cloud でコレクションを手動でロードして、検索およびクエリ機能を有効にする必要があります。詳細については、[ロードとリリース](./load-release-collections) を参照してください。

</Admonition>

