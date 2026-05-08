---
title: "Zilliz Cloud に登録 | BYOC"
slug: /register-with-zilliz-cloud
sidebar_key: register-with-zilliz-cloud
sidebar_label: "Zilliz Cloud に登録"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud サービスにアクセスするためのアカウントを作成する方法について、包括的な手順を説明します。 | BYOC"
type: origin
token: HriHwEU3qiQrgskz3a0cdkcpnyf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - 登録
  - cloud
  - milvus

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Zilliz Cloud に登録する

このガイドでは、Zilliz Cloud サービスにアクセスするためのアカウントを作成する方法について、包括的な手順を説明します。

## 開始前に\{#before-you-start}

Zilliz Cloud にアクセスして[サインアップ](https://cloud.zilliz.com/signup)することができます。

![sign_up](https://zdoc-images.s3.us-west-2.amazonaws.com/sign_up.png "sign_up")

## 登録オプション\{#registration-options}

Zilliz Cloud に登録およびログインするには、以下のオプションのうち1つだけを使用できます。

- [メールアドレスとパスワード](./register-with-zilliz-cloud#with-work-email-and-password)

- [Google アカウント](./register-with-zilliz-cloud#linking-to-google-account)

- [GitHub アカウント](./register-with-zilliz-cloud#linking-to-github-account)

ログイン時には、選択した登録方法と一貫性を保ってください。必要に応じて、後の段階でログイン方法を変更することができます。詳細については、[アカウントの管理](./email-accounts#switch-login-method) を参照してください。

### 仕事用メールとパスワードで登録する\{#with-work-email-and-password}

以下の手順に従って、仕事用メールとパスワードを使用して Zilliz Cloud アカウントを作成します。

<Procedures>

1. **仕事用メール** フィールドに仕事用メールアドレスを入力します。

1. **パスワード** フィールドにパスワードを入力します。

    パスワードは8文字以上で、以下の文字タイプのうち少なくとも3種類を含める必要があります。

    - 小文字（a–z）

    - 大文字（A–Z）

    - 数字（0–9）

    - 特殊文字（例：!@#$%^&*）

1. **[規約 of Service](https://zilliz.com/terms-and-conditions) および [Privacy Policy](https://zilliz.com/privacy-policy) に同意します** の横にあるチェックボックスをオンにします。

1. **Continue** をクリックします。確認コードが指定されたメールアドレスに送信されます。

1. 受信した確認コードをダイアログボックスに入力し、**Verify** をクリックします。

    確認コードが受信されない場合は、**コードを再送信** をクリックして再試行してください。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>初回ログイン時に、サービスをニーズに合わせてカスタマイズするための追加情報をお尋ねします。</p>

</Admonition>

### Google アカウントとの連携\{#linking-to-google-account}

Google アカウントを Zilliz Cloud と連携するには、以下の手順に従ってください。

<Procedures>

1. Google ロゴボタンをクリックします。

1. **[規約 of Service](https://zilliz.com/terms-and-conditions) および [Privacy Policy](https://zilliz.com/privacy-policy) に同意します** のチェックボックスを選択し、**Submit** をクリックします。

1. [Google アカウント ログインページ](https://accounts.google.com/) にリダイレクトされます。Google アカウントに関連付けられたメールアドレスまたは電話番号、および対応するパスワードを入力します。

1. 認証が成功すると、Zilliz Cloud にリダイレクトされ、成功通知が表示されます。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>スムーズな登録を確実にするため、連携前に <a href="https://support.google.com/accounts/answer/1064203?hl=en&ref_topic=7189195&sjid=2449417013251062800-AP">Google 管理の MFA を無効化</a> してください。</p>

</Admonition>

### GitHub アカウントとの連携\{#linking-to-github-account}

#### 前提条件\{#prerequisites}

GitHub で登録する場合、GitHub アカウントに公開メールアドレスが関連付けられている必要があります。以下の手順に従って、GitHub でメールアドレスを公開設定にしてください。

<Procedures>

1. GitHub にログインし、プロファイルメニューから **Settings** をクリックします。

1. 左側のナビゲーションから **メール** をクリックします。

1. **Keep my email addresses private** のチェックボックスをオフにします。

1. 左側のナビゲーションから **公開プロフィール** をクリックし、**公開メール** ドロップダウンから先ほど公開設定にしたメールアドレスを選択します。

1. **Update profile** をクリックして変更を保存します。

</Procedures>

#### 手順\{#procedures}

GitHub アカウントを連携するには、以下の手順に従ってください。

<Procedures>

1. GitHub ロゴボタンをクリックします。

1. **[規約 of Service](https://zilliz.com/terms-and-conditions) および [Privacy Policy](https://zilliz.com/privacy-policy) に同意します** のチェックボックスを選択し、**Submit** をクリックします。

1. [GitHub サインインページ](https://github.com/login) にリダイレクトされます。GitHub アカウントに関連付けられたユーザー名またはメールアドレス、および対応するパスワードを入力します。

1. 認証が成功すると、Zilliz Cloud にリダイレクトされ、成功通知が表示されます。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>スムーズな登録を確実にするため、連携前に <a href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/disabling-two-factor-authentication-for-your-personal-account">GitHub 管理の MFA を無効化</a> してください。</p>

</Admonition>

### Zilliz Cloud アカウントにログインする\{#log-in-to-your-zilliz-cloud-account}

Zilliz Cloud アカウントにログインする際は、常に登録時に選択した方法と同じ方法を使用してください。

## FAQ\{#faq}

**登録が失敗したのはなぜですか？**
このメールアドレスですでにアカウントを登録している可能性があります。直接ログインをお試しください。問題が解決しない場合は、[サポートチケットを作成](http://support.zilliz.com) してください。