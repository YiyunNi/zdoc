---
title: "オフライン移行 | BYOC"
slug: /offline-migration
sidebar_key: offline-migration
sidebar_label: "オフライン移行"
beta: FALSE
notebook: FALSE
description: "オフライン移行は、ソースの Zilliz Cloud クラスターからターゲットの Zilliz Cloud クラスターへ、既存のすべてのデータを転送します。この方法は、同じ組織内での移行と異なる組織間での移行の両方をサポートします。計画的なメンテナンスや小規模なデータベース移行など、一時的な書き込み中断が許容されるシナリオに最適です。 | BYOC"
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

オフラインマイグレーションは、ソースの Zilliz Cloud クラスタからターゲットの Zilliz Cloud クラスタへ、既存のすべてのデータを転送します。この方法は、同じ組織内でのマイグレーションと、異なる組織間でのマイグレーションの両方をサポートしています。計画的なメンテナンス時や小規模なデータベース移行など、一時的な書き込み中断が許容されるシナリオに最適です。

## マイグレーション機能\{#migration-capabilities}

### マイグレーション範囲のオプション\{#migration-scope-options}

<table>
   <tr>
     <th><p>マイグレーションタイプ</p></th>
     <th><p>説明</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p>同じプロジェクト内</p></td>
     <td><p>同じ Zilliz Cloud プロジェクト内の既存クラスタ間でのマイグレーション</p></td>
     <td><p>クラスタのアップグレード、パフォーマンス最適化、データ統合</p></td>
   </tr>
   <tr>
     <td><p>プロジェクトまたは組織をまたぐ</p></td>
     <td><p>異なる Zilliz Cloud プロジェクトまたは組織内の既存クラスタ間でのマイグレーション</p></td>
     <td><p>企業の合併、部門間の移管、マルチテナントシナリオ</p></td>
   </tr>
</table>

### 直接データ転送\{#direct-data-transfer}

オフラインマイグレーションは、Zilliz Cloud クラスタ間で直接データレプリケーションを実行し、以下の特性を持ちます：

- **スキーマの保持**: ソースのスキーマが変更されずにターゲットクラスタに転送されます

- **フィールドの変更なし**: マイグレーション中にフィールド名の変更、データ型の変更、フィールド属性の変更はできません

- **自動インデックス作成**: ベクトルフィールドに対して AUTOINDEX がターゲットクラスタに自動的に作成されます

## 前提条件\{#prerequisites}

オフラインマイグレーションを開始する前に、以下の要件を満たしていることを確認してください：

### 一般要件\{#general-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザーの権限</p></td>
     <td><p>組織オーナーまたはプロジェクト管理者のロール</p></td>
   </tr>
   <tr>
     <td><p>ソースクラスタへのアクセス</p></td>
     <td><p>ソースクラスタはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>ターゲットクラスタの容量</p></td>
     <td><p>ソースデータを収容するのに十分な CU サイズ（<a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a>を使用）</p></td>
   </tr>
</table>

### プロジェクトまたは組織をまたぐマイグレーションの要件\{#cross-project-or-organization-migration-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>接続資格情報</p></td>
     <td><p>ソースクラスタのパブリックエンドポイント、API キー、またはクラスタのユーザー名とパスワード</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ターゲット組織からソースクラスタへの接続が可能であること</p></td>
   </tr>
</table>

## はじめに\{#getting-started}

以下のデモでは、オフラインマイグレーションの完全なプロセスを順を追って説明します：

<Supademo id="cmb91ow5v0me4sn1rzlbzqi8x" title=""  />

<Admonition type="info" icon="📘" title="Notes">

マイグレーションされたコレクションは、検索やクエリ操作をすぐに利用できる状態にはなりません。Zilliz Cloud でコレクションを手動でロードし、検索およびクエリ機能を有効にする必要があります。詳細については、[ロードとリリース](./load-release-collections) を参照してください。

</Admonition>

