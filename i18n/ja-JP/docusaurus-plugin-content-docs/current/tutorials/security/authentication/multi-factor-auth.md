---
title: "MFA | Cloud"
slug: /multi-factor-auth
sidebar_label: "MFA"
beta: FALSE
notebook: FALSE
description: "認証は、Zilliz Cloud にサインインする際にユーザーの身元を確認します。このプロセスを強化するために、Zilliz Cloud は多要素認証 (MFA) をサポートしています。"
type: origin
token: KHAMwm0HUiU6qdkH2LOcu0FFnug
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - mfa
  - NLP
  - ニューラルネットワーク
  - ディープラーニング
  - ナレッジベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# MFA

Zilliz Cloudにサインインする際、認証によって本人確認が行われます。このプロセスを強化するため、Zilliz Cloudは多要素認証（MFA）をサポートしています。

MFAを有効にすると、ログイン時に2つの要素を提供する必要があります。

- アカウントのパスワード

- 認証アプリ（例：Google Authenticator、Microsoft Authenticatorなど）からのTOTP（時間ベースのワンタイムパスワード）

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloudは、アカウントセキュリティ強化のためMFAをアップグレードしました。<strong>2025年11月25日</strong>より、メールベースのMFAは非推奨となります。以前メールベースのMFAを使用していたユーザーは、TOTP認証アプリに切り替える必要があります。</p>

</Admonition>

## 考慮事項{#considerations}

- **SSO互換性**: 組織で[SSO](./single-sign-on)が有効になっている場合、MFAはIDプロバイダー（IdP）によって管理されます。この場合、IdPアカウントでMFAを設定するか、組織のオーナーに連絡して支援を求めてください。

- **ログイン方法の互換性**: Zilliz Cloudの組み込みMFA機能は、メールアドレスとパスワードで[登録](./register-with-zilliz-cloud#registration-options)したユーザーのみが利用できます。

    - アカウントがGoogleにリンクされている場合、MFAはGoogleによって制御されます。詳細については、[2段階認証をオンにする](https://support.google.com/accounts/answer/185839?hl=en&ref_topic=7189195&sjid=2449417013251062800-AP)を参照してください。

    - アカウントがGitHubにリンクされている場合、MFAはGitHubによって制御されます。詳細については、[2要素認証の設定](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)を参照してください。

## MFAを有効にする{#enable-mfa}

以下のデモは、自分のアカウントでMFAを有効にする方法を示しています。デモではMicrosoft Authenticatorを例として使用していますが、TOTP互換の認証アプリであればどれでも使用できます。

<Supademo id="cmi72ns5s4jwob7b4ul2t1zz5?utm_source=link" title=""  />

## MFAを無効にする{#disable-mfa}

<Admonition type="info" icon="📘" title="Notes">

<p>組織で<a href="./multi-factor-auth#enforce-mfa-for-all-organization-users">MFA強制</a>が有効になっている場合、アカウントのMFAを無効にすることはできません。</p>

</Admonition>

以下のデモは、自分のアカウントでMFAを無効にする方法を示しています。

<Supademo id="cmi7297fo4jq8b7b448ydxlhk?utm_source=link" title=""  />

## 組織のすべてのユーザーにMFAを強制する{#enforce-mfa-for-all-organization-users}

<Admonition type="info" icon="📘" title="Notes">

<p>この機能にアクセスするには、組織のオーナーである必要があります。</p>
<p>この機能を使用するには、有効な支払い方法、<strong>Enterprise</strong>プロジェクト、および<strong>Dedicated</strong>クラスターが必要です。</p>

</Admonition>

組織レベルのMFA強制が有効になっている場合：

- 組織内のすべてのユーザーは、サインインするために[MFAを設定](./multi-factor-auth#enable-mfa)する必要があります。

- まだMFAを有効にしていないユーザーは、次回ログイン時に設定を促されます。

- MFA設定を完了しないユーザーは、組織にアクセスできません。

以下のデモは、組織にMFAを強制する方法を示しています。

<Supademo id="cmi71danb4is0b7b4eogo3s07?utm_source=link" title=""  />

## 組織のMFA強制を無効にする{#disable-mfa-enforcement-for-organization}

<Admonition type="info" icon="📘" title="Notes">

<p>この機能にアクセスするには、組織のオーナーである必要があります。</p>

</Admonition>

組織レベルのMFA強制が無効になっている場合：

- ユーザーは組織にアクセスするためにMFAを設定する必要がなくなります。

- すでにMFAを有効にしているユーザーは、既存の設定を維持し、自分のアカウントのMFAを[オフにする](./multi-factor-auth#disable-mfa)ことを選択できます。

以下のデモは、組織のMFA強制を無効にする方法を示しています。

<Supademo id="cmi71q0gk4j6hb7b4xiywity3?utm_source=link" title=""  />

## トラブルシューティング{#troubleshooting}

1. **認証アプリへのアクセスを失った場合、どうすればよいですか？**

    認証アプリへのアクセスを失ったためにMFAを完了できない、またはログインできない場合は、組織のオーナーに連絡するか、[Zilliz Cloudサポートに連絡](http://support.zilliz.com)して支援を求めてください。

1. **私のアカウントはSSOを使用しています。MFAはどのように処理されますか？**

    組織でSSOが有効になっている場合、MFAはZilliz Cloudではなく、IDプロバイダー（IdP）によって管理されます。IdPアカウントでMFAを設定するか、組織のオーナーに連絡してください。

1. **MFAを無効にできないのはなぜですか？**

    組織でMFA強制が有効になっている場合、自分のアカウントのMFAをオフにすることはできません。

1. **私は組織のオーナーですが、MFA強制後に一部のユーザーがロックアウトされました。どうすればよいですか？**

    それらのユーザーに、ログイン時にMFA設定を完了するように依頼してください。それでも組織にアクセスできない場合は、[Zilliz Cloudサポートに連絡](http://support.zilliz.com)して支援を求めてください。

