---
title: "Zilliz Cloudへの登録 | Cloud"
slug: /register-with-zilliz-cloud
sidebar_label: "Zilliz Cloudへの登録"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloudサービスにアクセスするためのアカウント作成方法について、包括的な手順を説明します。 | Cloud"
type: origin
token: HriHwEU3qiQrgskz3a0cdkcpnyf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - 登録
  - クラウド
  - milvus

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Zilliz Cloudへの登録

このガイドでは、Zilliz Cloudサービスにアクセスするためのアカウント作成方法について包括的な手順を説明します。

## 開始する前に\{#before-you-start}

Zilliz Cloudにアクセスして[サインアップ](https://cloud.zilliz.com/signup)してください。

![sign_up](https://zdoc-images.s3.us-west-2.amazonaws.com/sign_up.png "sign_up")

## 登録オプション\{#registration-options}

Zilliz Cloudに登録し、ログインするには、以下のいずれか1つのオプションのみを使用できます。

- [仕事用メールアドレスとパスワード](./register-with-zilliz-cloud#with-work-email-and-password)

- [Googleアカウント](./register-with-zilliz-cloud#linking-to-google-account)

- [GitHubアカウント](./register-with-zilliz-cloud#linking-to-github-account)

ログイン目的で選択した登録方法との一貫性を維持してください。必要に応じて、後でログイン方法を変更できます。詳細については、[アカウントの管理](./email-accounts#switch-login-method)を参照してください。

### 仕事用メールとパスワードを使用する\{#with-work-email-and-password}

仕事用メールとパスワードを使用してZilliz Cloudアカウントを作成するには、以下の手順に従ってください。

<Procedures>

1. **仕事用メール**フィールドに仕事用メールアドレスを入力します。

1. **パスワード**フィールドにパスワードを入力します。

    パスワードは8文字以上で、以下の文字タイプのうち少なくとも3つを含める必要があります。

    - 小文字 (a–z)

    - 大文字 (A–Z)

    - 数字 (0–9)

    - 特殊文字 (例: !@#$%^&*)

1. **I agree to the [規約 of Service](https://zilliz.com/terms-and-conditions) and [Privacy Policy](https://zilliz.com/privacy-policy)**の横にあるチェックボックスをオンにします。

1. **Continue**をクリックします。確認コードが提供されたメールアドレスに送信されます。

1. ダイアログボックスに受信した確認コードを入力し、**Verify**をクリックします。

    確認コードが届かない場合は、**コードを再送信**をクリックして再試行してください。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>初回ログイン時には、お客様のニーズに合わせてサービスをより適切に調整するために、追加情報をお伺いします。</p>

</Admonition>

### Googleアカウントへのリンク\{#linking-to-google-account}

GoogleアカウントをZilliz Cloudにリンクするには、以下の手順に従ってください。

<Procedures>

1. Googleロゴボタンをクリックします。

1. **I agree to the [規約 of Service](https://zilliz.com/terms-and-conditions) and [Privacy Policy](https://zilliz.com/privacy-policy)**のチェックボックスを選択し、**Submit**をクリックします。

1. [Googleアカウントログインページ](https://accounts.google.com/)にリダイレクトされます。Googleアカウントに関連付けられたメールアドレスまたは電話番号と、対応するパスワードを入力します。

1. 認証が成功すると、Zilliz Cloudにリダイレクトされ、成功通知が表示されます。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>スムーズな登録を確実にするために、リンクする前に<a href="https://support.google.com/accounts/answer/1064203?hl=en&ref_topic=7189195&sjid=2449417013251062800-AP">Google管理のMFAを無効にしてください</a>。</p>

</Admonition>

### GitHubアカウントへのリンク\{#linking-to-github-account}

#### 前提条件\{#prerequisites}

GitHubで登録しようとする場合、GitHubアカウントに関連付けられた公開メールアドレスが必要です。GitHubでメールアドレスを公開に設定するには、以下の手順に従ってください。

<Procedures>

1. GitHubにログインし、プロファイルメニューの**Settings**をクリックします。

1. 左側のナビゲーションから**メール**をクリックします。

1. **Keep my email addresses private**のチェックボックスをオフにします。

1. 左側のナビゲーションで**公開プロフィール**をクリックし、**公開メール**ドロップダウンから公開に設定したばかりのメールアドレスを選択します。

1. **Update profile**をクリックして変更を保存します。

</Procedures>

#### 手順\{#procedures}

GitHubアカウントを当社にリンクするには、以下の手順に従ってください。

<Procedures>

1. GitHubロゴボタンをクリックします。

1. **I agree to the [規約 of Service](https://zilliz.com/terms-and-conditions) and [Privacy Policy](https://zilliz.com/privacy-policy)**のチェックボックスを選択し、**Submit**をクリックします。

1. [GitHubサインインページ](https://github.com/login)にリダイレクトされます。GitHubアカウントに関連付けられたユーザー名またはメールアドレスと、対応するパスワードを入力します。

1. 認証が成功すると、Zilliz Cloudにリダイレクトされ、成功通知が表示されます。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<p>スムーズな登録を確実にするために、リンクする前に<a href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/disabling-two-factor-authentication-for-your-personal-account">GitHub管理のMFAを無効にしてください</a>。</p>

</Admonition>

### Zilliz Cloudアカウントへのログイン\{#log-in-to-your-zilliz-cloud-account}

Zilliz Cloudアカウントにログインする際は、登録時に選択した方法と常に同じ方法を使用してください。

## FAQ\{#faq}

**登録が失敗したのはなぜですか？**
このメールアドレスで既にアカウントを登録している可能性があります。直接ログインしてみてください。問題が解決しない場合は、[サポートチケットを作成してください](http://support.zilliz.com)。