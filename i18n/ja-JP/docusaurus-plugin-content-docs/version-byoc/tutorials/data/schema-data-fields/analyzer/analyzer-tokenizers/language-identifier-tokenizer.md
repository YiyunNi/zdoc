---
title: "言語識別子 | BYOC"
slug: /language-identifier-tokenizer
sidebar_key: language-identifier-tokenizer
sidebar_label: "言語識別子"
beta: FALSE
notebook: FALSE
description: "`languageidentifier` は、言語分析プロセスを自動化することで Zilliz Cloud のテキスト検索機能を強化するよう設計された専用のトークナイザーです。その主な機能は、テキストフィールドの言語を検出し、その言語に最も適した事前設定されたアナライザーを動的に適用することです。これは、複数の言語を扱うアプリケーションに特に価値があり、入力ごとに手動で言語を割り当てる必要をなくします。 | BYOC"
type: origin
token: X6wiwFkuFiF8nekse05cnBIPnic
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - アナライザー
  - 組み込みトークナイザー
  - 言語識別子

---

import Admonition from '@theme/Admonition';


# 言語 Identifier

`language_identifier` は、言語分析プロセスを自動化することで Zilliz Cloud のテキスト検索機能を強化するために設計された専用トークナイザーです。その主な機能は、テキストフィールドの言語を検出し、その言語に最も適した事前設定されたアナライザーを動的に適用することです。これは、さまざまな言語を扱うアプリケーションにとって特に価値があり、入力ごとに手動で言語を割り当てる必要をなくします。

テキストデータを適切な処理パイプラインにインテリジェントにルーティングすることで、`language_identifier` は多言語データの取り込みを効率化し、後続の検索および取得操作のための正確なトークン化を保証します。

## 言語 detection workflow\{#language-detection-workflow}

`language_identifier` はテキスト文字列を処理するために一連のステップを実行します。このワークフローは、ユーザーが正しく設定する方法を理解するために重要です。

