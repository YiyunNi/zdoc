---
title: "ゼロダウンタイム移行 | Cloud"
slug: /zero-downtime-migration
sidebar_label: "ゼロダウンタイム移行"
beta: PRIVATE
notebook: FALSE
description: "ゼロダウンタイム移行により、データベースサービスは移行中も稼働し続け、データベースへのアクセスが中断されることはありません。この移行は以下の段階で構成されます | Cloud"
type: origin
token: XDoSwZodyigAEVkjkWfc9nsfnCg
sidebar_position: 2
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - 移行
  - クラスター
  - ゼロダウンタイム
  - Milvus ベクトルデータベース
  - Milvus DB
  - Milvus ベクトル DB
  - Zilliz Cloud

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# ダウンタイムゼロ移行

ダウンタイムゼロ移行により、データベースサービスは移行中も運用を継続でき、データベースへの中断のないアクセスを提供します。以下の段階で構成されます。

1. **初期化**: ソースクラスターを選択し、新しいターゲットクラスターを作成します。

1. **移行**: 既存のデータを移行し、増分データを同期します。

1. **最終処理**: ラグが10秒未満になったら同期を停止し、ターゲットクラスターに切り替えます。

![PTB0wxmm2hCBc3b2dj1cCCJgnRb](https://zdoc-images.s3.us-west-2.amazonaws.com/PTB0wxmm2hCBc3b2dj1cCCJgnRb.png)

<Admonition type="info" icon="📘" title="Notes">

<p>ダウンタイムゼロ移行は、Milvus 2.5.xで実行されているZilliz Cloudクラスターでのみ利用可能です。この機能を有効にするか、価格について話し合うには、<a href="https://support.zilliz.com/hc/en-us/requests/new">Zilliz Cloudサポート</a>にお問い合わせください。</p>

</Admonition>

## 移行機能{#migration-capabilities}

### クラスターの互換性{#cluster-compatibility}

次の表は、クラスター間の移行機能と制約を示しています。

<table>
   <tr>
     <th><p>ソースクラスター</p></th>
     <th><p>ターゲットクラスター</p></th>
     <th><p>移行範囲</p></th>
   </tr>
   <tr>
     <td><p>Dedicated</p></td>
     <td><p>新しいDedicatedクラスター</p></td>
     <td><p>ソースクラスターからすべてのデータベースを移行します。特定のデータベースの部分的な移行はサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p>Serverless / Free</p></td>
     <td><p>新しいDedicatedクラスター</p></td>
     <td><p>Serverless/Freeクラスターには最大1つのデータベースが含まれるため、ソースクラスターから単一のデータベースを移行します。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>下位層のクラスタープランに移行することはできません。つまり、ターゲットクラスターのプランは、ソースクラスターのプランと同じかそれ以上である必要があります。</p>

</Admonition>

### 移行範囲オプション{#migration-scope-options}

<table>
   <tr>
     <th><p>移行タイプ</p></th>
     <th><p>説明</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p>同じプロジェクト内</p></td>
     <td><p>同じZilliz Cloudプロジェクト内の既存のクラスター間で移行</p></td>
     <td><p>クラスターのアップグレード、パフォーマンスの最適化、データの統合</p></td>
   </tr>
   <tr>
     <td><p>プロジェクト間または組織間</p></td>
     <td><p>異なるZilliz Cloudプロジェクトまたは組織内の既存のクラスター間で移行</p></td>
     <td><p>企業の合併、部門間の異動、マルチテナントシナリオ</p></td>
   </tr>
</table>

### 直接データ転送{#direct-data-transfer}

ダウンタイムゼロ移行は、Zilliz Cloudクラスター間で直接データレプリケーションを実行し、以下の特徴があります。

- **スキーマの保持**: ソーススキーマは変更されずにターゲットクラスターに転送されます。

- **フィールドの変更なし**: 移行中にフィールドの名前変更、データ型の変更、フィールド属性の変更はできません。

- **自動インデックス作成**: ターゲットクラスターのベクトルフィールドにはAUTOINDEXが自動的に作成されます。

### 制限事項{#limits}

- 移行中、ソースクラスターで以下の操作を実行することはできません: **AlterCollection**、**AlterCollectionField**、**CreateAlias**、**DropAlias**、**AlterAlias**、**RenameCollection**、**AlterDatabase**、**Import**。

- 進行中のダウンタイムゼロ移行ジョブのキャンセルはサポートされていません。この機能は将来のリリースで利用可能になります。

- ダウンタイムゼロ移行には、データ同期の停止とクラスターの移行が完了するまでに約10秒のダウンタイムが必要です。

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
     <td><p>組織の所有者またはプロジェクト管理者ロール</p></td>
   </tr>
   <tr>
     <td><p>ソースクラスターへのアクセス</p></td>
     <td><p>ソースクラスターはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>ターゲットクラスターの容量</p></td>
     <td><p>ソースデータを収容するのに十分なCUサイズ（<a href="https://zilliz.com/pricing#calculator">CU計算機</a>を使用）</p></td>
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
     <td><p>ソースクラスターのパブリックエンドポイント、APIキー、またはクラスターのユーザー名とパスワード</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ターゲット組織からソースクラスターに接続できること</p></td>
   </tr>
</table>

## はじめに{#getting-started}

ダウンタイムゼロ移行プロセスは、注意と行動が必要な3つの主要なフェーズで構成されています。

### フェーズ1: 初期化{#phase-1-initialize}

以下のデモは、ダウンタイムゼロ移行の設定と開始方法を示しています。

<Supademo id="cmb94ul040o06sn1ri0s8ydn5" title="Zilliz Cloud - Zero Downtime Migration Demo" />

**Migrate**をクリックすると、ソースクラスターは**Locked**状態になり、移行中は削除できません。

### フェーズ2: 監視{#phase-2-monitor}

移行を開始すると、ターゲットクラスターの詳細ページに移動し、移行の進行状況を積極的に監視する必要があります。

<Supademo id="cmba5mvlu1g20sn1rruotossj" title="Zilliz Cloud - Monitor Zero Downtime Migration Demo" />

**ステージ1: ターゲットクラスターの準備と既存データの移行**

このステージでは、既存のデータをソースクラスターからターゲットクラスターに移行します。期間は転送されるデータの量によって異なり、大規模なデータセットの場合は数時間かかる場合があります。

<Admonition type="info" icon="📘" title="Notes">

<p>プロセスに時間がかかっている場合は、このページを離れて他の作業を行っても構いません。いつでも戻って、増分データ同期の進行状況を監視し続けることができます。</p>

</Admonition>

**ステージ2: 増分データの同期**

このステージでは、システムはソースクラスターに挿入された新しいデータをターゲットクラスターに継続的に同期します。ターゲットクラスターは**Syncing**状態を表示し、外部データ書き込みを受け付けないことを示します。この段階では、以下の手順に従ってください。

1. **同期ラグの監視**

    - **Lag Behind Source**（秒単位）を追跡して、同期の進行状況を監視します。このインジケーターは、ソースクラスターとターゲットクラスターの最新データの時間差を示します。

    - **Lag Behind Source**が10秒未満になると、データ同期を停止できることを示すメール通知が届きます。

    - **重要**: 合理的な待機期間の後も同期ラグが10秒未満にならない場合は、[Zilliz Cloudサポート](https://zilliz.com/contact-sales)にお問い合わせください。

1. **データ同期の停止**

    - 続行する前に、ソースクラスターへのすべての書き込みを停止し、同期停止とクラスター切り替えのために約10秒のメンテナンス期間を計画してください。

    - **Lag Behind Source**が許容しきい値に達したら、チェックボックス**I confirm that I have stopped writes to the source cluster**を選択し、**Stop Data Sync**をクリックします。

    <Admonition type="info" icon="📘" title="Notes">

    <p>データ同期を手動で停止しない場合、Zilliz Cloudは最大7日間同期を継続します。この期間の後、システムはリソースの無駄を防ぐために同期を自動的に停止し、移行ジョブは失敗します。</p>

    </Admonition>

### フェーズ3: 切り替え{#phase-3-switch}

同期ラグが10秒未満になったというメール通知を受け取ったら、最終的な切り替えの準備が整います。クラスターへの接続方法については、[クラスターへの接続](./connect-to-cluster)を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>移行後、ソースクラスターは<strong>自動的に削除されません</strong>。手動で削除する前に、データの一貫性を確認するために一定期間保持することをお勧めします。</p></li>
<li><p>移行されたcollectionは、検索またはクエリ操作にすぐに利用できるわけではありません。検索およびクエリ機能を有効にするには、Zilliz Cloudでcollectionを手動でloadする必要があります。詳細については、<a href="./load-release-collections">Load & Release</a>を参照してください。</p></li>
</ul>

</Admonition>