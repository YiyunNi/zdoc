---
title: "FAQ: クラスター | CLOUD"
slug: /faq-cluster
sidebar_label: "FAQ: クラスター"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題と、それに対応する解決策を一覧にしています。| CLOUD"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 2

---

# FAQ: クラスター

このトピックでは、Zilliz Cloud クラスターの使用中に発生する可能性のある問題と、それに対応する解決策を一覧にしています。

## 目次

- [フリークラスターの容量はどれくらいですか？](#what-is-the-capacity-of-a-free-cluster)
- ["quota exceeded\[reason=disk quota exceeded, please allocate more resources"というエラーを受け取った場合、どうすればよいですか？](#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources)
- [専用クラスター作成後に CU タイプを変更できますか？](#can-i-change-the-cu-type-after-my-dedicated-cluster-is-created)
- [クラスター作成後にクラウドリージョンを変更できますか？](#can-i-change-the-cloud-region-of-my-cluster-after-it-is-created)
- [クラスターの CU サイズをスケールダウンするにはどうすればよいですか？](#how-can-i-scale-down-my-cluster-cu-size)
- [AWS にフリークラスターをデプロイできますか？](#can-i-deploy-a-free-cluster-on-aws)
- [Zilliz Cloud への接続を試みた際に接続タイムアウトエラーが発生した場合、どう対処すればよいですか？](#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud)
- [クラスター作成後にクラスターに接続できないのはなぜですか？](#why-cant-i-connect-to-the-cluster-after-the-cluster-is-created)
- [Node.js SDK で Zilliz Cloud に接続できない場合、どうすればよいですか？](#what-can-i-do-if-i-cannot-connect-to-zilliz-cloud-with-nodejs-sdk)
- [非アクティブなクラスターはどうなりますか？](#what-happens-to-my-inactive-clusters)
- [クラスターを一時停止しても課金されますか？](#will-i-be-charged-if-i-suspend-my-cluster)
- [クラスター URI を取得するにはどうすればよいですか？](#how-to-obtain-a-cluster-uri)
- [Zilliz Cloud を Attu に接続できますか？](#can-i-connect-zilliz-cloud-to-attu)

## よくある質問




### フリークラスターの容量はどれくらいですか？\{#what-is-the-capacity-of-a-free-cluster}

一般に、フリークラスターは 100 万個の 768 次元ベクトルを処理できます。ただし、実際の容量はスキーマによって異なります。

データがフリークラスターの最大容量を超えた場合は、[アップグレード](./select-zilliz-cloud-service-plans) して Serverless または Dedicated デプロイメントオプションを選択し、新しいクラスターを作成して、そこに [データを移行](./offline-migration) してください。クラスターの容量の詳細については、[適切な CU の選択](./cu-types-explained#assess-capacity) をご参照ください。

### "quota exceeded\[reason=disk quota exceeded, please allocate more resources"というエラーを受け取った場合、どうすればよいですか？\{#what-can-i-do-if-i-receive-the-error-quota-exceededreasondisk-quota-exceeded-please-allocate-more-resources}

データの挿入またはアップサート時にこのエラーが表示されるのは、データがクラスターの CU 容量を超えているためです。フリークラスターは 100 万個の 768 次元ベクトルを処理できます。専用クラスターの容量は、その [CU タイプと CU サイズ](./cu-types-explained#assess-capacity) によって異なります。

この問題に対処するには、以下の手順に従ってください。

- フリークラスターを使用している場合は、Serverless または Dedicated デプロイメントオプションに [アップグレード](./manage-cluster) してください。

- 専用クラスターを使用している場合は、CU サイズを増やすことでクラスターを [スケールアップ](./scale-query-cu) してください。

### 専用クラスター作成後に CU タイプを変更できますか？\{#can-i-change-the-cu-type-after-my-dedicated-cluster-is-created}

はい。CU タイプを変更するには、以下の手順に従ってください。

1. 希望する CU タイプで新しいクラスターを作成します。この新しいクラスターの CU サイズを決定するには、[計算機](https://zilliz.com/pricing#calculator) を使用してください。

1. 現在のクラスターから新しく作成したクラスターへデータを [移行](./offline-migration) します。あるいは、クラスター間のデータ移行を当社に代行させるために [お問い合わせ](https://support.zilliz.com/hc/en-us) いただくこともできます。お問い合わせの際は、ソースクラスターとターゲットクラスターを明記してください。

### クラスター作成後にクラウドリージョンを変更できますか？\{#can-i-change-the-cloud-region-of-my-cluster-after-it-is-created}

はい。クラスターのクラウドリージョンを変更するには、以下の手順に従ってください。

1. 希望するクラウドリージョンで新しいクラスターを作成します。

1. 現在のクラスターから新しく作成したクラスターへデータを [移行](./offline-migration) します。あるいは、クラスター間のデータ移行を当社に代行させるために [お問い合わせ](https://support.zilliz.com/hc/en-us) いただくこともできます。お問い合わせの際は、ソースクラスターとターゲットクラスターを明記してください。

### クラスターの CU サイズをスケールダウンするにはどうすればよいですか？\{#how-can-i-scale-down-my-cluster-cu-size}

はい。クラスターの CU サイズをスケールダウンするには、[Zilliz Cloud コンソール](https://cloud.zilliz.com/signup) の **Summary** セクションに移動し、CU **Size** の横にある **Scale** をクリックしてください。これにより、CU サイズを増減できるスケーリングページが開きます。クラスターをスケールダウンする前に、CU サイズがデータ量とワークロード容量に対応できることを確認してください。

詳細については、[クラスターのスケール](./scale-query-cu) をご参照ください。

### AWS にフリークラスターをデプロイできますか？\{#can-i-deploy-a-free-cluster-on-aws}

はい。フリークラスターは、AWS eu-central-1（ドイツ・フランクフルト）または Google Cloud us-west1（アメリカ・オレゴン）のいずれかにデプロイできます。他のクラウドリージョンにクラスターをデプロイするには、Dedicated デプロイメントオプションにアップグレードしてください。サポートされているクラウドプロバイダーとリージョンの一覧については、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions) をご参照ください。

### Zilliz Cloud への接続を試みた際に接続タイムアウトエラーが発生した場合、どう対処すればよいですか？\{#how-can-i-deal-with-a-connection-timeout-error-when-i-attempt-to-connect-to-zilliz-cloud}

Zilliz Cloud クラスターに接続するには、いくつかの関連パラメータを提供する必要があります。例えば、PyMilvus SDK の connect メソッドは以下のように使用できます。

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

- ネットワーク状態が不良な場合

    ネットワーク状態が不良な場合は、接続操作のタイムアウト時間を延長することを推奨します。上記のコードでは、`timeout` が `30` 秒に設定されており、リクエスト送信後30秒以内に応答がない場合、接続操作はタイムアウトします。

- 接続パラメータが正しくない場合

    Zilliz Cloud クラスターは TLS が有効になっているため、クラスターに正常に接続するには、上記の例のように接続パラメータに `secure` を含め、その値を `true` に設定する必要があります。これを設定しないと、接続に失敗し、タイムアウトエラーが表示される可能性があります。

- ローカルの IP アドレスがホワイトリストに登録されていない場合

    クラスターへの接続を試みる際には、VPN/プロキシ接続を無効にし、パブリック IP アドレス（プライベート IP アドレスは機能しません）を取得して、接続したいクラスターのホワイトリストにその IP アドレスを追加する必要があります。

### クラスター作成後にクラスターに接続できないのはなぜですか？\{#why-cant-i-connect-to-the-cluster-after-the-cluster-is-created}

以下の手順に従って問題を特定できます。

1. クラスターのステータスが RUNNING であるか確認してください。クラスターが作成中、削除中、または IP ホワイトリストが更新中の場合、クラスターに接続できません。

1. 接続元の IP アドレスが IP ホワイトリストに含まれているか確認してください。

1. クラスターのエンドポイント URI 内のポート番号が正しいか確認してください。Zilliz Cloud ウェブコンソールからエンドポイント URI をコピーしていることを確認してください。以下の表は、異なるクラウドプロバイダー上にデプロイされたクラスターのポート番号を示しています。

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

1. `telnet in01-(uuid).(region).vectordb.zillizcloud.com port-number` を実行してポートの接続性をテストしてください。

上記の手順をすべて試しても問題が解決しない場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us)してください。

### Node.js SDK で Zilliz Cloud に接続できない場合はどうすればよいですか？\{#what-can-i-do-if-i-cannot-connect-to-zilliz-cloud-with-nodejs-sdk}

Node.js SDK を使用して Zilliz Cloud への接続に失敗した場合は、以下の対応をお試しください。

1. 最新バージョンの [Node.js SDK](https://github.com/milvus-io/milvus-sdk-node) がインストールされていることを確認してください。

1. クライアントが正しく初期化されていることを確認してください。

    ```bash
    const client = new MilvusClient('https://your-db-address-with-port', true, 'your-db-user', 'your-db-pasword');
    ```

1. クラスターエンドポイントとトークンが正しいことを確認してください。クラスターエンドポイントにはプロトコル `https://` を含めてください。

1. クラスターエンドポイント URI のポートが正しいか確認してください。エンドポイント URI は Zilliz Cloud Web コンソールからコピーしてください。以下の表は、異なるクラウドプロバイダーにデプロイされたクラスターのポートを一覧表示しています。

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

1. IP アドレスがクラスター設定でホワイトリストに登録されている必要があります。

### What happens to my inactive clusters?\{#what-happens-to-my-inactive-clusters}

フリークラスターは、7 日間非アクティブ状態が続くと、通知後に自動的に一時停止されます。必要に応じていつでもクラスターを再開できます。ただし、専用クラスターは長期間非アクティブであっても自動的に一時停止されることはありません。コストを節約するため、専用クラスターは手動で一時停止することをお勧めします。

### Will I be charged if I suspend my cluster?\{#will-i-be-charged-if-i-suspend-my-cluster}

クラスターが一時停止されている場合、コンピューティングリソースではなくストレージのみに対して課金されます。ストレージコストの詳細については、[料金](https://zilliz.com/pricing) をご覧ください。

### How to obtain a cluster URI?\{#how-to-obtain-a-cluster-uri}
クラスター URI とは、接続に使用できるクラスターエンドポイントのことを指します。

URI は Zilliz Cloud Web コンソールから取得できます。詳細については、[クラスターへの接続](./connect-to-cluster#connect-to-a-cluster) を参照してください。

### Can I connect Zilliz Cloud to Attu?\{#can-i-connect-zilliz-cloud-to-attu}

はい。[Attu](https://github.com/zilliztech/attu) は、Milvus および Zilliz Cloud 向けのオープンソースの視覚的管理ツールです。Docker コンテナまたはデスクトップアプリとして実行できます。接続するには、Attu のログインページで Zilliz Cloud の**パブリックエンドポイント**と**API キー**（または username:password 形式のクラスター認証情報）を提供してください。