![NZcFw5PuxhQcl1bUG60cS54QnMu](https://zdoc-images.s3.us-west-2.amazonaws.com/NZcFw5PuxhQcl1bUG60cS54QnMu.png)

1. **Input:** ワークフローはテキスト文字列を入力として開始します。

1. **言語 detection:** この文字列はまず言語検出エンジンに渡され、言語の識別を試みます。Zilliz Cloud は **whatlang** と **lingua** の2つのエンジンをサポートしています。

1. **Analyzer selection:**

    - **Success:** 言語が正常に検出された場合、システムは検出された言語名に対応するアナライザーが `analyzers` 辞書に設定されているかどうかを確認します。一致が見つかった場合、システムは指定されたアナライザーを入力テキストに適用します。例えば、検出された「Mandarin」のテキストは `jieba` トークナイザーにルーティングされます。

    - **Fallback:** 検出が失敗した場合、または言語は正常に検出されたが特定のアナライザーが提供されていない場合、システムは事前設定された **デフォルトアナライザー** にフォールバックします。これは重要な説明点です。`default` アナライザーは、検出失敗と一致するアナライザーの不在の両方に対するフォールバックです。

適切なアナライザーが選択された後、テキストはトークン化され処理され、ワークフローが完了します。

## Available language detection engines\{#available-language-detection-engines}

Zilliz Cloud は2つの言語検出エンジンから選択できます：

- [whatlang](https://github.com/greyblake/whatlang-rs)

- [lingua](https://github.com/pemistahl/lingua)

選択は、アプリケーションの特定のパフォーマンスと精度の要件に依存します。

<table>
   <tr>
     <th><p>Engine</p></th>
     <th><p>Speed</p></th>
     <th><p>Accuracy</p></th>
     <th><p>Output Format</p></th>
     <th><p>Best For</p></th>
   </tr>
   <tr>
     <td><p><code>whatlang</code></p></td>
     <td><p>Fast</p></td>
     <td><p>Good for most languages</p></td>
     <td><p>言語 names (e.g., <code>"English"</code>,  <code>"Mandarin"</code>, <code>"Japanese"</code>)</p><p><strong>Reference:</strong> <a href="https://github.com/greyblake/whatlang-rs/blob/master/SUPPORTED_LANGUAGES.md">言語 column in supported languages table</a></p></td>
     <td><p>Real-time applications where speed is critical</p></td>
   </tr>
   <tr>
     <td><p><code>lingua</code></p></td>
     <td><p>Slower</p></td>
     <td><p>Higher precision, especially for short texts</p></td>
     <td><p>English language names (e.g., <code>"English"</code>, <code>"Chinese"</code>, <code>"Japanese"</code>)</p><p><strong>Reference:</strong> <a href="https://github.com/pemistahl/lingua?tab=readme-ov-file#3-which-languages-are-supported">Supported languages list</a></p></td>
     <td><p>アプリケーション where accuracy is more important than speed</p></td>
   </tr>
</table>

重要な考慮事項はエンジンの命名規則です。両方のエンジンが英語で言語名を返しますが、一部の言語に対して異なる用語を使用します（例：`whatlang` は `Mandarin` を返しますが、`lingua` は `Chinese` を返します）。アナライザーのキーは、選択した検出エンジンが返す名前と完全に一致する必要があります。

## 設定\{#configuration}

`language_identifier` トークナイザーを正しく使用するには、以下のステップに従ってその設定を定義および適用する必要があります。

### Step 1: Choose your languages and analyzers\{#step-1-choose-your-languages-and-analyzers}

`language_identifier` の設定の核心は、サポートする予定の特定の言語にアナライザーを調整することです。システムは検出された言語と正しいアナライザーを一致させて動作するため、このステップは正確なテキスト処理にとって重要です。

以下は、言語に適した Zilliz Cloud アナライザーへの推奨マッピングです。このテーブルは、言語検出エンジンの出力と最適なツールの間の架け橋として機能します。

<table>
   <tr>
     <th><p>言語 (Detector Output)</p></th>
     <th><p>Recommended Analyzer</p></th>
     <th><p>Description</p></th>
   </tr>
   <tr>
     <td><p><code>English</code></p></td>
     <td><p><code>type: english</code></p></td>
     <td><p>Standard English tokenization with stemming and stop-word filtering.</p></td>
   </tr>
   <tr>
     <td><p><code>Mandarin</code> (via whatlang) or <code>Chinese</code> (via lingua)</p></td>
     <td><p><code>tokenizer: jieba</code></p></td>
     <td><p>Chinese word segmentation for non-space-delimited text.</p></td>
   </tr>
   <tr>
     <td><p><code>Japanese</code></p></td>
     <td><p><code>tokenizer: icu</code></p></td>
     <td><p>A robust tokenizer for complex scripts, including Japanese.</p></td>
   </tr>
   <tr>
     <td><p><code>French</code></p></td>
     <td><p><code>type: standard</code>, <code>filter: ["lowercase", "asciifolding"]</code></p></td>
     <td><p>A custom configuration that handles French accents and characters.</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

- **Matching is キー:** アナライザーの名前は、検出エンジンの言語出力と**完全に一致する必要があります**。例えば、`whatlang` を使用している場合、中国語テキストのキーは `Mandarin` である必要があります。

- **Best practices:** 上記のテーブルは、いくつかの一般的な言語に対する推奨設定を提供しますが、網羅的なリストではありません。アナライザーの選択に関するより包括的なガイドについては、[Choose the Right Analyzer for Your Use Case](./choose-the-right-analyzer-for-your-use-case) を参照してください。

- **Detector output**: 検出エンジンが返す言語名の完全なリストについては、[Whatlang supported languages table](https://github.com/greyblake/whatlang-rs) および [Lingua supported languages list](https://github.com/pemistahl/lingua-rs) を参照してください。

</Admonition>

### Step 2: Define analyzer_params\{#step-2-define-analyzerparams}

Zilliz Cloud で `language_identifier` トークナイザーを使用するには、以下の主要コンポーネントを含む辞書を作成します：

**Required components:**

- `analyzers` config set – すべてのアナライザー設定を含む辞書で、以下を含む必要があります：

    - `default` – 言語検出が失敗した場合、または一致するアナライザーが見つからない場合に使用されるフォールバック アナライザー

    - **言語固有のアナライザー** – それぞれ `<analyzer_name>: <analyzer_config>` として定義され、ここで：

        - `analyzer_name` は選択した検出エンジンの出力と一致します（例：`"English"`、`"Japanese"`）

        - `analyzer_config` は標準のアナライザー パラメーター形式に従います（[Analyzer Overview](./analyzer-overview#analyzer-types) を参照）

**Optional components:**

- `identifier` – 使用する言語検出エンジンを指定します（`whatlang` または `lingua`）。指定されていない場合、デフォルトは `whatlang` です

- `mapping` – アナライザーのカスタムエイリアスを作成し、検出エンジンの正確な出力形式の代わりに説明的な名前を使用できるようにします

トークナイザーは、まず入力テキストの言語を検出し、次に設定から適切なアナライザーを選択して動作します。検出が失敗した場合、または一致するアナライザーが存在しない場合、自動的に `default` アナライザーにフォールバックします。

#### Recommended: Direct name matching\{#recommended-direct-name-matching}

アナライザー名は、選択した言語検出エンジンの出力と完全に一致する必要があります。このアプローチはよりシンプルで、潜在的な混乱を回避できます。

`whatlang` と `lingua` の両方について、それぞれのドキュメントに示されている言語名を使用します：

- [whatlang supported languages](https://github.com/greyblake/whatlang-rs/blob/master/SUPPORTED_LANGUAGES.md)（「**言語**」列を使用）

- [lingua supported languages](https://github.com/pemistahl/lingua?tab=readme-ov-file#3-which-languages-are-supported)

```python
analyzer_params = {
    "tokenizer": {
        "type": "language_identifier",  # Must be \`language_identifier\`
        "identifier": "whatlang",  # or \`lingua\`
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

#### 代替アプローチ: マッピングによるカスタム名の使用\{#alternative-approach-custom-names-with-mapping}

カスタムアナライザー名を使用したい場合や、既存の設定との互換性を維持する必要がある場合は、`mapping` パラメータを使用できます。これによりアナライザーのエイリアスが作成され、元の検出エンジン名とカスタム名の両方が機能します。

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

`analyzer_params` を定義した後、コレクションスキーマの定義時に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は指定したアナライザーを使用してそのフィールドのテキストを処理し、効率的なトークン化とフィルタリングを行います。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## 例\{#examples}

一般的なシナリオ向けのすぐに使える設定をいくつか紹介します。各例には設定と検証コードの両方が含まれているため、すぐにセットアップをテストできます。

### 英語と中国語の検出\{#english-and-chinese-detection}

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

## 使用上の注意\{#usage-notes}

- **フィールドごとの単一言語:** この機能は、フィールドを単一で均質なテキスト単位として処理します。異なるデータレコード間で異なる言語を扱うように設計されています。例えば、あるレコードが英語の文を含み、次のレコードがフランス語の文を含むといったケースです。

- **複数言語混在文字列の非対応:** 単一の文字列内に複数の言語が混在するケースには**対応していません**。例えば、1つの `VARCHAR` フィールド内に英語の文と日本語の引用句の両方が含まれている場合、その文字列全体が単一の言語として処理されます。

- **主要言語に基づく処理:** 複数言語が混在するシナリオでは、検出エンジンがおそらく主要な言語を特定し、その言語に対応するアナライザーがテキスト全体に適用されます。このため、埋め込まれた外国語テキストについては、トークン化が不十分になるか、まったく行われない可能性があります。

