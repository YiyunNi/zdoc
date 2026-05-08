---
title: "ユースケースに適したアナライザーの選択 | BYOC"
slug: /choose-the-right-analyzer-for-your-use-case
sidebar_key: choose-the-right-analyzer-for-your-use-case
sidebar_label: "ベストプラクティス"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud でテキストコンテンツに最適なアナライザーを選択・設定する方法を説明します。 | BYOC"
type: origin
token: Pulhw06e5iXJTFkidFXcGbylnod
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - アナライザー
  - ベスト
  - プラクティス

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# ユースケースに適したアナライザーの選択

このガイドでは、Zilliz Cloud でテキストコンテンツに最も適した **アナライザー** を選択および構成する方法を説明します。

本ガイドは **実用的な意思決定** に焦点を当てています：どのアナライザーを使用するか、いつカスタマイズするか、および構成を確認する方法について説明します。アナライザーのコンポーネントとパラメータの背景については、[アナライザーの概要](./analyzer-overview) を参照してください。

## クイックコンセプト：アナライザーの仕組み\{#quick-concept-how-analyzers-work}

アナライザーは、[全文検索](./full-text-search)（BM25 ベース）、[フレーズ一致](./phrase-match)、または [テキスト一致](./text-match) などの機能で検索可能になるようにテキストデータを処理します。2段階のパイプラインを通じて、生のテキストを個別の検索可能なトークンに変換します。

