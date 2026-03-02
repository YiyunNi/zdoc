---
title: "その他のIdP (SAML 2.0) | BYOC"
slug: /single-sign-on-with-other-idp
sidebar_label: "その他のIdP (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0プロトコルをサポートする任意のIDプロバイダー（IdP）を使用して、Zilliz Cloudでシングルサインオン（SSO）を設定する方法について説明します。 | BYOC"
type: origin
token: WDOJwtKkAijW4gkUpQhcAL0Rn1d
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - sso
  - その他
  - idp
  - RAG ベクトルデータベース
  - ベクトルDBとは
  - ベクトルデータベースとは
  - ベクトルデータベース比較

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# その他の IdP (SAML 2.0)

このトピックでは、SAML 2.0 プロトコルをサポートする任意の ID プロバイダー (IdP) を使用して、Zilliz Cloud でシングルサインオン (SSO) を構成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は、<a href="./single-sign-on-with-okta">Okta</a>、<a href="./single-sign-on-with-google-workspace">Google Workspace</a>、<a href="./single-sign-on-with-microsoft-entra">Microsoft Entra</a> の専用統合ガイドを提供していますが、<strong>その他の IdP (SAML 2.0)</strong> オプションを使用すれば、標準に準拠した任意の SAML 2.0 IdP を使用できます。</p>

</Admonition>

## 開始する前に{#before-you-start}

- Zilliz Cloud 組織に少なくとも 1 つの **Dedicated (Enterprise)** クラスターがあること。

- SSO を構成する Zilliz Cloud 組織の **Organization Owner** であること。

- 使用する予定の IdP への管理者アクセス権があること。

- IdP 固有のセットアップの詳細については、IdP の公式ドキュメントを参照してください。

## 構成手順{#configuration-steps}

### ステップ 1: Zilliz Cloud コンソールでサービスプロバイダーの詳細にアクセスする{#step-1-access-service-provider-details-in-zilliz-cloud-console}

<Supademo id="cme6sledl274yh3py7hf96vo1" title="Step 1: Access service provider details in Zilliz Cloud" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインし、SSO を構成したい組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけて、**Configure** をクリックします。

1. 表示されるダイアログボックスで、IdP とプロトコルとして **Other IdP (SAML)** を選択します。

1. **Service Provider Details** カードで、次の値をコピーします。

    - **SP Entity ID**

    - **ACS URL**

</Procedures>

これらの値は、IdP で SAML アプリケーションを作成する際に、[ステップ 2](./single-sign-on-with-other-idp#step-2-create-a-saml-app-in-your-idp-console) で必要になります。

### ステップ 2: IdP コンソールで SAML アプリを作成する{#step-2-create-a-saml-app-in-your-idp-console}

正確なプロセスは IdP によって異なります。一般的には次のとおりです。

<Procedures>

1. IdP の管理者コンソールにサインインします。

1. 新しい SAML 2.0 アプリケーション (SAML 接続または統合と呼ばれることもあります) を作成します。

1. サービスプロバイダー情報の提供を求められたら、次を入力します。

    - [ステップ 1](./single-sign-on-with-other-idp#step-1-access-service-provider-details-in-zilliz-cloud-console) の **SP Entity ID**。

    - [ステップ 1](./single-sign-on-with-other-idp#step-1-access-service-provider-details-in-zilliz-cloud-console) の **ACS URL**。

1. アプリケーションを保存し、次のいずれかの形式で IdP 構成を取得します。

    - **オプション 1 – メタデータ URL/ファイル**: ほとんどの IdP は、必要なすべての SAML メタデータを含むダウンロード可能な XML ファイルまたは公開 URL を提供します。

    - **オプション 2 – 手動**: メタデータが利用できない場合は、IdP から次を収集します。

        - **IdP SSO URL** (Zilliz Cloud が認証リクエストを送信するエンドポイント)

        - **x.509 証明書** (`-----BEGIN CERTIFICATE-----` と `-----END CERTIFICATE-----` の行を含む)

    この情報は、[ステップ 3](./single-sign-on-with-other-idp#step-3-configure-idp-settings-in-zilliz-cloud-console) で使用します。

</Procedures>

### ステップ 3: Zilliz Cloud コンソールで IdP 設定を構成する{#step-3-configure-idp-settings-in-zilliz-cloud-console}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻ります。

1. シングルサインオン (SSO) 構成ダイアログボックスの **Identity Provider Details** カードで、次のいずれかの方法を選択します。

    **オプション 1 – メタデータ URL/ファイル**

    - IdP からコピーした **Metadata URL** を貼り付けるか、ダウンロードした Metadata XML ファイルをアップロードします。

    - Zilliz Cloud は、証明書を含む必要な IdP の詳細を自動的にインポートします。

    **オプション 2 – 手動**

    - IdP からの **IdP SSO URL** を入力します。

    - X.509 形式の IdP 署名証明書をアップロードまたは貼り付けます。`-----BEGIN CERTIFICATE-----` と `-----END CERTIFICATE-----` の行が含まれていることを確認してください。

1. **Save** をクリックします。

</Procedures>

## 構成後のタスク{#post-configuration-tasks}

### タスク 1: IdP でユーザーに SAML アプリを割り当てる{#task-1-assign-saml-app-to-users-in-your-idp}

ユーザーが SSO 経由でサインインする前に、IdP で SAML アプリへのアクセス権を付与する必要があります。

- アプリを特定のユーザーまたはグループに割り当てます。

- 割り当てられた各ユーザーのメールアドレスが、Zilliz Cloud アカウントのメールアドレスと一致していることを確認します。

### タスク 2: ユーザーをプロジェクトに招待する{#task-2-invite-users-to-your-project}

ユーザーが初めて SSO 経由で Zilliz Cloud にログインすると、**Organization Member** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **Organization Owner** は、適切なプロジェクトにユーザーを招待する必要があります。

- ユーザーをプロジェクトに招待する手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project)を参照してください。

プロジェクトに招待された後、**Organization Owner** は Zilliz Cloud ログイン URL をエンタープライズユーザーと共有して、SSO 経由でサインインできるようにします。

セットアップまたはテストプロセス中に問題が発生した場合は、[Zilliz サポート](https://zilliz.com/contact-sales)にお問い合わせください。

## FAQ{#faq}

### 初めて SSO 経由でログインするユーザーにはどのようなロールが割り当てられますか？{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、最初の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで **Organization Member** ロールが割り当てられます。Zilliz Cloud コンソールで後でロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role-or-remove-a-collaborator)を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？{#how-do-users-access-projects-after-sso-login}

SSO 経由でログインした後、ユーザーはデフォルトで **Organization Member** ロールを持ちます。特定のプロジェクトにアクセスするには、**Organization Owner** または **Project Admin** がプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### SSO でログインする前にユーザーがすでに Zilliz Cloud アカウントを持っている場合はどうなりますか？{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーがすでに Zilliz Cloud 組織に存在する場合 (メールアドレスに基づく)、SSO 経由でログインしても、元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きすることはありません。

### 同じ組織に対して複数の SSO プロバイダーを構成できますか？{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織は、一度に **1 つのアクティブな SAML SSO 構成**のみをサポートしています。