---
title: "クラスターIP許可リストの設定 | Cloud"
slug: /setup-whitelist
sidebar_label: "クラスターIP許可リストの設定"
beta: FALSE
notebook: FALSE
description: "Zilliz CloudのクラスターIP許可リストは、プロジェクトレベルで堅牢なセキュリティレイヤーとして機能し、指定されたプロジェクト内のすべてのクラスターにその利点を拡張します。IP許可リストを実装することで、プロジェクトのクラスターへのアクセスを特定のIPアドレスグループに効果的に絞り込み、悪意のある攻撃のリスクを大幅に軽減します。 | Cloud"
type: origin
token: FnS1wY0iuia4qgkMycVclZyHnOf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - ホワイトリスト
  - セットアップ
  - RAGベクトルデータベース
  - ベクトルDBとは
  - ベクトルデータベースとは
  - ベクトルデータベース比較

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# クラスター IP 許可リストの設定

Zilliz Cloud のクラスター IP 許可リストは、プロジェクトレベルで堅牢なセキュリティレイヤーとして機能し、指定されたプロジェクト内のすべてのクラスターにその利点をもたらします。IP 許可リストを実装することで、プロジェクトのクラスターへのアクセスを特定の IP アドレスのグループに効果的に絞り込み、悪意のある攻撃のリスクを大幅に軽減します。

## 開始する前に{#before-you-start}

続行する前に、以下の前提条件が満たされていることを確認してください。

- Zilliz Cloud にサインアップしていること。アカウントの登録方法については、「[Zilliz Cloud への登録](./register-with-zilliz-cloud)」を参照してください。

- クラスター IP 許可リストを設定する組織またはプロジェクトの所有者であること。ロールと権限については、「[組織ユーザーの管理](./organization-users)」および「[プロジェクトユーザーの管理](./project-users)」を参照してください。

## 手順{#procedure}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. 許可リストを設定する特定の組織とプロジェクトに移動します。

1. 左側のナビゲーションペインで、**Security** > **Cluster IP Allowlist** を選択します。

1. **Add IP Address** をクリックします。

1. 表示されるダイアログボックスで、**IP Address (CIDR)** と **Description** を指定します。

    以下の表にフィールドの説明を示します。

    <table>
       <tr>
         <th><p><strong>フィールド</strong></p></th>
         <th><p><strong>説明</strong></p></th>
       </tr>
       <tr>
         <td><p>IP Address (CIDR)</p></td>
         <td><p>許可リストに追加する IP アドレスまたは CIDR ブロック。最大 100 個の CIDR ブロックが許可されます。例: 192.168.1.1/20。</p></td>
       </tr>
       <tr>
         <td><p>Description</p></td>
         <td><p>許可リストに追加する IP アドレスまたは CIDR ブロックの説明。</p></td>
       </tr>
    </table>

1. **Add** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>許可リストにエントリがない場合、Zilliz Cloud は任意の IP アドレスからのアクセスを許可します。</p></li>
<li><p>CIDR ブロックを追加すると、クラスターへのアクセスはそのブロック内の IP アドレスに限定されます。</p></li>
<li><p>0.0.0.0/0 を追加することは、空の許可リストを持つことと同じです。</p></li>
</ul>

</Admonition>

![whitelist-ip-access](https://zdoc-images.s3.us-west-2.amazonaws.com/whitelist-ip-access.png "whitelist-ip-access")

## 関連トピック{#related-topics}

- [API キー](./manage-api-keys)

- [クラスター認証情報 (コンソール)](./cluster-credentials)

- [プライベートリンクの設定](./setup-a-private-link)

