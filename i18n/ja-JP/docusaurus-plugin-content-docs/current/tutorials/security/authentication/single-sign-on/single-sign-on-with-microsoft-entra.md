---
title: "Microsoft Entra (SAML 2.0) | Cloud"
slug: /single-sign-on-with-microsoft-entra
sidebar_label: "Microsoft Entra (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0 プロトコルを使用して Microsoft Entra でシングルサインオン (SSO) を構成する方法について説明します。 | Cloud"
type: origin
token: Qkm3wPF9Titu1MkQ0fgcENs4nZc
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - sso
  - microsoft
  - entra
  - 大規模言語モデル
  - ベクトル化
  - k近傍法
  - ANNS

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Microsoft Entra (SAML 2.0)

このトピックでは、SAML 2.0 プロトコルを使用して Microsoft Entra でシングルサインオン (SSO) を構成する方法について説明します。

このガイドでは、Zilliz Cloud がサービスプロバイダー (SP) として機能し、Microsoft Entra がアイデンティティプロバイダー (IdP) として機能します。次の図は、Zilliz Cloud と Microsoft Entra 管理センターで必要な手順を示しています。

![M3UywWSZHhlwTHbkjI8c6jTinGh](https://zdoc-images.s3.us-west-2.amazonaws.com/M3UywWSZHhlwTHbkjI8c6jTinGh.png)

## 開始する前に{#before-you-start}

- Zilliz Cloud 組織に少なくとも 1 つの **Dedicated (Enterprise)** クラスターがあること。

- Microsoft Entra 管理センターにアクセスできること。詳細については、[Microsoft Entra ドキュメント](https://learn.microsoft.com/en-us/entra/fundamentals/entra-admin-center)を参照してください。

- SSO を構成する Zilliz Cloud 組織の組織所有者であること。

## 構成手順{#configuration-steps}

### ステップ 1: Zilliz Cloud コンソールで SP の詳細にアクセスする{#step-1-access-sp-details-in-zilliz-cloud-console}

SP として、Zilliz Cloud は、Microsoft Entra で SAML アプリケーションを設定する際に必要な **Identifier (Entity ID)** と **Reply URL (Assertion Consumer Service URL)** を提供します。

 <Supademo id="cme7yk5zy38k0h3pyor6ovyvh" title="Step 1: Access service provider details in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインし、SSO を構成する組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけて、**Configure** をクリックします。

1. 表示されるダイアログボックスで、IdP とプロトコルとして **Microsoft Entra (SAML 2.0)** を選択します。

1. **Service Provider Details** カードで、**Identifier (Entity ID)** と **Reply URL (Assertion Consumer Service URL)** をコピーします。これらの値は、[ステップ 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で Microsoft Entra 管理センターでアプリケーションを設定する際に必要になります。

1. 完了したら、[ステップ 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) に進みます。

</Procedures>

### ステップ 2: Microsoft Entra 管理センターでアプリケーションを設定する{#step-2-set-up-an-application-in-microsoft-entra-admin-center}

このステップでは、Zilliz Cloud から取得した SP の詳細を使用して Microsoft Entra (IdP) を構成します。

<Supademo id="cme7ynp8r38ksh3pyaghg664m" title="Set up an application in Microsoft Entra admin center" />

\<Procedures>

1. [Microsoft Entra 管理センター](https://aad.portal.azure.com/?ad=in-text-link)にログインします。

1. 左側のナビゲーションペインで、**Enterprise apps** をクリックします。

1. 表示されるページで、**New application** をクリックします。次に、**Create your own application** をクリックします。

1. **Create your own application** パネルで、アプリケーション名を **zilliz** に設定し、**Integrate any other application you don't find in the gallery (Non-gallery)** オプションを選択します。

1. 次に、**Create** をクリックします。完了すると、アプリケーションが作成され、アプリケーションの詳細ページにリダイレクトされます。

1. アプリケーションの詳細ページで、**Single sign-on** > **SAML** を選択します。

1. **Basic SAML Configuration** セクションで、**Edit** をクリックします。

1. **Identifier (Entity ID)** 領域で、**Add identifier** をクリックします。次に、[ステップ 1](./single-sign-on-with-microsoft-entra#step-1-access-sp-details-in-zilliz-cloud-console) で Zilliz Cloud コンソールからコピーした **Identifier (Entity ID)** をテキストボックスに貼り付けます。

1. **Reply URL (Assertion Consumer Service URL)** 領域で、**Add reply URL** をクリックします。次に、[ステップ 1](./single-sign-on-with-microsoft-entra#step-1-access-sp-details-in-zilliz-cloud-console) で Zilliz Cloud コンソールからコピーした **Reply URL (Assertion Consumer Service URL)** をテキストボックスに貼り付けます。

1. **Save** をクリックします。

1. 完了したら、作成したアプリケーションの **Single sign-on** パネルに戻り、**App Federation Metadata Url** をコピーします。これは、[ステップ 3](./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console) で Zilliz Cloud コンソールで必要になります。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、次の詳細を取得します。</p>
    <ul>
    <li><p><strong>SAML Certificates</strong> セクションで、<strong>Download</strong> をクリックして <strong>Certificate (Base64)</strong> を保存します。これは、<a href="./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console">ステップ 3</a> で <strong>Manual</strong> モードが選択されている場合に Zilliz Cloud コンソールで必要になります。</p></li>
    <li><p><strong>Set up zilliz</strong> セクションで、<strong>Login URL</strong> をコピーします。これは、<a href="./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console">ステップ 3</a> で <strong>Manual</strong> モードが選択されている場合に Zilliz Cloud コンソールで必要になります。</p></li>
    </ul>

    </Admonition>

\<Procedures>

### ステップ 3: Zilliz Cloud コンソールで IdP 設定を構成する{#step-3-configure-idp-settings-in-zilliz-cloud-console}

このステップでは、SAML 信頼関係を完了するために、Microsoft Entra の IdP の詳細を Zilliz Cloud に提供します。

 <Supademo id="cme7yxwoh38qih3pycwf88tzi" title="Configure IdP settings in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻ります。

1. **Configure Single Sign-On (SSO)** ダイアログボックスの **Identity Provider Details** カードで、[ステップ 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で Microsoft Entra 管理センターからコピーした **App Federation Metadata URL** を貼り付けます。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、IdP の詳細構成で <strong>Manual</strong> モードを選択した場合は、次を構成します。</p>
    <ul>
    <li><p><strong>Login URL</strong>: [ステップ 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で Microsoft Entra 管理センターからコピーしたログイン URL をここに貼り付けます。</p></li>
    <li><p><strong>Certificate (Base64)</strong>: [ステップ 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で Microsoft Entra 管理センターからダウンロードした証明書をここにアップロードします。<code>-----BEGIN CERTIFICATE-----</code> で始まり <code>-----END CERTIFICATE-----</code> で終わる行を含む証明書全体が提供されていることを確認してください。</p></li>
    </ul>

    </Admonition>

1. 完了したら、**Save** をクリックします。

</Procedures>

## 構成後のタスク{#post-configuration-tasks}

### タスク 1: Microsoft Entra アプリケーションをユーザーに割り当てる{#task-1-assign-microsoft-entra-application-to-users}

 <Supademo id="cme7z3h7r38s8h3py95vf8g4m" title="Task 1: Assign Microsoft Entra application to users" />

ユーザーが SSO を介して Zilliz Cloud にアクセスする前に、Microsoft Entra アプリケーションをユーザーに割り当てる必要があります。

<Procedures>

1. [Microsoft Entra 管理センター](https://aad.portal.azure.com/?ad=in-text-link)のアプリケーションページで、**Users and groups** > **+ Add user/group** を選択します。

1. アプリケーションへのアクセスを許可するユーザーまたはグループを選択します。

</Procedures>

詳細については、[Microsoft Entra ドキュメント](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal)を参照してください。

### タスク 2: ユーザーをプロジェクトに招待する{#task-2-invite-users-to-your-project}

ユーザーが初めて SSO 経由で Zilliz Cloud にログインすると、**Organization Member** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **Organization Owner** は、適切なプロジェクトにユーザーを招待する必要があります。

- ユーザーをプロジェクトに招待する手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project)を参照してください。

プロジェクトに招待された後、**Organization** **Owner** は Zilliz Cloud のログイン URL をエンタープライズユーザーと共有して、SSO 経由でサインインできるようにします。

セットアップまたはテストプロセス中に問題が発生した場合は、[Zilliz サポート](https://zilliz.com/contact-sales)にお問い合わせください。

## FAQ{#faq}

### SSO 経由で初めてログインするユーザーに割り当てられるロールは何ですか？{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、最初の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで **Organization Member** ロールが割り当てられます。後で Zilliz Cloud コンソールでロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role-or-remove-a-collaborator)を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？{#how-do-users-access-projects-after-sso-login}

SSO 経由でログインした後、ユーザーはデフォルトで **Organization Member** ロールを持ちます。特定のプロジェクトにアクセスするには、**Organization Owner** または **Project Admin** がユーザーをプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### SSO でログインする前にユーザーがすでに Zilliz Cloud アカウントを持っている場合はどうなりますか？{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーがすでに Zilliz Cloud 組織に存在する場合 (メールアドレスに基づいて)、SSO 経由でログインしても元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に複数の SSO プロバイダーを構成できますか？{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織は、一度に **1 つのアクティブな SAML SSO 構成**のみをサポートしています。