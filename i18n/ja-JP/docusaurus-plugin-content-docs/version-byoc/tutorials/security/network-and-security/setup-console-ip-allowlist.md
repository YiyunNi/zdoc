---
title: "コンソール IP アローリストの設定 | BYOC"
slug: /setup-console-ip-allowlist
sidebar_key: setup-console-ip-allowlist
sidebar_label: "コンソール IP アローリストを設定"
beta: FALSE
notebook: FALSE
description: "デフォルトでは、組織の Web コンソールは任意の IP アドレスからアクセス可能です。アクセスを制限してセキュリティを強化するには、コンソール IP アローリストを構成し、オフィスネットワークの IP など、指定されたアドレスからのみ Web コンソールにアクセスできるようにします。 | BYOC"
type: origin
token: E1BCwXVouiDrtpkWp5ecvdXHnAb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ネットワーク
  - セキュリティ

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# コンソール IP 許可リストの設定

デフォルトでは、組織の Web コンソールは任意の IP アドレスからアクセス可能です。アクセスを制限してセキュリティを強化するには、コンソール IP 許可リストを構成し、ユーザーがオフィスネットワークの IP など、指定されたアドレスからのみ Web コンソールにアクセスできるようにします。

コンソール IP 許可リストは、組織の Web コンソールにのみ適用されます。プロジェクトクラスターへのアクセスは制御しません。

## 制限\{#limits}

- 組織オーナーであること。

- コンソール許可リストに追加できる IP は最大 100 個までです。

## IP アドレスの追加\{#add-ip-address}

許可リストに IPv4 アドレス（例: `192.168.0.0`）または CIDR ブロック（`192.168.0.0/24`）を追加できます。

ロックアウトを防ぐため、現在の IP と頻繁に使用する IP を追加することをお勧めします。

<Admonition type="info" icon="📘" title="Notes">

`0.0.0.0/0` は任意の IP からのアクセスを許可します。

コンソール IP 許可リストの更新は 30 秒以内に有効になります。

</Admonition>

以下のデモでは、許可リストに IP アドレスを追加する方法を示しています。

<Supademo id="cmi79l9ih4slqb7b4yi1x32r1?utm_source=link" title=""  />

## IP アドレスの確認\{#view-ip-address}

許可リストを構成した後、いつでも IP を確認できます。

以下のデモでは、許可リスト内の IP アドレスを確認する方法を示しています。

<Supademo id="cmi79trxa4tbsb7b44fnxlgik?utm_source=link" title=""  />

## IP アドレスの削除\{#delete-ip-address}

IP または CIDR エントリを削除して、そのソースからのコンソールアクセスを拒否できます。すべてのエントリを削除すると、コンソールは任意の IP からアクセス可能になります。

<Admonition type="info" icon="📘" title="Notes">

コンソール IP 許可リストの更新は 30 秒以内に有効になります。

</Admonition>

以下のデモでは、許可リストから IP アドレスを削除する方法を示しています。

<Supademo id="cmi79zr2500s6z20jewbtd5xb?utm_source=link" title=""  />

## よくある質問\{#faqs}

1. **ロックアウトされた場合はどうすればよいですか？**

    ロックアウトされると、以下の画面が表示されます。

    ![YGKLbTmW7oYJkIxuyx2cf6cvnwh](https://zdoc-images.s3.us-west-2.amazonaws.com/ygklbtmw7oyjkixuyx2cf6cvnwh.png "YGKLbTmW7oYJkIxuyx2cf6cvnwh")

    以下の復旧オプションをお試しください：

    - 許可リストに登録されている IP のネットワークから接続する（例: オフィス VPN）。

    - まだアクセスできる組織オーナーに、新しい IP の追加を依頼する。

    - オーナーが誰もコンソールにアクセスできない場合は、[サポートにお問い合わせ](http://support.zilliz.com) ください。

1. **コンソール IP 許可リストを更新した場合、現在サインインしているユーザーにはどうなりますか？**

    更新は新規サインインに適用されます。既存のセッションは通常、期限切れになるかユーザーがサインアウトするまで継続します。許可リストを即座に適用するには、組織のユーザーにサインアウトしてから再度サインインするよう依頼してください。

1. **SSO または MFA はコンソール IP 許可リストをバイパスしますか？**

    いいえ。[SSO](./single-sign-on)、[MFA](./multi-factor-auth)、および組織コンソール IP 許可リストは、それぞれ独立した制御です。

1. **組織コンソール IP 許可リストはクラスターアクセスに影響しますか？**

    いいえ。コンソール IP 許可リストは Web コンソールへのアクセスのみを制限します。

1. **動的 IP を使用している場合はどうすればよいですか？**

    インターネットサービスプロバイダー（ISP）がアドレスをローテーションする場合、自分の範囲をカバーする小さな CIDR（例: `/29` または `/28`）を許可することを検討してください。

