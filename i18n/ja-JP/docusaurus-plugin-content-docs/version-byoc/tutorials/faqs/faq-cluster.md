---
title: "FAQ: クラスター | BYOC"
slug: /faq-cluster
sidebar_label: "FAQ: クラスター"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題とその解決策を一覧で紹介します。 | BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 2

---

# FAQ: クラスター

このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題と、それに対応する解決策を一覧で紹介します。

## 目次

- [「quota exceeded\[reason=disk quota exceeded, please allocate more resources」というエラーを受け取った場合、どうすればよいですか？](#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources)
- [serving クラスターのクエリ CU をスケールダウンするにはどうすればよいですか？](#how-can-i-scale-down-the-query-cus-of-my-serving-cluster)
- [Zilliz Cloud への接続時に接続タイムアウトエラーが発生した場合、どう対処すればよいですか？](#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud)
- [クラスター作成後に接続できないのはなぜですか？](#why-cant-i-connect-to-the-cluster-after-the-cluster-is-created)
- [Node.js SDK で Zilliz Cloud に接続できない場合、どうすればよいですか？](#what-can-i-do-if-i-cannot-connect-to-zilliz-cloud-with-nodejs-sdk)
- [クラスターを一時停止した場合、課金されますか？](#will-i-be-charged-if-i-suspend-my-cluster)

## よくある質問




### 「quota exceeded\[reason=disk quota exceeded, please allocate more resources」というエラーを受け取った場合、どうすればよいですか？\{#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources}

データの挿入またはアップサート時に、データが serving クラスターの CU容量 を超えるため、このエラーが発生します。クラスターの容量は、[クラスタータイプと CU サイズ](./cu-types-explained#assess-capacity) によって異なります。

この問題を解決するには、以下の手順に従ってください。

このような場合、クエリ CU を増やして [serving クラスターをスケールアップ](./scale-query-cu) することをお勧めします。

### serving クラスターのクエリ CU をスケールダウンするにはどうすればよいですか？\{#how-can-i-scale-down-the-query-cus-of-my-serving-cluster}

クラスターをスケールダウンする必要がある場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us) してください。

### Zilliz Cloud への接続時に接続タイムアウトエラーが発生した場合、どう対処すればよいですか？\{#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud}

Zilliz Cloud クラスターへの接続を確立するには、いくつかの関連パラメーターを指定する必要があります。例えば、PyMilvus SDK の connect メソッドは、以下のように使用できます。

```python
from pymilvus import Connections

conn = Connections.connect(
        alias=ALIAS,
        host=HOST,
        port=PORT,
        user=USER,
        password=PASSWORD,
        timeout=30,
        secure=True
)
```

接続タイムアウトエラーは、以下のシナリオで発生する可能性があります：

- ネットワーク状態が悪い場合

    ネットワーク状態が悪い場合は、connect 操作のタイムアウト時間を長くすることをお勧めします。上記のコードでは、`timeout` が `30` 秒に設定されており、リクエスト送信後 30 秒以内に応答がない場合、connect 操作がタイムアウトになります。

- 接続パラメーターが正しくない場合

    Zilliz Cloud クラスターは TLS が有効になっているため、クラスターに正常に接続するには、上記の例に示すように、接続パラメーターに `secure` を含め、それを `true` に設定してください。そうしないと、接続に失敗し、タイムアウトエラーのプロンプトが表示される可能性があります。

- VPC セキュリティグループのルール

    接続タイムアウトが発生した場合は、VPC セキュリティグループのルールを確認し、ソース IP が許可されていることを確認してください。

### クラスター作成後にクラスターに接続できないのはなぜですか？\{#why-cant-i-connect-to-the-cluster-after-the-cluster-is-created}

以下の手順で問題を特定できます：

1. クラスターのステータスが RUNNING であることを確認してください。クラスターの作成中、削除中、または IP ホワイトリストの更新中は、クラスターに接続できません。

1. 接続元の IP アドレスが IP ホワイトリストに含まれているか確認してください。

1. クラスターエンドポイント URI のポートが正しいか確認してください。Zilliz Cloud Web コンソールからエンドポイント URI をコピーしていることを確認してください。以下の表は、異なるクラウドプロバイダーにデプロイされたクラスターのポートを示しています。

    <table>
       <tr>
         <th><p><strong>クラウドプロバイダー</strong></p></th>
         <th><p><strong>Port</strong></p></th>
       </tr>
       <tr>
         <td><p>AWS</p></td>
         <td><p>19530 - 19550</p></td>
       </tr>
       <tr>
         <td><p>Google Cloud</p></td>
         <td><p>443</p></td>
       </tr>
       <tr>
         <td><p>Azure</p></td>
         <td><p>19530</p></td>
       </tr>
    </table>

1. `telnet in01-(uuid).(region).vectordb.zillizcloud.com port-number` を実行して、ポートの接続性をテストしてください。

上記の手順をすべて試しても問題が解決しない場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us) してください。

### Node.js SDK で Zilliz Cloud に接続できない場合はどうすればよいですか？\{#what-can-i-do-if-i-cannot-connect-to-zilliz-cloud-with-nodejs-sdk}

Node.js SDK で Zilliz Cloud に接続できない場合は、以下をお試しください：

1. [Node.js SDK](https://github.com/milvus-io/milvus-sdk-node) の最新バージョンがインストールされていることを確認してください。

1. クライアントが正しく初期化されていることを確認してください。

    ```bash
    const client = new MilvusClient('https://your-db-address-with-port', true, 'your-db-user', 'your-db-pasword');
    ```

1. クラスターエンドポイントとトークンが正しいことを確認してください。クラスターエンドポイントにはプロトコル `https://` を含めるようにしてください。

1. クラスターエンドポイント URI のポートが正しいか確認してください。Zilliz Cloud Web コンソールからエンドポイント URI をコピーしていることを確認してください。以下の表は、異なるクラウドプロバイダーにデプロイされたクラスターのポートを示しています。

    <table>
       <tr>
         <th><p><strong>クラウドプロバイダー</strong></p></th>
         <th><p><strong>ポート</strong></p></th>
       </tr>
       <tr>
         <td><p>AWS</p></td>
         <td><p>19530 - 19550</p></td>
       </tr>
       <tr>
         <td><p>Google Cloud</p></td>
         <td><p>443</p></td>
       </tr>
       <tr>
         <td><p>Azure</p></td>
         <td><p>19530</p></td>
       </tr>
    </table>

1. お使いの IP アドレスは、クラスター設定でホワイトリストに登録されている必要があります。

### クラスターを停止すると課金されますか？\{#will-i-be-charged-if-i-suspend-my-cluster}

クラスターが停止している間は、コンピューティングではなくストレージのみが課金されます。ストレージコストの詳細については、[料金](https://zilliz.com/pricing) を参照してください。
