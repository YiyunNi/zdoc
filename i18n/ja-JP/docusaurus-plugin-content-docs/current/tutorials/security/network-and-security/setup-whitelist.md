---
title: "クラスタのIP許可リストを設定 | Cloud"
slug: /setup-whitelist
sidebar_key: setup-whitelist
sidebar_label: "クラスタのIP許可リストを設定"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のクラスタ IP 許可リストは、プロジェクトレベルで機能する強固なセキュリティ層であり、指定したプロジェクト内のすべてのクラスタにその利点を拡張します。IP 許可リストを実装することで、プロジェクトのクラスタへのアクセスを特定の IP アドレスのグループに限定でき、悪意のある攻撃のリスクを大幅に軽減できます。"
type: origin
token: FnS1wY0iuia4qgkMycVclZyHnOf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ホワイトリスト
  - セットアップ

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# クラスター IP 許可リストの設定

Zilliz Cloud のクラスター IP 許可リストは、プロジェクトレベルで機能する堅牢なセキュリティ層であり、指定されたプロジェクト内のすべてのクラスターにその利点を拡張します。IP 許可リストを実装することで、プロジェクトのクラスターへのアクセスを選ばれた IP アドレスのグループに効果的に絞り込むことができ、悪意のある攻撃のリスクを大幅に軽減できます。

## 開始前の準備\{#before-you-start}

以下の前提条件が満たされていることを確認してください。

- Zilliz Cloud にサインアップしていること。アカウントの登録方法については、[Zilliz Cloud への登録](./register-with-zilliz-cloud) を参照してください。

- クラスター IP 許可リストを設定したい組織またはプロジェクトの所有者であること。ロールと権限については、[組織ユーザーの管理](./organization-users) および [プロジェクトユーザーの管理](./project-users) を参照してください。

## 手順\{#procedure}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. 許可リストを設定する特定の組織およびプロジェクトに移動します。

1. 左側のナビゲーションペインで、**Security** > **Cluster IP Allowlist** を選択します。

1. **Add IP Address** をクリックします。

1. 表示されたダイアログボックスで、**IP Address (CIDR)** と **Description** を指定します。

    以下の表に各フィールドの説明を示します。

    <table>
       <tr>
         <th><p><strong>Field</strong></p></th>
         <th><p><strong>Description</strong></p></th>
       </tr>
       <tr>
         <td><p>IP Address (CIDR)</p></td>
         <td><p>許可リストに追加する IP アドレスまたは CIDR ブロック。最大 100 個の CIDR ブロックを指定できます。例: 192.168.1.1/20。</p></td>
       </tr>
       <tr>
         <td><p>Description</p></td>
         <td><p>許可リストに追加する IP アドレスまたは CIDR ブロックの説明。</p></td>
       </tr>
    </table>

1. **Add** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

- 許可リストにエントリがない場合、Zilliz Cloud は任意の IP アドレスからのアクセスを許可します。

- CIDR ブロックを追加すると、そのブロック内の IP アドレスからのアクセスに限定されます。

- 0.0.0.0/0 を追加することは、許可リストが空の状態と同等です。

</Admonition>

![whitelist-ip-access](https://zdoc-images.s3.us-west-2.amazonaws.com/whitelist-ip-access.png "whitelist-ip-access")

## 関連トピック\{#related-topics}

- [APIキーs](./manage-api-keys)

- [Cluster Credentials (Console)](./cluster-credentials)

- [Set up a プライベート Link](./setup-a-private-link)

