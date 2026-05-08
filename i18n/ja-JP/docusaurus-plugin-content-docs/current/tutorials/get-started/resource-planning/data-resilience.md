---
title: "データレジリエンス | Cloud"
slug: /data-resilience
sidebar_key: data-resilience
sidebar_label: "データレジリエンス"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、フルマネージドのベクトルデータベースサービスとして、エンタープライズグレードの高可用性（HA）とディザスタリカバリ（DR）機能を提供し、さまざまな障害シナリオにおいてミッションクリティカルなデータとサービスの継続的な可用性を確保します。"
type: origin
token: YBDGwmFYkiRmRIkKGsscRjDmnIb
sidebar_position: 7
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データレジリエンス
  - ha
  - dr
  - rto
  - rpo
  - コスト最適化

---

import Admonition from '@theme/Admonition';


# データの回復力

Zilliz Cloud は、フルマネージドのベクトルデータベースサービスとして、エンタープライズグレードの **高可用性（HA）** および **ディザスタリカバリ（DR）** 機能を提供し、さまざまな障害シナリオ下でもミッションクリティカルなデータとサービスの継続的な可用性を確保します。

### コア機能\{#core-capabilities}

- **高可用性（HA）：** 自動障害検出と高速フェイルオーバーメカニズムにより、ノード、可用性ゾーン（AZ）、またはリージョンレベルの停止中もサービス運用を中断しません。

- **ディザスタリカバリ（DR）：** 包括的なバックアップと復元戦略により、重大なインシデント後の迅速な事業回復を可能にします。

- **柔軟な回復力ティア：** Standard からエンタープライズグレードのクロスリージョン展開まで、さまざまなビジネスシナリオにわたる多様な RPO/RTO 要件に応じた柔軟な選択肢。

- **コスト最適化：** ビジネス価値とリスク許容度に基づいて、最もコスト効果の高い回復力戦略を選択できます。

## 主要な概念\{#key-concepts}

### コアメトリクス\{#core-metrics}

- **Recovery Point Objective（RPO）：** 許容可能な最大データ損失量を時間で測定します。例えば、RPO が 5 分の場合、障害発生時に最大 5 分間の最新データが失われる可能性があります。

- **Recovery Time Objective（RTO）：** 障害発生から完全なサービス復旧までの許容可能な最大時間で、障害検出、フェイルオーバー判断、および実際の復旧を含みます。

- **Service Level Agreement（Uptime SLA）：** Zilliz Cloud のサービス可用性に対するコミットメントで、通常はパーセンテージで表されます（例：99.95% の稼働率は、月あたりのダウンタイムが 21.6 分以内であることを意味します）。

### フォルトトレランスの範囲\{#fault-tolerance-scope}

- **ノードレベルのフォルトトレランス：** 単一の計算ノードまたはストレージノードの障害

- **AZ レベルのフォルトトレランス：** 完全な AZ 停止（例：データセンターの障害）

- **リージョンレベルのフォルトトレランス：** リージョン全体のサービス中断（例：自然災害）

- **クラウドプロバイダーレベルのフォルトトレランス：** 単一クラウドベンダーのリスクを軽減するマルチクラウド展開

## 回復力アーキテクチャティア\{#resilience-architecture-tiers}

### 高可用性（HA）ティア\{#high-availability-ha-tiers}

<table>
   <tr>
     <th><p>ティア</p></th>
     <th><p>説明</p></th>
     <th><p>RPO</p></th>
     <th><p>RTO</p></th>
     <th><p>書き込みレイテンシ / レプリケーション方式</p></th>
     <th><p>フォルトトレランス</p></th>
     <th><p>SLA</p></th>
     <th><p>相対コスト</p></th>
   </tr>
   <tr>
     <td><p><strong>Standard</strong></p></td>
     <td><p>シングルリージョン、シングル AZ 展開、マルチレプリカメカニズム</p></td>
     <td><p>0 秒</p></td>
     <td><p>≤1 分</p></td>
     <td><p>シングル AZ 内書き込み；WAL は Quorum 経由でレプリケート</p></td>
     <td><p>ノードレベルの障害</p><p>AZ: 1</p><p>リージョン: 1</p></td>
     <td><p>SLA 保証なし</p></td>
     <td><p>低</p></td>
   </tr>
   <tr>
     <td><p><strong>Enterprise</strong></p></td>
     <td><p>3 AZ にまたがるシングルリージョン展開、自動フェイルオーバー</p></td>
     <td><p>0 秒</p></td>
     <td><p>≤1 分</p></td>
     <td><p>クロス AZ 書き込み；WAL は Quorum 経由でレプリケート</p></td>
     <td><p>AZ レベルの障害</p><p>AZ: 3</p><p>リージョン: 1</p></td>
     <td><p>99.95%</p></td>
     <td><p>中</p></td>
   </tr>
   <tr>
     <td><p><strong>Enterprise Multi-Replica</strong></p></td>
     <td><p>リージョン内アクティブ・アクティブマルチレプリカアーキテクチャ；読み書き分離、高速フェイルオーバー</p></td>
     <td><p>0 秒</p></td>
     <td><p>≤10 秒</p></td>
     <td><p>クロス AZ 書き込み；レプリカ間同期は WAL 経由</p></td>
     <td><p>AZ レベルの障害</p><p>AZ: 3</p><p>リージョン: 1</p></td>
     <td><p>99.99%</p></td>
     <td><p>中～高</p></td>
   </tr>
   <tr>
     <td><p><strong>Cross-Region HA</strong></p></td>
     <td><p>マルチリージョン/マルチクラウド展開、グローバルロードバランシング</p></td>
     <td><p>≤10 秒</p></td>
     <td><p>手動または自動フェイルオーバー：</p><p>自動: ≤3 分</p></td>
     <td><p>AZ 間同期書き込み；他のリージョン/クラウドへの非同期レプリケーション</p></td>
     <td><p>リージョンレベルの障害</p><p>AZ: ≥3</p><p>リージョン: ≥2</p></td>
     <td><p>99.99%</p></td>
     <td><p>高</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>クロスリージョン HA は 2025 年 11 月に利用可能になります。</p>

