---
title: "プロジェクトアラートの管理 | BYOC"
slug: /manage-project-alerts
sidebar_key: manage-project-alerts
sidebar_label: "プロジェクトアラートを管理"
beta: FALSE
notebook: FALSE
description: "プロジェクトアラートは、指定した条件が満たされたときに通知を送信することで、Zilliz Cloud クラスターのプロアクティブな監視を可能にします。CU容量やクエリパフォーマンスなどのクラスターメトリクスを監視するようプロジェクトアラートを設定でき、注意が必要な潜在的な問題が発生した際に即座に通知を受け取ることができます。 | BYOC"
type: origin
token: NvDLw4kFji0xeWkc4Hpc9wUfnRh
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - project
  - alerts

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# プロジェクトアラートの管理

プロジェクトアラートは、指定された条件が満たされたときに通知を送信することで、Zilliz Cloud クラスターのプロアクティブな監視を可能にします。CU容量やクエリパフォーマンスなどのクラスターメトリクスを監視するようプロジェクトアラートを設定でき、注意が必要な潜在的な問題が発生した際に即座に通知を受け取ることができます。

## 開始前に\{#before-you-start}

プロジェクトアラートの作成または管理を行う前に、以下を確認してください:

- **組織オーナー** または **プロジェクト管理者** のロールアクセス権限

## プロジェクトアラートの表示\{#view-project-alerts}

左サイドバーの **プロジェクトアラート** に移動して、プロジェクトアラートダッシュボードにアクセスします。

<Supademo id="cmb5xa9pg39f6ppkpjwalrmro" title="Zilliz Cloud - View プロジェクトアラート Demo" />

### アラート履歴\{#alert-history}

過去のイベントを調査したり、アラートのパターンを理解したり、システムの信頼性を示す必要がある場合は、**履歴** タブを使用します。

### アラート設定\{#alert-settings}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"Bash","value":"Bash"}]}>

<TabItem value="Cloud Console">

**Settings** タブを使用して、設定済みのすべてのアラートとその現在のステータスを確認します。これにより、監視カバレッジの一元化されたビューが提供されます。

アラートを表示する際、以下の設定項目に遭遇します:

<table>
   <tr>
     <th><p>フィールド</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>名前</p></td>
     <td><p>アラートの説明的な識別子（例: "High CU Usage - Dedicated Clusters", "P99 Query Latency"）</p></td>
   </tr>
   <tr>
     <td><p>ステータス</p></td>
     <td><p>現在のアラート状態を示すトグルスイッチ: 有効（アクティブな監視）または 無効（通知なし）</p></td>
   </tr>
   <tr>
     <td><p>対象クラスター</p></td>
     <td><p>監視対象クラスター - 特定のクラスター（例: "Dedicated-02, Dedicated-01"）またはすべてのDedicatedクラスター（後から作成されるものも含む）</p></td>
   </tr>
   <tr>
     <td><p>メトリクスと条件</p></td>
     <td><p>監視対象パラメーターとトリガー設定の結合表示（例: "CU容量 &gt; 80%, Duration &gt;= 10 min", "Query Latency (P99) &gt; 1000 ms, Duration &gt;= 10 min"）</p></td>
   </tr>
   <tr>
     <td><p>重要度レベル</p></td>
     <td><p>影響の分類</p><ul><li><p><strong>警告:</strong> 制限に近づいている</p></li><li><p><strong>重大:</strong> 即時の対応が必要</p></li></ul></td>
   </tr>
   <tr>
     <td><p>受信者</p></td>
     <td><p>設定済みのメールアドレスと通知チャネルを含む通知の受信者。</p><p>利用可能な通知チャネルの一覧については、<a href="./manage-notification-channels">通知チャネルの管理</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>アラート間隔</p></td>
     <td><p>各アラート送信後、設定された時間の間、繰り返し通知を抑制します。</p><ul><li><p>アラートが継続する場合、間隔中は通知が再送信されません。次の間隔に入る前に通知が再送信されます。</p></li><li><p>アラートが解決された場合、アラート間隔はリセットされ、アラート評価が再開されます。</p></li></ul></td>
   </tr>
   <tr>
     <td><p>アクション</p></td>
     <td><p>利用可能な管理オプション: 編集、クローン、削除</p></td>
   </tr>
</table>

</TabItem>
<TabItem value="Bash">

特定のプロジェクトに対して作成されたアラートリストを表示できます。パラメーターの詳細については、[アラートルールの一覧表示](/reference/restful/list-alert-rules-v2) を参照してください。

```bash
export BASE_URL=https://api.cloud.zilliz.com
export PROJECT_ID=proj-bf71ce2fd4f3785d*****
export API_KEY=c84c9a9515**********81319c2f147ffdd47ad6c36b31c126d1b790f457619c23237eba9287de73575943d2bfebcecd728bd07e

curl --request GET \
     --url "${BASE_URL}/v2/alertRules?projectId=${PROJECT_ID}" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-type: application/json"
```

</TabItem>
</Tabs>

## Create a project alert\{#create-a-project-alert}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"Bash","value":"Bash"}]}>

<TabItem value="Cloud Console">

クラスターのパフォーマンスと健全性をさまざまな側面から監視するための新しいアラートを設定します。

