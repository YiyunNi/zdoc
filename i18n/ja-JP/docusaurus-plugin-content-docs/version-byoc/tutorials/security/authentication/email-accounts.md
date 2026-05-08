---
title: "Eメールアカウント | BYOC"
slug: /email-accounts
sidebar_key: email-accounts
sidebar_label: "Eメールアカウント"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud にアカウントを登録した後、アカウント情報の管理、ログイン方法の切り替え、Google または GitHub アカウントとの連携解除ができます。 | BYOC"
type: origin
token: GMdhwQQCRi2QaLkimNOcc3qNnbh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - Eメールアカウント

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Eメール アカウント

Zilliz Cloud で [アカウントを登録](./register-with-zilliz-cloud) したら、アカウント情報の管理、ログイン方法の切り替え、Google または GitHub アカウントとのリンク解除ができます。

## プロファイル情報を変更する\{#modify-your-profile-information}

![modify_account_info](https://zdoc-images.s3.us-west-2.amazonaws.com/modify_account_info.png "modify_account_info")

<Procedures>

1. **プロファイル** に移動し、**アカウント設定** をクリック。

1. 以下のアカウント情報を編集できます：

    - 名前

    - 会社

    - 国

</Procedures>

## アカウントのEメールアドレスを更新する\{#update-account-email-address}

![update_email_address](https://zdoc-images.s3.us-west-2.amazonaws.com/update_email_address.png "update_email_address")

<Admonition type="info" icon="📘" title="Notes">

<p>Eメールアドレスを更新しても、請求書やアラートの受信者には影響しません。必要に応じて、これらの情報を手動で更新してください。</p>

</Admonition>

## アカウントのパスワードを変更する\{#change-account-password}

![change_password](https://zdoc-images.s3.us-west-2.amazonaws.com/change_password.png "change_password")

パスワードは8文字以上で、以下の文字タイプのうち少なくとも3種類を含める必要があります：

- 小文字（a–z）

- 大文字（A–Z）

- 数字（0–9）

- 特殊文字（例：!@#$%^&*）

## MFAを有効化・無効化する\{#enable-and-disable-mfa}

詳細については、[MFA](./multi-factor-auth) を参照してください。

## ログイン方法を切り替える\{#switch-login-method}

初期登録時のログイン方法を維持する必要がありますが、Zilliz Cloud ではログイン方法の切り替えに柔軟性を提供しています。

<Admonition type="info" icon="📘" title="Notes">

<p>組織ユーザーは、IDプロバイダー（IdP）である Okta を使用してシングルサインオン（SSO）を設定できます。これにより、組織ユーザーは Okta で認証した後、ビジネスEメールを使用して Zilliz Cloud にシームレスにアクセスでき、別途 Zilliz Cloud アカウントを作成する必要はありません。詳細については、<a href="./single-sign-on-with-okta">Okta を使用したシングルサインオン</a> を参照してください。</p>

</Admonition>

### パスワードログインからサードパーティログインへ切り替える\{#switch-from-password-login-to-third-party-login}

パスワードからサードパーティ（Google または GitHub）ログインへ切り替えるには、[Zilliz Cloud アカウントをサードパーティサービスにリンクする](./register-with-zilliz-cloud#linking-to-google-account) のと同じ手順に従い、事前に [MFA を無効化](./multi-factor-auth#disable-mfa) しておいてください。

### サードパーティログインからパスワードログインへ切り替える\{#switch-from-third-party-login-to-password-login}

Zilliz Cloud アカウントをサードパーティアカウントにリンクした後、Eメールとパスワードを使用してログインに戻すには、単に [Zilliz Cloud アカウントからサードパーティサービスのリンクを解除](./email-accounts#unlink-from-third-party-authentication) してください。

### サードパーティログイン間を切り替える\{#switch-between-third-party-logins}

Zilliz Cloud アカウントをすでにサードパーティアカウントとリンクしており、別のサードパーティログインに切り替えたい場合は、以下の手順に従うことができます。

<Procedures>

1. [現在のサードパーティアカウントとのリンクを解除](./email-accounts#unlink-from-third-party-authentication)。

1. [Zilliz Cloud アカウントを新しい希望のサードパーティアカウントにリンク](./register-with-zilliz-cloud)。

</Procedures>

## サードパーティ認証とのリンクを解除する\{#unlink-from-third-party-authentication}

### Google アカウントとのリンクを解除する\{#unlink-from-your-google-account}

![unlink_from_google](https://zdoc-images.s3.us-west-2.amazonaws.com/unlink_from_google.png "unlink_from_google")

<Procedures>

1. **プロファイル** に移動し、**アカウント設定** をクリック。

1. **Googleとのリンクを解除** をクリック。

1. **リンクを解除** をクリック。 

    - すでにパスワードを設定している場合、Google アカウントは直接リンク解除され、元のEメールとパスワードでログインできます。

    - まだパスワードを設定していない場合、Eメールに送信されたリンクから新しいパスワードを設定してください。パスワードが設定されると、ログイン方法は勤務先のEメールと新しいパスワードに変更されます。

</Procedures>

### GitHub アカウントとのリンクを解除する\{#unlink-from-your-github-account}

![unlink_from_github](https://zdoc-images.s3.us-west-2.amazonaws.com/unlink_from_github.png "unlink_from_github")

<Procedures>

1. **プロファイル** に移動し、**アカウント設定** をクリック。

1. **GitHubとのリンクを解除** をクリック。

1. **リンクを解除** をクリック。 

    - すでにパスワードを設定している場合、GitHub アカウントは直接リンク解除され、元のEメールとパスワードでログインできます。

    - まだパスワードを設定していない場合、Eメールに送信されたリンクから新しいパスワードを設定してください。パスワードが設定されると、ログイン方法は勤務先のEメールと新しいパスワードに変更されます。

</Procedures>

## アカウントを閉鎖する\{#close-your-account}

<Admonition type="caution" icon="🚧" title="Warning">

<p>アカウントを閉鎖すると、それを使用して Zilliz Cloud にログインすることはできなくなります。気が変わってアカウントを再開する必要がある場合は、<a href="https://support.zilliz.com/hc/en-us">Zilliz Cloud サポートポータル</a> でサポートチケットを作成してください。30日後、このアカウントのすべてのデータが削除されます。</p>

</Admonition>

### 開始前に\{#before-you-start}

進める前に、以下の条件を満たしていることを確認してください：

- クラスターがあるプロジェクトで唯一のプロジェクト管理者である場合、[プロジェクトのクラスターを削除](./manage-cluster) してください。

- 唯一の組織オーナーである場合、組織を削除してください。

### 手順\{#procedures}

![delete-account-en](https://zdoc-images.s3.us-west-2.amazonaws.com/delete-account-en.png "delete-account-en")

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. 右上のプロファイルアイコンをクリック。**アカウント設定** をクリック。

1. **アカウント** **設定** ウィンドウで、**アカウントを閉鎖** ボタンをクリック。

1. Zilliz Cloud を離れる理由を教えてください。フィードバックを送信してください。

1. テキストボックスにアカウントのEメールアドレスを再度入力します。**認証コードを送信** をクリックし、Eメールの受信トレイに届いたコードを入力します。以下の情報を読み、チェックボックスにチェックを入れます。**次へ** をクリックして続行します。

1. アカウントが正常に削除されると、Eメール通知を受信します。

</Procedures>