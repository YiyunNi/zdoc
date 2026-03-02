---
title: "FAQ: クラスター | BYOC"
slug: /faq-cluster
sidebar_label: "FAQ: クラスター"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題と、それに対応する解決策をリストアップします。 | BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 2

---

# FAQ: クラスター

このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [「quota exceeded[reason=disk quota exceeded, please allocate more resources」というエラーが表示された場合、どうすればよいですか？](#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources)
- [クラスターのCUサイズをスケールダウンするにはどうすればよいですか？](#how-can-i-scale-down-my-cluster-cu-size)
- [Zilliz Cloudへの接続を試みたときに、接続タイムアウトエラーが発生した場合、どうすればよいですか？](#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud)
- [クラスター作成後にクラスターに接続できないのはなぜですか？](#why-cant-i-connect-to-the-cluster-after-the-cluster-is-created)
- [Node.js SDKでZilliz Cloudに接続できない場合、どうすればよいですか？](#what-can-i-do-if-i-cannot-connect-to-zilliz-cloud-with-nodejs-sdk)
- [クラスターを一時停止した場合でも課金されますか？](#will-i-be-charged-if-i-suspend-my-cluster)
- [クラスターURIを取得するにはどうすればよいですか？](#how-to-obtain-a-cluster-uri)

## FAQ




### 「quota exceeded[reason=disk quota exceeded, please allocate more resources」というエラーが表示された場合、どうすればよいですか？{#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources}

データを挿入またはアップサートする際に、データがクラスターのCU容量を超えているため、このエラーが表示されます。クラスターの容量は、[CUタイプとCUサイズ](./cu-types-explained#assess-capacity)によって異なります。

この問題に対処するには、以下の手順に従ってください。

このような場合は、CUサイズを増やすことで[クラスターをスケールアップする](./scale-query-cu)ことをお勧めします。

### クラスターのCUサイズをスケールダウンするにはどうすればよいですか？{#how-can-i-scale-down-my-cluster-cu-size}

クラスターのCUサイズをスケールダウンする必要がある場合は、[リクエストを送信してください](https://support.zilliz.com/hc/en-us)。

### Zilliz Cloudへの接続を試みたときに、接続タイムアウトエラーが発生した場合、どうすればよいですか？{#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud}

Zilliz Cloudクラスターへの接続を確立するには、いくつかの関連パラメーターを指定する必要があります。たとえば、PyMilvus SDKの`connect`メソッドは次のように使用できます。

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

接続タイムアウトエラーは、以下のシナリオで発生する可能性があります。

- ネットワークの状態が悪い

    ネットワークの状態が悪い場合、接続操作のタイムアウト時間を長くすることをお勧めします。上記のコードでは、`timeout`は`30`秒に設定されています。これは、リクエストが送信されてから30秒以内に応答がない場合、接続操作がタイムアウトすることを意味します。

- 接続パラメータが正しくない

    Zilliz CloudクラスターはTLSが有効になっているため、クラスターに正常に接続するには、接続パラメータに`secure`を含め、上記の例に示すように`true`に設定してください。そうしないと、接続に失敗し、タイムアウトエラーのプロンプトが表示される可能性があります。

- ホワイトリストに登録されていないローカルIPアドレス

    クラスターへの接続を試みる場合、VPN/プロキシ接続をオフにし、パブリックIPアドレスを取得し（プライベートIPアドレスは機能しません）、そのIPアドレスを接続したいクラスターのホワイトリストに追加する必要があります。

### クラスター作成後にクラスターに接続できないのはなぜですか？{#why-cant-i-connect-to-the-cluster-after-the-cluster-is-created}

以下の手順で問題を確認できます。

1. クラスターのステータスがRUNNINGであることを確認します。クラスターが作成中、削除中、またはIPホワイトリストが更新中の場合、クラスターに接続することはできません。

1. 接続元のIPアドレスがIPホワイトリストに含まれていることを確認します。

1. クラスターエンドポイントURIのポートが正しいことを確認します。Zilliz Cloud WebコンソールからエンドポイントURIをコピーしていることを確認してください。以下の表は、異なるクラウドプロバイダーにデプロイされたクラスターのポートを示しています。

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

1. `telnet in01-(uuid).(region).vectordb.zillizcloud.com port-number`を実行してポートの接続性をテストします。

上記の手順をすべて試しても問題が解決しない場合は、[リクエストを送信してください](https://support.zilliz.com/hc/en-us)。

### Node.js SDKでZilliz Cloudに接続できない場合、どうすればよいですか？{#what-can-i-do-if-i-cannot-connect-to-zilliz-cloud-with-nodejs-sdk}

Node.js SDKでZilliz Cloudに接続できない場合は、以下を試してください。

1. [Node.js SDK](https://github.com/milvus-io/milvus-sdk-node)の最新バージョンがインストールされていることを確認します。

1. クライアントが正しく初期化されていることを確認します。

    ```bash
    const client = new MilvusClient('https://your-db-address-with-port', true, 'your-db-user', 'your-db-pasword');
    ```

1. クラスターのエンドポイントとトークンが正しいことを確認してください。クラスターのエンドポイントにはプロトコル `https://` を含めるようにしてください。

1. クラスターのエンドポイントURIのポートが正しいか確認してください。Zilliz CloudウェブコンソールからエンドポイントURIをコピーしていることを確認してください。以下の表は、異なるクラウドプロバイダーにデプロイされたクラスターのポートを示しています。

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

1. あなたのIPアドレスは、クラスター設定でホワイトリストに登録されている必要があります。

### クラスターを一時停止した場合、料金は発生しますか？{#will-i-be-charged-if-i-suspend-my-cluster}

クラスターが一時停止されている場合、コンピューティングではなくストレージに対してのみ課金されます。ストレージコストの詳細については、[料金](https://zilliz.com/pricing)を参照してください。

### クラスターURIの取得方法{#how-to-obtain-a-cluster-uri}
クラスターURIは、接続に使用できるクラスターエンドポイントを指します。

URIはZilliz Cloudウェブコンソールから取得できます。詳細については、[クラスターへの接続](./connect-to-cluster#connect-to-a-cluster)を参照してください。