</Admonition>

### ディザスタリカバリ（DR）ティア\{#disaster-recovery-dr-tiers}

<table>
   <tr>
     <th><p>ティア</p></th>
     <th><p>説明</p></th>
     <th><p>RPO</p></th>
     <th><p>復元速度</p></th>
     <th><p>バックアップ戦略</p></th>
     <th><p>ユースケース</p></th>
     <th><p>追加コスト</p></th>
   </tr>
   <tr>
     <td><p><strong>Local Backup</strong></p></td>
     <td><p>同一リージョンのオブジェクトストレージ；スケジュールされたフルバックアップ</p></td>
     <td><p>毎時</p></td>
     <td><p>数分～数時間</p></td>
     <td><p>フルバックアップ</p></td>
     <td><p>誤削除、論理エラーの回復</p></td>
     <td><p>低</p></td>
   </tr>
   <tr>
     <td><p><strong>Cross-Region Backup</strong></p></td>
     <td><p>バックアップデータを別リージョンに保存；リージョナルディザスタから保護</p></td>
     <td><p>毎時</p></td>
     <td><p>数分～数時間</p></td>
     <td><p>リージョン/クラウド間でレプリケートされたフルバックアップ</p></td>
     <td><p>リージョナルディザスタ、コンプライアンス要件</p></td>
     <td><p>中</p></td>
   </tr>
</table>

## クイック選択ガイド\{#quick-selection-guide}

### ビジネスティアリングと回復力の推奨\{#business-tiering-and-resilience-recommendations}

#### **ティア 1 – ミッションクリティカルワークロード**\{#tier-1-mission-critical-workloads}

- **特徴：** 24 時間 365 日運用；数分のダウンタイムでも重大な損失が発生；極めて高いビジネス価値

- **推奨：** クロスリージョン HA + Enterprise Multi-Replica + 継続的データ保護

- **目標：** RPO = 0 秒、RTO < 30 秒、クロスクラウド/リージョン DR

- **想定コスト：** 高

#### **ティア 2 – 重要なビジネスシステム**\{#tier-2-important-business-systems}

- **特徴：** 24 時間 365 日運用；高い安定性要件

- **推奨：** Enterprise Multi-Replica + クロスリージョンバックアップ

- **目標：** RPO = 0 秒、RTO < 30 秒

- **想定コスト：** 中～高

#### **ティア 3 – 一般アプリケーション**\{#tier-3-general-applications}

- **特徴：** 営業時間内運用；コスト重視；ある程度の復旧時間を許容

- **推奨：** Enterprise + Local Backup

- **目標：** RPO = 0 秒、RTO < 3 分

- **想定コスト：** 低～中

#### **ティア 4 – 非クリティカルワークロード**\{#tier-4-non-critical-workloads}

- **特徴：** 必須システムではない；コスト重視；スケジュールされたメンテナンスウィンドウを受け入れる

- **推奨：** Standard + Local Backup

- **目標：** RPO = 0 秒、RTO < 3 分

- **想定コスト：** 低～中

### コスト最適化意思決定マトリクス\{#cost-optimization-decision-matrix}

