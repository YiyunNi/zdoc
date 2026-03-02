---
title: "ユースケースに合ったアナライザーの選択 | BYOC"
slug: /choose-the-right-analyzer-for-your-use-case
sidebar_label: "ベストプラクティス"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloudでテキストコンテンツに最適なアナライザーを選択し、設定する方法について説明します。 | BYOC"
type: origin
token: Pulhw06e5iXJTFkidFXcGbylnod
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - コレクション
  - スキーマ
  - アナライザー
  - ベスト
  - プラクティス
  - ベクトルデータベース
  - IVF
  - knn
  - 画像検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# ユースケースに適したアナライザーを選択する

このガイドでは、Zilliz Cloud のテキストコンテンツに最適な**アナライザー**を選択し、設定する方法について説明します。

**実用的な意思決定**に焦点を当てています。つまり、どのアナライザーを使用するか、いつカスタマイズするか、そして設定を検証する方法です。アナライザーのコンポーネントとパラメーターの背景については、[アナライザーの概要](./analyzer-overview)を参照してください。

## クイックコンセプト：アナライザーの仕組み{#quick-concept-how-analyzers-work}

アナライザーは、[フルテキスト検索](./full-text-search) (BM25ベース)、[フレーズマッチ](./phrase-match)、または[テキストマッチ](./text-match)などの機能で検索可能になるように、テキストデータを処理します。生テキストを2段階のパイプラインで個別の検索可能なトークンに変換します。

