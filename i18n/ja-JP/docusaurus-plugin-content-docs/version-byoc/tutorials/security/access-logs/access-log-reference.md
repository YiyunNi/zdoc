---
title: "アクセスログリファレンス | BYOC"
slug: /access-log-reference
sidebar_key: access-log-reference
sidebar_label: "アクセスログリファレンス"
beta: PUBLIC
notebook: FALSE
description: "アクセスログは JSON Lines 形式で配信されます。各行に 1 つの JSON オブジェクトが含まれ、各行は単一の操作を表す自己完結型の JSON オブジェクトです。以下の例は、Search 操作のログエントリを示しています。 | BYOC"
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

アクセスログは [JSON Lines](https://jsonlines.org/) 形式で配信されます — 1 行につき 1 つの JSON オブジェクトです。各行は単一の操作を表す自己完結型の JSON オブジェクトです。以下の例は、Search 操作のログエントリを示しています:

```json
{
    "action": "Search",
    "cluster_id": "in01-2b8d91fc3a3b93b",
    "database": "default",
    "date": "2026/04/14 06:31:16.827 +00:00",
    "interface": "Restful",
    "log_type": "ACCESS",
    "params": {
        "collection": "ccc1",
        "consistency_level": 2,
        "execution_time": "15.368706ms",
        "expr": "",
        "input_params": {
            "anns_field": "",
            "offset": "0",
            "params": "{}",
            "round_decimal": "-1",
            "topk": "10"
        },
        "nq": 1,
        "output_fields": ["*"],
        "partition": null,
        "result_num": 10,
        "result_pks": [55, 19, 18, 10, -26, 115, -14, -96, -50, 9],
        "result_scores": [0.87269604, 0.8639183, 0.8605273, 0.85245466, 0.8490447, 0.84537137, 0.84066796, 0.8314183, 0.8296911, 0.82586515],
        "topk": 10
    },
    "result": 0,
    "status": "Success",
    "timestamp": 1776148276827,
    "trace_id": "f89903d701329910380442aa86941be9",
    "user": "key-ibchakktguxxrvvxseoasz"
}
```

実際には、各エントリは `.log` ファイル内で1行を占めます。以下のセクションでは、各フィールドについて詳しく説明します。

## ログフィールドスキーマ\{#log-field-schema}

<table>
   <tr>
     <th><p><strong>フィールド</strong></p></th>
     <th><p><strong>必須</strong></p></th>
     <th><p><strong>型</strong></p></th>
     <th><p><strong>説明</strong></p></th>
     <th><p><strong>例</strong></p></th>
   </tr>
   <tr>
     <td><p><code>action</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>操作名。詳細は <a href="./access-log-reference#supported-actions">サポートされているアクション</a> を参照してください。</p></td>
     <td><p><code>"Search"</code></p></td>
   </tr>
   <tr>
     <td><p><code>cluster_id</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>クラスターの一意の識別子。</p></td>
     <td><p><code>"in01-2b8d91fc3a3b93b"</code></p></td>
   </tr>
   <tr>
     <td><p><code>database</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>操作が発生したデータベース。</p></td>
     <td><p><code>"default"</code></p></td>
   </tr>
   <tr>
     <td><p><code>date</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>タイムゾーン付きの人間が読めるタイムスタンプ。</p></td>
     <td><p><code>"2026/04/14 06:31:16.827 +00:00"</code></p></td>
   </tr>
   <tr>
     <td><p><code>interface</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>インターフェースの種類: <code>Restful</code> または <code>Grpc</code>。</p></td>
     <td><p><code>"Restful"</code></p></td>
   </tr>
   <tr>
     <td><p><code>log_type</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>ログのカテゴリ: <code>ACCESS</code>、<code>AUDIT</code>、または <code>SLOW</code>。</p></td>
     <td><p><code>"ACCESS"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params</code></p></td>
     <td><p>Yes</p></td>
     <td><p>object</p></td>
     <td><p>アクション固有のパラメータ。ネストされたフィールドについては <a href="./access-log-reference#params-fields">以下</a> を参照してください。</p></td>
     <td><p><code>--</code></p></td>
   </tr>
   <tr>
     <td><p><code>result</code></p></td>
     <td><p>Yes</p></td>
     <td><p>int</p></td>
     <td><p>操作結果コード。<code>0</code> は成功を示し、0以外の値はエラーを示します。</p></td>
     <td><p><code>0</code></p></td>
   </tr>
   <tr>
     <td><p><code>status</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>操作の人間が読めるステータス。</p></td>
     <td><p><code>"Success"</code></p></td>
   </tr>
   <tr>
     <td><p><code>timestamp</code></p></td>
     <td><p>Yes</p></td>
     <td><p>int</p></td>
     <td><p>プロキシがリクエストを受信した時の Unix タイムスタンプ（ミリ秒、13桁）。</p></td>
     <td><p><code>1776148276827</code></p></td>
   </tr>
   <tr>
     <td><p><code>trace_id</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>操作の一意の ID。同じリクエストに属する複数のログエントリを関連付けるために使用します。</p></td>
     <td><p><code>"f89903d701329910380442aa86941be9"</code></p></td>
   </tr>
   <tr>
     <td><p><code>user</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>リクエストを発行したユーザーまたは API キー。</p></td>
     <td><p><code>"key-ibchakktguxxrvvxseoasz"</code></p></td>
   </tr>
</table>

### params フィールド\{#params-fields}

<table>
   <tr>
     <th><p><strong>フィールド</strong></p></th>
     <th><p><strong>必須</strong></p></th>
     <th><p><strong>型</strong></p></th>
     <th><p><strong>説明</strong></p></th>
     <th><p><strong>例</strong></p></th>
   </tr>
   <tr>
     <td><p><code>params.collection</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>対象のコレクション。Search、HybridSearch、Query アクションでは必須です。</p></td>
     <td><p><code>"ccc1"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.consistency_level</code></p></td>
     <td><p>No</p></td>
     <td><p>int</p></td>
     <td><p>操作に使用された一貫性レベル。</p></td>
     <td><p><code>2</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.execution_time</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>サーバー側の実行時間。プロキシが完全なペイロードを受信してからレスポンスの送信を開始するまでを測定します。ネットワーク転送時間は含みません。</p></td>
     <td><p><code>"15.368706ms"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.expr</code></p></td>
     <td><p>No</p></td>
     <td><p>string or array</p></td>
     <td><p>リクエストとともに渡されたフィルタ式。HybridSearch の場合、これは式の配列（サブリクエストごとに1つ）です。</p></td>
     <td><p><code>"" or [""]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.input_params</code></p></td>
     <td><p>No</p></td>
     <td><p>object</p></td>
     <td><p>操作の入力パラメータ（検索パラメータ、offset、topk など）。HybridSearch の場合、<code>sub_0.&ast;</code> プレフィックスのサブリクエストパラメータと <code>strategy</code> を含みます。</p></td>
     <td><p><code>\{"topk": "10", "offset": "0"\}</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.limit</code></p></td>
     <td><p>No</p></td>
     <td><p>int</p></td>
     <td><p>返す結果の数の上限。Query および HybridSearch アクションで表示されます。</p></td>
     <td><p><code>100</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.nq</code></p></td>
     <td><p>No</p></td>
     <td><p>int</p></td>
     <td><p>クエリベクトルの数。Search アクションで表示されます。</p></td>
     <td><p><code>1</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.output_fields</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p>クエリで要求された出力フィールド。</p></td>
     <td><p><code>["&ast;"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.partition</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>指定された場合の対象パーティション。パーティションが指定されていない場合は <code>null</code>。</p></td>
     <td><p><code>null</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.result_num</code></p></td>
     <td><p>No</p></td>
     <td><p>int</p></td>
     <td><p>操作によって返された実際の結果の数。</p></td>
     <td><p><code>10</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.result_pks</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p>クエリ結果の主キー。出力パラメータに含めるように設定されている場合、Search、HybridSearch、Query アクションで表示されます。</p></td>
     <td><p><code>[55, 19, 18, 10]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.result_scores</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p><code>params.result_pks</code> の各エントリに対応する類似度スコア。Search および HybridSearch アクションで表示されます。</p></td>
     <td><p><code>[0.87269604, 0.8639183]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.topk</code></p></td>
     <td><p>No</p></td>
     <td><p>int</p></td>
     <td><p>検索リクエストの topk パラメータ。Search および HybridSearch アクションで表示されます。</p></td>
     <td><p><code>10</code></p></td>
   </tr>
</table>

## サポートされているアクション\{#supported-actions}

このリリースでは、検索またはクエリクラスのアクションのみをログに記録します:

<table>
   <tr>
     <th><p>アクション</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>Search</p></td>
     <td><p>ベクトル類似度検索</p></td>
   </tr>
   <tr>
     <td><p>HybridSearch</p></td>
     <td><p>リランキング付きマルチベクトル検索</p></td>
   </tr>
   <tr>
     <td><p>Query</p></td>
     <td><p>スカラーフィルタリング クエリ</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

追加のアクションのサポートは、将来のリリースで予定されています。

</Admonition>

## ファイルパスと命名規則\{#file-path-and-naming}

ログファイルは、オブジェクトストレージバケット内で以下のパス構造で整理されます:

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

