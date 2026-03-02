---
title: "言語識別子 | Cloud"
slug: /language-identifier-tokenizer
sidebar_label: "言語識別子"
beta: FALSE
notebook: FALSE
description: "`languageidentifier` は、言語分析プロセスを自動化することで Zilliz Cloud のテキスト検索機能を強化するために設計された特殊なトークナイザーです。その主な機能は、テキストフィールドの言語を検出し、その言語に最も適した事前設定されたアナライザーを動的に適用することです。これは、さまざまな言語を扱うアプリケーションにとって特に価値があり、入力ごとに手動で言語を割り当てる必要がなくなります。 | Cloud"
type: origin
token: X6wiwFkuFiF8nekse05cnBIPnic
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - コレクション
  - スキーマ
  - アナライザー
  - 組み込みトークナイザー
  - 言語識別子
  - コサイン距離
  - ベクトルデータベースとは
  - vectordb
  - マルチモーダルベクトルデータベース検索

---

import Admonition from '@theme/Admonition';


# 言語識別子

`language_identifier` は、言語分析プロセスを自動化することで Zilliz Cloud のテキスト検索機能を強化するために設計された特殊なトークナイザーです。その主な機能は、テキストフィールドの言語を検出し、その言語に最も適した事前設定されたアナライザーを動的に適用することです。これは、さまざまな言語を扱うアプリケーションにとって特に価値があり、入力ごとに手動で言語を割り当てる必要がなくなります。

`language_identifier` は、テキストデータを適切な処理パイプラインにインテリジェントにルーティングすることで、多言語データの取り込みを効率化し、その後の検索および取得操作のための正確なトークン化を保証します。

## 言語検出ワークフロー{#language-detection-workflow}

`language_identifier` は、テキスト文字列を処理するために一連のステップを実行します。このワークフローは、ユーザーが正しく設定する方法を理解するために重要です。

