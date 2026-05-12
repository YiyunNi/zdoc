---
title: "コスト最適化 | Cloud"
slug: /cost-optimization
sidebar_key: cost-optimization
sidebar_label: "コスト最適化"
beta: FALSE
notebook: FALSE
description: "データのスケールとクエリ量の増加に伴い、コスト管理が重要になります。本ガイドでは、Zilliz Cloud のコスト最適化戦略を、デプロイメントの選択、インデックスのチューニング、弾力的なスケーリング、割引、請求分析の5つの観点から体系的に解説します。"
type: origin
token: MYHwwhKtri4MMJku6BbcMjF4n1d
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - milvus
  - コスト最適化

---

import Admonition from '@theme/Admonition';


# コスト最適化

データのスケールとクエリ量が増加するにつれ、コスト管理が重要になります。本ガイドでは、Zilliz Cloud のコスト最適化戦略を、デプロイメント選択、インデックスチューニング、弾力スケーリング、割引、請求分析の5つの観点から体系的に解説します。

## 請求内容を理解する\{#understand-your-bill}

最適化を行う前に、コストの発生元を特定してください。Zilliz Cloud の料金は5つの構成要素からなります：

<table>
    <tr>
        <th><p>項目</p></th>
        <th><p>説明</p></th>
        <th><p>最適化可能？</p></th>
    </tr>
    <tr>
        <td><p><a href="https://zilliverse.feishu.cn/wiki/J2prwh2KLis9oqkqNIAcU1d6nsd">コンピュート（CU）</a></p></td>
        <td><p>Dedicated クラスターの Compute Unit による時間課金。</p></td>
        <td><p>選択 + スケーリング</p></td>
    </tr>
    <tr>
        <td><p><a href="https://zilliverse.feishu.cn/wiki/Uk0Nw1ZdbiOEBtkAOKacLTf8nGe">読み取り/書き込み操作</a></p></td>
        <td><p>Serverless クラスターの従量課金。</p></td>
        <td><p>クエリ最適化</p></td>
    </tr>
    <tr>
        <td><p><a href="https://zilliverse.feishu.cn/wiki/PNj2w5fY9ifr82kbX8ucKgXAn0r">ストレージ</a></p></td>
        <td><p>データおよびバックアップストレージ（クラスター状態に関わらず）。</p></td>
        <td><p>ビルドレベル + データクリーンアップ</p></td>
    </tr>
    <tr>
        <td><p><a href="https://zilliverse.feishu.cn/wiki/BClgwKlHaiushBkPPssclTkYnef">データ転送</a></p></td>
        <td><p>イングレス、エグレス、およびリージョン間転送。</p></td>
        <td><p>アーキテクチャ計画</p></td>
    </tr>
    <tr>
        <td><p><a href="https://zilliverse.feishu.cn/wiki/GBfswoqhviHfTVk2qhHc4eGXnfh">監査ログ</a></p></td>
        <td><p>監査ログのリソース消費。</p></td>
        <td><p>必要に応じて有効化</p></td>
    </tr>
</table>

ほとんどのユーザーにとって、コストの70%以上が**コンピュート**に由来し、これは最も最適化の余地がある部分でもあります。

