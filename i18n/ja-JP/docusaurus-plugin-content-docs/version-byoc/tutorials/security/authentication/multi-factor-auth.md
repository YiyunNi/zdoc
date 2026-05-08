---
title: "MFA | BYOC"
slug: /multi-factor-auth
sidebar_key: multi-factor-auth
sidebar_label: "MFA"
beta: FALSE
notebook: FALSE
description: "認証は、Zilliz Cloud にサインインする際にユーザーの身元を確認するものです。このプロセスを強化するため、Zilliz Cloud は多要素認証（MFA）をサポートしています。 | BYOC"
type: origin
token: KHAMwm0HUiU6qdkH2LOcu0FFnug
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - mfa

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# MFA

認証は、Zilliz Cloud にサインインする際にあなたの身元を確認するプロセスです。このプロセスを強化するため、Zilliz Cloud は多要素認証（MFA）をサポートしています。

MFA を有効にすると、ログイン時に 2 つの要素を提供する必要があります。

- アカウントのパスワード

- 認証アプリからの TOTP（時刻ベースのワンタイムパスワード）（例：Google Authenticator、Microsoft Authenticator など）

<Admonition type="info" icon="📘" title="Notes">

Zilliz Cloud は、アカウントセキュリティの強化のため MFA をアップグレードしました。**2025 年 11 月 25 日**より、メールベースの MFA は非推奨となります。これまでメールベースの MFA を使用していたユーザーは、TOTP 認証アプリに切り替える必要があります。

</Admonition>

## 考慮事項\{#considerations}

- **SSO互換性**: 組織で [SSO](./single-sign-on) を有効にしている場合、MFA はアイデンティティプロバイダー（IdP）によって管理されます。この場合、IdP アカウントで MFA を設定するか、組織オーナーに問い合わせてください。

- **ログイン方法の互換性**: Zilliz Cloud の組み込み MFA 機能は、[メールアドレスとパスワードで登録](./register-with-zilliz-cloud#registration-options)したユーザーのみが利用できます。

    - アカウントが Google と連携している場合、MFA は Google によって管理されます。詳細については、[2 段階認証プロセスを有効にする](https://support.google.com/accounts/answer/185839?hl=en&ref_topic=7189195&sjid=2449417013251062800-AP) を参照してください。

    - アカウントが GitHub と連携している場合、MFA は GitHub によって管理されます。詳細については、[2 要素認証の設定](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication) を参照してください。

## MFA を有効にする\{#enable-mfa}

以下のデモでは、自分のアカウントで MFA を有効にする方法を示します。このデモでは Microsoft Authenticator を例として使用していますが、TOTP 互換の認証アプリであればどれでも使用できます。

<Supademo id="cmi72ns5s4jwob7b4ul2t1zz5?utm_source=link" title=""  />

## MFA を無効にする\{#disable-mfa}

<Admonition type="info" icon="📘" title="Notes">

組織で [MFA 強制適用](./multi-factor-auth#enforce-mfa-for-all-organization-users) が有効になっている場合、アカウントの MFA を無効にすることはできません。

</Admonition>

以下のデモでは、自分のアカウントで MFA を無効にする方法を示します。

<Supademo id="cmi7297fo4jq8b7b448ydxlhk?utm_source=link" title=""  />

## 組織のすべてのユーザーに MFA を強制適用する\{#enforce-mfa-for-all-organization-users}

<Admonition type="info" icon="📘" title="Notes">

この機能にアクセスするには、組織オーナーである必要があります。

この機能を使用するには、有効な支払い方法、**Enterprise** プロジェクト、および **Dedicated** クラスタが必要です。

</Admonition>

組織レベルの MFA 強制適用が有効になっている場合：

- 組織内のすべてのユーザーは、サインインするために [MFA を設定](./multi-factor-auth#enable-mfa) する必要があります。

- まだ MFA を有効にしていないユーザーは、次回ログイン時に設定を求められます。

- MFA の設定を完了しないユーザーは、組織にアクセスできません。

以下のデモでは、組織に MFA を強制適用する方法を示します。

<Supademo id="cmi71danb4is0b7b4eogo3s07?utm_source=link" title=""  />

## 組織の MFA 強制適用を無効にする\{#disable-mfa-enforcement-for-organization}

<Admonition type="info" icon="📘" title="Notes">

この機能にアクセスするには、組織オーナーである必要があります。

</Admonition>

組織レベルの MFA 強制適用が無効になっている場合：

- ユーザーは、組織にアクセスするために MFA を設定する必要がなくなります。

- すでに MFA を有効にしているユーザーは、既存の設定を保持し、自分のアカウントで [MFA をオフにする](./multi-factor-auth#disable-mfa) ことを選択できます。

以下のデモでは、組織の MFA 強制適用を無効にする方法を示します。

<Supademo id="cmi71q0gk4j6hb7b4xiywity3?utm_source=link" title=""  />

## トラブルシューティング\{#troubleshooting}

1. **認証アプリにアクセスできなくなった場合、どうすればよいですか？**

    認証アプリへのアクセスを失い、MFA を完了できない、またはログインできない場合は、組織オーナーに問い合わせるか、[Zilliz Cloud サポートに問い合わせ](http://support.zilliz.com) てください。

1. **自分のアカウントは SSO を使用しています。MFA はどのように処理されますか？**

    組織で SSO を有効にしている場合、MFA は Zilliz Cloud ではなくアイデンティティプロバイダー（IdP）によって管理されます。IdP アカウントで MFA を設定するか、組織オーナーに問い合わせてください。

1. **MFA を無効にできないのはなぜですか？**

    組織で MFA 強制適用が有効になっている場合、自分のアカウントの MFA をオフにすることはできません。

1. **自分は組織オーナーで、MFA 強制適用後に一部のユーザーがロックアウトされました。どうすればよいですか？**

    ロックアウトされたユーザーに、ログイン時のプロンプトに従って MFA の設定を完了するよう依頼してください。それでも組織にアクセスできない場合は、[Zilliz Cloud サポートに問い合わせ](http://support.zilliz.com) てください。