![JwMZwIYUwhbSZ4bjhxcc1PfNnvNnvx](https://zdoc-images.s3.us-west-2.amazonaws.com/JwMZwIYUwhbSZ4bjhxcc1PfNnvx.png)

1. **トークン化 (必須):** この初期段階では、**トークナイザー**を適用して、連続したテキスト文字列を個別の意味のある単位であるトークンに分割します。トークン化の方法は、言語やコンテンツの種類によって大きく異なります。

1. **トークンフィルタリング (オプション):** トークン化の後、トークンを変更、削除、または洗練するために**フィルター**が適用されます。これらの操作には、すべてのトークンを小文字に変換する、一般的な意味のない単語 (ストップワードなど) を削除する、または単語を語根形式に還元する (ステミング) などがあります。

例:

```plaintext
Input: "Hello World!" 
       1. Tokenization → ["Hello", "World", "!"]
       2. Lowercase & Punctuation Filtering → ["hello", "world"]
```

## アナライザーの選択が重要な理由{#why-the-choice-of-analyzer-matters}

選択するアナライザーは、**検索の品質と関連性**に直接影響します。

不適切なアナライザーは、トークン化の不足または過剰、用語の欠落、あるいは無関係な結果を引き起こす可能性があります。

<table>
   <tr>
     <th><p>問題</p></th>
     <th><p>症状</p></th>
     <th><p>例 (入力 & 出力)</p></th>
     <th><p>原因 (不適切なアナライザー)</p></th>
     <th><p>解決策 (適切なアナライザー)</p></th>
   </tr>
   <tr>
     <td><p>過剰なトークン化</p></td>
     <td><p>技術用語、識別子、またはURLが不適切に分割される</p></td>
     <td><ul><li><p><code>"user_id"</code> → <code>['user', 'id']</code></p></li><li><p><code>"C++"</code> → <code>['c']</code></p></li></ul></td>
     <td><p><a href="./standard-analyzer"><code>standard</code></a> アナライザー</p></td>
     <td><p><a href="./whitespace-tokenizer"><code>whitespace</code></a> トークナイザーを使用し、<a href="./alphanumonly-filter"><code>alphanumonly</code></a> フィルターと組み合わせる。</p></td>
   </tr>
   <tr>
     <td><p>トークン化の不足</p></td>
     <td><p>複数単語のフレーズが単一のトークンとして扱われる</p></td>
     <td><p><code>"state-of-the-art"</code> → <code>['state-of-the-art']</code></p></td>
     <td><p><a href="./whitespace-tokenizer"><code>whitespace</code></a> トークナイザーを持つアナライザー</p></td>
     <td><p><a href="./standard-tokenizer"><code>standard</code></a> トークナイザーを使用して句読点とスペースで分割し、カスタムの<a href="./regex-filter">regex</a>フィルターを使用する。</p></td>
   </tr>
   <tr>
     <td><p>言語の不一致</p></td>
     <td><p>外国語の結果が無意味になる</p></td>
     <td><p>中国語テキスト: <code>"机器学习"</code> → <code>['机器学习']</code> (1トークン)</p></td>
     <td><p><a href="./english-analyzer"><code>english</code></a> アナライザー</p></td>
     <td><p><a href="./chinese-analyzer"><code>chinese</code></a>のような言語固有のアナライザーを使用する。</p></td>
   </tr>
</table>

## ステップ1: アナライザーを選択する必要がありますか？{#step-1-do-you-need-to-choose-an-analyzer}

テキスト検索機能（例：**full text search**、**phrase match**、または**text match**）を使用しているが、**アナライザーを明示的に指定しない**場合、

Zilliz Cloudは自動的に[standard analyzer](./standard-analyzer)を適用します。

**Standard analyzerの動作**:

- スペースと句読点でテキストを分割します。

- すべてのトークンを小文字に変換します。

**変換例**:

```plaintext
Input:  "The Milvus vector database is built for scale!"
Output: ['the', 'milvus', 'vector', 'database', 'is', 'built', 'for', 'scale']
```

## ステップ2：標準アナライザーがニーズを満たしているか確認する{#step-2-check-if-the-standard-analyzer-meets-your-needs}

この表を使用して、デフォルトの[`standard`](./standard-analyzer)[アナライザー](./standard-analyzer)がニーズを満たしているかどうかをすばやく判断してください。満たしていない場合は、[別のパスを選択する](./choose-the-right-analyzer-for-your-use-case#step-3-choose-your-path)必要があります。

<table>
   <tr>
     <th><p>コンテンツ</p></th>
     <th><p>標準アナライザーでOK？</p></th>
     <th><p>理由</p></th>
     <th><p>必要なもの</p></th>
   </tr>
   <tr>
     <td><p>英語のブログ記事</p></td>
     <td><p>✅ はい</p></td>
     <td><p>デフォルトの動作で十分です。</p></td>
     <td><p>デフォルトを使用します（設定不要）。</p></td>
   </tr>
   <tr>
     <td><p>中国語のドキュメント</p></td>
     <td><p>❌ いいえ</p></td>
     <td><p>中国語の単語にはスペースがなく、1つのトークンとして扱われます。</p></td>
     <td><p>組み込みの<a href="./chinese-analyzer"><code>chinese</code></a>アナライザーを使用します。</p></td>
   </tr>
   <tr>
     <td><p>技術文書</p></td>
     <td><p>❌ いいえ</p></td>
     <td><p><code>C++</code>のような用語から句読点が削除されます。</p></td>
     <td><p><a href="./whitespace-tokenizer"><code>whitespace</code></a>トークナイザーと<a href="./alphanumonly-filter"><code>alphanumonly</code></a>フィルターを使用してカスタムアナライザーを作成します。</p></td>
   </tr>
   <tr>
     <td><p>フランス語/スペイン語などのスペース区切り言語</p></td>
     <td><p>⚠️ 場合による</p></td>
     <td><p>アクセント付き文字（<code>café</code>と<code>cafe</code>）が一致しない場合があります。</p></td>
     <td><p>より良い結果を得るには、<a href="./ascii-folding-filter"><code>asciifolding</code></a>フィルターを使用したカスタムアナライザーをお勧めします。</p></td>
   </tr>
   <tr>
     <td><p>多言語または不明な言語</p></td>
     <td><p>❌ いいえ</p></td>
     <td><p><code>standard</code>アナライザーには、異なる文字セットやトークン化ルールを処理するために必要な言語固有のロジックがありません。</p></td>
     <td><p>Unicode対応のトークン化には、<a href="./icu-tokenizer"><code>icu</code></a>トークナイザーを使用したカスタムアナライザーを使用します。</p><p>または、多言語コンテンツをより正確に処理するために、<a href="./multi-language-analyzers">多言語アナライザー</a>または<a href="./language-identifier-tokenizer">言語識別子</a>の設定を検討してください。</p></td>
   </tr>
</table>

## ステップ3：パスを選択する{#step-3-choose-your-path}

デフォルトの[standard analyzer](./standard-analyzer)で不十分な場合は、次の2つのパスのいずれかを選択します。

- **パスA – 組み込みアナライザーを使用する**（すぐに使える、言語固有）

- **パスB – カスタムアナライザーを作成する**（トークナイザーと一連のフィルターを手動で定義する）

### パスA：組み込みアナライザーを使用する{#path-a-use-built-in-analyzers}

組み込みアナライザーは、一般的な言語向けに事前設定されたソリューションです。デフォルトの標準アナライザーが完全に適合しない場合に、最も簡単に始めることができます。

#### 利用可能な組み込みアナライザー{#available-built-in-analyzers}

<table>
   <tr>
     <th><p>アナライザー</p></th>
     <th><p>言語サポート</p></th>
     <th><p>コンポーネント</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p><a href="./standard-analyzer"><code>standard</code></a></p></td>
     <td><p>ほとんどのスペース区切り言語（英語、フランス語、ドイツ語、スペイン語など）</p></td>
     <td><ul><li><p>トークナイザー：<code>standard</code></p></li><li><p>フィルター：<code>lowercase</code></p></li></ul></td>
     <td><p>初期テキスト処理用の汎用アナライザーです。単一言語のシナリオでは、言語固有のアナライザー（<code>english</code>など）の方が優れたパフォーマンスを発揮します。</p></td>
   </tr>
   <tr>
     <td><p><a href="./english-analyzer"><code>english</code></a></p></td>
     <td><p>英語専用で、より良い英語のセマンティックマッチングのためにステミングとストップワード除去を適用します。</p></td>
     <td><ul><li><p>トークナイザー：<code>standard</code></p></li><li><p>フィルター：<code>lowercase</code>、<code>stemmer</code>、<code>stop</code></p></li></ul></td>
     <td><p>英語のみのコンテンツには<code>standard</code>よりも推奨されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="./chinese-analyzer"><code>chinese</code></a></p></td>
     <td><p>中国語</p></td>
     <td><ul><li><p>トークナイザー：<code>jieba</code></p></li><li><p>フィルター：<code>cnalphanumonly</code></p></li></ul></td>
     <td><p>現在、デフォルトで簡体字中国語辞書を使用しています。</p></td>
   </tr>
</table>

#### 実装例{#implementation-example}

組み込みアナライザーを使用するには、フィールドスキーマを定義する際に`analyzer_params`でそのタイプを指定するだけです。

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

<p>詳細な使用方法については、<a href="./full-text-search">全文検索</a>、<a href="./text-match">テキストマッチ</a>、または<a href="./phrase-match">フレーズマッチ</a>を参照してください。</p>

</Admonition>

### パス B: カスタムアナライザーを作成する{#path-b-create-a-custom-analyzer}

[組み込みのオプション](./choose-the-right-analyzer-for-your-use-case#available-built-in-analyzers)がニーズを満たさない場合、トークナイザーと一連のフィルターを組み合わせてカスタムアナライザーを作成できます。これにより、テキスト処理パイプラインを完全に制御できます。

#### ステップ 1: 言語に基づいてトークナイザーを選択する{#step-1-select-the-tokenizer-based-on-language}

コンテンツの主要言語に基づいてトークナイザーを選択します。

##### 西洋言語{#western-languages}

スペース区切りの言語の場合、以下のオプションがあります。

<table>
   <tr>
     <th><p>トークナイザー</p></th>
     <th><p>動作</p></th>
     <th><p>最適な用途</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><a href="./standard-tokenizer"><code>standard</code></a></p></td>
     <td><p>スペースと句読点に基づいてテキストを分割します</p></td>
     <td><p>一般的なテキスト、混合句読点</p></td>
     <td><ul><li><p>入力: <code>"Hello, world! Visit example.com"</code></p></li><li><p>出力: <code>['Hello', 'world', 'Visit', 'example', 'com']</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./whitespace-tokenizer"><code>whitespace</code></a></p></td>
     <td><p>空白文字のみで分割します</p></td>
     <td><p>前処理されたコンテンツ、ユーザーがフォーマットしたテキスト</p></td>
     <td><ul><li><p>入力: <code>"user_id = get_user_data()"</code></p></li><li><p>出力: <code>['user_id', '=', 'get_user_data()']</code></p></li></ul></td>
   </tr>
</table>

##### 東アジア言語{#east-asian-languages}

辞書ベースの言語では、適切な単語分割のために特殊なトークナイザーが必要です。

###### 中国語{#chinese}

<table>
   <tr>
     <th><p>トークナイザー</p></th>
     <th><p>動作</p></th>
     <th><p>最適な用途</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><a href="./jieba-tokenizer"><code>jieba</code></a></p></td>
     <td><p>インテリジェントなアルゴリズムによる中国語辞書ベースの分割</p></td>
     <td><p><strong>中国語コンテンツに推奨</strong> - 辞書とインテリジェントなアルゴリズムを組み合わせ、中国語向けに特別に設計されています</p></td>
     <td><ul><li><p>入力: <code>"机器学习是人工智能的一个分支"</code></p></li><li><p>出力: <code>['机器', '学习', '是', '人工', '智能', '人工智能', '的', '一个', '分支']</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./lindera-tokenizer"><code>lindera</code></a></p></td>
     <td><p>中国語辞書 (<a href="https://cc-cedict.org/wiki/">cc-cedict</a>) を使用した純粋な辞書ベースの形態素解析</p></td>
     <td><p><code>jieba</code>と比較して、中国語テキストをより一般的な方法で処理します</p></td>
     <td><ul><li><p>入力: <code>"机器学习算法"</code></p></li><li><p>出力: <code>["机器", "学习", "算法"]</code></p></li></ul></td>
   </tr>
</table>

###### 日本語と韓国語{#japanese-and-korean}

<table>
   <tr>
     <th><p>言語</p></th>
     <th><p>トークナイザー</p></th>
     <th><p>辞書オプション</p></th>
     <th><p>最適な用途</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p>日本語</p></td>
     <td><p><a href="./lindera-tokenizer"><code>lindera</code></a></p></td>
     <td><p><a href="https://taku910.github.io/mecab/">ipadic</a> (汎用), <a href="https://github.com/neologd/mecab-ipadic-neologd">ipadic-neologd</a> (現代用語), <a href="https://clrd.ninjal.ac.jp/unidic/">unidic</a> (学術)</p></td>
     <td><p>固有名詞処理を含む形態素解析</p></td>
     <td><ul><li><p>入力: <code>"東京都渋谷区"</code></p></li><li><p>出力: <code>["東京", "都", "渋谷", "区"]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p>韓国語</p></td>
     <td><p><a href="./lindera-tokenizer"><code>lindera</code></a></p></td>
     <td><p><a href="https://bitbucket.org/eunjeon/mecab-ko-dic/src/master/">ko-dic</a></p></td>
     <td><p>韓国語形態素解析</p></td>
     <td><ul><li><p>入力: <code>"안녕하세요"</code></p></li><li><p>出力: <code>["안녕", "하", "세요"]</code></p></li></ul></td>
   </tr>
</table>

##### 多言語または不明な言語{#multilingual-or-unknown-languages}

言語が予測不能な場合や、ドキュメント内で混在しているコンテンツの場合:

<table>
   <tr>
     <th><p>トークナイザー</p></th>
     <th><p>動作</p></th>
     <th><p>最適な用途</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><a href="./icu-tokenizer"><code>icu</code></a></p></td>
     <td><p>Unicode対応のトークン化 (International Components for Unicode)</p></td>
     <td><p>混合スクリプト、不明な言語、または単純なトークン化で十分な場合</p></td>
     <td><ul><li><p>入力: <code>"Hello 世界 مرحبا"</code></p></li><li><p>出力: <code>['Hello', ' ', '世界', ' ', 'مرحبا']</code></p></li></ul></td>
   </tr>
</table>

**icu を使用するタイミング**:

- 言語識別が非現実的な混合言語。

- [多言語アナライザー](./multi-language-analyzers)や[言語識別子](./language-identifier-tokenizer)のオーバーヘッドを避けたい場合。

- コンテンツに主要言語があり、全体的な意味にほとんど寄与しない外国語の単語（例：日本語やフランス語のブランド名や専門用語が散発的に含まれる英語のテキスト）が時折含まれる場合。

**代替アプローチ**: 多言語コンテンツをより正確に処理するには、多言語アナライザーまたは言語識別子の使用を検討してください。詳細については、[多言語アナライザー](./multi-language-analyzers)または[言語識別子](./language-identifier-tokenizer)を参照してください。

#### ステップ 2: 精度を高めるためのフィルターを追加する{#step-2-add-filters-for-precision}

[トークナイザーを選択した後](./choose-the-right-analyzer-for-your-use-case#step-1-select-the-tokenizer-based-on-language)、特定の検索要件とコンテンツ特性に基づいてフィルターを適用します。

##### 一般的に使用されるフィルター{#commonly-used-filters}

これらのフィルターは、ほとんどのスペース区切り言語設定（英語、フランス語、ドイツ語、スペイン語など）に不可欠であり、検索品質を大幅に向上させます。

<table>
   <tr>
     <th><p>フィルター</p></th>
     <th><p>動作</p></th>
     <th><p>使用するタイミング</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><a href="./lowercase-filter"><code>lowercase</code></a></p></td>
     <td><p>すべてのトークンを小文字に変換します</p></td>
     <td><p>普遍的 - 大文字と小文字の区別があるすべての言語に適用されます</p></td>
     <td><ul><li><p>入力: <code>["Apple", "iPhone"]</code></p></li><li><p>出力: <code>[['apple'], ['iphone']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./stemmer-filter"><code>stemmer</code></a></p></td>
     <td><p>単語を語根形に還元します</p></td>
     <td><p>単語の活用がある言語（英語、フランス語、ドイツ語など）</p></td>
     <td><p>英語の場合:</p><ul><li><p>入力: <code>["running", "runs", "ran"]</code></p></li><li><p>出力: <code>[['run'], ['run'], ['ran']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./stop-filter"><code>stop</code></a></p></td>
     <td><p>一般的な意味のない単語を削除します</p></td>
     <td><p>ほとんどの言語 - 特にスペース区切り言語に効果的です</p></td>
     <td><ul><li><p>入力: <code>["the", "quick", "brown", "fox"]</code></p></li><li><p>出力: <code>[[], ['quick'], ['brown'], ['fox']]</code></p></li></ul></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>東アジア言語（中国語、日本語、韓国語など）の場合、代わりに<a href="./choose-the-right-analyzer-for-your-use-case#language-specific-filters">言語固有のフィルター</a>に焦点を当ててください。これらの言語は通常、テキスト処理に異なるアプローチを使用し、ステミングから大きな恩恵を受けない場合があります。</p>

</Admonition>

##### テキスト正規化フィルター{#text-normalization-filters}

これらのフィルターは、テキストのバリエーションを標準化して、マッチングの一貫性を向上させます。

<table>
   <tr>
     <th><p>フィルター</p></th>
     <th><p>動作</p></th>
     <th><p>使用するタイミング</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><a href="./ascii-folding-filter"><code>asciifolding</code></a></p></td>
     <td><p>アクセント付き文字をASCII同等物に変換します</p></td>
     <td><p>国際コンテンツ、ユーザー生成コンテンツ</p></td>
     <td><ul><li><p>入力: <code>["café", "naïve", "résumé"]</code></p></li><li><p>出力: <code>[['cafe'], ['naive'], ['resume']]</code></p></li></ul></td>
   </tr>
</table>

##### トークンフィルタリング{#token-filtering}

文字コンテンツまたは長さに基づいて、保持するトークンを制御します。

<table>
   <tr>
     <th><p>フィルター</p></th>
     <th><p>動作</p></th>
     <th><p>使用するタイミング</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><a href="./remove-punct-filter"><code>removepunct</code></a></p></td>
     <td><p>単独の句読点トークンを削除します</p></td>
     <td><p>句読点を単一のトークンとして返す<code>jieba</code>、<code>lindera</code>、<code>icu</code>トークナイザーからのクリーンな出力</p></td>
     <td><ul><li><p>入力: <code>["Hello", "!", "world"]</code></p></li><li><p>出力: <code>[['Hello'], ['world']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./alphanumonly-filter"><code>alphanumonly</code></a></p></td>
     <td><p>文字と数字のみを保持します</p></td>
     <td><p>技術コンテンツ、クリーンなテキスト処理</p></td>
     <td><ul><li><p>入力: <code>["user123", "test@email.com"]</code></p></li><li><p>出力: <code>[['user123'], ['test', 'email', 'com']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./length-filter"><code>length</code></a></p></td>
     <td><p>指定された長さ範囲外のトークンを削除します</p></td>
     <td><p>ノイズ（過度に長いトークン）をフィルタリングします</p></td>
     <td><ul><li><p>入力: <code>["a", "very", "extraordinarily"]</code></p></li><li><p>出力: <code>[['a'], ['very'], []]</code> (<strong>max=10</strong>の場合)</p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./regex-filter"><code>regex</code></a></p></td>
     <td><p>カスタムパターンベースのフィルタリング</p></td>
     <td><p>ドメイン固有のトークン要件</p></td>
     <td><ul><li><p>入力: <code>["test123", "prod456"]</code></p></li><li><p>出力: <code>[[], ['prod456']]</code> (<strong>expr="^prod"</strong>の場合)</p></li></ul></td>
   </tr>
</table>

##### 言語固有のフィルター{#language-specific-filters}

これらのフィルターは、特定の言語特性を処理します。

<table>
   <tr>
     <th><p>フィルター</p></th>
     <th><p>言語</p></th>
     <th><p>動作</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><a href="./decompounder-filter"><code>decompounder</code></a></p></td>
     <td><p>ドイツ語</p></td>
     <td><p>複合語を検索可能なコンポーネントに分割します</p></td>
     <td><ul><li><p>入力: <code>["dampfschifffahrt"]</code></p></li><li><p>出力: <code>[['dampf', 'schiff', 'fahrt']]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./cnalphanumonly-filter">cnalphanumonly</a></p></td>
     <td><p>中国語</p></td>
     <td><p>中国語文字 + 英数字のみを保持します</p></td>
     <td><ul><li><p>入力: <code>["Hello", "世界", "123", "!@#"]</code></p></li><li><p>出力: <code>[['Hello'], ['世界'], ['123'], []]</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><a href="./cncharonly-filter"><code>cncharonly</code></a></p></td>
     <td><p>中国語</p></td>
     <td><p>中国語文字のみを保持します</p></td>
     <td><ul><li><p>入力: <code>["Hello", "世界", "123"]</code></p></li><li><p>出力: <code>[[], ['世界'], []]</code></p></li></ul></td>
   </tr>
</table>

#### ステップ 3: 結合して実装する{#step-3-combine-and-implement}

カスタムアナライザーを作成するには、`analyzer_params`辞書でトークナイザーとフィルターのリストを定義します。フィルターはリストされた順序で適用されます。

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

#### 最終: `run_analyzer` を使用したテスト{#final-test-with-runanalyzer}

コレクションに適用する前に、必ず設定を検証してください。

```python
# Sample text to analyze
sample_text = "The Milvus vector database is built for scale!"

# Run analyzer with the defined configuration
result = client.run_analyzer(sample_text, analyzer_params)
print("Analyzer output:", result)
```

確認すべき一般的な問題：

- **過剰なトークン化**: 技術用語が不正確に分割されている

- **過少なトークン化**: フレーズが適切に分離されていない

- **トークンの欠落**: 重要な用語がフィルタリングされている

詳細な使用方法については、[run_analyzer](https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/CollectionSchema/run_analyzer.md) を参照してください。

## ユースケース別クイックレシピ{#quick-recipes-by-use-case}

このセクションでは、Zilliz Cloud でアナライザーを扱う際の一般的なユースケースに対する推奨されるトークナイザーとフィルターの設定を提供します。コンテンツタイプと検索要件に最も適した組み合わせを選択してください。

<Admonition type="info" icon="📘" title="Notes">

<p>アナライザーをコレクションに適用する前に、<a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/CollectionSchema/run_analyzer.md"><code>run_analyzer</code></a> を使用してテキスト分析のパフォーマンスをテストおよび検証することをお勧めします。</p>

</Admonition>

### 英語{#english}

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

### ヒンディー語\{#hindi}

```json
{
    "tokenizer": "icu",
    "filter": ["lowercase", {
        "type": "stop",
        "stop_words": [<put stop words list here>]
    }]
}
```

### 日本語\{#japanese}

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

### ポルトガル語\{#portuguese}

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

### ウルドゥー語\{#urdu}

```json
{
    "tokenizer": "icu",
    "filter": ["lowercase", {
        "type": "stop",
        "stop_words": [<put stop words list here>]
    }]
}
```

### 混合または多言語コンテンツ{#mixed-or-multilingual-content}

複数の言語にまたがるコンテンツや、スクリプトが予測不能なコンテンツを扱う場合は、`icu` analyzer から始めます。この Unicode 対応のアナライザーは、混合スクリプトや記号を効果的に処理します。

**基本的な多言語設定（ステミングなし）**:

```python
analyzer_params = {
    "tokenizer": "icu",
    "filter": ["lowercase", "asciifolding"]
}
```

**高度な多言語処理**:

異なる言語間でのトークン動作をより詳細に制御するには、以下を行います。

- **多言語アナライザー**設定を使用します。詳細については、[多言語アナライザー](./multi-language-analyzers)を参照してください。

- コンテンツに**言語識別子**を実装します。詳細については、[言語識別子](./language-identifier-tokenizer)を参照してください。

## Zilliz Cloudでアナライザーを設定およびプレビューする{#configure-and-preview-analyzers-in-zilliz-cloud}

Zilliz Cloudでは、コードを書くことなく、[Zilliz Cloud](https://cloud.zilliz.com/) [コンソール](https://cloud.zilliz.com/)から直接テキストアナライザーを設定およびテストできます。

<Supademo id="cmfxfue5c41ld10k86la66x1v" title=""  />

