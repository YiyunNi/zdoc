---
title: "アクセスログリファレンス | BYOC"
slug: /access-log-reference
sidebar_label: "アクセスログリファレンス"
beta: FALSE
notebook: FALSE
description: "アクセスログは JSON Lines 形式で配信され、1 行に 1 つの JSON オブジェクトが含まれます。各行は単一の操作を表す独立した JSON オブジェクトです。以下の例は、Search 操作のログエントリを示しています | BYOC"
type: origin
token: TeLbw6guCimFLgkQWdmcZB2unMd
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - アクセス
  - ログ
  - リファレンス

---

import Admonition from '@theme/Admonition';


# アクセスログリファレンス

アクセスログは [JSON Lines](https://jsonlines.org/) 形式で配信されます。各行に 1 つの JSON オブジェクトが含まれ、各操作を表す独立した JSON オブジェクトとなっています。以下の例は、Search 操作のログエントリを示しています：

```json
{
    "action": "Search",
    "database": "Database1",
    "log_type": "Access",
    "user": "key-xxxxxxxxxx",
    "cluster_id": "in01-668744cf5e27e2d",
    "timestamp": 1742798170636,
    "trace_id": "90c09bcd04d8f41871ebe2c3aa7126d4",
    "result": 0,
    "interface": "Restful",
    "params": {
        "sdk": "Python",
        "expr": "",
        "collection": "medium_articles",
        "partition": "partition1",
        "input_params": {
            "anns_field": "",
            "offset": "0",
            "params": "{}",
            "round_decimal": "-1",
            "topk": "3"
        },
        "output_fields": ["title", "link", "id"],
        "consistency_level": 2,
        "execution_time": "2.924823ms",
        "ids": [
            "53d85e82-8fa0-4569-8dc9-7ecb2f9cc264",
            "9ead30cf-fa05-450a-8704-76c994dae0f2",
            "b85acff9-2375-4105-9baf-e82dea772a24"
        ],
        "scores": [0.11, 0.12, 0.13]
    }
}
```

実際には、各エントリは `.log` ファイル内の 1 行を占めます。以下のセクションでは、各フィールドについて詳しく説明します。

## Log field schema\{#log-field-schema}

<table>
   <tr>
     <th><p><strong>Field</strong></p></th>
     <th><p><strong>Required</strong></p></th>
     <th><p><strong>Type</strong></p></th>
     <th><p><strong>Description</strong></p></th>
     <th><p><strong>Example</strong></p></th>
   </tr>
   <tr>
     <td><p><code>action</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>操作名。<a href="./access-log-reference#supported-actions">Supported actions</a> を参照してください。</p></td>
     <td><p><code>"Search"</code></p></td>
   </tr>
   <tr>
     <td><p><code>database</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>操作が発生したデータベース。</p></td>
     <td><p><code>"データベース1"</code></p></td>
   </tr>
   <tr>
     <td><p><code>log_type</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>ログカテゴリ：<code>"Access"</code>、<code>"Audit",</code> または <code>"Slow"</code>。</p></td>
     <td><p><code>"Access"</code></p></td>
   </tr>
   <tr>
     <td><p><code>user</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>リクエストを発行したユーザーまたは API キー。</p></td>
     <td><p><code>"key-xxxxxxxxxx"</code></p></td>
   </tr>
   <tr>
     <td><p><code>cluster_id</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>クラスターの一意の識別子。</p></td>
     <td><p><code>"in01-668744cf5e27e2d"</code></p></td>
   </tr>
   <tr>
     <td><p><code>timestamp</code></p></td>
     <td><p>Yes</p></td>
     <td><p>int</p></td>
     <td><p>プロキシがリクエストを受信した時点の Unix タイムスタンプ（ミリ秒単位、13 桁）。</p></td>
     <td><p><code>1742798170636</code></p></td>
   </tr>
   <tr>
     <td><p><code>trace_id</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>操作の一意の ID。同じリクエストに属する複数のログエントリを関連付けるために使用します。</p></td>
     <td><p><code>"90c09bcd04d8f41871ebe2c3aa7126d4"</code></p></td>
   </tr>
   <tr>
     <td><p><code>result</code></p></td>
     <td><p>Yes</p></td>
     <td><p>int</p></td>
     <td><p>操作の結果コード。0 は成功を示し、0 以外の値はエラーを示します。</p></td>
     <td><p><code>0</code></p></td>
   </tr>
   <tr>
     <td><p><code>interface</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>インターフェースタイプ：<code>"Restful"</code> または <code>"SDK"</code>。</p></td>
     <td><p><code>"Restful"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params</code></p></td>
     <td><p>Yes</p></td>
     <td><p>object</p></td>
     <td><p>アクション固有のパラメータ。ネストされたフィールドについては<a href="./access-log-reference#params-fields">以下</a>を参照してください。</p></td>
     <td><p>--</p></td>
   </tr>
</table>

### params fields\{#params-fields}

<table>
   <tr>
     <th><p>Field</p></th>
     <th><p>Required</p></th>
     <th><p>Type</p></th>
     <th><p>Description</p></th>
     <th><p>Example</p></th>
   </tr>
   <tr>
     <td><p><code>params.sdk</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>interface が SDK の場合に記録される SDK 言語。</p></td>
     <td><p><code>"Python"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.expr</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>リクエストとともに渡されたフィルタ式。</p></td>
     <td><p><code>""</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.collection</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>対象コレクションの名前。Search、HybridSearch、および Query アクションで必須です。</p></td>
     <td><p><code>"medium_articles"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.partition</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>指定されている場合の対象パーティション。</p></td>
     <td><p><code>"partition1"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.input_params</code></p></td>
     <td><p>No</p></td>
     <td><p>object</p></td>
     <td><p>操作の入力パラメータ（offset、limit など）。</p></td>
     <td><p><code>\{"limit": "10", "offset": "0"}</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.output_fields</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p>クエリで要求された出力フィールド。</p></td>
     <td><p><code>["title", "id"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.consistency_level</code></p></td>
     <td><p>No</p></td>
     <td><p>int</p></td>
     <td><p>操作に使用された整合性レベル。</p></td>
     <td><p><code>2</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.execution_time</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>サーバー側の実行時間（ミリ秒単位）。プロキシがペイロード全体を受信してからレスポンスの送信を開始するまでを計測します。ネットワーク転送時間は含まれません。</p></td>
     <td><p><code>"2.924823ms"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.ids</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p>クエリ結果における主キーの値。出力フィールドに含めるように構成されている場合、Search、HybridSearch、および Query アクションでのみ表示されます。</p></td>
     <td><p><code>["53d85e82-...", "9ead30cf-..."]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.scores</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p><code>params.ids</code> の各エントリに対応する類似度スコア。Search、HybridSearch、および Query アクションでのみ表示されます。</p></td>
     <td><p><code>[0.11, 0.12, 0.13]</code></p></td>
   </tr>
</table>

## Supported actions\{#supported-actions}

このリリースでは、検索系またはクエリ系のアクションのみをログに記録します：

<table>
   <tr>
     <th><p>Action</p></th>
     <th><p>Description</p></th>
   </tr>
   <tr>
     <td><p>Search</p></td>
     <td><p>ベクトル類似度検索</p></td>
   </tr>
   <tr>
     <td><p>HybridSearch</p></td>
     <td><p>リランキング付きのマルチベクトル検索</p></td>
   </tr>
   <tr>
     <td><p>Query</p></td>
     <td><p>スカラーフィルタリングクエリ</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>追加のアクションのサポートは、将来のリリースで予定されています。</p>

</Admonition>

## File path and naming\{#file-path-and-naming}

ログファイルは、オブジェクトストレージバケット内に以下のパス構造で整理されています：

```plaintext
/<Cluster ID>/<Log type>/<Date>/<File name><File name suffix>
```

<table>
   <tr>
     <th><p><strong>コンポーネント</strong></p></th>
     <th><p><strong>形式</strong></p></th>
     <th><p><strong>例</strong></p></th>
   </tr>
   <tr>
     <td><p>クラスター ID</p></td>
     <td><p>クラスターの一意の識別子</p></td>
     <td><p><code>in03-c7be749d5f403ad</code></p></td>
   </tr>
   <tr>
     <td><p>ログタイプ</p></td>
     <td><p>access、audit、または slow</p></td>
     <td><p><code>access</code></p></td>
   </tr>
   <tr>
     <td><p>日付</p></td>
     <td><p>ISO 形式の日付 (YYYY-MM-DD)</p></td>
     <td><p><code>2024-12-20</code></p></td>
   </tr>
   <tr>
     <td><p>ファイル名</p></td>
     <td><p>HH:MM:SS-&lt;UUID&gt;。ここで HH:MM:SS は UTC 時間、&lt;UUID&gt; は一意性を確保するためのランダムな文字列です</p></td>
     <td><p><code>09:16:53-jz5l7D8Q</code></p></td>
   </tr>
   <tr>
     <td><p>ファイル名の拡張子</p></td>
     <td><p>.log</p></td>
     <td><p><code>.log</code></p></td>
   </tr>
</table>

フルパスの例：

```plaintext
/in03-c7be749d5f403ad/access/2024-12-20/09:16:53-jz5l7D8Q.log
```

