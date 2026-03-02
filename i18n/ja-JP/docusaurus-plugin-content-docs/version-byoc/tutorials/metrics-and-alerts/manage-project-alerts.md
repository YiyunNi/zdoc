---
title: "プロジェクトアラートの管理 | BYOC"
slug: /manage-project-alerts
sidebar_label: "プロジェクトアラートの管理"
beta: FALSE
notebook: FALSE
description: "プロジェクトアラートは、指定された条件が満たされたときに通知を送信することで、Zilliz Cloudクラスターのプロアクティブな監視を可能にします。CU容量、クエリパフォーマンスなどのクラスターメトリクスを監視するようにプロジェクトアラートを設定でき、注意が必要な潜在的な問題がすぐに通知されるようにします。 | BYOC"
type: origin
token: NvDLw4kFji0xeWkc4Hpc9wUfnRh
sidebar_position: 4
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - プロジェクト
  - アラート
  - HNSW
  - 非構造化データとは
  - ベクトル埋め込み
  - ベクトルストア

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# プロジェクトアラートの管理

プロジェクトアラートは、指定された条件が満たされたときに通知を送信することで、Zilliz Cloudクラスターのプロアクティブな監視を可能にします。CU容量、クエリパフォーマンスなどのクラスターメトリクスを監視するようにプロジェクトアラートを設定でき、注意が必要な潜在的な問題がすぐに通知されるようにします。

## 開始する前に{#before-you-start}

プロジェクトアラートを作成または管理する前に、以下を確認してください。

- **Organization Owner**または**Project Admin**ロールアクセス

## プロジェクトアラートの表示{#view-project-alerts}

左サイドバーの**Project Alerts**に移動して、プロジェクトアラートダッシュボードにアクセスします。

<Supademo id="cmb5xa9pg39f6ppkpjwalrmro" title="Zilliz Cloud - View Project Alerts Demo" />

### アラート履歴{#alert-history}

過去のイベントを調査したり、アラートパターンを理解したり、システム信頼性を実証したりする必要がある場合は、**History**タブを使用します。

### アラート設定{#alert-settings}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"Bash","value":"Bash"}]}>

<TabItem value="Cloud Console">

**Settings**タブを使用して、設定されているすべてのアラートとその現在のステータスを確認します。これにより、監視範囲の一元的なビューが提供されます。

アラートを表示する際には、以下の設定項目が表示されます。

<table>
   <tr>
     <th><p>フィールド</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>名前</p></td>
     <td><p>アラートの記述的な識別子（例：「高CU使用率 - 専用クラスター」、「P99クエリレイテンシー」）</p></td>
   </tr>
   <tr>
     <td><p>ステータス</p></td>
     <td><p>現在のアラート状態を示すトグルスイッチ：有効（アクティブ監視）または無効（通知なし）</p></td>
   </tr>
   <tr>
     <td><p>ターゲットクラスター</p></td>
     <td><p>監視対象クラスター - 特定のクラスター（例：「Dedicated-02, Dedicated-01」）またはすべてのDedicatedクラスター（後で作成されるものを含む）</p></td>
   </tr>
   <tr>
     <td><p>メトリクスと条件</p></td>
     <td><p>監視対象パラメーターとトリガー設定の組み合わせ表示（例：「CU容量 > 80%、期間 >= 10分」、「クエリレイテンシー (P99) > 1000 ms、期間 >= 10分」）</p></td>
   </tr>
   <tr>
     <td><p>重要度レベル</p></td>
     <td><p>影響分類</p><ul><li><p><strong>Warning:</strong> 制限に近づいている</p></li><li><p><strong>Critical:</strong> 直ちに対応が必要</p></li></ul></td>
   </tr>
   <tr>
     <td><p>受信者</p></td>
     <td><p>設定されたメールアドレスと通知チャネルを含む通知受信者。</p><p>利用可能な通知チャネルのリストについては、<a href="./manage-notification-channels">通知チャネルの管理</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>アラート間隔</p></td>
     <td><p>各アラート送信後、設定された期間、繰り返しの通知を抑制します。</p><ul><li><p>アラートが継続する場合、その間隔中は通知は再送信されません。次の間隔に入る前に通知が再送信されます。</p></li><li><p>アラートが解決された場合、アラート間隔はリセットされ、アラート評価が再開されます。</p></li></ul></td>
   </tr>
   <tr>
     <td><p>アクション</p></td>
     <td><p>利用可能な管理オプション：編集、複製、削除</p></td>
   </tr>
