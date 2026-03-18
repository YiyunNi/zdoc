---
title: "ゼロダウンタイム移行 | Cloud"
slug: /zero-downtime-migration
sidebar_label: "ゼロダウンタイム移行"
beta: PRIVATE
notebook: FALSE
description: "ゼロダウンタイム移行により、データベースサービスは移行中も稼働し続け、データベースへの途切れないアクセスを提供します。これは以下の段階で構成されます | Cloud"
type: origin
token: XDoSwZodyigAEVkjkWfc9nsfnCg
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - migrations
  - clusters
  - zero downtime

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# ゼロダウンタイム移行

ゼロダウンタイム移行により、移行中もデータベースサービスが稼働し続け、データベースへの途切れないアクセスを提供します。このプロセスは以下のステージで構成されます。

1. **初期化**: ソースクラスターを選択し、新しいターゲットクラスターを作成します。

1. **移行**: 既存データの移行と増分データの同期を行います。

1. **最終処理**: 遅延が 10 秒未満になった時点で同期を停止し、ターゲットクラスターへ切り替えます。

![PTB0wxmm2hCBc3b2dj1cCCJgnRb](https://zdoc-images.s3.us-west-2.amazonaws.com/PTB0wxmm2hCBc3b2dj1cCCJgnRb.png)

<Admonition type="info" icon="📘" title="Notes">

<p>ゼロダウンタイム移行は、Milvus 2.5.x で実行されている Zilliz Cloud クラスターでのみ利用可能です。この機能の有効化や価格については、<a href="https://support.zilliz.com/hc/en-us/requests/new">Zilliz Cloud サポート</a>にお問い合わせください。</p>

</Admonition>

## 移行機能\{#migration-capabilities}

### クラスターの互換性\{#cluster-compatibility}

以下の表は、クラスター間の移行機能と制約を示しています。

<table>
   <tr>
     <th><p>ソースクラスター</p></th>
     <th><p>ターゲットクラスター</p></th>
     <th><p>移行範囲</p></th>
   </tr>
   <tr>
     <td><p>Dedicated</p></td>
     <td><p>新しい Dedicated クラスター</p></td>
     <td><p>ソースクラスターからすべてのデータベースを移行します。特定のデータベースの部分的な移行はサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p>Serverless / Free</p></td>
     <td><p>新しい Dedicated クラスター</p></td>
     <td><p>ソースクラスターから単一のデータベースを移行します。Serverless/Free クラスターには最大で 1 つのデータベースしか含まれていないためです。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>下位ティアのクラスタープランへ移行することはできません。つまり、ターゲットクラスターのプランは、ソースクラスターのプランと同じか、それより上位である必要があります。</p>

</Admonition>

### 移行範囲のオプション\{#migration-scope-options}

<table>
   <tr>
     <th><p>移行タイプ</p></th>
     <th><p>説明</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p>同一プロジェクト内</p></td>
     <td><p>同一の Zilliz Cloud プロジェクト内の既存クラスター間で移行します</p></td>
     <td><p>クラスターのアップグレード、パフォーマンス最適化、データの統合</p></td>
   </tr>
   <tr>
     <td><p>プロジェクト間または組織間</p></td>
     <td><p>異なる Zilliz Cloud プロジェクトまたは組織にまたがる既存クラスター間で移行します</p></td>
     <td><p>企業の合併、部門の移管、マルチテナントシナリオ</p></td>
   </tr>
</table>

### 直接データ転送\{#direct-data-transfer}

ゼロダウンタイム移行は、Zilliz Cloud クラスター間で直接データレプリケーションを実行し、以下の特徴を持ちます。

- **スキーマの保持**: ソースのスキーマが変更されずにターゲットクラスターへ転送されます

- **フィールドの変更なし**: 移行中にフィールドの名前変更、データ型の変更、またはフィールド属性の変更は行えません

- **自動インデックス作成**: AUTOINDEX がターゲットクラスターのベクトルフィールドに対して自動的に作成されます

### 制限\{#limits}

- 移行中は、ソースクラスターに対して以下の操作は一切実行できません：**AlterCollection**、**AlterCollectionField**、**Createエイリアス**、**Dropエイリアス**、**Alterエイリアス**、**RenameCollection**、**Alterデータベース**、**Import**。

- 進行中のゼロダウンタイム移行ジョブをキャンセルすることはサポートされていません。この機能は今後のリリースで提供される予定です。

- ゼロダウンタイム移行では、データ同期の停止とクラスターの切り替えを完了させるために、約 10 秒のダウンタイムが必要です。

## 前提条件\{#prerequisites}

オフライン移行を開始する前に、以下の要件を満たしていることを確認してください。

### 一般要件\{#general-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザー権限</p></td>
     <td><p>組織オーナーまたはプロジェクト管理者のロール</p></td>
   </tr>
   <tr>
     <td><p>ソースクラスターへのアクセス</p></td>
     <td><p>ソースクラスターはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>ターゲットクラスターの容量</p></td>
     <td><p>ソースデータを格納するのに十分な CU サイズ（<a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a>を使用）</p></td>
   </tr>
</table>

### プロジェクト間または組織間の移行要件\{#cross-project-or-organization-migration-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>接続認証情報</p></td>
     <td><p>ソースクラスターのパブリックエンドポイント、API キー、またはクラスターのユーザー名とパスワード</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ターゲット組織からソースクラスターに接続できること</p></td>
   </tr>
</table>

## 始め方\{#getting-started}

ゼロダウンタイム移行プロセスは、注意とアクションが必要な 3 つの主要フェーズで構成されます。

### フェーズ 1: 初期化\{#phase-1-initialize}

以下のデモでは、ゼロダウンタイム移行を設定して開始する方法を示しています。

<Supademo id="cmb94ul040o06sn1ri0s8ydn5" title="Zilliz Cloud - Zero Downtime Migration Demo" />

**移行**をクリックすると、ソースクラスターは**ロック済み**状態になり、移行中は削除できなくなります。

### フェーズ 2: モニタリング\{#phase-2-monitor}

移行を開始すると、ターゲットクラスターの詳細ページに移動し、移行の進捗状況を積極的に監視する必要があります。

<Supademo id="cmba5mvlu1g20sn1rruotossj" title="Zilliz Cloud - Monitor Zero Downtime Migration Demo" />

**ステージ 1: ターゲットクラスターの準備と既存データの移行**

このステージでは、ソースクラスターからターゲットクラスターへ既存データを移行します。所要時間は転送されるデータ量に依存し、大規模なデータセットの場合、数時間かかることがあります。

<Admonition type="info" icon="📘" title="Notes">

<p>処理に時間がかかる場合は、このページを離れて他の作業を行っても構いません。いつでも戻って、増分データの同期進捗状況の監視を再開できます。</p>

</Admonition>

**ステージ 2: 増分データの同期**

このステージでは、システムはソースクラスターに挿入された新しいデータをターゲットクラスターへ継続的に同期します。ターゲットクラスターには**同期中**状態が表示され、外部からのデータ書き込みを受け付けないことを示します。このステージでは、以下の手順に従ってください。

1. **同期遅延の監視**

    - 同期の進捗状況を監視するために、**ソースからの遅延**（秒単位）を追跡します。この指標は、ソースクラスターとターゲットクラスター内の最新データ間の時間差を示します。

    - **ソースからの遅延**が 10 秒未満になると、データ同期を停止して次に進めることを示すメール通知が届きます。

    - **重要**: 合理的な待機期間を経ても同期遅延が 10 秒未満にならない場合は、[Zilliz Cloud サポート](https://zilliz.com/contact-sales)にお問い合わせください。

1. **データ同期の停止**

    - 続行する前に、ソースクラスターへのすべての書き込みを停止し、同期の停止とクラスターの切り替えのために約 10 秒のメンテナンスウィンドウを計画してください。

    - **ソースからの遅延**が許容可能な閾値に達したら、チェックボックス「**ソースクラスターへの書き込みを停止したことを確認します**」を選択し、**データ同期を停止**をクリックします。

    <Admonition type="info" icon="📘" title="Notes">

    <p>手動でデータ同期を停止しない場合、Zilliz Cloud は最大 7 日間同期を続けます。この期間を過ぎると、システムはリソースの浪費を防ぐために自動的に同期を停止し、移行ジョブは失敗します。</p>

    </Admonition>

### フェーズ 3: 切り替え\{#phase-3-switch}

同期遅延が 10 秒未満になったことを示すメール通知を受け取ったら、最終的な切り替えの準備が整います。クラスターへの接続方法については、[クラスターへの接続](./connect-to-cluster) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>移行後、ソースクラスターは<strong>自動的に削除されません</strong>。手動で削除する前にデータの一貫性を検証するため、一定期間保持することを推奨します。</p></li>
<li><p>移行されたコレクションは、検索またはクエリ操作のために即座に利用可能になるわけではありません。検索およびクエリ機能を有効にするには、Zilliz Cloud でコレクションを手動でロードする必要があります。詳細については、<a href="./load-release-collections">ロード＆リリース</a>を参照してください。</p></li>
</ul>

</Admonition>