[料金計算ツール](https://zilliz.com/pricing#calculator)を使用して、ベクトル次元、データ量、QPS要件に基づく月額見積もりを取得してください。実際のコストは見積もりより低くなることが多く、業務負荷がピーク容量を無期限に維持することはほとんどありません。

## 適切なデプロイメント方式を選択する\{#choose-the-right-deployment-method}

適切なデプロイメント方式の選択は、最も影響力のある決定です。誤った方式を選択すると、細かな最適化では埋められないコストが発生します。

### デプロイメント方式の概要\{#deployment-methods-at-a-glance}

<table>
    <tr>
        <th><p>タイプ</p></th>
        <th><p>価格目安（768次元）</p></th>
        <th><p>容量/CU</p></th>
        <th><p>検索 QPS</p></th>
        <th><p>レイテンシ</p></th>
        <th><p>ユースケース</p></th>
    </tr>
    <tr>
        <td><p>Free</p></td>
        <td><p>0</p></td>
        <td><p>5 GB、最大5コレクション</p></td>
        <td><p>—</p></td>
        <td><p>—</p></td>
        <td><p>学習、プロトタイピング</p></td>
    </tr>
    <tr>
        <td><p>Serverless</p></td>
        <td><p>RU 従量課金</p></td>
        <td><p>オートスケーリング</p></td>
        <td><p>自動</p></td>
        <td><p>中</p></td>
        <td><p>不安定なトラフィック、開発/テスト</p></td>
    </tr>
    <tr>
        <td><p>Dedicated（パフォーマンス最適化済み）</p></td>
        <td><p>~&#36;65/百万ベクトル/月</p></td>
        <td><p>150万/CU</p></td>
        <td><p>500–1,500</p></td>
        <td><p>低（&lt;10ms p99）</p></td>
        <td><p>レイテンシ重視の本番環境</p></td>
    </tr>
    <tr>
        <td><p>Dedicated（容量最適化済み）</p></td>
        <td><p>~&#36;20/百万ベクトル/月</p></td>
        <td><p>500万/CU</p></td>
        <td><p>100–300</p></td>
        <td><p>中</p></td>
        <td><p>大規模、コスト重視</p></td>
    </tr>
    <tr>
        <td><p>Dedicated（階層ストレージ）</p></td>
        <td><p>~&#36;7/百万ベクトル/月</p></td>
        <td><p>2,000万/CU（8 CU以上）</p></td>
        <td><p>100–150（ホット）</p></td>
        <td><p>高</p></td>
        <td><p>大量データ、コールド/ホット分離</p></td>
    </tr>
    <tr>
        <td><p>BYOC</p></td>
        <td><p>カスタム</p></td>
        <td><p>カスタム</p></td>
        <td><p>カスタム</p></td>
        <td><p>カスタム</p></td>
        <td><p>コンプライアンス、Cloud 割引</p></td>
    </tr>
</table>

### 選択のための意思決定ツリー\{#selection-decision-tree}

- **データ < 100万ベクトル、QPS < 50？**
→ **Serverless** を使用。操作分のみ課金され、アイドルコストはゼロ。「潜在的な」トラフィックのために Dedicated リソースをプロビジョニングしないでください。

- **データ 100万–5,000万ベクトル、安定した低レイテンシが必要？**
→ **容量最適化済み** クラスターが最もコスト効率の高いソリューションです。パフォーマンス最適化済みオプションの3分の1のコストで、ほとんどの RAG およびレコメンデーションシナリオに十分な数百ミリ秒未満のレイテンシを提供します。**パフォーマンス最適化済み** クラスターは、極端な要件（例：&lt;10 ms p99 リアルタイム検索）にのみ使用してください。

- **データ > 5,000万ベクトル、アクセス頻度が低い？**
→ **階層ストレージ** クラスターを使用。容量最適化済みオプションの3分の1のコストで、大量データのうち頻繁にクエリされるのが一部のみのシナリオ（例：履歴ログ分析）に最適です。

- **コンプライアンスまたは既存の Cloud 割引（RI/SP）？**
→ **BYOC（Bring Your Own Cloud）**。クラスターはお客様の VPC で実行され、エンタープライズレベルのクラウド割引を活用し、データ主権の要件を満たすことができます。

### 推奨：容量最適化済み—ほとんどのシナリオに最適\{#recommendation-capacity-optimizedthe-best-fit-for-most-scenarios}

容量最適化済みクラスターは、単なる「遅い」バージョンと誤解されることがよくあります。実際には、これは Zilliz Cloud で最もアーキテクチャ的に洗練された製品です。

従来のベクトルデータベースは、すべてのインデックスと生データをメモリに保持し、コストと引き換えに速度を追求しますが、容量最適化済みクラスターは**階層ストレージアーキテクチャ**を使用します：

- **階層ストレージ：** ベクトルインデックスは速度のためにメモリに残り、スカラーデータと生ベクトルは mmap によりディスクにマッピングされ、インテリジェントなキャッシングが行われます。これにより、パフォーマンス最適化済みクラスターと比較して CU あたり3倍のデータ密度を実現します。

- **DiskANN レベルの最適化：** IVF インデックスはディスクフレンドリーなアクセス向けにチューニングされ、NVMe SSD でのスループットを最大化し、10–50ms のレイテンシを維持します—ほとんどの AI アプリケーションでは無視できるレベルです。

- **高リソース利用率：** パフォーマンス最適化済みクラスターは30%のヘッドルームを維持することが多いですが、容量最適化済みクラスターは90%以上のデータ密度に到達できます。

**まとめ：** パフォーマンス最適化済みオプションはハードウェアで速度を購入し、容量最適化済みオプションは技術で効率を購入します。

### プロジェクトプラン：Standard vs. Enterprise vs. ビジネスクリティカル\{#project-plans-standard-vs-enterprise-vs-business-critical}

Zilliz Cloud は、機能とスケーリング制限に影響を与える複数のプランを提供しています：

<table>
    <tr>
        <th><p>機能</p></th>
        <th><p>Standard</p></th>
        <th><p>Enterprise</p></th>
        <th><p>ビジネスクリティカル</p></th>
    </tr>
    <tr>
        <td><p>最大 CU</p></td>
        <td><p>32 CU</p></td>
        <td><p>256 CU</p></td>
        <td><p>512 CU</p></td>
    </tr>
    <tr>
        <td><p>レプリカ制限</p></td>
        <td><p>Query CU × Repl ≤ 32</p></td>
        <td><p>Query CU × Repl ≤ 256</p></td>
        <td><p>Query CU × Repl ≤ 512</p></td>
    </tr>
    <tr>
        <td><p>SLA</p></td>
        <td><p>0.999</p></td>
        <td><p>0.9995</p></td>
        <td><p>0.9999</p></td>
    </tr>
    <tr>
        <td><p>Multi-AZ</p></td>
        <td><p>Single AZ</p></td>
        <td><p>オプション</p></td>
        <td><p>デフォルトで有効</p></td>
    </tr>
    <tr>
        <td><p>RBAC</p></td>
        <td><p>Basic</p></td>
        <td><p>カスタムロール + 監査</p></td>
        <td><p>フル + SOC2/HIPAA</p></td>
    </tr>
    <tr>
        <td><p>BYOC</p></td>
        <td><p>非対応</p></td>
        <td><p>対応</p></td>
        <td><p>対応</p></td>
    </tr>
    <tr>
        <td><p>サポート</p></td>
        <td><p>チケット</p></td>
        <td><p>SA + Slack</p></td>
        <td><p>24/7 + 15分レスポンス</p></td>
    </tr>
</table>

詳細については、[プラン詳細比較](./select-zilliz-cloud-service-plans) を参照してください。

**アドバイス：** **Standard** から開始してください。より高い SLA、Multi-AZ、または大規模が必要になった場合のみ **Enterprise** にアップグレードしてください。アップグレードはシームレスで、データ移行は不要です。

### よくある落とし穴\{#common-pitfalls}

1. **デフォルトでパフォーマンス最適化済みクラスターを選択：** 多くのユーザーは PoC 時に使用したパフォーマンス最適化済みクラスターに基づいて予算を立てます。しかし、容量最適化済みは「ダウングレード」版ではなく、コスト効率のために特別に設計されたアーキテクチャです。ほとんどのシナリオに十分な QPS を、パフォーマンス最適化済みクラスターの3分の1のコストで提供します。

1. **階層ストレージオプションの見落とし：** パフォーマンス最適化済みクラスターの9分の1のコストで、階層ストレージクラスターは明確なホット/コールドアクセスパターンを持つデータに最適です。データのごく一部のみが低レイテンシを必要とする場合、階層ストレージオプションはコストを桁違いに削減できます。

1. **小規模で Dedicated を使用：** 小規模データセットや不安定なトラフィックの場合、Serverless（従量課金）は Dedicated よりはるかにコスト効率が高いです。「エンタープライズ」という体裁のためにだけリソースを過剰プロビジョニングしないでください。

## インデックスとストレージの最適化\{#index-and-storage-optimization}

モードを選択したら、各 CU の活用を最大化するようパラメータをチューニングします。

### インデックスビルドレベル：容量 vs. 再現率\{#index-build-level-capacity-vs-recall}

[`build_level`](./tune-index-build-level)[ パラメータ ](./tune-index-build-level)は、インデックスの精度とストレージ密度を制御します。極端な再現率を必要としないシナリオでは、これを下げることで各 CU のストレージ容量を大幅に増加させることができます。

- **パフォーマンス最適化済みクラスター（768次元、CUあたり）：**

    <table>
        <tr>
            <th><p>ビルドレベル</p></th>
            <th><p>容量</p></th>
            <th><p>増加率</p></th>
            <th><p>再現率</p></th>
            <th><p>QPS</p></th>
        </tr>
        <tr>
            <td><p>容量優先 (0)</p></td>
            <td><p>210万</p></td>
            <td><p>0.4</p></td>
            <td><p>90–95%</p></td>
            <td><p>~2,850</p></td>
        </tr>
        <tr>
            <td><p>バランス (1) デフォルト</p></td>
            <td><p>150万</p></td>
            <td><p>ベースライン</p></td>
            <td><p>91–97%</p></td>
            <td><p>~3,500</p></td>
        </tr>
        <tr>
            <td><p>精度優先 (2)</p></td>
            <td><p>100万</p></td>
            <td><p>-0.33</p></td>
            <td><p>92–98%</p></td>
            <td><p>~3,000</p></td>
        </tr>
    </table>

- **容量最適化済みクラスター（768次元、CUあたり）：**

    <table>
        <tr>
            <th><p>ビルドレベル</p></th>
            <th><p>容量</p></th>
            <th><p>増加率</p></th>
            <th><p>再現率</p></th>
            <th><p>QPS</p></th>
        </tr>
        <tr>
            <td><p>容量優先 (0)</p></td>
            <td><p>700万</p></td>
            <td><p>0.4</p></td>
            <td><p>89–97%</p></td>
            <td><p>~300</p></td>
        </tr>
        <tr>
            <td><p>バランス (1) デフォルト</p></td>
            <td><p>500万</p></td>
            <td><p>ベースライン</p></td>
            <td><p>93–98%</p></td>
            <td><p>~350</p></td>
        </tr>
        <tr>
            <td><p>精度優先 (2)</p></td>
            <td><p>300万</p></td>
            <td><p>-0.4</p></td>
            <td><p>94–98%</p></td>
            <td><p>~345</p></td>
        </tr>
    </table>

**ケーススタディ：** 16 CU の容量最適化済みクラスターは、デフォルトで8,000万ベクトルを保持します。`容量優先` に切り替えると、これは1億1,200万に増加するか、同じ8,000万ベクトルを12 CU に収めることができ、**CU コストを25%削減**できます。

<Admonition type="info" icon="📘" title="**Note**">

`build_level` パラメータは設定後に変更できません。変更するにはインデックスを削除して再作成する必要があります。コレクション作成前に要件を評価することを推奨します。このパラメータは浮動小数点ベクトルタイプ（FLOAT_VECTOR、FLOAT16_VECTOR、BFLOAT16_VECTOR）のみサポートします。

</Admonition>

### 検索レベル：パフォーマンス vs. コスト\{#search-level-performance-vs-cost}

[`level`](./tune-recall-rate)[ パラメータ](./tune-recall-rate)（1–10）は検索精度を制御します。

- **レベル 1–3：** ほとんどのシナリオに最適（90–95% 再現率）。

- **レベル 4–7：** 高精度シナリオ。約2–3倍のレイテンシと引き換えに95–98% の再現率。

- **レベル 8–10：** 高リスクシナリオ（例：医療、不正検出）のための極限精度ですが、レイテンシとコンピュートコストが大幅に増加します。

**アドバイス：** `enable_recall_calculation=true` を使用して再現率を測定し、ビジネス要件を満たす最低レベルを見つけてください。レベルが1つ上がるごとに、検索で消費される計算リソースが増加します—Serverless クラスターでは、これは直接 Read vCU コストの増加を意味します；Dedicated クラスターでは、同じ CU 配分でサポート可能な QPS が低下することを意味します。

### Mmap 設定：メモリとディスクのバランス\{#mmap-configuration-balancing-memory-and-disk}

[Memory Mapping (mmap)](./use-mmap) は、データをメモリからディスクにオフロードします。

<table>
    <tr>
        <th><p>クラスタータイプ</p></th>
        <th><p>デフォルト MMAP ポリシー</p></th>
        <th><p>効果</p></th>
    </tr>
    <tr>
        <td><p>Dedicated（パフォーマンス最適化済み）</p></td>
        <td><p>生ベクトルデータのみ mmap を使用；スカラーデータとすべてのインデックスはメモリに残る</p></td>
        <td><p>低レイテンシを保証</p></td>
    </tr>
    <tr>
        <td><p>Dedicated（容量最適化済み）</p></td>
        <td><p>スカラーインデックス + すべての生データが mmap を使用；ベクトルインデックスのみメモリに残る</p></td>
        <td><p>容量を最大化</p></td>
    </tr>
    <tr>
        <td><p>Free / Serverless</p></td>
        <td><p>すべてのフィールドとインデックスが mmap を使用</p></td>
        <td><p>システムキャッシュに依存</p></td>
    </tr>
</table>

**最適化の推奨事項：**

- パフォーマンス最適化済みクラスターでは、スカラー絞り込みがボトルネックでない場合、スカラーフィールドで mmap を有効にして、ベクトルインデックス用のメモリを解放することを検討してください。

- 容量最適化済みクラスターでは、デフォルトポリシーはすでにストレージ優先です；追加のチューニングは一般的に不要です。

<Admonition type="info" icon="📘" title="**Note**">

mmap 設定を変更する前にコレクションをリリースし、その後再ロードする必要があります。誤設定はパフォーマンス低下や OOM エラーを引き起こす可能性があります—まずテスト環境で検証してください。

</Admonition>

## クエリ最適化\{#query-optimization}

効率的なクエリは、Serverless ユーザーの Read Unit（RU）コストを削減し、Dedicated CU の QPS を向上させます。

### スカラーフィールドにインデックスを作成する\{#index-scalar-fields}

多くのユーザーは[スカラーインデックス](./index-scalar-fields)を無視しています。これがないと、フィルタ（例：`category == "electronics"` や `timestamp > 1700000000`）が**フルコレクションスキャン**を引き起こし、これは極めて高コストです。頻繁に絞り込みを行うスカラーフィールドにインデックスを作成できます。

```python
collection.create_index(
    field_name="category",
    index_name="idx_category"
)
collection.create_index(
    field_name="timestamp",
    index_name="idx_timestamp"
)
```

**最適化の推奨事項:**

- `filter` 式に含まれるすべてのスカラーフィールドに対してインデックスの構築を行ってください。Zilliz Cloud は適切なインデックスタイプ（文字列には転置インデックス、数値にはソートインデックスなど）を自動的に選択します。

- スカラーインデックスのメモリオーバーヘッドは最小限ですが、フィルタリング性能を桁違いに向上させます — フルテーブルスキャンをインデックスルックアップに変換します。

- **重要:** 特に容量最適化クラスターでのフィルタ付きベクトル検索では、スカラーインデックスの有無が、クエリレイテンシがミリ秒単位になるか秒単位になるかを直接左右します。

### 適切な TopK の選択\{#select-appropriate-topk}

[TopK](./single-vector-search) は計算およびネットワークのオーバーヘッドに直接影響します。

<table>
    <tr>
        <th><p>TopK</p></th>
        <th><p>相対レイテンシ</p></th>
        <th><p>相対 RU コスト (Serverless)</p></th>
        <th><p>典型的なユースケース</p></th>
    </tr>
    <tr>
        <td><p>1–10</p></td>
        <td><p>ベースライン</p></td>
        <td><p>1x</p></td>
        <td><p>RAG（通常 3–5 コンテキストチャンク）</p></td>
    </tr>
    <tr>
        <td><p>10–50</p></td>
        <td><p>1.2–1.5x</p></td>
        <td><p>1.5–2x</p></td>
        <td><p>レコメンデーションシステム、検索結果ページ</p></td>
    </tr>
    <tr>
        <td><p>50–200</p></td>
        <td><p>1.5–3x</p></td>
        <td><p>2–4x</p></td>
        <td><p>候補セット生成、リランキング入力</p></td>
    </tr>
    <tr>
        <td><p>200–1000</p></td>
        <td><p>3–10x</p></td>
        <td><p>4–10x</p></td>
        <td><p>バッチ分析、クラスタリング</p></td>
    </tr>
</table>

- **RAG:** TopK 3–10 を使用してください。コンテキストを増やしても LLM の品質はほとんど向上せず、トークンと RU を無駄にするだけです。

- **レコメンデーション:** リランキングモデルの上限を使用してください（通常 20–50）。

- **大 きな TopK:** 巨大な結果セットを1回のリクエストで返すのではなく、[ページネーション](./single-vector-search#use-limit-and-offset)（`offset` + `limit`）または [イテレータ](./with-iterators) を使用してください。

### 出力フィールドの絞り込み\{#refine-output-fields}

デフォルトでは、検索は以下に示すようにすべてのスカラーフィールドを返します。

```python
results = collection.search(vectors, "embedding", search_params, limit=10)
```

ただし、すべてのクエリで大きなテキストフィールド（例：ドキュメントの全文）を返すと、レイテンシと RU コストが増加します。そのため、必要な出力フィールドのみを指定できます。

```python
results = collection.search(
    vectors, "embedding", search_params, limit=10,
    output_fields=["id", "title", "category"]  # 不要返回 "content" 等大字段
)
```

詳細については、[出力フィールドの使用](./single-vector-search#use-output-fields) を参照してください。

**最適化の推奨事項:**

- 常に `output_fields` を明示的に指定し、ビジネスロジックで必要なフィールドのみを返すようにしてください。

- RAG シナリオで元のテキストが必要な場合は、まずベクトル検索で ID を取得し、その後、外部ストレージ（例：Redis、データベース）から ID を使ってソースコンテンツを取得することを検討してください。これにより、ベクトル検索を高速に保ちながら、外部ストレージがキャッシングの恩恵を受けられるようになります。

- Serverless モードでは、返されるデータ量が Read vCU の課金に直接影響します — 不要なフィールドを減らすことは、コストを削減する最も簡単な方法です。

### パーティションキーを活用する\{#utilize-partition-keys}

[パーティションキー](./use-partition-key) は、スカラー値に基づいてデータを自動的にパーティションに分散させ、検索時に無関係なデータをスキップできるようにします。

以下の例は、コレクション作成時にパーティションキーを指定する方法を示しています：

```python
schema.add_field("tenant_id", DataType.VARCHAR, max_length=128, is_partition_key=True)
```

**ユースケース:**

- **マルチテナントSaaS:** `tenant_id` をパーティションキーとして使用することで、各テナントのクエリは自分のデータパーティションのみをスキャンし、QPSとレイテンシーの両方を大幅に改善します。

- **カテゴリフィルタリング:** `category` をパーティションキーとして使用することで、特定のカテゴリ内を検索する際にフルデータセットのスキャンが不要になります。

**パフォーマンス向上:** 100テナントでデータが均等に分散していると仮定すると、パーティションキーの使用によりクエリあたりのスキャン量が約99%削減されます。不均等な分散の場合でも、スキャン量は通常50〜90%削減されます。

## Elastic scaling\{#elastic-scaling}

Dedicated クラスターにおける最大のコストの落とし穴は、「ピーク負荷に合わせてプロビジョニングし、24時間稼働させること」です。Zilliz Cloud はこのパターンを打破するための3つのスケーリング戦略を提供しています。

### Dynamic scaling\{#dynamic-scaling}

最小および最大CU値を設定すると、システムがリアルタイムの負荷に基づいて自動的にスケーリングします。

- Query CU は CU容量 メトリクス（データ量主導）に基づいて自動スケーリングされます

- Replica は CU計算 メトリクス（QPS主導）に基づいて自動スケーリングされます

**典型的なシナリオ:** 昼間のピーク時に32 CUが必要だが、夜間は8 CUで十分なeコマース検索サービス。動的スケーリング の設定で min=8、max=32 と設定すると、オフピーク時に自動的に8 CUまでスケールダウンします。1日あたりオフピーク時間を10時間と仮定すると、月間のコンピュートコストを約30〜40%削減できます。

詳細については、[Dynamic Scaling](./scale-query-cu#dynamic-scaling) を参照してください。

### Scheduled scaling\{#scheduled-scaling}

予測可能なトラフィックパターンを持つワークロードに適しています。基本モード（シンプルなセレクタ）と詳細モード（Unix cron式）をサポートしています。

**典型的な設定:**

- 平日の9:00に32 CUへスケールアップ、22:00に8 CUへスケールダウン

- 週末は終日8 CUを維持

- 月末のプロモーション期間に事前スケーリング

詳細については、[Scheduled Scaling](./scale-query-cu#scheduled-scaling) を参照してください。

### Manual scaling\{#manual-scaling}

最もシンプルなオプションを見落とさないでください — ワークロードが静寂期に入った場合（例: プロジェクト間やオフシーズン中）、積極的にCU設定を削減してください。多くのユーザーはPoC後にスケールダウンを忘れ、数週間から数ヶ月にわたって不要な容量の料金を支払うことになります。

詳細については、[Manual Scaling](./scale-query-cu#manual-scaling) を参照してください。

### Scaling constraints\{#scaling-constraints}

- Query CU × Replica ≤ 10,240

- Replica > 1 の場合、クラスターは12 CU未満にスケールできません

- スケールダウン時、データ量は新しいCU容量の80%未満である必要があります

- 12 CU未満ではQuery CUのみ調整可能です。12 CU以上では、Query CUとReplicaを独立して調整できます

**推奨:** 予測不能なトラフィックには 動的スケーリング を、定期的なトラフィックパターンには スケジュールされたスケーリング を使用してください。両者を組み合わせることも可能です。

## Get more credits and discounts\{#get-more-credits-and-discounts}

技術的な最適化に加えて、Zillizのプロモーションプログラムを最大限に活用することも同様に重要です。

### クレジット\{#credits}

<table>
    <tr>
        <th><p>Channel</p></th>
        <th><p>クレジット</p></th>
        <th><p>Validity</p></th>
        <th><p>Notes</p></th>
    </tr>
    <tr>
        <td><p>New user registration</p></td>
        <td><p>&#36;100 credits</p></td>
        <td><p>30 days</p></td>
        <td><p>Ready to use immediately, no credit card required</p></td>
    </tr>
    <tr>
        <td><p>Add a payment method</p></td>
        <td><p>—</p></td>
        <td><p>Extended to 1 year</p></td>
        <td><p>Any unused credits are automatically extended upon adding a payment method</p></td>
    </tr>
    <tr>
        <td><p>ごみ箱</p></td>
        <td><p>Free</p></td>
        <td><p>—</p></td>
        <td><p>Deleted data incurs no charges while in the ごみ箱</p></td>
    </tr>
</table>

**推奨:** 初回登録後、できるだけ早く支払い方法を追加し、&#36;100クレジットの有効期限を30日間から1年間に延長して、技術評価に十分な時間を確保してください。

### Dedicated programs\{#dedicated-programs}

<table>
    <tr>
        <th><p>Program</p></th>
        <th><p>Target 対象ユーザー</p></th>
        <th><p>How to Apply</p></th>
    </tr>
    <tr>
        <td><p>Zilliz AI Startup Program</p></td>
        <td><p>Early-stage startups</p></td>
        <td><p>Apply through the <a href="https://zilliz.com/zilliz-for-startups">official website</a> to receive additional credits and technical support</p></td>
    </tr>
    <tr>
        <td><p>AI Agent Program</p></td>
        <td><p>AI Agent developers</p></td>
        <td><p>Exclusive credits for developers building AI Agent applications. Coming soon.</p></td>
    </tr>
</table>

### Enterprise customers\{#enterprise-customers}

- **営業部門に連絡してカスタム見積もりを取得:** エンタープライズ顧客は年間サブスクリプションを通じて割引を受けることができます。具体的な価格については [営業部門に連絡](https://zilliz.com/contact-sales) してください。

- **Cloud Marketplace サブスクリプション:** [AWS](./subscribe-on-aws-marketplace)、[Google Cloud](./subscribe-on-gcp-marketplace)、[Azure](./subscribe-on-azure-marketplace) Marketplace を通じてサブスクライブすると、Zilliz Cloud の料金をクラウド請求に統合し、既存のエンタープライズ割引を適用できます。

- **Advance pay:** [advance pay](./advance-pay) を通じてアカウントに資金を入金してください。控除の優先順位は: クレジット > advance pay > cloud marketplace サブスクリプション/クレジットカードです。予算管理要件を持つ組織に適しています。

## Monitor usage page\{#monitor-usage-page}

最適化は一度きりの作業ではありません。Zilliz Cloud は多角的なコスト分析ツールを提供し、支出の継続的な追跡と最適化を支援します。

### Visualized Cost Analysis\{#visualized-cost-analysis}

**請求 > Usage** ページでは、5つの次元で請求を内訳できます:

<table>
   <tr>
     <th><p><strong>Dimension</strong></p></th>
     <th><p><strong>目的</strong></p></th>
   </tr>
   <tr>
     <td><p>Project</p></td>
     <td><p>Compare usage across different business lines or departments</p></td>
   </tr>
   <tr>
     <td><p>Cluster</p></td>
     <td><p>Identify which cluster is the primary cost driver</p></td>
   </tr>
   <tr>
     <td><p>Time 期間</p></td>
     <td><p>View day-level trends and detect abnormal fluctuations</p></td>
   </tr>
   <tr>
     <td><p>Cost Type</p></td>
     <td><p>Break down charges by billing category</p></td>
   </tr>
   <tr>
     <td><p>クラウドリージョン</p></td>
     <td><p>Compare costs across regions in multi-region deployments</p></td>
   </tr>
</table>

複数の次元をフィルターとして組み合わせることができます。例えば、特定のプロジェクトの過去7日間のCUコストを選択すると、その事業部門のコンピュートコストトレンドを正確に把握できます。

詳細については、[Analyze Cost](./analyze-cost) を参照してください。

### RESTful API\{#restful-api}

[Query Daily Usage](/reference/restful/query-daily-usage-v2) API は、小数点以下8桁までの精度で使用状況データを提供し、内部的なFinOpsワークフローにプログラムで統合して以下が可能です:

- コストレポートの自動生成

- 内部予算システムとの統合

- カスタムアラートルールの設定

### Usage alerts\{#usage-alerts}

[cost metrics](./metrics-alerts-reference#organization-level-metrics) の監視とアラート閾値の設定を推奨し、異常な支出を早期に検出してください — 特に以下のシナリオで重要です:

- 新しく起動したクラスターで、実際のコストが想定と一致するか確認するため

- 動的スケーリング の設定後、スケーリングが正しく機能しているか確認するため

- 新しいチームメンバーが不要なリソースを作成した可能性がある場合

## Cost optimization checklist\{#cost-optimization-checklist}

すぐに実行できるチェックリスト:

**Selection Phase**

**Index 設定**

**Query Optimization**

**運用 Phase**

**請求 Optimization**

## Summary\{#summary}

Zilliz Cloud におけるコスト最適化は、単一のパラメーターを調整することではなく — 選択、設定、クエリ、運用、請求にまたがるシステム的な取り組みです。最も効果の高い最適化は以下の通りです:

1. **まず capacity-optimized クラスターを選択する** — これは「ダウングレード」ではありません。コスト効率を目的に特別に設計された階層型ストレージアーキテクチャであり、パフォーマンス最適化クラスターの1/3の単位コストで、90%以上の本番ユースケースをカバーします。

1. **クエリパターンを最適化する** — スカラーフィールドにインデックスを作成し、TopKを制御し、返却フィールドを削減し、パーティションキーを使用します。これらのそれぞれがクエリあたりのコストを意味fullyに削減します。

1. **Elastic scaling を使用する** — アイドルリソースの支払いをやめ、30〜40%の節約を実現します。

1. **Build level を調整する** — 同じCUで40%多くのデータを保存します。

適切に実行すれば、ほとんどのユーザーはビジネス要件を満たしながらコストを適正な範囲内に抑えることができ — ストレージ階層化、インデックス最適化、および弾力的なスケジューリングにおける Zilliz Cloud の技術的優位性からも恩恵を受けることができます。