![NZcFw5PuxhQcl1bUG60cS54QnMu](https://zdoc-images.s3.us-west-2.amazonaws.com/NZcFw5PuxhQcl1bUG60cS54QnMu.png)

1. **入力:** ワークフローは、テキスト文字列を入力として開始します。

1. **言語検出:** この文字列はまず言語検出エンジンに渡され、言語の識別を試みます。Zilliz Cloud は、**whatlang** と **lingua** の 2 つのエンジンをサポートしています。

1. **アナライザーの選択:**

    - **成功:** 言語が正常に検出された場合、システムは検出された言語名が `analyzers` ディクショナリに設定されている対応するアナライザーを持っているかどうかを確認します。一致が見つかった場合、システムは指定されたアナライザーを入力テキストに適用します。たとえば、検出された「Mandarin」テキストは `jieba` トークナイザーにルーティングされます。

    - **フォールバック:** 検出に失敗した場合、または言語が正常に検出されたが、その言語に特定のアナライザーが提供されていない場合、システムは事前設定された**デフォルトアナライザー**にフォールバックします。これは重要な明確化のポイントです。`default` アナライザーは、検出の失敗と一致するアナライザーがない場合のフォールバックの両方です。

適切なアナライザーが選択された後、テキストはトークン化され、処理され、ワークフローが完了します。

## 利用可能な言語検出エンジン{#available-language-detection-engines}

Zilliz Cloud は、2 つの言語検出エンジンから選択できます。

- [whatlang](https://github.com/greyblake/whatlang-rs)

- [lingua](https://github.com/pemistahl/lingua)

選択は、アプリケーションの特定のパフォーマンスと精度の要件によって異なります。

<table>
   <tr>
     <th><p>エンジン</p></th>
     <th><p>速度</p></th>
     <th><p>精度</p></th>
     <th><p>出力形式</p></th>
     <th><p>最適な用途</p></th>
   </tr>
   <tr>
     <td><p><code>whatlang</code></p></td>
     <td><p>高速</p></td>
     <td><p>ほとんどの言語で良好</p></td>
     <td><p>言語名 (例: <code>"English"</code>,  <code>"Mandarin"</code>, <code>"Japanese"</code>)</p><p><strong>参照:</strong> <a href="https://github.com/greyblake/whatlang-rs/blob/master/SUPPORTED_LANGUAGES.md">サポートされている言語テーブルの言語列</a></p></td>
     <td><p>速度が重要なリアルタイムアプリケーション</p></td>
   </tr>
   <tr>
     <td><p><code>lingua</code></p></td>
     <td><p>低速</p></td>
     <td><p>特に短いテキストで高精度</p></td>
     <td><p>英語の言語名 (例: <code>"English"</code>, <code>"Chinese"</code>, <code>"Japanese"</code>)</p><p><strong>参照:</strong> <a href="https://github.com/pemistahl/lingua?tab=readme-ov-file#3-which-languages-are-supported">サポートされている言語リスト</a></p></td>
     <td><p>速度よりも精度が重要なアプリケーション</p></td>
   </tr>
</table>

重要な考慮事項は、エンジンの命名規則です。どちらのエンジンも英語で言語名を返しますが、一部の言語では異なる用語を使用します (例: `whatlang` は `Mandarin` を返し、`lingua` は `Chinese` を返します)。アナライザーのキーは、選択した検出エンジンによって返される名前に正確に一致する必要があります。

## 設定{#configuration}

`language_identifier` トークナイザーを正しく使用するには、その設定を定義して適用するために次の手順を実行する必要があります。

### ステップ 1: 言語とアナライザーを選択する{#step-1-choose-your-languages-and-analyzers}

`language_identifier` の設定の核となるのは、アナライザーをサポートする予定の特定の言語に合わせて調整することです。システムは、検出された言語を正しいアナライザーと照合することで機能するため、このステップは正確なテキスト処理にとって非常に重要です。

以下は、言語と適切な Zilliz Cloud アナライザーの推奨マッピングです。この表は、言語検出エンジンの出力と最適なツールの間の橋渡しとして機能します。

<table>
   <tr>
     <th><p>言語 (検出器の出力)</p></th>
     <th><p>推奨アナライザー</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>English</code></p></td>
     <td><p><code>type: english</code></p></td>
     <td><p>ステミングとストップワードフィルタリングを備えた標準的な英語のトークン化。</p></td>
   </tr>
   <tr>
     <td><p><code>Mandarin</code> (whatlang 経由) または <code>Chinese</code> (lingua 経由)</p></td>
     <td><p><code>tokenizer: jieba</code></p></td>
     <td><p>スペースで区切られていないテキストの中国語単語分割。</p></td>
   </tr>
   <tr>
     <td><p><code>Japanese</code></p></td>
     <td><p><code>tokenizer: icu</code></p></td>
     <td><p>日本語を含む複雑なスクリプト用の堅牢なトークナイザー。</p></td>
   </tr>
   <tr>
     <td><p><code>French</code></p></td>
     <td><p><code>type: standard</code>, <code>filter: ["lowercase", "asciifolding"]</code></p></td>
     <td><p>フランス語のアクセントと文字を処理するカスタム設定。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p><strong>一致が重要:</strong> アナライザーの名前は、検出エンジンの言語出力と**正確に一致**する必要があります。たとえば、`whatlang` を使用している場合、中国語テキストのキーは `Mandarin` である必要があります。</p></li>
<li><p><strong>ベストプラクティス:</strong> 上記の表は、いくつかの一般的な言語の推奨設定を提供しますが、網羅的なリストではありません。アナライザーの選択に関するより包括的なガイドについては、「<a href="./choose-the-right-analyzer-for-your-use-case">ユースケースに適したアナライザーを選択する</a>」を参照してください。</p></li>
<li><p><strong>検出器の出力</strong>: 検出エンジンによって返される言語名の完全なリストについては、「<a href="https://github.com/greyblake/whatlang-rs">Whatlang がサポートする言語テーブル</a>」と「<a href="https://github.com/pemistahl/lingua-rs">Lingua がサポートする言語リスト</a>」を参照してください。</p></li>
</ul>

</Admonition>

### ステップ 2: analyzer_params を定義する{#step-2-define-analyzerparams}

Zilliz Cloud で `language_identifier` トークナイザーを使用するには、これらの主要コンポーネントを含むディクショナリを作成します。

**必須コンポーネント:**

- `analyzers` 設定セット – すべてのアナライザー設定を含むディクショナリ。これには以下が含まれている必要があります。

    - `default` – 言語検出が失敗した場合、または一致するアナライザーが見つからない場合に使用されるフォールバックアナライザー

    - **言語固有のアナライザー** – それぞれが `<analyzer_name>: <analyzer_config>` として定義されます。ここで、

        - `analyzer_name` は、選択した検出エンジンの出力と一致します (例: `"English"`, `"Japanese"`)

        - `analyzer_config` は、標準のアナライザーパラメータ形式に従います (「[アナライザーの概要](./analyzer-overview#analyzer-types)」を参照)

**オプションコンポーネント:**

- `identifier` – 使用する言語検出エンジン (`whatlang` または `lingua`) を指定します。指定しない場合、デフォルトは `whatlang` です。

- `mapping` – アナライザーのカスタムエイリアスを作成し、検出エンジンの正確な出力形式ではなく、記述的な名前を使用できるようにします。

トークナイザーは、まず入力テキストの言語を検出し、次に設定から適切なアナライザーを選択することで機能します。検出に失敗した場合、または一致するアナライザーが存在しない場合、自動的に `default` アナライザーにフォールバックします。

#### 推奨: 直接名前一致{#recommended-direct-name-matching}

アナライザー名は、選択した言語検出エンジンの出力と正確に一致する必要があります。このアプローチはよりシンプルで、潜在的な混乱を回避できます。

`whatlang` と `lingua` の両方について、それぞれのドキュメントに示されている言語名を使用してください。

- [whatlang がサポートする言語](https://github.com/greyblake/whatlang-rs/blob/master/SUPPORTED_LANGUAGES.md) (「**Language**」列を使用)

- [lingua がサポートする言語](https://github.com/pemistahl/lingua?tab=readme-ov-file#3-which-languages-are-supported)

```python
analyzer_params = {
    "tokenizer": {
        "type": "language_identifier",  # Must be `language_identifier`
        "identifier": "whatlang",  # or `lingua`
        "analyzers": {  # A set of analyzer configs
            "default": {
                "tokenizer": "standard"  # fallback if language detection fails
            },
            "English": {  # Analyzer name that matches whatlang output
                "type": "english"
            },
            "Mandarin": {  # Analyzer name that matches whatlang output
                "tokenizer": "jieba"
            }
        }
    }
}
```

#### 代替アプローチ：マッピングによるカスタム名{#alternative-approach-custom-names-with-mapping}

カスタムアナライザー名を使用したい場合や、既存の構成との互換性を維持する必要がある場合は、`mapping`パラメータを使用できます。これにより、アナライザーのエイリアスが作成され、元の検出エンジン名とカスタム名の両方が機能します。

```python
analyzer_params = {
    "tokenizer": {
        "type": "language_identifier",
        "identifier": "lingua",
        "analyzers": {
            "default": {
                "tokenizer": "standard"
            },
            "english_analyzer": {  # Custom analyzer name
                "type": "english"
            },
            "chinese_analyzer": {  # Custom analyzer name
                "tokenizer": "jieba"
            }
        },
        "mapping": {
            "English": "english_analyzer",   # Maps detection output to custom name
            "Chinese": "chinese_analyzer"
        }
    }
}
```

`analyzer_params` を定義した後、コレクションスキーマを定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は指定されたアナライザーを使用してそのフィールドのテキストを処理し、効率的なトークン化とフィルタリングを行うことができます。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## 例{#examples}

一般的なシナリオに対応するすぐに使える設定をいくつか紹介します。各例には設定と検証コードの両方が含まれているため、すぐにセットアップをテストできます。

### 英語と中国語の検出{#english-and-chinese-detection}

```python
from pymilvus import MilvusClient

# Configuration
analyzer_params = {
    "tokenizer": {
        "type": "language_identifier",
        "identifier": "whatlang",
        "analyzers": {
            "default": {"tokenizer": "standard"},
            "English": {"type": "english"},
            "Mandarin": {"tokenizer": "jieba"}
        }
    }
}

# Test the configuration
client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# English text
result_en = client.run_analyzer("The Milvus vector database is built for scale!", analyzer_params)
print("English:", result_en)
# Output: 
# English: ['The', 'Milvus', 'vector', 'database', 'is', 'built', 'for', 'scale']

# Chinese text  
result_cn = client.run_analyzer("Milvus向量数据库专为大规模应用而设计", analyzer_params)
print("Chinese:", result_cn)
# Output: 
# Chinese: ['Milvus', '向量', '数据', '据库', '数据库', '专', '为', '大规', '规模', '大规模', '应用', '而', '设计']
```

### アクセント正規化を伴うヨーロッパ言語\{#european-languages-with-accent-normalization}

```python
# Configuration for French, German, Spanish, etc.
analyzer_params = {
    "tokenizer": {
        "type": "language_identifier",
        "identifier": "lingua", 
        "analyzers": {
            "default": {"tokenizer": "standard"},
            "English": {"type": "english"},
            "French": {
                "tokenizer": "standard",
                "filter": ["lowercase", "asciifolding"]
            }
        }
    }
}

# Test with accented text
result_fr = client.run_analyzer("Café français très délicieux", analyzer_params)
print("French:", result_fr)
# Output: 
# French: ['cafe', 'francais', 'tres', 'delicieux']
```

## 使用上の注意点{#usage-notes}

- **フィールドごとの単一言語:** フィールドを単一の均質なテキスト単位として扱います。あるレコードには英語の文が含まれ、次のレコードにはフランス語の文が含まれるなど、異なるデータレコード間で異なる言語を処理するように設計されています。

- **混合言語文字列は不可:** 複数の言語のテキストを含む単一の文字列を処理するようには**設計されていません**。例えば、英語の文と引用された日本語のフレーズの両方を含む単一の`VARCHAR`フィールドは、単一の言語として処理されます。

- **優勢言語処理:** 混合言語のシナリオでは、検出エンジンが優勢な言語を特定し、対応するanalyzerがテキスト全体に適用される可能性が高いです。これにより、埋め込まれた外国語テキストのトークン化が不十分になるか、まったく行われないことになります。

