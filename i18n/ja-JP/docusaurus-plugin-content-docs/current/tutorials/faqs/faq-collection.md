---
title: "FAQ: コレクション | CLOUD"
slug: /faq-collection
sidebar_label: "FAQ: コレクション"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud のコレクションを使用する際に発生する可能性のある問題と、それに対応する解決策をリストアップしています。 | CLOUD"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 3

---

# FAQ: コレクション

このトピックでは、Zilliz Cloud コレクションの使用中に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [単一クラスターで許可されるコレクションの数はいくつですか？](#how-many-collections-are-allowed-in-a-single-cluster)
- [コレクション作成時に動的フィールドが無効になっていた場合、後で有効にできますか？](#if-dynamic-field-was-disabled-when-the-collection-was-created-can-i-enable-it-later)
- [Zilliz Cloud がサポートするインデックス作成メトリックタイプは何ですか？](#what-are-the-indexing-metric-types-supported-by-zilliz-cloud)
- [作成されたコレクションの TTL (time to live) プロパティを設定する方法は？](#how-to-set-the-ttl-time-to-live-property-of-a-created-collection)
- [コレクション読み込みリクエストの同時実行数は？同時実行リクエストの数を増やすにはどうすればよいですか？](#what-is-the-concurrency-for-collection-loading-requests-how-can-i-increase-the-number-of-concurrent-requests)
- [コレクションの読み込みに失敗するのはなぜですか？どうすればよいですか？](#why-do-i-fail-to-load-collections-what-can-i-do)
- [コレクションに追加できるフィールドの数に制限はありますか？](#is-there-any-limit-to-the-number-of-fields-i-can-add-in-a-collection)
- [パーティションとパーティションキーの違いは何ですか？](#whats-the-difference-between-partitions-and-partition-keys)
- [コレクションのシャード数を変更できますか？](#can-i-modify-the-number-of-shards-in-a-collection)
- [パーティション名にルールはありますか？](#is-there-any-rules-for-partition-names)
- [異なるモデルプロバイダーのカスタムパラメータを設定できますか？](#can-i-configure-custom-parameters-for-different-model-providers)

## FAQ




### 単一クラスターで許可されるコレクションの数はいくつですか？\{#how-many-collections-are-allowed-in-a-single-cluster}

フリークラスターでは最大5つのコレクションを持つことができます。上限に達し、さらにコレクションを作成する必要がある場合は、クラスターのデプロイオプションを[アップグレード](./manage-cluster)してください。

Serverless クラスターでは最大100のコレクションを持つことができます。

Dedicated クラスターで許可されるコレクションの数は、クラスターの CU サイズによって異なります。詳細については、[Zilliz Cloud の制限](./limits#collections)を参照してください。

クラスターで許可されるコレクションの最大数に達した場合は、次のことができます。

1. クラスターをより大きな CU サイズに[スケール](./manage-cluster)します。

1. 未使用のコレクションを[削除](./drop-collection)します。

1. コレクションの代わりに[パーティション](./manage-partitions)を作成してみてください。

### コレクション作成時に動的フィールドが無効になっていた場合、後で有効にできますか？\{#if-dynamic-field-was-disabled-when-the-collection-was-created-can-i-enable-it-later}

はい。コレクション作成後でも動的フィールドを有効にできます。詳細については、[コレクションの変更](./modify-collections)を参照してください。

### Zilliz Cloud がサポートするインデックス作成メトリックタイプは何ですか？\{#what-are-the-indexing-metric-types-supported-by-zilliz-cloud}

Zilliz Cloud は以下のメトリックタイプをサポートしています。

1. **ユークリッド (L2)** は、平面上の2つのベクトル間の距離を測定します。結果が小さいほど、2つのベクトルはより類似しています。

1. **内積 (IP)** は、2つのベクトルを乗算します。結果がより正であるほど、2つのベクトルはより類似しています。

1. **コサイン** は、2つのベクトル間の角度のコサイン値を測定します。

1. **Jaccard** は、データセット間の非類似度を測定し、JACCARD 類似度係数を1から引くことで得られます。

1. **ハミング** は、バイナリデータ文字列を測定します。同じ長さの2つの文字列間の距離は、ビットが異なるビット位置の数です。

### 作成されたコレクションの TTL (time to live) プロパティを設定する方法は？\{#how-to-set-the-ttl-time-to-live-property-of-a-created-collection}

SDK を使用して、**collection.ttl.seconds** パラメータの値を指定することで、コレクションの TTL を設定できます。詳細については、[コレクション TTL の設定](./set-collection-ttl)を参照してください。

以下の例では、TTL を1800秒に設定しています。

```python
collection.set_properties(properties={"collection.ttl.seconds": 1800})
```

### コレクション読み込みリクエストの同時実行数はどのくらいですか？同時実行リクエストの数を増やすにはどうすればよいですか？\{#what-is-the-concurrency-for-collection-loading-requests-how-can-i-increase-the-number-of-concurrent-requests}

現在、Zilliz Cloudでのコレクション読み込みリクエストのレート制限は1秒あたり1回です。これは1 CUクラスターの推奨値です。同時実行リクエストの数を増やす必要がある場合は、[リクエストを送信してください](https://support.zilliz.com/hc/en-us)。

### コレクションの読み込みに失敗するのはなぜですか？どうすればよいですか？\{#why-do-i-fail-to-load-collections-what-can-i-do}

この失敗は、クラスターのメモリ不足が原因です。クラスターをより大きなCUサイズに[スケールアップ](./scale-query-cu)してみてください。

### コレクションに追加できるフィールドの数に制限はありますか？\{#is-there-any-limit-to-the-number-of-fields-i-can-add-in-a-collection}

はい。1つのコレクションには最大64個のフィールドを含めることができます。

### パーティションとパーティションキーの違いは何ですか？\{#whats-the-difference-between-partitions-and-partition-keys}

パーティションはコレクションのサブセットです。各パーティションは親コレクションと同じデータ構造を共有しますが、コレクション内のデータのサブセットのみを含みます。パーティションは、特定の基準に基づいてデータを整理するために使用されます。

パーティションキーは、パーティションに基づく検索最適化ソリューションです。特定のスカラフィールドをパーティションキーとして指定し、検索時にパーティションキーに基づくフィルタリング条件を指定することで、検索範囲をいくつかのパーティションに絞り込み、検索効率を向上させることができます。

違いは、データがパーティション内で物理的に分離されているのに対し、パーティションキーはデータを論理的にグループ化することです。さらに、パーティションは手動で作成および管理する必要がありますが、パーティションキーを有効にすると、16個のパーティションが自動的に作成され、同じパーティションキー値を持つデータは同じパーティションにルーティングされます。

詳細については、[パーティションの管理](./manage-partitions)および[パーティションキーの使用](./use-partition-key)を参照してください。

### コレクションのシャード数を変更できますか？\{#can-i-modify-the-number-of-shards-in-a-collection}

はい。シャード数を変更するには、「[コレクションのクローン](./manage-collections-console#create-collection)」機能を使用します。

1. 対象コレクションの**概要**ページに移動します。

1. **アクション**ドロップダウンで、**クローン**を選択します。

1. ダイアログで、

    - コレクション名を入力します。

    - **クローンスコープ**を**コレクションのスキーマとデータ**に設定します。

    - **設定**を展開し、希望のシャード数を指定します。

    - **クローン**をクリックします。

1. クローンされたコレクションが作成されたら、アプリケーションコードを更新して、新しくクローンされたコレクションを使用します。

### パーティション名にルールはありますか？\{#is-there-any-rules-for-partition-names}

はい。パーティション名には、文字、数字、アンダースコア（「_」）、ハイフン（「-」）のみを含めることができ、数字またはハイフンで始めることはできません。

### 異なるモデルプロバイダーのカスタムパラメータを設定できますか？\{#can-i-configure-custom-parameters-for-different-model-providers}

はい、異なるモデルプロバイダーのカスタムパラメータがサポートされています。サポートされているパラメータの完全なリストについては、各プロバイダーの公式ドキュメントを参照してください。

- [OpenAI](https://platform.openai.com/docs/api-reference/embeddings)

- [Cohere](https://docs.cohere.com/reference/embed)

- [Voyage AI](https://docs.voyageai.com/docs/embeddings)
