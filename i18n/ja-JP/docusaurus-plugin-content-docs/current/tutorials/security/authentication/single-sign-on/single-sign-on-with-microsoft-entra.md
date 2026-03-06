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

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Microsoft Entra (SAML 2.0)

このトピックでは、SAML 2.0プロトコルを使用してMicrosoft Entraでシングルサインオン（SSO）を構成する方法について説明します。

このガイドでは、Zilliz Cloudがサービスプロバイダー（SP）として機能し、Microsoft EntraがIDプロバイダー（IdP）として機能します。以下の図は、Zilliz CloudとMicrosoft Entra管理センターでの必要な手順を示しています。

![M3UywWSZHhlwTHbkjI8c6jTinGh](https://zdoc-images.s3.us-west-2.amazonaws.com/M3UywWSZHhlwTHbkjI8c6jTinGh.png)

## 開始する前に\{#before-you-start}

- Zilliz Cloud組織には、少なくとも1つの**Dedicated (Enterprise)** クラスターがあります。

- Microsoft Entra管理センターにアクセスできます。詳細については、[Microsoft Entraドキュメント](https://learn.microsoft.com/en-us/entra/fundamentals/entra-admin-center)を参照してください。

- SSOを構成するZilliz Cloud組織の組織オーナーであること。

## 設定\{#configuration-steps}

### ステップ1：Zilliz CloudコンソールでSPの詳細にアクセスする\{#step-1-access-sp-details-in-zilliz-cloud-console}

SPとして、Zilliz Cloudは、Microsoft EntraでSAMLアプリケーションを設定する際に必要な**Identifier (エンティティID)** と**Reply URL (Assertion Consumer Service URL)** を提供します。

 <Supademo id="cme7yk5zy38k0h3pyor6ovyvh" title="Step 1: Access service provider details in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)にログインし、SSOを構成したい組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけて、**Configure** をクリックします。

1. 表示されるダイアログボックスで、IdPとプロトコルとして**Microsoft Entra (SAML 2.0)** を選択します。

1. **サービスプロバイダーの詳細** カードで、**Identifier (エンティティID)** と**Reply URL (Assertion Consumer Service URL)** をコピーします。これらの値は、[ステップ2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center)でMicrosoft Entra管理センターでアプリケーションを設定する際に必要になります。

1. 完了したら、[ステップ2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center)に進みます。

</Procedures>

### ステップ2：Microsoft Entra管理センターでアプリケーションを設定する\{#step-2-set-up-an-application-in-microsoft-entra-admin-center}

このステップでは、Zilliz Cloudから取得したSPの詳細を使用してMicrosoft Entra（IdP）を構成します。

<Supademo id="cme7ynp8r38ksh3pyaghg664m" title="Set up an application in Microsoft Entra admin center" />

<Procedures>

1. [Microsoft Entra管理センター](https://aad.portal.azure.com/?ad=in-text-link)にログインします。

1. 左側のナビゲーションペインで、**エンタープライズアプリ** をクリックします。

1. 表示されるページで、**新しいアプリケーション** をクリックします。次に、**Create your own application** をクリックします。

1. **Create your own application** パネルで、アプリケーション名を**zilliz**に設定し、**Integrate any other application you don't find in the gallery (Non-gallery)** オプションを選択します。

1. 次に、**Create** をクリックします。完了すると、アプリケーションが作成され、アプリケーションの詳細ページにリダイレクトされます。

1. アプリケーションの詳細ページで、**シングルサインオン** > **SAML** を選択します。

1. **基本SAML構成** セクションで、**Edit** をクリックします。

1. **Identifier (エンティティID)** エリアで、**Add identifier** をクリックします。次に、[ステップ1](./single-sign-on-with-microsoft-entra#step-1-access-sp-details-in-zilliz-cloud-console)でZilliz Cloudコンソールからコピーした**Identifier (エンティティID)** をテキストボックスに貼り付けます。

1. **Reply URL (Assertion Consumer Service URL)** エリアで、**Add reply URL** をクリックします。次に、[ステップ1](./single-sign-on-with-microsoft-entra#step-1-access-sp-details-in-zilliz-cloud-console)でZilliz Cloudコンソールからコピーした**Reply URL (Assertion Consumer Service URL)** をテキストボックスに貼り付けます。

1. **Save** をクリックします。

1. 完了したら、作成したアプリケーションの**シングルサインオン** パネルに戻り、**App Federation Metadata Url** をコピーします。これは、[ステップ3](./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console)でZilliz Cloudコンソールで必要になります。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、以下の詳細を取得します。</p>
    <ul>
    <li><p><strong>SAML Certificates</strong> セクションで、<strong>ダウンロード</strong> をクリックして<strong>Certificate (Base64)</strong> を保存します。これは、<a href="./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console">ステップ3</a>で<strong>Manual</strong>モードが選択されている場合、Zilliz Cloudコンソールで必要になります。</p></li>
    <li><p><strong>Set up zilliz</strong> セクションで、<strong>Login URL</strong> をコピーします。これは、<a href="./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console">ステップ3</a>で<strong>Manual</strong>モードが選択されている場合、Zilliz Cloudコンソールで必要になります。</p></li>
    </ul>

    </Admonition>

<Procedures>

### ステップ3：Zilliz CloudコンソールでIdP設定を構成する\{#step-3-configure-idp-settings-in-zilliz-cloud-console}

このステップでは、Microsoft EntraのIdPの詳細をZilliz Cloudに提供して、SAML信頼関係を完了します。

 <Supademo id="cme7yxwoh38qih3pycwf88tzi" title="Configure IdP settings in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)に戻ります。

1. **Configure Single Sign-On (SSO)** ダイアログボックスの**IDプロバイダーの詳細** カードで、[ステップ2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center)でMicrosoft Entra管理センターからコピーした**App Federation メタデータURL** を貼り付けます。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、IdP詳細設定で<strong>Manual</strong>モードを選択した場合、以下を構成します。</p>
    <ul>
    <li><p><strong>Login URL</strong>: [ステップ2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center)でMicrosoft Entra管理センターからコピーしたログインURLをここに貼り付けます。</p></li>
    <li><p><strong>Certificate (Base64)</strong>: [ステップ2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center)でMicrosoft Entra管理センターからダウンロードした証明書をここにアップロードします。<code>-----BEGIN CERTIFICATE-----</code>で始まり<code>-----END CERTIFICATE-----</code>で終わる行を含む証明書の内容全体が提供されていることを確認してください。</p></li>
    </ul>

    </Admonition>

1. 完了したら、**Save** をクリックします。

</Procedures>

## 構成後のタスク\{#post-configuration-tasks}

### タスク1：Microsoft Entraアプリケーションをユーザーに割り当てる\{#task-1-assign-microsoft-entra-application-to-users}

 <Supademo id="cme7z3h7r38s8h3py95vf8g4m" title="Task 1: Assign Microsoft Entra application to users" />

ユーザーがSSOを通じてZilliz Cloudにアクセスする前に、Microsoft Entraアプリケーションをユーザーに割り当てる必要があります。

<Procedures>

1. [Microsoft Entra管理センター](https://aad.portal.azure.com/?ad=in-text-link)のアプリケーションページで、**ユーザーとグループ** > **+ Add user/group** を選択します。

1. アプリケーションへのアクセスを許可するユーザーまたはグループを選択します。

</Procedures>

詳細については、[Microsoft Entraドキュメント](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal)を参照してください。

### タスク2：ユーザーをプロジェクトに招待する\{#task-2-invite-users-to-your-project}

ユーザーがSSO経由でZilliz Cloudに初めてログインすると、**組織メンバー**として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **組織オーナー**は、適切なプロジェクトにユーザーを招待する必要があります。

- ユーザーをプロジェクトに招待する手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project)を参照してください。

プロジェクトに招待された後、**組織オーナー**はZilliz CloudログインURLをエンタープライズユーザーと共有し、SSOを通じてサインインできるようにします。

セットアップまたはテストプロセス中に問題が発生した場合は、[Zillizサポート](https://zilliz.com/contact-sales)にお問い合わせください。

### タスク3：（オプション）SSO強制を有効にする\{#task-3-optional-enable-sso-enforcement}

SSO接続が完全に構成されテストされた後、オプションで**SSO強制**を有効にして、すべての組織メンバーがSSOを通じてのみログインするように要求できます。有効にすると、メンバーはメール/パスワードまたはサードパーティアカウント（Google、GitHub）を使用してサインインできなくなります。

<Admonition type="danger" icon="🚧" title="Warning">

<p>この機能を有効にすると、現在パスワードでサインインしているすべてのメンバーが直ちにログアウトされ、SSO以外のログイン方法がブロックされます。</p>

</Admonition>

<Supademo id="cml4tlban34cozsadvi68n666" title=""  />

詳細については、[組織でのSSOの強制](./enforce-sso-in-your-organization)を参照してください。

## FAQ\{#faq}

### SSO経由で初めてログインするユーザーに割り当てられるロールは何ですか？\{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloudアカウントをまだ持っていない新規ユーザーは、最初のSSOログイン時に自動的に作成されます。これらのユーザーには、デフォルトで**組織メンバー**ロールが割り当てられます。後でZilliz Cloudコンソールでロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role)を参照してください。

### SSOログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？\{#how-do-users-access-projects-after-sso-login}

SSO経由でログインした後、ユーザーはデフォルトで**組織メンバー**ロールを持ちます。特定のプロジェクトにアクセスするには、**組織オーナー**または**プロジェクト管理者**がプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### SSOでログインする前に、ユーザーがすでにZilliz Cloudアカウントを持っている場合はどうなりますか？\{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーがすでにZilliz Cloud組織に存在する場合（メールアドレスに基づく）、SSO経由でログインしても元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に対して複数のSSOプロバイダーを構成できますか？\{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各Zilliz Cloud組織は、一度に**1つのアクティブなSAML SSO構成**のみをサポートしています。