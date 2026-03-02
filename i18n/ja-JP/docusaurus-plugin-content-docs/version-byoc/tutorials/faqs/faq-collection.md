---
title: "FAQ: Collection | BYOC"
slug: /faq-collection
sidebar_label: "FAQ: Collection"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud collection の使用中に発生する可能性のある問題と、それに対応する解決策をリストアップします。 | BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 3

---

# FAQ: Collection

このトピックでは、Zilliz Cloud collection の使用中に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [1つのクラスターで許可されるcollectionの数は？](#how-many-collections-are-allowed-in-a-single-cluster)
- [collection作成時にdynamic fieldが無効になっていた場合、後から有効にできますか？](#if-dynamic-field-was-disabled-when-the-collection-was-created-can-i-enable-it-later)
- [Zilliz Cloudがサポートするインデックスメトリックタイプは何ですか？](#what-are-the-indexing-metric-types-supported-by-zilliz-cloud)
- [作成したcollectionのTTL（time to live）プロパティを設定する方法は？](#how-to-set-the-ttl-time-to-live-property-of-a-created-collection)
- [collectionのロードリクエストの同時実行数は？同時実行リクエスト数を増やすにはどうすればよいですか？](#what-is-the-concurrency-for-collection-loading-requests-how-can-i-increase-the-number-of-concurrent-requests)
- [collectionのロードに失敗するのはなぜですか？どうすればよいですか？](#why-do-i-fail-to-load-collections-what-can-i-do)
- [collectionに追加できるフィールド数に制限はありますか？](#is-there-any-limit-to-the-number-of-fields-i-can-add-in-a-collection)
- [partitionsとpartition keysの違いは何ですか？](#whats-the-difference-between-partitions-and-partition-keys)
- [collectionのshard数を変更できますか？](#can-i-modify-the-number-of-shards-in-a-collection)
- [partition名にルールはありますか？](#is-there-any-rules-for-partition-names)
- [異なるモデルプロバイダーのカスタムパラメータを設定できますか？](#can-i-configure-custom-parameters-for-different-model-providers)

## よくある質問

### 1つのクラスターで許可されるcollectionの数は？{#how-many-collections-are-allowed-in-a-single-cluster}

1つのクラスターで許可されるcollectionの数は、クラスターのCUサイズによって異なります。詳細については、[Zilliz Cloud Limits](./limits#collections) を参照してください。

クラスターで許可されるcollectionの最大数に達した場合は、次のことができます。

1. クラスターをより大きなCUサイズに[スケール](./manage-cluster)します。

1. 未使用のcollectionを[ドロップ](./drop-collection)します。

1. collectionの代わりに[partitions](./manage-partitions)を作成してみてください。

### collection作成時にdynamic fieldが無効になっていた場合、後から有効にできますか？{#if-dynamic-field-was-disabled-when-the-collection-was-created-can-i-enable-it-later}

はい。collection作成後でもdynamic fieldを有効にできます。詳細については、[Modify Collection](./modify-collections) を参照してください。

### Zilliz Cloudがサポートするインデックスメトリックタイプは何ですか？{#what-are-the-indexing-metric-types-supported-by-zilliz-cloud}

Zilliz Cloudは、以下の種類のメトリックをサポートしています。

1. **Euclidean (L2)** は、平面上の2つのベクトルの距離を測定します。結果が小さいほど、2つのベクトルはより類似しています。

1. **Inner Product (IP)** は、2つのベクトルを乗算します。結果がより正であるほど、2つのベクトルはより類似しています。

1. **Cosine** は、2つのベクトルの間の角度のコサイン値を測定します。

1. **Jaccard** は、データセット間の非類似度を測定し、JACCARD類似度係数を1から引くことで得られます。

1. **Hamming** は、バイナリデータ文字列を測定します。同じ長さの2つの文字列間の距離は、ビットが異なるビット位置の数です。

### 作成したcollectionのTTL（time to live）プロパティを設定する方法は？{#how-to-set-the-ttl-time-to-live-property-of-a-created-collection}

SDKを使用して、パラメータ **collection.ttl.seconds** の値を指定することで、collectionのTTLを設定できます。詳細については、[Set Collection TTL](./set-collection-ttl) を参照してください。

以下の例では、TTLを1800秒に設定しています。

```python
collection.set_properties(properties={"collection.ttl.seconds": 1800})
```

### コレクション読み込みリクエストの同時実行数は？同時リクエスト数を増やすにはどうすればよいですか？{#what-is-the-concurrency-for-collection-loading-requests-how-can-i-increase-the-number-of-concurrent-requests}

現在、Zilliz Cloudでのコレクション読み込みリクエストのレート制限は1秒あたり1です。これは1 CUクラスターの推奨値です。同時リクエスト数を増やす必要がある場合は、[リクエストを送信してください](https://support.zilliz.com/hc/en-us)。

### コレクションの読み込みに失敗するのはなぜですか？どうすればよいですか？{#why-do-i-fail-to-load-collections-what-can-i-do}

この失敗は、クラスターのメモリ不足が原因です。クラスターをより大きなCUサイズに[スケールアップ](./scale-query-cu)してみてください。

### コレクションに追加できるフィールド数に制限はありますか？{#is-there-any-limit-to-the-number-of-fields-i-can-add-in-a-collection}

はい。1つのコレクションには最大64個のフィールドを設定できます。

### パーティションとパーティションキーの違いは何ですか？{#whats-the-difference-between-partitions-and-partition-keys}

パーティションはコレクションのサブセットです。各パーティションは親コレクションと同じデータ構造を共有しますが、コレクション内のデータの一部のみを含みます。パーティションは、特定の基準に基づいてデータを整理するために使用されます。

パーティションキーは、パーティションに基づく検索最適化ソリューションです。特定のスカラフィールドをパーティションキーとして指定し、検索時にパーティションキーに基づくフィルタリング条件を指定することで、検索範囲をいくつかのパーティションに絞り込み、検索効率を向上させることができます。

違いは、データがパーティション内で物理的に分離されているのに対し、パーティションキーはデータを論理的にグループ化することです。さらに、パーティションは手動で作成および管理する必要がありますが、パーティションキーを有効にすると、16個のパーティションが自動的に作成され、同じパーティションキー値を持つデータは同じパーティションにルーティングされます。

詳細については、[パーティションの管理](./manage-partitions)と[パーティションキーの使用](./use-partition-key)を参照してください。

### コレクションのシャード数を変更できますか？{#can-i-modify-the-number-of-shards-in-a-collection}

はい。「[コレクションのクローン作成](./manage-collections-console#create-collection)」機能を使用して、シャード数を変更できます。

1. ターゲットコレクションの**概要**ページに移動します。

1. **アクション**ドロップダウンで、**クローン**を選択します。

1. ダイアログで、

    - コレクション名を入力します。

    - **クローンスコープ**を**コレクションスキーマとデータ**に設定します。

    - **設定**を展開し、希望のシャード数を指定します。

    - **クローン**をクリックします。

1. クローンされたコレクションが作成されたら、アプリケーションコードを更新して、新しくクローンされたコレクションを使用します。

### パーティション名にルールはありますか？{#is-there-any-rules-for-partition-names}

はい。パーティション名には、文字、数字、アンダースコア（「_」）、ハイフン（「-」）のみを含めることができ、数字またはハイフンで始めることはできません。

### 異なるモデルプロバイダーのカスタムパラメータを設定できますか？{#can-i-configure-custom-parameters-for-different-model-providers}

はい、異なるモデルプロバイダーのカスタムパラメータがサポートされています。サポートされているパラメータの完全なリストについては、各プロバイダーの公式ドキュメントを参照してください。

- [OpenAI](https://platform.openai.com/docs/api-reference/embeddings)

- [Cohere](https://docs.cohere.com/reference/embed)

- [Voyage AI](https://docs.voyageai.com/docs/embeddings)
