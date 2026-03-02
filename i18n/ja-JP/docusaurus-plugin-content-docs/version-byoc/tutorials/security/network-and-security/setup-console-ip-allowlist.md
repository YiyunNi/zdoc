---
title: "コンソールIP許可リストの設定 | BYOC"
slug: /setup-console-ip-allowlist
sidebar_label: "コンソールIP許可リストの設定"
beta: FALSE
notebook: FALSE
description: "デフォルトでは、組織のWebコンソールは任意のIPアドレスからアクセス可能です。アクセスを制限し、セキュリティを強化するために、コンソールIP許可リストを設定し、オフィスネットワークのIPなど、指定されたアドレスからのみWebコンソールにアクセスできるようにします。| BYOC"
type: origin
token: E1BCwXVouiDrtpkWp5ecvdXHnAb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - ネットワーク
  - セキュリティ
  - NLP
  - ニューラルネットワーク
  - ディープラーニング
  - ナレッジベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# コンソールIP許可リストを設定する

デフォルトでは、組織のウェブコンソールは任意のIPアドレスからアクセス可能です。アクセスを制限し、セキュリティを強化するために、コンソールIP許可リストを設定し、ユーザーがオフィスネットワークのIPなど、指定されたアドレスからのみウェブコンソールにアクセスできるようにします。

コンソールIP許可リストは、組織のウェブコンソールにのみ適用されます。プロジェクトクラスターへのアクセスは制御しません。

## 制限事項{#limits}

- あなたは組織のオーナーであること。

- コンソール許可リストに追加できるIPは最大100個です。

## IPアドレスを追加する{#add-ip-address}

IPv4アドレス（例: `192.168.0.0`）またはCIDRブロック（`192.168.0.0/24`）を許可リストに追加できます。

ロックアウトを避けるため、現在のIPと頻繁に使用するIPを追加することをお勧めします。

<Admonition type="info" icon="📘" title="Notes">

<p><code>0.0.0.0/0</code> は、任意のIPからのアクセスを許可します。</p>
<p>コンソールIP許可リストの更新は、30秒以内に有効になります。</p>

</Admonition>

以下のデモは、許可リストにIPアドレスを追加する方法を示しています。

<Supademo id="cmi79l9ih4slqb7b4yi1x32r1?utm_source=link" title=""  />

## IPアドレスを表示する{#view-ip-address}

許可リストを設定した後、いつでもIPを確認できます。

以下のデモは、許可リスト内のIPアドレスを表示する方法を示しています。

<Supademo id="cmi79trxa4tbsb7b44fnxlgik?utm_source=link" title=""  />

## IPアドレスを削除する{#delete-ip-address}

IPまたはCIDRエントリを削除して、そのソースからのコンソールアクセスを拒否できます。すべてのエントリを削除すると、コンソールは任意のIPからアクセス可能になります。

<Admonition type="info" icon="📘" title="Notes">

<p>コンソールIP許可リストの更新は、30秒以内に有効になります。</p>

</Admonition>

以下のデモは、許可リストからIPアドレスを削除する方法を示しています。

<Supademo id="cmi79zr2500s6z20jewbtd5xb?utm_source=link" title=""  />

## よくある質問{#faqs}

1. **ロックアウトされた場合、どうすればよいですか？**

    ロックアウトされた場合、以下の画面が表示されます。

    ![YGKLbTmW7oYJkIxuyx2cf6cvnwh](https://zdoc-images.s3.us-west-2.amazonaws.com/ygklbtmw7oyjkixuyx2cf6cvnwh.png "YGKLbTmW7oYJkIxuyx2cf6cvnwh")

    以下の復旧オプションを試してください。

    - 許可リストにIPがあるネットワーク（例：オフィスVPN）から接続する。

    - アクセス権を持つ組織のオーナーに、新しいIPを追加してもらう。

    - オーナーが誰もコンソールにアクセスできない場合は、[サポートに連絡](http://support.zilliz.com)して支援を求めてください。

1. **コンソールIP許可リストを更新すると、現在サインインしているユーザーはどうなりますか？**

    更新は新しいサインインに適用されます。既存のセッションは通常、期限切れになるか、ユーザーがサインアウトするまで継続します。許可リストをすぐに適用するには、組織のユーザーにログアウトして再度ログインするよう依頼してください。

1. **SSOまたはMFAはコンソールIP許可リストをバイパスしますか？**

    いいえ。[SSO](./single-sign-on)、[MFA](./multi-factor-auth)、および組織のコンソールIP許可リストは別々の制御です。

1. **組織のコンソールIP許可リストはクラスターアクセスに影響しますか？**

    いいえ。コンソールIP許可リストは、ウェブコンソールへのアクセスのみを制限します。

1. **動的IPを使用している場合はどうなりますか？**

    インターネットサービスプロバイダー（ISP）がアドレスをローテーションする場合、範囲をカバーする小さなCIDR（例：`/29`または`/28`）を許可することを検討してください。

