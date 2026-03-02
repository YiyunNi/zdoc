---
title: "Zilliz Cloudへの登録 | Cloud"
slug: /register-with-zilliz-cloud
sidebar_label: "Zilliz Cloudへの登録"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloudサービスにアクセスするためのアカウント作成方法について、包括的な手順を説明します。"
type: origin
token: HriHwEU3qiQrgskz3a0cdkcpnyf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - 登録
  - cloud
  - milvus
  - 動画類似性検索
  - ベクトル検索
  - 音声類似性検索
  - エラスティックベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Zilliz Cloudへの登録

このガイドでは、Zilliz Cloudサービスにアクセスするためのアカウントを作成する手順を包括的に説明します。

## 開始する前に{#before-you-start}

Zilliz Cloudにアクセスして[サインアップ](https://cloud.zilliz.com/signup)してください。

![sign_up](https://zdoc-images.s3.us-west-2.amazonaws.com/sign_up.png "sign_up")

## 登録オプション{#registration-options}

Zilliz Cloudに登録してログインするには、以下のオプションのいずれか1つのみを使用できます。

- [メールアドレスとパスワード](./register-with-zilliz-cloud#with-work-email-and-password)

- [Googleアカウント](./register-with-zilliz-cloud#linking-to-google-account)

- [GitHubアカウント](./register-with-zilliz-cloud#linking-to-github-account)

ログインには、選択した登録方法との一貫性を保ってください。必要に応じて、後でログイン方法を変更できます。詳細については、[アカウントの管理](./email-accounts#switch-login-method)を参照してください。

### 職場のメールアドレスとパスワードを使用する場合{#with-work-email-and-password}

職場のメールアドレスとパスワードを使用してZilliz Cloudアカウントを作成するには、以下の手順に従ってください。

<Procedures>

1. **Work Email**フィールドに職場のメールアドレスを入力します。

1. **Password**フィールドにパスワードを入力します。

    パスワードは8文字以上で、以下の文字タイプのうち少なくとも3つを含める必要があります。

    - 小文字 (a–z)

    - 大文字 (A–Z)

    - 数字 (0–9)

    - 特殊文字 (例: !@#$%^&*)

1. **I agree to the [Terms of Service](https://zilliz.com/terms-and-conditions) and [Privacy Policy](https://zilliz.com/privacy-policy)**の横にあるチェックボックスをオンにします。

1. **Continue**をクリックします。確認コードが指定されたメールアドレスに送信されます。

1. 受信した確認コードをダイアログボックスに入力し、**Verify**をクリックします。

    確認コードが届かない場合は、**Resend Code**をクリックして再試行してください。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>初回ログイン時には、お客様のニーズに合わせてサービスをより適切に調整するために、追加情報をお伺いします。</p>

</Admonition>

### Googleアカウントとの連携{#linking-to-google-account}

GoogleアカウントをZilliz Cloudと連携するには、以下の手順に従ってください。

<Procedures>

1. Googleロゴボタンをクリックします。

1. **I agree to the [Terms of Service](https://zilliz.com/terms-and-conditions) and [Privacy Policy](https://zilliz.com/privacy-policy)**のチェックボックスを選択し、**Submit**をクリックします。

1. [Googleアカウントログインページ](https://accounts.google.com/)にリダイレクトされます。Googleアカウントに関連付けられたメールアドレスまたは電話番号と、対応するパスワードを入力します。

1. 認証が成功すると、Zilliz Cloudにリダイレクトされ、成功通知が表示されます。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>スムーズな登録を確実にするために、連携する前に<a href="https://support.google.com/accounts/answer/1064203?hl=en&ref_topic=7189195&sjid=2449417013251062800-AP">Googleが管理するMFAを無効にしてください</a>。</p>

</Admonition>

### GitHubアカウントとの連携{#linking-to-github-account}

#### 前提条件{#prerequisites}

GitHubで登録しようとする場合、GitHubアカウントに関連付けられた公開メールアドレスが必要です。GitHubでメールアドレスを公開に設定するには、以下の手順に従ってください。

<Procedures>

1. GitHubにログインし、プロフィールメニューの**Settings**をクリックします。

1. 左側のナビゲーションから**Emails**をクリックします。

1. **Keep my email addresses private**のチェックボックスをオフにします。

1. 左側のナビゲーションで**Public Profile**をクリックし、**Public email**ドロップダウンから公開に設定したばかりのメールアドレスを選択します。

1. **Update profile**をクリックして変更を保存します。

</Procedures>

#### 手順{#procedures}

GitHubアカウントを連携するには、以下の手順に従ってください。

<Procedures>

1. GitHubロゴボタンをクリックします。

1. **I agree to the [Terms of Service](https://zilliz.com/terms-and-conditions) and [Privacy Policy](https://zilliz.com/privacy-policy)**のチェックボックスを選択し、**Submit**をクリックします。

1. [GitHubサインインページ](https://github.com/login)にリダイレクトされます。GitHubアカウントに関連付けられたユーザー名またはメールアドレスと、対応するパスワードを入力します。

1. 認証が成功すると、Zilliz Cloudにリダイレクトされ、成功通知が表示されます。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>スムーズな登録を確実にするために、連携する前に<a href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/disabling-two-factor-authentication-for-your-personal-account">GitHubが管理するMFAを無効にしてください</a>。</p>

</Admonition>

### Zilliz Cloudアカウントへのログイン{#log-in-to-your-zilliz-cloud-account}

Zilliz Cloudアカウントにログインする際は、登録時に選択した方法と常に同じ方法を使用してください。

## FAQ{#faq}

**登録が失敗したのはなぜですか？**
このメールアドレスで既にアカウントを登録している可能性があります。直接ログインしてみてください。問題が解決しない場合は、[サポートチケットを作成してください](http://support.zilliz.com)。