---
title: "オフライン移行 | Cloud"
slug: /offline-migration
sidebar_label: "オフライン移行"
beta: FALSE
notebook: FALSE
description: "オフライン移行は、ソースのZilliz CloudクラスターからターゲットのZilliz Cloudクラスターへ、既存のすべてのデータを転送します。この方法は、同じ組織内および異なる組織間での移行をサポートします。計画的なメンテナンスや小規模なデータベース移行など、一時的な書き込み中断が許容されるシナリオに最適です。 | Cloud"
type: origin
token: MTqjwwUKhiyns4kGV7Lc7PRlnwb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - クラスター
  - オフライン
  - 非構造化データとは
  - ベクトル埋め込み
  - ベクトルストア
  - オープンソースベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# オフライン移行

オフライン移行は、既存のすべてのデータをソース Zilliz Cloud クラスターからターゲット Zilliz Cloud クラスターに転送します。この方法は、同じ組織内および異なる組織間の両方の移行をサポートします。計画的なメンテナンスや小規模なデータベース移行など、一時的な書き込み中断が許容されるシナリオに最適です。

中断のない書き込み操作が必要な移行については、[ゼロダウンタイム移行](./zero-downtime-migration)を参照してください。

## 移行機能{#migration-capabilities}

### クラスターの互換性{#cluster-compatibility}

次の表は、異なるデプロイメントオプションのクラスター間の移行機能と制約を示しています。

<table>
   <tr>
     <th rowspan="2"><p><strong>ソース</strong></p></th>
     <th colspan="3"><p><strong>ターゲット</strong></p></th>
   </tr>
   <tr>
     <td><p>Free クラスター</p></td>
     <td><p>Serverless クラスター</p></td>
     <td><p>Dedicated クラスター</p></td>
   </tr>
   <tr>
     <td><p>Free クラスター</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされていません</p><p>(Free クラスターは Serverless クラスターにのみアップグレードできます。<a href="./manage-cluster#upgrade-deployment-option">クラスターの管理</a>を参照してください。)</p></td>
     <td><p>サポートされています</p><p>(Free クラスターは Dedicated クラスターにもアップグレードできます。<a href="./manage-cluster#upgrade-deployment-option">クラスターの管理</a>を参照してください。)</p></td>
   </tr>
   <tr>
     <td><p>Serverless クラスター</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされています</p></td>
     <td><p>サポートされています</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>サポートされています</p></td>
   </tr>
</table>

### 移行範囲オプション{#migration-scope-options}

<table>
   <tr>
     <th><p>移行タイプ</p></th>
     <th><p>説明</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p>同じプロジェクト内</p></td>
     <td><p>同じ Zilliz Cloud プロジェクト内の既存のクラスター間で移行します</p></td>
     <td><p>クラスターのアップグレード、パフォーマンスの最適化、データの統合</p></td>
   </tr>
   <tr>
     <td><p>プロジェクト間または組織間</p></td>
     <td><p>異なる Zilliz Cloud プロジェクトまたは組織内の既存のクラスター間で移行します</p></td>
     <td><p>企業の合併、部門間の異動、マルチテナントシナリオ</p></td>
   </tr>
</table>

### 直接データ転送{#direct-data-transfer}

オフライン移行は、Zilliz Cloud クラスター間で直接データレプリケーションを実行し、以下の特性を持ちます。

- **スキーマの保持**: ソーススキーマは変更されずにターゲットクラスターに転送されます。

- **フィールドの変更なし**: 移行中にフィールド名の変更、データ型の変更、フィールド属性の変更はできません。

- **自動インデックス作成**: ターゲットクラスターのベクトルフィールドにはAUTOINDEXが自動的に作成されます。

## 前提条件{#prerequisites}

オフライン移行を開始する前に、以下の要件を満たしていることを確認してください。

### 一般的な要件{#general-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザー権限</p></td>
     <td><p>Organization Owner または Project Admin ロール</p></td>
   </tr>
   <tr>
     <td><p>ソースクラスターへのアクセス</p></td>
     <td><p>ソースクラスターはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>ターゲットクラスターの容量</p></td>
     <td><p>ソースデータを収容するのに十分な CU サイズ (<a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a>を使用)</p></td>
   </tr>
</table>

### プロジェクト間または組織間の移行要件{#cross-project-or-organization-migration-requirements}

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

## はじめに{#getting-started}

以下のデモでは、オフライン移行の全プロセスを説明します。

<Supademo id="cmb91ow5v0me4sn1rzlbzqi8x" title="Zilliz Cloud - Offline Migration Demo" />

<Admonition type="info" icon="📘" title="Notes">

<p>移行されたコレクションは、検索またはクエリ操作にすぐに利用できるわけではありません。検索およびクエリ機能を有効にするには、Zilliz Cloud でコレクションを手動でロードする必要があります。詳細については、<a href="./load-release-collections">ロードとリリース</a>を参照してください。</p>

</Admonition>