<table>
   <tr>
     <th><p>ビジネス影響</p></th>
     <th><p>データ価値</p></th>
     <th><p>コンプライアンス要件</p></th>
     <th><p>推奨ソリューション</p></th>
     <th><p>コストレベル</p></th>
   </tr>
   <tr>
     <td><p>極めて高い</p></td>
     <td><p>極めて高い</p></td>
     <td><p>厳格</p></td>
     <td><p>クロスリージョン HA + フル DR</p></td>
     <td><p>高</p></td>
   </tr>
   <tr>
     <td><p>高い</p></td>
     <td><p>高い</p></td>
     <td><p>中程度</p></td>
     <td><p>Enterprise Multi-Replica + クロスリージョンバックアップ</p></td>
     <td><p>中～高</p></td>
   </tr>
   <tr>
     <td><p>中</p></td>
     <td><p>中</p></td>
     <td><p>基本</p></td>
     <td><p>Enterprise + Local Backup</p></td>
     <td><p>中</p></td>
   </tr>
   <tr>
     <td><p>低い</p></td>
     <td><p>低い</p></td>
     <td><p>なし</p></td>
     <td><p>Standard + 基本バックアップ</p></td>
     <td><p>低</p></td>
   </tr>
</table>

## よくある質問（FAQ）\{#frequently-asked-questions-faq}

**Q1: Standard および Enterprise プランはどのように高可用性を実現していますか？**

**アーキテクチャ設計**  

Zilliz Cloud は、計算とストレージを分離したアーキテクチャを採用し、3 種類のデータタイプを使用します：  

- **メタデータ：** etcd に保存（3 レプリカ、RAFT プロトコル）

- **ログデータ：** 独自の Woodpecker に保存（Quorum プロトコル）

- **生データおよびインデックスデータ：** オブジェクトストレージに保存し、クラウドストレージのネイティブ HA を継承

**計算ノードの HA**  

- Kubernetes による自動スケジューリングで管理

- 単一ノードまたは単一 AZ の障害時に Pod が自動的に再生成される

- コーディネーターがセグメントを他の QueryNode に再割り当て

- インデックスとデータはストレージから再読み込み；復旧時間 < 1 分

**コスト最適化**  

- **複数の永続レプリカ** + **動的なインメモリ読み込み** を使用  

    - 複数のインメモリレプリカの維持によるコスト爆発を回避

    - DR アーキテクチャを簡素化

    - ログおよびオブジェクトストレージの帯域を活用してより高速な復旧を実現

**Q2: マルチレプリカメカニズムはどのように動作しますか？**

**コアメカニズム**  

- **シャードレベル：** 複数の StreamNode が同じシャードをプライマリ/スタンバイの役割で読み込む

- **セグメントレベル：** 複数の QueryNode が同じセグメントを読み込む；データは単一コピーとして永続化

**読み書き分離**  

- **書き込み：** プライマリ StreamNode が処理

- **読み込み：** 任意のスタンバイ StreamNode または QueryNode が提供

**主な利点**  

- **高速フェイルオーバー：** プロキシが自動的にトラフィックをスタンバイノードにリダイレクト

- **より高い QPS：** 複数のインメモリレプリカが読み取りスループットを向上

- **スムーズなアップグレード：** ローリングアップデートによりサービスのジッターを低減し、安定性を向上

**Q3: Global データベース はどのようにクロスリージョン高可用性を実現しますか？**

**CDC 同期**  

- Change データ Capture（CDC）が DDL、DML、および一括インポート操作を同期

- 典型的な同期レイテンシ < 10 秒

- 非常に低い RPO でクロスリージョン/クロスクラウド DR を実現

**データ書き込み戦略**  

- 同一リージョン内の複数 AZ にわたる同期書き込み

- 書き込みレイテンシは AZ 間レベル

- 極端なフェイルオーバーシナリオでも、データ損失 < 10 秒

<Admonition type="info" icon="📘" title="Notes">

<p><strong>2026 年のロードマップ：</strong> クロスリージョン Woodpecker で <strong>RPO = 0</strong> を達成</p>

</Admonition>

**フェイルオーバーモード**  

- **手動：** OpenAPI または Web Console 経由

- **自動：** Zilliz のヘルスチェックサービスが障害を検出し、1～3 分でフェイルオーバーを完了

**アクセスパターン**

<table>
   <tr>
     <th><p>モード</p></th>
     <th><p>特徴</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p><strong>Active-Standby DR</strong></p></td>
     <td><p>プライマリが読み書きを処理；スタンバイはフェイルオーバー時のみ有効化</p></td>
     <td><p>標準的なディザスタリカバリ</p></td>
   </tr>
   <tr>
     <td><p><strong>Active-Active（マルチリード）</strong></p></td>
     <td><p>プライマリが書き込み；複数リージョンが読み込みを提供（最寄りリージョン読み取り）</p></td>
     <td><p>グローバルな読み取り重視、低書き込みワークロード</p></td>
   </tr>
   <tr>
     <td><p><strong>Multi-Primary</strong> <em>（2026 年に登場予定）</em></p></td>
     <td><p>両方のリージョンが書き込みを受け付ける；ユーザーはデータ競合を回避する必要がある</p></td>
     <td><p>セルベースまたはシャード展開</p></td>
   </tr>
</table>

最新の機能アップデートまたは技術サポートについては、[Zilliz Cloud サポート](https://support.zilliz.com/hc/en-us) までお問い合わせください。