![JwMZwIYUwhbSZ4bjhxcc1PfNnvx](https://zdoc-images.s3.us-west-2.amazonaws.com/JwMZwIYUwhbSZ4bjhxcc1PfNnvx.png)

1. **トークン化（必須）：** この初期段階では、**トークナイザー** を適用して、連続したテキスト文字列をトークンと呼ばれる個別の意味のある単位に分割します。トークン化の方法は、言語やコンテンツの種類によって大きく異なる場合があります。

1. **トークンフィルタリング（オプション）：** トークン化後、**フィルター** を適用してトークンを変更、削除、または絞り込みます。これらの操作には、すべてのトークンを小文字に変換する、一般的な意味のない単語（ストップワードなど）を削除する、または単語を語幹に還元する（ステミング）などが含まれます。

例：

```plaintext
Input: "Hello World!" 
       1. Tokenization → ["Hello", "World", "!"]
       2. Lowercase & Punctuation Filtering → ["hello", "world"]
```

## アナライザーの選択が重要な理由\{#why-the-choice-of-analyzer-matters}

選択するアナライザーは、**検索の品質と関連性**に直接影響します。

不適切なアナライザーは、過剰なトークン化や不十分なトークン化、用語の欠落、または不関連な結果を引き起こす可能性があります。

<table>
   <tr>
     <th><p>問題</p></th>
     <th><p>症状</p></th>
     <th><p>例（入力と出力）</p></th>
     <th><p>原因（不適切なアナライザー）</p></th>
     <th><p>ソリューション（適切なアナライザー）</p></th>
   </tr>
   <tr>
     <td><p>過剰なトークン化</p></td>
     <td><p>技術用語、識別子、または URL が誤って分割される</p></td>
     <td><ul><li><p><code>"user_id"</code> → <code>['user', 'id']</code></p></li><li><p><code>"C++"</code> → <code>['c']</code></p></li></ul></td>
     <td><p><a href="./standard-analyzer"><code>standard</code></a> アナライザー</p></td>
     <td><p><a href="./whitespace-tokenizer"><code>whitespace</code></a> トークナイザーを使用し、<a href="./alphanumonly-filter"><code>alphanumonly</code></a> フィルターと組み合わせる。</p></td>
   </tr>
   <tr>
     <td><p>不十分なトークン化</p></td>
     <td><p>複数単語のフレーズが単一のトークンとして扱われる</p></td>
     <td><p><code>"state-of-the-art"</code> → <code>['state-of-the-art']</code></p></td>
     <td><p><a href="./whitespace-tokenizer"><code>whitespace</code></a> トークナイザーを持つアナライザー</p></td>
     <td><p><a href="./standard-tokenizer"><code>standard</code></a> トークナイザーを使用して句読点とスペースで分割する。カスタム <a href="./regex-filter">regex</a> フィルターを使用する。</p></td>
   </tr>
   <tr>
     <td><p>言語の不一致</p></td>
     <td><p>外国語の結果が意味をなさない</p></td>
     <td><p>中国語テキスト: <code>"机器学习"</code> → <code>['机器学习']</code>（1 トークン）</p></td>
     <td><p><a href="./english-analyzer"><code>english</code></a> アナライザー</p></td>
     <td><p><a href="./chinese-analyzer"><code>chinese</code></a> など、言語固有のアナライザーを使用する。</p></td>
   </tr>
</table>

## ステップ 1: アナライザーを選択する必要があるか\{#step-1-do-you-need-to-choose-an-analyzer}

テキスト検索機能（例: **全文検索**、**フレーズ一致**、または **テキスト一致**）を使用しているが、**アナライザーを明示的に指定していない**場合、

Zilliz Cloud は自動的に [標準アナライザー](./standard-analyzer) を適用します。

**標準アナライザーの動作**:

- テキストをスペースと句読点で分割する

- すべてのトークンを小文字に変換する

**変換例**:

```plaintext
Input:  "The Milvus vector database is built for scale!"
Output: ['the', 'milvus', 'vector', 'database', 'is', 'built', 'for', 'scale']
```

## Step 2: 標準アナライザーが要件を満たすか確認する\{#step-2-check-if-the-standard-analyzer-meets-your-needs}

この表を使用して、デフォルトの [`standard`](./standard-analyzer)[ アナライザー](./standard-analyzer) が要件を満たすかどうかを迅速に判断してください。満たさない場合は、[別の方法を選択する](./choose-the-right-analyzer-for-your-use-case#step-3-choose-your-path) 必要があります。

<table>
   <tr>
     <th><p>Your Content</p></th>
     <th><p>Standard Analyzer OK?</p></th>
     <th><p>Why</p></th>
     <th><p>What You Need</p></th>
   </tr>
   <tr>
     <td><p>English blog posts</p></td>
     <td><p>✅ Yes</p></td>
     <td><p>Default behavior is sufficient.</p></td>
     <td><p>Use the default (no configuration needed).</p></td>
   </tr>
   <tr>
     <td><p>Chinese documents</p></td>
     <td><p>❌ No</p></td>
     <td><p>Chinese words have no spaces and will be treated as one token.</p></td>
     <td><p>Use a built-in <a href="./chinese-analyzer"><code>chinese</code></a> analyzer.</p></td>
   </tr>
   <tr>
     <td><p>Technical documentation</p></td>
     <td><p>❌ No</p></td>
     <td><p>Punctuation is stripped from terms like <code>C++</code>.</p></td>
     <td><p>Create a custom analyzer with a <a href="./whitespace-tokenizer"><code>whitespace</code></a> tokenizer and an <a href="./alphanumonly-filter"><code>alphanumonly</code></a> filter.</p></td>
   </tr>
   <tr>
     <td><p>Space-separated languages such as French/Spanish text</p></td>
     <td><p>⚠️ Maybe</p></td>
     <td><p>Accented characters (<code>café</code> vs. <code>cafe</code>) may not match.</p></td>
     <td><p>A custom analyzer with the <a href="./ascii-folding-filter"><code>asciifolding</code></a> is recommended for better results.</p></td>
   </tr>
   <tr>
     <td><p>Multilingual or unknown languages</p></td>
     <td><p>❌ No</p></td>
     <td><p>The <code>standard</code> analyzer lacks the language-specific logic needed to handle different character sets and tokenization rules.</p></td>
     <td><p>Use a custom analyzer with the <a href="./icu-tokenizer"><code>icu</code></a> tokenizer for unicode-aware tokenization. </p><p>Alternatively, consider configuring <a href="./multi-language-analyzers">多言語アナライザーs</a> or a <a href="./language-identifier-tokenizer">言語識別子</a> for more precise handling of multilingual content.</p></td>
   </tr>
</table>

## Step 3: 方法を選択する\{#step-3-choose-your-path}

デフォルトの [standard アナライザー](./standard-analyzer) が不十分な場合、2つの方法から1つを選択してください。

- **方法 A – 組み込みアナライザーを使用する**（すぐに使用可能、言語固有）

- **方法 B – カスタムアナライザーを作成する**（トークナイザー + フィルターのセットを手動で定義）

### 方法 A: 組み込みアナライザーを使用する\{#path-a-use-built-in-analyzers}

組み込みアナライザーは、一般的な言語向けの事前設定済みソリューションです。デフォルトの standard アナライザーが完全に適合しない場合に、最も簡単に始められる方法です。

#### 利用可能な組み込みアナライザー\{#available-built-in-analyzers}

<table>
   <tr>
     <th><p>Analyzer</p></th>
     <th><p>言語 Support</p></th>
     <th><p>Components</p></th>
     <th><p>Notes</p></th>
   </tr>
   <tr>
     <td><p><a href="./standard-analyzer"><code>standard</code></a></p></td>
     <td><p>Most space-separated languages (English, French, German, Spanish, etc.)</p></td>
     <td><ul><li><p>トークナイザー: <code>standard</code></p></li><li><p>フィルター: <code>lowercase</code></p></li></ul></td>
     <td><p>一般-purpose analyzer for initial text processing. For monolingual scenarios, language-specific analyzers (like <code>english</code>) provide better performance.</p></td>
   </tr>
   <tr>
     <td><p><a href="./english-analyzer"><code>english</code></a></p></td>
     <td><p>Dedicated to English, which applies stemming and stop word removal for better English semantic matching</p></td>
     <td><ul><li><p>トークナイザー: <code>standard</code></p></li><li><p>フィルター: <code>lowercase</code>, <code>stemmer</code>, <code>stop</code></p></li></ul></td>
     <td><p>Recommended for English-only content over <code>standard</code>.</p></td>
   </tr>
   <tr>
     <td><p><a href="./chinese-analyzer"><code>chinese</code></a></p></td>
     <td><p>Chinese</p></td>
     <td><ul><li><p>トークナイザー: <code>jieba</code></p></li><li><p>フィルター: <code>cnalphanumonly</code></p></li></ul></td>
     <td><p>Currently uses Simplified Chinese dictionary by default.</p></td>
   </tr>
</table>

#### 実装例\{#implementation-example}

組み込みアナライザーを使用するには、フィールドスキーマを定義する際に `analyzer_params` でそのタイプを指定するだけです。

```python
# Using built-in English analyzer
analyzer_params = {
    "type": "english"
}

# Applying analyzer config to target VARCHAR field in your collection schema
schema.add_field(
    field_name='text',
    datatype=DataType.VARCHAR,
    max_length=200,
    enable_analyzer=True,
    # highlight-next-line
    analyzer_params=analyzer_params,
)
```

<Admonition type="info" icon="📘" title="Notes">

詳細な使用方法については、[全文検索](./full-text-search)、[テキストマッチ](./text-match)、または[フレーズマッチ](./phrase-match)を参照してください。

</Admonition>

### Path B: カスタムアナライザーの作成\{#path-b-create-a-custom-analyzer}

[ビルトイン](./choose-the-right-analyzer-for-your-use-case#available-built-in-analyzers)[オプション](./choose-the-right-analyzer-for-your-use-case#available-built-in-analyzers)でニーズが満たされない場合は、トークナイザーとフィルターのセットを組み合わせてカスタムアナライザーを作成できます。これにより、テキスト処理パイプラインを完全に制御できます。

#### Step 1: 言語に基づいてトークナイザーを選択する\{#step-1-select-the-tokenizer-based-on-language}

コンテンツの主要な言語に基づいてトークナイザーを選択してください：

##### 西洋言語\{#western-languages}

スペース区切りの言語では、以下のオプションがあります：

<table>
   <tr>
     <th><p>トークナイザー</p></th>
     <th><p>How It Works</p></th>
     <th><p>Best For</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p><a href="./standard-tokenizer"><code>standard</code></a></p></td>
     <td><p>スペースと句読点に基づいてテキストを分割</p></td>
     <td><p>一般テキスト、混在する句読点</p></td>
     <td><ul><li><p>Input: <code>"Hello, world! Visit example.com"</code></p></li><li><p>Output: <code>['Hello', 'world', 'Visit', 'example', 'com']</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./whitespace-tokenizer"><code>whitespace</code></a></p></td>
     <td><p>空白文字のみで分割</p></td>
     <td><p>前処理済みコンテンツ、ユーザーがフォーマットしたテキスト</p></td>
     <td><ul><li><p>Input: <code>"user_id = get_user_data()"</code></p></li><li><p>Output: <code>['user_id', '=', 'get_user_data()']</code></p></li></ul></td>
   </tr>
</table>

##### 東アジア言語\{#east-asian-languages}

辞書ベースの言語では、適切な単語分割のために専用のトークナイザーが必要です：

###### 中国語\{#chinese}

<table>
   <tr>
     <th><p>トークナイザー</p></th>
     <th><p>How It Works</p></th>
     <th><p>Best For</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p><a href="./jieba-tokenizer"><code>jieba</code></a></p></td>
     <td><p>中国語辞書ベースの分割とインテリジェントアルゴリズム</p></td>
     <td><p><strong>中国語コンテンツに推奨</strong> - 辞書とインテリジェントアルゴリズムを組み合わせ、中国語専用に設計</p></td>
     <td><ul><li><p>Input: <code>"机器学习是人工智能的一个分支"</code></p></li><li><p>Output: <code>['机器', '学习', '是', '人工', '智能', '人工智能', '的', '一个', '分支']</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./lindera-tokenizer"><code>lindera</code></a></p></td>
     <td><p>中国語辞書（<a href="https://cc-cedict.org/wiki/">cc-cedict</a>）を使用した純粋な辞書ベースの形態素解析</p></td>
     <td><p><code>jieba</code>と比較して、より一般的な方法で中国語テキストを処理</p></td>
     <td><ul><li><p>Input: <code>"机器学习算法"</code></p></li><li><p>Output: <code>["机器", "学习", "算法"]</code></p></li></ul></td>
   </tr>
</table>

###### 日本語と韓国語\{#japanese-and-korean}

<table>
   <tr>
     <th><p>言語</p></th>
     <th><p>トークナイザー</p></th>
     <th><p>Dictionary Options</p></th>
     <th><p>Best For</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p>Japanese</p></td>
     <td><p><a href="./lindera-tokenizer"><code>lindera</code></a></p></td>
     <td><p><a href="https://taku910.github.io/mecab/">ipadic</a>（汎用）、<a href="https://github.com/neologd/mecab-ipadic-neologd">ipadic-neologd</a>（現代用語）、<a href="https://clrd.ninjal.ac.jp/unidic/">unidic</a>（学術）</p></td>
     <td><p>固有名詞処理を伴う形態素解析</p></td>
     <td><ul><li><p>Input: <code>"東京都渋谷区"</code></p></li><li><p>Output: <code>["東京", "都", "渋谷", "区"]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p>Korean</p></td>
     <td><p><a href="./lindera-tokenizer"><code>lindera</code></a></p></td>
     <td><p><a href="https://bitbucket.org/eunjeon/mecab-ko-dic/src/master/">ko-dic</a></p></td>
     <td><p>韓国語の形態素解析</p></td>
     <td><ul><li><p>Input: <code>"안녕하세요"</code></p></li><li><p>Output: <code>["안녕", "하", "세요"]</code></p></li></ul></td>
   </tr>
</table>

##### 多言語または不明な言語\{#multilingual-or-unknown-languages}

言語が予測不可能であるか、ドキュメント内で混在しているコンテンツの場合：

<table>
   <tr>
     <th><p>トークナイザー</p></th>
     <th><p>How It Works</p></th>
     <th><p>Best For</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p><a href="./icu-tokenizer"><code>icu</code></a></p></td>
     <td><p>Unicode対応のトークン化（International Components for Unicode）</p></td>
     <td><p>混在するスクリプト、不明な言語、または単純なトークン化で十分な場合</p></td>
     <td><ul><li><p>Input: <code>"Hello 世界 مرحبا"</code></p></li><li><p>Output: <code>['Hello', ' ', '世界', ' ', 'مرحبا']</code></p></li></ul></td>
   </tr>
</table>

**icuを使用する場合**：

- 言語識別が実用的でない混在言語。

- [多言語アナライザー](./multi-language-analyzers)や[言語識別子](./language-identifier-tokenizer)のオーバーヘッドを避けたい場合。

- 主要な言語があり、全体の意味にほとんど寄与しない外国語の単語が散発的に含まれるコンテンツ（例：日本語やフランス語のブランド名や技術用語が散発的に含まれる英語テキスト）。

**代替アプローチ**：多言語コンテンツをより正確に処理するには、多言語アナライザーまたは言語識別子の使用を検討してください。詳細については、[多言語アナライザー](./multi-language-analyzers)または[言語識別子](./language-identifier-tokenizer)を参照してください。

#### Step 2: 精度のためのフィルターを追加する\{#step-2-add-filters-for-precision}

[トークナイザーの選択](./choose-the-right-analyzer-for-your-use-case#step-1-select-the-tokenizer-based-on-language)後、特定の検索要件とコンテンツの特性に基づいてフィルターを適用します。

##### 一般的に使用されるフィルター\{#commonly-used-filters}

これらのフィルターは、ほとんどのスペース区切り言語設定（英語、フランス語、ドイツ語、スペイン語など）に不可欠であり、検索品質を大幅に向上させます：

<table>
   <tr>
     <th><p>Filter</p></th>
     <th><p>How It Works</p></th>
     <th><p>When to Use</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p><a href="./lowercase-filter"><code>lowercase</code></a></p></td>
     <td><p>すべてのトークンを小文字に変換</p></td>
     <td><p>普遍的 - 大文字小文字の区別があるすべての言語に適用</p></td>
     <td><ul><li><p>Input: <code>["Apple", "iPhone"]</code></p></li><li><p>Output: <code>[['apple'], ['iphone']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./stemmer-filter"><code>stemmer</code></a></p></td>
     <td><p>単語を語幹に還元</p></td>
     <td><p>単語の屈折がある言語（英語、フランス語、ドイツ語など）</p></td>
     <td><p>英語の場合：</p><ul><li><p>Input: <code>["running", "runs", "ran"]</code></p></li><li><p>Output: <code>[['run'], ['run'], ['ran']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./stop-filter"><code>stop</code></a></p></td>
     <td><p>一般的な意味のない単語を削除</p></td>
     <td><p>ほとんどの言語 - 特にスペース区切りの言語で効果的</p></td>
     <td><ul><li><p>Input: <code>["the", "quick", "brown", "fox"]</code></p></li><li><p>Output: <code>[[], ['quick'], ['brown'], ['fox']]</code></p></li></ul></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

東アジア言語（中国語、日本語、韓国語など）では、代わりに[言語固有のフィルター](./choose-the-right-analyzer-for-your-use-case#language-specific-filters)に焦点を当ててください。これらの言語では、通常、テキスト処理に異なるアプローチを使用し、ステミングから大きな利益を得られない場合があります。

</Admonition>

##### テキスト正規化フィルター\{#text-normalization-filters}

これらのフィルターは、テキストのバリエーションを標準化して、マッチングの一貫性を向上させます：

<table>
   <tr>
     <th><p>Filter</p></th>
     <th><p>How It Works</p></th>
     <th><p>When to Use</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p><a href="./ascii-folding-filter"><code>asciifolding</code></a></p></td>
     <td><p>アクセント付き文字をASCII相当の文字に変換</p></td>
     <td><p>国際的なコンテンツ、ユーザー生成コンテンツ</p></td>
     <td><ul><li><p>Input: <code>["café", "naïve", "résumé"]</code></p></li><li><p>Output: <code>[['cafe'], ['naive'], ['resume']]</code></p></li></ul></td>
   </tr>
</table>

##### トークン フィルタリング\{#token-filtering}

文字コンテンツまたは長さに基づいて、どのトークンを保持するかを制御します：

<table>
   <tr>
     <th><p>Filter</p></th>
     <th><p>How It Works</p></th>
     <th><p>When to Use</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p><a href="./remove-punct-filter"><code>removepunct</code></a></p></td>
     <td><p>単独の句読点トークンを削除</p></td>
     <td><p><code>jieba</code>、<code>lindera</code>、<code>icu</code>トークナイザーからの出力をクリーンアップ。これらは句読点を単一トークンとして返します</p></td>
     <td><ul><li><p>Input: <code>["Hello", "!", "world"]</code></p></li><li><p>Output: <code>[['Hello'], ['world']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./alphanumonly-filter"><code>alphanumonly</code></a></p></td>
     <td><p>文字と数字のみを保持</p></td>
     <td><p>技術的なコンテンツ、クリーンなテキスト処理</p></td>
     <td><ul><li><p>Input: <code>["user123", "test@email.com"]</code></p></li><li><p>Output: <code>[['user123'], ['test', 'email', 'com']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./length-filter"><code>length</code></a></p></td>
     <td><p>指定された長さの範囲外のトークンを削除</p></td>
     <td><p>ノイズの除去（過度に長いトークン）</p></td>
     <td><ul><li><p>Input: <code>["a", "very", "extraordinarily"]</code></p></li><li><p>Output: <code>[['a'], ['very'], []]</code>（<strong>max=10</strong>の場合）</p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./regex-filter"><code>regex</code></a></p></td>
     <td><p>カスタムパターンに基づくフィルタリング</p></td>
     <td><p>ドメイン固有のトークン要件</p></td>
     <td><ul><li><p>Input: <code>["test123", "prod456"]</code></p></li><li><p>Output: <code>[[], ['prod456']]</code>（<strong>expr="^prod"</strong>の場合）</p></li></ul></td>
   </tr>
</table>

##### 言語固有のフィルター\{#language-specific-filters}

これらのフィルターは、特定の言語の特性を処理します：

<table>
   <tr>
     <th><p>Filter</p></th>
     <th><p>言語</p></th>
     <th><p>How It Works</p></th>
     <th><p>Examples</p></th>
   </tr>
   <tr>
     <td><p><a href="./decompounder-filter"><code>decompounder</code></a></p></td>
     <td><p>German</p></td>
     <td><p>複合語を検索可能な構成要素に分割</p></td>
     <td><ul><li><p>Input: <code>["dampfschifffahrt"]</code></p></li><li><p>Output: <code>[['dampf', 'schiff', 'fahrt']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./cnalphanumonly-filter">cnalphanumonly</a></p></td>
     <td><p>Chinese</p></td>
     <td><p>中国語文字と英数字を保持</p></td>
     <td><ul><li><p>Input: <code>["Hello", "世界", "123", "!@#"]</code></p></li><li><p>Output: <code>[['Hello'], ['世界'], ['123'], []]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./cncharonly-filter"><code>cncharonly</code></a></p></td>
     <td><p>Chinese</p></td>
     <td><p>中国語文字のみを保持</p></td>
     <td><ul><li><p>Input: <code>["Hello", "世界", "123"]</code></p></li><li><p>Output: <code>[[], ['世界'], []]</code></p></li></ul></td>
   </tr>
</table>

#### Step 3: 組み合わせて実装する\{#step-3-combine-and-implement}

カスタムアナライザーを作成するには、`analyzer_params` ディクショナリでトークナイザーとフィルターのリストを定義します。フィルターは、リストされた順序で適用されます。

```python
# Example: A custom analyzer for technical content
analyzer_params = {
    "tokenizer": "whitespace",
    "filter": ["lowercase", "alphanumonly"]
}

# Applying analyzer config to target VARCHAR field in your collection schema
schema.add_field(
    field_name='text',
    datatype=DataType.VARCHAR,
    max_length=200,
    enable_analyzer=True,
    # highlight-next-line
    analyzer_params=analyzer_params,
)
```

#### 最終確認：`run_analyzer` でのテスト\{#final-test-with-runanalyzer}

コレクションに適用する前に、常に設定を検証してください：

```python
# Sample text to analyze
sample_text = "The Milvus vector database is built for scale!"

# Run analyzer with the defined configuration
result = client.run_analyzer(sample_text, analyzer_params)
print("Analyzer output:", result)
```

確認すべき一般的な問題:

- **過剰なトークン化**: 技術用語が誤って分割される

- **不十分なトークン化**: フレーズが適切に分離されない

- **欠落しているトークン**: 重要な用語がフィルタリングされる

詳細な使用方法については、[run_analyzer](https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/CollectionSchema/run_analyzer.md) を参照してください。

## ユースケース別のクイックレシピ\{#quick-recipes-by-use-case}

このセクションでは、Zilliz Cloud でアナライザーを使用する際の一般的なユースケースに対する、推奨されるトークナイザーとフィルターの構成を提供します。コンテンツの種類と検索要件に最も適合する組み合わせを選択してください。

<Admonition type="info" icon="📘" title="Notes">

コレクションにアナライザーを適用する前に、テキスト分析のパフォーマンスをテストおよび検証するために [`run_analyzer`](https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/CollectionSchema/run_analyzer.md) を使用することをお勧めします。

</Admonition>

### English\{#english}

```json
analyzer_params = {
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stemmer",
            "language": "english"
        },
        {
            "type": "stop",
            "stop_words": [
                "_english_"
            ]
        }
    ]
}
```

### 中国語\{#chinese}

```json
{
    "tokenizer": "jieba",
    "filter": ["cnalphanumonly"]
}
```

### アラビア語\{#arabic}

```python
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stemmer",
            "language": "arabic"
        }
    ]
}
```

### ベンガル語\{#bengali}

```python
{
    "tokenizer": "icu",
    "filter": ["lowercase", {
        "type": "stop",
        "stop_words": [<put stop words list here>]
    }]
}
```

### フランス語\{#french}

```json
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stemmer",
            "language": "french"
        },
        {
            "type": "stop",
            "stop_words": [
                "_french_"
            ]
        }
    ]
}
```

### ドイツ語\{#german}

```json
{
    "tokenizer": {
        "type": "lindera",
        "dict_kind": "ipadic"
    },
    "filter": [
        "removepunct"
    ]
}
```

### हिन्दी\{#hindi}

```json
{
    "tokenizer": "icu",
    "filter": ["lowercase", {
        "type": "stop",
        "stop_words": [<put stop words list here>]
    }]
}
```

### 韓国語\{#korean}

```json
{
    "tokenizer": {
        "type": "lindera",
        "dict_kind": "ko-dic",
        "filter": [
            {
                "kind": "korean_stop_tags",
                "tags": ["SP", "SSC", "SSO", "SC", "SE", "SF", "JKS", "JKC", "JKG", "JKO", "JKB", "JKV", "JKQ", "JX", "JC", "UNK", "EP", "ETM"]
            }
        ]
    }
}
```

### Japanese\{#japanese}

```json
{
    "tokenizer": {
        "type": "lindera",
        "dict_kind": "ipadic"
    },
    "filter": [
        "removepunct"
    ]
}
```

ポルトガル語\{#portuguese}

```json
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stemmer",
            "language": "portuguese"
        },
        {
            "type": "stop",
            "stop_words": [
                "_portuguese_"
            ]
        }
    ]
}
```

### ロシア語\{#russian}

```json
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stemmer",
            "language": "russian"
        },
        {
            "type": "stop",
            "stop_words": [
                "_russian_"
            ]
        }
    ]
}
```

### スペイン語\{#spanish}

```json
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stemmer",
            "language": "spanish"
        },
        {
            "type": "stop",
            "stop_words": [
                "_spanish_"
            ]
        }
    ]
}
```

### スワヒリ語\{#swahili}

```json
{
    "tokenizer": "standard",
    "filter": ["lowercase", {
        "type": "stop",
        "stop_words": [<put stop words list here>]
    }]
}
```

### トルコ語\{#turkish}

```json
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stemmer",
            "language": "turkish"
        }
    ]
}
```

### Urdu\{#urdu}

```json
{
    "tokenizer": "icu",
    "filter": ["lowercase", {
        "type": "stop",
        "stop_words": [<put stop words list here>]
    }]
}
```

### 混合または多言語コンテンツ\{#mixed-or-multilingual-content}

複数の言語にまたがるコンテンツや、スクリプトが予測不能に使用されるコンテンツを扱う場合は、`icu` アナライザーから開始してください。この Unicode 対応アナライザーは、混合スクリプトや記号を効果的に処理します。

**基本的な多言語設定（ステミングなし）**:

```python
analyzer_params = {
    "tokenizer": "icu",
    "filter": ["lowercase", "asciifolding"]
}
```

**高度な多言語処理**:

異なる言語間でのトークン動作をより細かく制御するには:

- **多言語アナライザー**の設定を使用します。詳細については、[多言語アナライザー](./multi-language-analyzers) を参照してください。

- コンテンツに**言語識別子**を実装します。詳細については、[言語識別子](./language-identifier-tokenizer) を参照してください。

## Zilliz Cloud でアナライザーを設定およびプレビューする\{#configure-and-preview-analyzers-in-zilliz-cloud}

Zilliz Cloud では、[Zilliz Cloud](https://cloud.zilliz.com/) [コンソール](https://cloud.zilliz.com/)から直接テキストアナライザーの設定とテストを行うことができ、コードを書く必要はありません。

<Supademo id="cmfxfue5c41ld10k86la66x1v" title=""  />

