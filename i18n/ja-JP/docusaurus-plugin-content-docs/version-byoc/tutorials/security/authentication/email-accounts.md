---
title: "Eメールアカウント | BYOC"
slug: /email-accounts
sidebar_label: "Eメールアカウント"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudにアカウントを登録すると、アカウント情報の管理、ログイン方法の切り替え、GoogleまたはGitHubアカウントとの連携解除ができます。 | BYOC"
type: origin
token: GMdhwQQCRi2QaLkimNOcc3qNnbh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - Eメールアカウント
  - Zillizデータベース
  - 非構造化データ
  - vector database
  - IVF

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# メールアカウント

Zilliz Cloud に[アカウントを登録](./register-with-zilliz-cloud)すると、アカウント情報の管理、ログイン方法の切り替え、Google または GitHub アカウントとの連携解除を行うことができます。

## プロフィール情報を変更する{#modify-your-profile-information}

![modify_account_info](https://zdoc-images.s3.us-west-2.amazonaws.com/modify_account_info.png "modify_account_info")

<Procedures>

1. **プロフィール**に移動し、**アカウント設定**をクリックします。

1. 以下の情報を編集できます。

    - 名前

    - 会社

    - 国

</Procedures>

## アカウントのメールアドレスを更新する{#update-account-email-address}

![update_email_address](https://zdoc-images.s3.us-west-2.amazonaws.com/update_email_address.png "update_email_address")

<Admonition type="info" icon="📘" title="Notes">

<p>メールアドレスを更新しても、請求書やアラートの受信者には影響しません。必要に応じて、これらの情報を手動で更新してください。</p>

</Admonition>

## アカウントのパスワードを変更する{#change-account-password}

![change_password](https://zdoc-images.s3.us-west-2.amazonaws.com/change_password.png "change_password")

パスワードは8文字以上で、以下の文字タイプのうち3つ以上を含める必要があります。

- 小文字 (a–z)

- 大文字 (A–Z)

- 数字 (0–9)

- 特殊文字 (例: !@#$%^&*)

## MFA を有効/無効にする{#enable-and-disable-mfa}

詳細については、[MFA](./multi-factor-auth) を参照してください。

## ログイン方法を切り替える{#switch-login-method}

最初の登録時と同じログイン方法を維持する必要がありますが、Zilliz Cloud はログイン方法を切り替える必要がある場合に柔軟性を提供します。

<Admonition type="info" icon="📘" title="Notes">

<p>組織ユーザーの場合、ID プロバイダー (IdP) Okta とシングルサインオン (SSO) を設定できます。これにより、組織ユーザーは Okta で認証し、個別の Zilliz Cloud アカウントを作成する代わりに、ビジネスメールを使用して Zilliz Cloud にシームレスにアクセスできます。詳細については、<a href="./single-sign-on-with-okta">Okta とのシングルサインオン</a>を参照してください。</p>

</Admonition>

### パスワードログインからサードパーティログインに切り替える{#switch-from-password-login-to-third-party-login}

パスワードからサードパーティ (Google または GitHub) ログインに切り替えるには、[Zilliz Cloud アカウントをサードパーティサービスにリンクする](./register-with-zilliz-cloud#linking-to-google-account)のと同じ手順に従い、事前に[MFA が無効になっている](./multi-factor-auth#disable-mfa)ことを確認してください。

### サードパーティログインからパスワードログインに切り替える{#switch-from-third-party-login-to-password-login}

Zilliz Cloud アカウントをサードパーティアカウントにリンクした後、メールとパスワードを使用してログインに戻すには、[Zilliz Cloud アカウントをサードパーティサービスから連携解除する](./email-accounts#unlink-from-third-party-authentication)だけです。

### サードパーティログイン間で切り替える{#switch-between-third-party-logins}

Zilliz Cloud アカウントをすでにサードパーティアカウントとリンクしており、別のサードパーティログインに切り替えたい場合は、以下の手順に従ってください。

<Procedures>

1. [現在のサードパーティアカウントから連携解除する](./email-accounts#unlink-from-third-party-authentication)。

1. [Zilliz Cloud アカウントを新しい希望のサードパーティアカウントにリンクする](./register-with-zilliz-cloud)。

</Procedures>

## サードパーティ認証から連携解除する{#unlink-from-third-party-authentication}

### Google アカウントから連携解除する{#unlink-from-your-google-account}

![unlink_from_google](https://zdoc-images.s3.us-west-2.amazonaws.com/unlink_from_google.png "unlink_from_google")

<Procedures>

1. **プロフィール**に移動し、**アカウント設定**をクリックします。

1. **Google から連携解除**をクリックします。

1. **連携解除**をクリックします。

    - すでにパスワードを設定している場合、Google アカウントは直接連携解除され、元のメールとパスワードでログインできます。

    - まだパスワードを設定していない場合、メールで送信されたリンクから新しいパスワードを設定します。パスワードが設定されると、ログイン方法が勤務先のメールと新しいパスワードに変更されます。

</Procedures>

### GitHub アカウントから連携解除する{#unlink-from-your-github-account}

![unlink_from_github](https://zdoc-images.s3.us-west-2.amazonaws.com/unlink_from_github.png "unlink_from_github")

<Procedures>

1. **プロフィール**に移動し、**アカウント設定**をクリックします。

1. **GitHub から連携解除**をクリックします。

1. **連携解除**をクリックします。

    - すでにパスワードを設定している場合、GitHub アカウントは直接連携解除され、元のメールとパスワードでログインできます。

    - まだパスワードを設定していない場合、メールで送信されたリンクから新しいパスワードを設定します。パスワードが設定されると、ログイン方法が勤務先のメールと新しいパスワードに変更されます。

</Procedures>

## アカウントを閉鎖する{#close-your-account}

<Admonition type="caution" icon="🚧" title="Warning">

<p>アカウントが閉鎖されると、Zilliz Cloud にログインするために使用できなくなります。気が変わってアカウントを再開する必要がある場合は、<a href="https://support.zilliz.com/hc/en-us">Zilliz Cloud サポートポータル</a>でサポートチケットを作成してください。30日後、このアカウントのすべてのデータはクリーンアップされます。</p>

</Admonition>

### 開始する前に{#before-you-start}

続行する前に、以下の基準を満たしていることを確認してください。

- クラスターを持つプロジェクトで唯一のプロジェクト管理者である場合、[プロジェクトクラスターを削除](./manage-cluster)します。

- 唯一の組織所有者である場合、組織を削除します。

### 手順{#procedures}

![delete-account-en](https://zdoc-images.s3.us-west-2.amazonaws.com/delete-account-en.png "delete-account-en")

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. 右上隅のプロフィールアイコンをクリックします。**アカウント設定**をクリックします。

1. **アカウント設定**ウィンドウで、**アカウントを閉鎖**ボタンをクリックします。

1. Zilliz Cloud を離れる理由を伝え、フィードバックを送信します。

1. テキストボックスにアカウントのメールアドレスを再度入力します。**確認コードを送信**をクリックし、メールの受信トレイに届いたコードを入力します。以下の情報を読み、チェックボックスにチェックを入れます。**次へ**をクリックして続行します。

1. アカウントが正常に削除されると、メール通知が届きます。

</Procedures>