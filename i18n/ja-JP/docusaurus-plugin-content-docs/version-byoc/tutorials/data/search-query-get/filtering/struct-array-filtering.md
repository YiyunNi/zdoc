---
title: "StructArray 演算子 | BYOC"
slug: /struct-array-filtering
sidebar_key: struct-array-filtering
sidebar_label: "StructArray"
beta: PRIVATE
notebook: FALSE
description: "エンティティ内の構造体の配列（StructArray）は、順序付けられた構造体要素のセットを格納します。配列内の各構造体は、複数のベクトルとスカラーフィールドで構成される同じ事前定義スキーマを共有します。構造体内のスカラーサブフィールドにインデックスが作成されている場合、要素フィルタと match ファミリーの演算子を使用して、スカラーフィルタリングを実行できます。 | BYOC"
type: origin
token: VmGMwsTliiGZdFkzzeBckRNlnCh
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - フィルタ
  - フィルタリング式
  - フィルタリング
  - struct array operators

---

import Admonition from '@theme/Admonition';


# 構造体配列 演算子

エンティティ内の 構造体 の配列（構造体配列）は、順序付けられた 構造体 要素の集合を格納します。配列内の各 構造体 は、複数のベクトルとスカラーフィールドで構成される同じ事前定義スキーマを共有します。構造体 内のスカラーサブフィールドにインデックスが作成されている場合、**要素フィルター**および**match ファミリーの演算子**を使用して、スカラー フィルタリングを実行できます。

要素フィルターは、構造体配列 フィールド内に指定された述語に一致する値を少なくとも 1 つ含むエンティティを選択します。対照的に、match ファミリーの演算子は、構造体配列 フィールド内に指定された述語に一致する値を特定の数または割合含むエンティティを検索するために使用されます。

<Admonition type="info" icon="📘" title="Notes">

`$[subField]` に対して述語を構築する際、これらの演算子は各候補エンティティに対して配列要素を反復処理する必要があるため、大規模データセットを扱う場合はサブフィールドにインデックスが作成されていることを確認してください。

</Admonition>

## 要素フィルター\{#element-filter}

エンティティの 構造体配列 フィールドに特定の述語に一致する値が含まれているかどうかを確認する必要がある場合に、要素フィルターを使用します。 

```python
element_filter(chunks, $[text] LIKE "Red%")
```

上記の要素フィルタ式に示されているように、要素フィルタは、`text` サブフィールド内で "Red" で始まるチャンクを少なくとも1つ含むエンティティを返します。最初のパラメータは 構造体配列 フィールドの名前で、2番目のパラメータは 構造体 サブフィールドに適用される述語です。

条件を構築するために、比較演算子、範囲演算子、算術演算子を使用でき、複数の条件を連結するために論理演算子を使用できます。詳細については、[基本演算子](./basic-filtering-operators) を参照してください。

ただし、エンティティレベルの述語と要素フィルタの両方を組み合わせたフィルタ式を構築する場合は、常に要素フィルタを最後に配置する必要があります。以下の例に示します。

```python
# correct
id > 0 && element_filter(chunks, $[x] > 1)

# incorrect, resulting errors
element_filter(chunks, $[x] > 1) && id > 0
```

## Match ファミリ演算子\{#match-family-operators}

Match ファミリ演算子は、構造体配列 フィールドに対しても機能します。単に要素が存在するかどうかを確認するのではなく、要素述語を満たす要素がいくつ（またはどのような割合）必要かを決定できます。

- [`MATCH_ANY(identifier, predicate)`](./struct-array-filtering#matchany): `text` サブフィールドに "Red" で始まるチャンクが少なくとも1つ含まれるエンティティを返します。意味的には、これは `element_filter` と同等です。

- [`MATCH_ALL(identifier, predicate)`](./struct-array-filtering#matchall): すべてのチャンクの text サブフィールドが "Red" で始まるエンティティを返します。

- [`MATCH_LEAST(identifier, predicate, k)`](./struct-array-filtering#matchleast): `text` サブフィールドに "Red" で始まるチャンクが少なくとも `k` 個含まれるエンティティを返します。

- [`MATCH_MOST(identifier, predicate, k)`](./struct-array-filtering#matchmost): `text` サブフィールドに "Red" で始まるチャンクが最大 `k` 個含まれるエンティティを返します。

- [`MATCH_EXACT(identifier, predicate, k)`](./struct-array-filtering#matchexact): `text` サブフィールドに "Red" で始まるチャンクがちょうど `k` 個含まれるエンティティを返します。

### MATCH_ANY\{#matchany}

この演算子は、配列内の**少なくとも1つ**の要素が述語を満たす場合に true と評価されます。これは、すべての配列要素に対する論理的 `OR` の構造的等価物を示します。

MATCH_ANY 演算子と要素フィルタは意味的に同じであり、互換的に使用できます。`count(matches) >= 1` という論理を表現する必要がある場合は、これらを使用する必要があります。

**例:**

次の例は、ドキュメントのいずれかの部分が "Red" で始まるエンティティを返します。

```python
MATCH_ANY(chunks, $[text] LIKE 'Red%')
```

### MATCH_ALL\{#matchall}

この演算子は、配列内の**すべての**要素が述語を満たす場合にのみ true と評価されます。

`count(matches) == total elements` という論理を表現する必要がある場合は、この演算子を使用します。

**例:**

```python
MATCH_ALL(chunks, $[text] LIKE 'Red%')
```

### MATCH_LEAST\{#matchleast}

この演算子は定量的フィルタであり、述語を満たす要素の数が指定された定数 $k$ **以上**の場合に true を返します。

`count(matches) >= k` という論理を表現する必要がある場合、この演算子を使用します。

**例:**

```python
MATCH_LEAST(chunks, $[text] LIKE 'Red%', 3)
```

### MATCH_MOST\{#matchmost}

この演算子は、述語を満たす要素の数が指定された定数 $k$ **以下**である場合に true を返す定量的フィルターです。

これは、特定のキーワードを過度にターゲットにしているエンティティを除外する（ノイズ低減）際に特に有用です。

**例:**

```python
MATCH_MOST(chunks, $[text] LIKE 'Red%', 3)
```

### MATCH_EXACT\{#matchexact}

この演算子は、ファミリー内で最も制限的な定量的演算子です。述語を満たす要素の数が**厳密に** $k$ 個である場合にのみ true を返します。

**例:**

```python
MATCH_EXACT(chunks, $[text] LIKE 'Red%', 3)
```

