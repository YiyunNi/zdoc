---
title: "FAQ: クラスター | CLOUD"
slug: /faq-cluster
sidebar_label: "FAQ: クラスター"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題と、それに対応する解決策を一覧表示します。 | CLOUD"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 2

---

# FAQ: クラスター

このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [無料クラスターの容量はどれくらいですか？](#what-is-the-capacity-of-a-free-cluster)
- ["quota exceeded\[reason=disk quota exceeded, please allocate more resources" というエラーが表示された場合、どうすればよいですか？](#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources)
- [専用クラスター作成後、CU タイプを変更できますか？](#can-i-change-the-cu-type-after-my-dedicated-cluster-is-created)
- [クラスター作成後、クラスターのクラウドリージョンを変更できますか？](#can-i-change-the-cloud-region-of-my-cluster-after-it-is-created)
- [クラスターのCUサイズをスケールダウンするにはどうすればよいですか？](#how-can-i-scale-down-my-cluster-cu-size)
- [AWSに無料クラスターをデプロイできますか？](#can-i-deploy-a-free-cluster-on-aws)
- [Zilliz Cloudへの接続を試みた際に、接続タイムアウトエラーが発生した場合、どうすればよいですか？](#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud)
- [クラスター作成後、クラスターに接続できないのはなぜですか？](#why-cant-i-connect-to-the-cluster-after-the-cluster-is-created)
- [Node.js SDKでZilliz Cloudに接続できない場合、どうすればよいですか？](#what-can-i-do-if-i-cannot-connect-to-zilliz-cloud-with-nodejs-sdk)
- [非アクティブなクラスターはどうなりますか？](#what-happens-to-my-inactive-clusters)
- [クラスターを一時停止した場合、料金は発生しますか？](#will-i-be-charged-if-i-suspend-my-cluster)
- [クラスターURIを取得するにはどうすればよいですか？](#how-to-obtain-a-cluster-uri)

## FAQ




### 無料クラスターの容量はどれくらいですか？{#what-is-the-capacity-of-a-free-cluster}

一般的に、無料クラスターは100万個の768次元ベクトルを処理できます。ただし、実際の容量はスキーマによって異なります。

データが無料クラスターの最大容量を超える場合は、ServerlessまたはDedicatedデプロイオプションに[アップグレード](./select-zilliz-cloud-service-plans)して新しいクラスターを作成し、そこに[データを移行](./offline-migration)してください。クラスターの容量に関する詳細については、[適切なCUの選択](./cu-types-explained#assess-capacity)を参照してください。

### "quota exceeded\[reason=disk quota exceeded, please allocate more resources" というエラーが表示された場合、どうすればよいですか？{#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources}

データを挿入またはアップサートする際に、データがクラスターのCU容量を超えているため、このエラーが表示されます。無料クラスターは100万個の768次元ベクトルを処理できます。専用クラスターの容量は、その[CUタイプとCUサイズ](./cu-types-explained#assess-capacity)によって異なります。

この問題に対処するには、以下の手順に従ってください。

- 無料クラスターを使用している場合は、ServerlessまたはDedicatedデプロイオプションに[アップグレード](./manage-cluster)してください。

- 専用クラスターを使用している場合は、CUサイズを増やすことで[クラスターをスケールアップ](./scale-query-cu)してください。

### 専用クラスター作成後、CU タイプを変更できますか？{#can-i-change-the-cu-type-after-my-dedicated-cluster-is-created}

はい、できます。CUタイプを変更するには、以下の手順に従う必要があります。

1. 目的のCUタイプで新しいクラスターを作成します。[計算ツール](https://zilliz.com/pricing#calculator)を使用して、この新しいクラスターのCUサイズを決定します。

1. 現在のクラスターから、作成したばかりの新しいクラスターにデータを[移行](./offline-migration)します。または、[お問い合わせ](https://support.zilliz.com/hc/en-us)いただくと、クラスター間のデータ移行を代行することも可能です。その際は、ソースクラスターとターゲットクラスターを明記してください。

### クラスター作成後、クラスターのクラウドリージョンを変更できますか？{#can-i-change-the-cloud-region-of-my-cluster-after-it-is-created}

はい、できます。クラスターのクラウドリージョンを変更するには、以下の手順に従う必要があります。

1. 目的のクラウドリージョンで新しいクラスターを作成します。

1. 現在のクラスターから、作成したばかりの新しいクラスターにデータを[移行](./offline-migration)します。または、[お問い合わせ](https://support.zilliz.com/hc/en-us)いただくと、クラスター間のデータ移行を代行することも可能です。その際は、ソースクラスターとターゲットクラスターを明記してください。

### クラスターのCUサイズをスケールダウンするにはどうすればよいですか？{#how-can-i-scale-down-my-cluster-cu-size}

はい、できます。クラスターのCUサイズをスケールダウンするには、[Zilliz Cloud コンソール](https://cloud.zilliz.com/signup)の**Summary**セクションに移動し、CU **Size**の横にある**Scale**をクリックします。これにより、CUサイズを増減できるスケーリングページが開きます。クラスターをスケールダウンする前に、CUサイズがデータ量とワークロード容量に対応できることを確認してください。

詳細については、[クラスターのスケール](./scale-query-cu)を参照してください。

### AWSに無料クラスターをデプロイできますか？{#can-i-deploy-a-free-cluster-on-aws}

はい、できます。無料クラスターは、AWS eu-central-1 (ドイツ、フランクフルト) または Google Cloud us-west1 (米国、オレゴン) のいずれかにデプロイできます。他のクラウドリージョンにクラスターをデプロイするには、Dedicatedデプロイオプションにアップグレードするだけです。サポートされているクラウドプロバイダーとリージョンの完全なリストについては、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions)を参照してください。

### Zilliz Cloudへの接続を試みた際に、接続タイムアウトエラーが発生した場合、どうすればよいですか？{#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud}

Zilliz Cloud クラスターへの接続を確立するには、いくつかの関連パラメーターを指定する必要があります。たとえば、PyMilvus SDK の接続メソッドは以下のように使用できます。

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

    Zilliz CloudクラスターはTLSが有効になっているため、クラスターに正常に接続するには、接続パラメータに`secure`を含め、上記の例に示すように`true`に設定してください。そうしないと、接続に失敗し、タイムアウトエラーが表示される可能性があります。

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

1. `telnet in01-(uuid).(region).vectordb.zillizcloud.com port-number`を実行して、ポートの接続性をテストします。

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

### 非アクティブなクラスターはどうなりますか？{#what-happens-to-my-inactive-clusters}

無料クラスターは、7日間非アクティブ状態が続くと、通知とともに自動的に一時停止されます。必要に応じていつでもクラスターを再開できます。ただし、専用クラスターは、長期間の非アクティブ状態によって自動的に一時停止されることはありません。コストを節約するために、専用クラスターを手動で一時停止することをお勧めします。

### クラスターを一時停止した場合でも料金は発生しますか？{#will-i-be-charged-if-i-suspend-my-cluster}

クラスターが一時停止されている場合、コンピューティングではなくストレージに対してのみ課金されます。ストレージコストの詳細については、[料金](https://zilliz.com/pricing)を参照してください。

### クラスターURIを取得するにはどうすればよいですか？{#how-to-obtain-a-cluster-uri}
クラスターURIとは、接続に使用できるクラスターエンドポイントのことです。

URIはZilliz Cloudウェブコンソールから取得できます。詳細については、[クラスターへの接続](./connect-to-cluster#connect-to-a-cluster)を参照してください。