</table>

</TabItem>
<TabItem value="Bash">

特定のプロジェクト用に作成されたアラートリストを表示できます。パラメーターの詳細については、[List Alert Rules](/reference/restful/list-alert-rules-v2)を参照してください。

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

## プロジェクトアラートの作成{#create-a-project-alert}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"Bash","value":"Bash"}]}>

<TabItem value="Cloud Console">

クラスターのパフォーマンスと健全性をさまざまな側面から監視するために、新しいアラートを設定します。

<Supademo id="cmb5w29ip399appkp45y9k3u2" title="Zilliz Cloud - Create Project Alerts Demo" />

</TabItem>
<TabItem value="Bash">

特定のDedicatedクラスターまたはすべてのDedicatedクラスターに対してアラートを作成できます。パラメータの詳細については、[アラートルールの作成](/reference/restful/create-alert-rule-v2)を参照してください。

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

## プロジェクトアラートの管理{#manage-project-alerts}

既存のアラートを変更、整理、維持して、監視を関連性のある効果的なものに保ちます。

<Supademo id="cmb5ywkim01nozo0iqfsmhy3q" title="Manage Project Alerts" isShowcase="true" />

<Admonition type="info" icon="📘" title="Notes">

<p>プロジェクトアラートはRESTful API経由でも管理できます。詳細については、<a href="/reference/restful/update-alert-rule-v2">アラートルールの更新</a>および<a href="/reference/restful/delete-alert-rule-v2">アラートルールの削除</a>を参照してください。</p>

</Admonition>

### アラートの無効化または有効化{#disable-or-enable-an-alert}

設定を失うことなくアクティブな監視を制御します。

- **無効なアラート:** 通知の送信を停止しますが、すべての設定を保持します。

- **有効なアラート:** クラスターを積極的に監視し、しきい値を超えたときに通知を送信します。

### アラートの編集{#edit-an-alert}

監視要件が変更されたときにアラート設定を更新します。

次のアラートパラメータをすべて変更します。

- しきい値と比較演算子

- ターゲットクラスターとメトリックタイプ

- 通知チャネル、受信者、アラート間隔

- 重大度レベルと期間設定

### アラートのクローン作成{#clone-an-alert}

最小限のセットアップで類似のアラートを作成します。クローン作成は既存のすべての設定をコピーするため、次のことが可能になります。

- さまざまなクラスター環境のバリアントを作成する

- 他のパラメータを維持しながらしきい値を調整する

- 複数のプロジェクトで監視を拡張する

### アラートの削除{#delete-an-alert}

古くなった監視ルールや冗長な監視ルールを削除します。

<Admonition type="danger" icon="🚧" title="Warning">

<p>アラートの削除は永続的であり、元に戻すことはできません。続行する前に、アラートが不要であることを確認してください。</p>

</Admonition>

## アラート受信者設定の構成{#configure-alert-receiver-settings}

プロジェクト全体のデフォルト通知設定を設定し、チーム全体で一貫した監視プラクティスを確保します。

<Supademo id="cmb5zptc03acdppkpy0vk18f9" title="Zilliz Cloud - Configure Alert Receiver Settings Demo" />

設定を構成する際には、次の概念に遭遇します。

- **送信先**: 新しいアラートに対して自動的に選択されるデフォルトの通知チャネル (メール、Slack、Webhooks)。最も一般的に使用されるチャネルを構成して、アラート作成を効率化します。

- **アラート解決通知**: 有効にすると、アラートが解決されたときに通知を受け取ります。

- **既存のアラートに設定を適用**: 新しいデフォルト設定で既存のすべてのアラートを更新するかどうかを選択します。

## FAQ{#faq}

### アラートがトリガーされた場合、どのくらいの頻度でアラート通知を受け取りますか？{#how-often-will-i-receive-alert-notifications-when-an-alert-is-triggered}

アラート通知は自動頻度パターンに従います。

- **最初の通知**: アラートしきい値を超えるとすぐに送信されます。

- **2番目の通知**: 状態が継続する場合、1時間後に送信されます。

- **その後の通知**: アラート状態がアクティブな間、毎日1回送信されます。

通知が頻繁すぎる場合は、次のことができます。

- [アラートを編集](./manage-project-alerts#edit-an-alert)して、条件しきい値または期間要件を調整します。

- [アラートを一時的に無効にする](./manage-project-alerts#disable-or-enable-an-alert)ことで、設定を保持しながらすべての通知を停止します。

