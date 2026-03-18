---
title: "FAQ: コレクション | BYOC"
slug: /faq-collection
sidebar_label: "FAQ: コレクション"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud のコレクションを使用する際に発生する可能性のある問題と、それに対応する解決策を一覧にしています。| BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 3

---

# FAQ: コレクション

このトピックでは、Zilliz Cloud のコレクションを使用する際に発生する可能性のある問題と、それに対応する解決策を一覧にします。

## 目次

- [単一のクラスターで許可されるコレクションの数はいくつですか？](#how-many-collections-are-allowed-in-a-single-cluster)
- [コレクション作成時に動的フィールドが無効になっていた場合、後から有効にできますか？](#if-dynamic-field-was-disabled-when-the-collection-was-created-can-i-enable-it-later)
- [Zilliz Cloud でサポートされているインデックスのメトリックタイプは何ですか？](#what-are-the-indexing-metric-types-supported-by-zilliz-cloud)
- [作成済みコレクションの TTL（生存時間）プロパティを設定するにはどうすればよいですか？](#how-to-set-the-ttl-time-to-live-property-of-a-created-collection)
- [コレクション読み込みリクエストの同時実行性はどうなっていますか？同時リクエスト数を増やすにはどうすればよいですか？](#what-is-the-concurrency-for-collection-loading-requests-how-can-i-increase-the-number-of-concurrent-requests)
- [コレクションの読み込みに失敗するのはなぜですか？どうすればよいですか？](#why-do-i-fail-to-load-collections-what-can-i-do)
- [コレクションに追加できるフィールド数に制限はありますか？](#is-there-any-limit-to-the-number-of-fields-i-can-add-in-a-collection)
- [パーティションとパーティションキーの違いは何ですか？](#whats-the-difference-between-partitions-and-partition-keys)
- [コレクションのシャード数を変更できますか？](#can-i-modify-the-number-of-shards-in-a-collection)
- [パーティション名に関するルールはありますか？](#is-there-any-rules-for-partition-names)
- [異なるモデルプロバイダーに対してカスタムパラメーターを構成できますか？](#can-i-configure-custom-parameters-for-different-model-providers)

## よくある質問




### 単一のクラスターで許可されるコレクションの数はいくつですか？\{#how-many-collections-are-allowed-in-a-single-cluster}

クラスターで許可されるコレクションの数は、クラスターの CU サイズによって異なります。詳細については、[Zilliz Cloud の制限](./limits#collections) を参照してください。

クラスターで許可される最大コレクション数に達した場合、以下の対応が可能です。

1. クラスターをより大きな CU サイズに[スケール](./manage-cluster) します。

1. 未使用のコレクションを[削除](./drop-collection) します。

1. コレクションの代わりに[パーティション](./manage-partitions) の作成を検討します。

### コレクション作成時に動的フィールドが無効になっていた場合、後から有効にできますか？\{#if-dynamic-field-was-disabled-when-the-collection-was-created-can-i-enable-it-later}

はい。コレクション作成後でも動的フィールドを有効にすることができます。詳細については、[コレクションの変更](./modify-collections) を参照してください。

### Zilliz Cloud でサポートされているインデックスのメトリックタイプは何ですか？\{#what-are-the-indexing-metric-types-supported-by-zilliz-cloud}

Zilliz Cloud は、以下のメトリックタイプをサポートしています。

1. **ユークリッド距離 (L2)** は、平面上の 2 つのベクトル間の距離を測定します。結果が小さいほど、2 つのベクトルは類似しています。

1. **内積 (IP)** は、2 つのベクトルの積を計算します。結果が正の値で大きいほど、2 つのベクトルは類似しています。

1. **コサイン** は、2 つのベクトル間の角度のコサイン値を測定します。

1. **ジャカード** は、データセット間の非類似度を測定し、ジャカード類似係数を 1 から引くことで得られます。

1. **ハミング** は、バイナリデータ文字列を測定します。長さが等しい 2 つの文字列間の距離は、ビットが異なるビット位置の数です。

### 作成済みコレクションの TTL（生存時間）プロパティを設定するにはどうすればよいですか？\{#how-to-set-the-ttl-time-to-live-property-of-a-created-collection}

SDK を使用して、パラメーター **collection.ttl.seconds** に値を指定することで、コレクションの TTL を設定できます。詳細については、[コレクション TTL の設定](./set-collection-ttl) を参照してください。

以下の例では、TTL を 1800 秒に設定しています。

```python
collection.set_properties(properties={"collection.ttl.seconds": 1800})
```

### コレクションのロードリクエストにおける同時実行数とは何ですか？同時実行リクエスト数を増やすにはどうすればよいですか？\{#what-is-the-concurrency-for-collection-loading-requests-how-can-i-increase-the-number-of-concurrent-requests}

現在、Zilliz Cloud におけるコレクションのロードリクエストのレート制限は 1 秒あたり 1 リクエストです。これは 1 CU クラスタ向けの推奨値です。同時実行リクエスト数を増やす必要がある場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us)してください。

### なぜコレクションのロードに失敗するのですか？どうすればよいですか？\{#why-do-i-fail-to-load-collections-what-can-i-do}

この失敗は、クラスタのメモリが不足しているために発生します。クラスタをより大きな CU サイズに[スケールアップ](./scale-query-cu)してみてください。

### コレクションに追加できるフィールド数に制限はありますか？\{#is-there-any-limit-to-the-number-of-fields-i-can-add-in-a-collection}

はい。1 つのコレクションには最大 64 個のフィールドを含めることができます。

### パーティションとパーティションキーの違いは何ですか？\{#whats-the-difference-between-partitions-and-partition-keys}

パーティションはコレクションのサブセットです。各パーティションは親コレクションと同じデータ構造を共有しますが、コレクション内のデータの一部のみを保持します。パーティションは特定の基準に基づいてデータを整理するために使用されます。

パーティションキーは、パーティションに基づいた検索最適化ソリューションです。特定のスカラー型フィールドをパーティションキーとして指定し、検索時にそのパーティションキーに基づくフィルタリング条件を設定することで、検索範囲をいくつかのパーティションに絞り込むことができ、検索効率が向上します。

主な違いは、パーティションではデータが物理的に分離されるのに対し、パーティションキーは論理的にデータをグループ化することです。また、パーティションは手動で作成・管理する必要がありますが、パーティションキーを有効にすると自動的に 16 個のパーティションが作成され、同じパーティションキー値を持つデータは同じパーティションにルーティングされます。

詳細については、[パーティションの管理](./manage-partitions)および[パーティションキーの使用](./use-partition-key)をご参照ください。

### コレクションのシャード数を変更できますか？\{#can-i-modify-the-number-of-shards-in-a-collection}

はい。「[コレクションのクローン](./manage-collections-console#create-collection)」機能を使用してシャード数を変更できます。

1. 対象コレクションの **Overview** ページに移動します。

2. **Actions** ドロップダウンメニューから **クローン** を選択します。

3. ダイアログで以下を設定します。

    - コレクション名を入力

    - **クローン scope** を **コレクションのスキーマとデータ** に設定

    - **Settings** を展開し、希望するシャード数を指定

    - **クローン** をクリック

4. クローンされたコレクションが作成されたら、アプリケーションコードを更新して新しいクローンコレクションを使用するようにしてください。

### パーティション名に命名ルールはありますか？\{#is-there-any-rules-for-partition-names}

はい。パーティション名には英字、数字、アンダースコア（“_”）、ハイフン（“-”）のみを使用でき、数字またはハイフンで始めることはできません。

### 異なるモデルプロバイダーに対してカスタムパラメータを設定できますか？\{#can-i-configure-custom-parameters-for-different-model-providers}

はい。異なるモデルプロバイダーに対してカスタムパラメータを設定できます。サポートされているパラメータの完全なリストについては、各プロバイダーの公式ドキュメントをご参照ください。

- [OpenAI](https://platform.openai.com/docs/api-reference/embeddings)

- [Cohere](https://docs.cohere.com/reference/embed)

- [Voyage AI](https://docs.voyageai.com/docs/embeddings)