<Supademo id="cmb5w29ip399appkp45y9k3u2" title="Zilliz Cloud - Create プロジェクトアラート Demo" />

</TabItem>
<TabItem value="Bash">

特定の Dedicated クラスターまたはすべての Dedicated クラスターに対してアラートを作成できます。パラメータの詳細については、[アラートルールの作成](/reference/restful/create-alert-rule-v2) を参照してください。

```bash
export BASE_URL=https://api.cloud.zilliz.com
export PROJECT_ID=proj-bf71ce2fd4f3785d*****
export API_KEY=c84c9a9515**********81319c2f147ffdd47ad6c36b31c126d1b790f457619c23237eba9287de73575943d2bfebcecd728bd07e

curl --request POST \
     --url "${BASE_URL}/v2/alertRules" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-type: application/json" \
     --data-raw '{
       "projectId": "'"${PROJECT_ID}"'",
       "ruleName": "High CU Computation",
       "level": "CRITICAL",
       "metricName": "CU_COMPUTATION",
       "metricUnit": "percent",
       "threshold": 80,
       "windowSize": 10,
       "comparisonMethod": "GREATER_THAN",
       "targetClusterIds": ["in01-fbc09dde0a4bfc5"],
       "enabled": true,
       "sendResolved": true,
       "actions": [
         {
           "type": "EMAIL",
           "config": {
             "recipients": {
               "members": ["leryn.li@zilliz.com"],
               "orgRoles": ["OWNER"],
               "projectRoles": ["OWNER"]
             }
           }
         }
       ]
     }'
```

</TabItem>
</Tabs>

## プロジェクトアラートの管理\{#manage-project-alerts}

既存のアラートを変更、整理、および維持して、監視の関連性と効果を保ちます。

<Supademo id="cmb5ywkim01nozo0iqfsmhy3q" title="Manage プロジェクトアラート" isShowcase="true" />

<Admonition type="info" icon="📘" title="Notes">

<p>プロジェクトアラートは RESTful API を使用して管理することもできます。詳細については、<a href="/reference/restful/update-alert-rule-v2">アラートルールの更新</a>および<a href="/reference/restful/delete-alert-rule-v2">アラートルールの削除</a>を参照してください。</p>

</Admonition>

### アラートの無効化または有効化\{#disable-or-enable-an-alert}

設定を失うことなく、アクティブな監視を制御します。

- **無効化されたアラート:** 通知の送信を停止しますが、すべての設定を保持します

- **有効化されたアラート:** クラスターをアクティブに監視し、しきい値を超えた場合に通知を送信します

### アラートの編集\{#edit-an-alert}

監視要件が変更された場合に、アラート設定を更新します。

以下を含むあらゆるアラートパラメータを変更できます：

- しきい値と比較演算子

- 対象クラスターとメトリックタイプ

- 通知チャネル、受信者、およびアラート間隔

- 重大度レベルと継続時間設定

### アラートのクローン\{#clone-an-alert}

最小限の設定作業で類似のアラートを作成します。クローン作成により、既存のすべての設定がコピーされ、以下が可能になります：

- 異なるクラスター環境用のバリアントを作成する

- 他のパラメータを保持したまましきい値を調整する

- 複数のプロジェクトにわたって監視をスケールする

### アラートの削除\{#delete-an-alert}

不要または重複した監視ルールを削除します。

<Admonition type="danger" icon="🚧" title="Warning">

<p>アラートの削除は永久であり、元に戻すことはできません。進める前に、アラートが不要であることを確認してください。</p>

</Admonition>

## アラート受信設定の構成\{#configure-alert-receiver-settings}

プロジェクト全体のデフォルト通知設定を構成し、チーム全体で一貫した監視プラクティスを確保します。

<Supademo id="cmb5zptc03acdppkpy0vk18f9" title="Zilliz Cloud - Configure Alert Receiver Settings Demo" />

設定を構成する際、以下の概念に遭遇します：

- **送信先**: 新しいアラートに自動的に選択されるデフォルトの通知チャネル（メール、Slack、Webhook）。最もよく使用するチャネルを構成して、アラート作成を効率化します。

- **アラート解決通知**: 有効にすると、アラートが解決されたときに通知を受け取ります。

- **既存のアラートに設定を適用**: 新しいデフォルト設定ですべての既存アラートを更新するかどうかを選択します。

## FAQ\{#faq}

### アラートがトリガーされたとき、アラート通知はどのくらいの頻度で受け取りますか？\{#how-often-will-i-receive-alert-notifications-when-an-alert-is-triggered}

アラート通知は自動的な頻度パターンに従います：

- **最初の通知**: アラートしきい値を超えたときに即座に送信されます

- **2番目の通知**: 状態が継続する場合、1時間後に送信されます

- **以降の通知**: アラート状態がアクティブな間、1日1回送信されます

通知が頻繁すぎると感じた場合、以下が可能です：

- [アラートを編集](./manage-project-alerts#edit-an-alert)して、条件のしきい値または継続時間要件を調整する

- [アラートを無効化](./manage-project-alerts#disable-or-enable-an-alert)して、設定を保持したまま一時的にすべての通知を停止する

