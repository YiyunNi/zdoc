---
title: "Google Workspace (SAML 2.0) | Cloud"
slug: /single-sign-on-with-google-workspace
sidebar_label: "Google Workspace (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0 プロトコルを使用して Google Workspace でシングルサインオン (SSO) を設定する方法について説明します。 | Cloud"
type: origin
token: OLAEwETZtitiNFkkA9JcE5YZnXf
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - sso
  - google
  - workspace
  - milvus vector db
  - Zilliz Cloud
  - what is milvus
  - milvus database

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Google Workspace (SAML 2.0)

このトピックでは、SAML 2.0 プロトコルを使用して Google Workspace でシングルサインオン (SSO) を構成する方法について説明します。

このガイドでは、Zilliz Cloud がサービスプロバイダー (SP) として機能し、Google Workspace がアイデンティティプロバイダー (IdP) として機能します。次の図は、Zilliz Cloud と Google Admin コンソールで必要な手順を示しています。

![LsmAwFbPthojH3bLRtEcogRinwc](https://zdoc-images.s3.us-west-2.amazonaws.com/LsmAwFbPthojH3bLRtEcogRinwc.png)

## 開始する前に{#before-you-start}

- Zilliz Cloud 組織に少なくとも 1 つの **Dedicated (Enterprise)** クラスターがあること。

- Google Admin コンソールで管理者ロールを持っている必要があります。

- SSO を構成する Zilliz Cloud 組織の組織所有者であること。

## 構成手順{#configuration-steps}

### ステップ 1: Zilliz Cloud コンソールで SP の詳細にアクセスする{#step-1-access-sp-details-in-zilliz-cloud-console}

SP として、Zilliz Cloud は Google Admin で SAML アプリを設定する際に必要な **Entity ID** と **ACS URL** を提供します。

<Supademo id="cme6flmz31zk2h3py5y8zv82m" title="Step 1: Access service provider details in Zilliz Cloud" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインし、SSO を構成する組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけ、**Configure** をクリックします。

1. 表示されるダイアログボックスで、IdP とプロトコルとして **Google Workspace (SAML 2.0)** を選択します。

1. **Service Provider Details** カードで、**Entity ID** と **ACS URL** をコピーします。これらの値は、Google Admin コンソールで SAML アプリを作成する際の[ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console)で必要になります。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、ここで <strong>SSO URL</strong> と <strong>Certificate</strong> をコピーすることもできます。この場合、<a href="./single-sign-on-with-google-workspace#step-3-configure-idp-settings-in-zilliz-cloud-console">ステップ 3</a> で IdP の詳細を手動モードで構成する必要があります。</p>

    </Admonition>

1. 完了したら、[ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console)に進みます。

</Procedures>

### ステップ 2: Google Admin コンソールでカスタム SAML アプリを作成する{#step-2-create-a-custom-saml-app-in-google-admin-console}

このステップでは、Zilliz Cloud から取得した SP の詳細で Google Workspace (IdP) を構成します。

<Supademo id="cmdwjibf16qq99f96c9uz5n8i" title="Step 2: Create SAML app in Google Admin" />

<Procedures>

1. [Google Admin コンソール](https://admin.google.com/)にログインします。

1. 左側のナビゲーションペインで、**Apps** > **Web and mobile apps** を選択します。次に、**Add app** > **Add custom SAML app** を選択します。

1. アプリ名 (例: **zilliz**) をカスタマイズし、**CONTINUE** をクリックします。

1. 表示されるページで、**Option 1: Download IdP metadata** から IdP メタデータをダウンロードします。これは、Zilliz Cloud コンソールで IdP 設定を構成する際の[ステップ 3](./single-sign-on-with-google-workspace#step-3-configure-idp-settings-in-zilliz-cloud-console)で必要になります。次に、**Continue** をクリックします。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、<strong>Option 2: Copy the SSO URL, entity ID, and certificate</strong> から、それぞれ <strong>SSO URL</strong>、<strong>Entity ID</strong>、<strong>Certificate</strong> を取得します。これらは、<a href="./single-sign-on-with-google-workspace#step-3-configure-idp-settings-in-zilliz-cloud-console">ステップ 3</a> で <strong>Manual</strong> モードが選択されている場合、Zilliz Cloud コンソールで必要になります。</p>

    </Admonition>

1. **Service provider details** セクションで、以下を構成します。

    - **ACS URL**: [ステップ 1](./single-sign-on-with-google-workspace#step-1-access-sp-details-in-zilliz-cloud-console)で Zilliz Cloud コンソールからコピーした **ACS URL** を貼り付けます。

    - **Entity ID**: [ステップ 1](./single-sign-on-with-google-workspace#step-1-access-sp-details-in-zilliz-cloud-console)で Zilliz Cloud コンソールからコピーした **Entity ID** を貼り付けます。

    完了したら、**Continue** をクリックします。

1. **Attributes** セクションで、以下を構成します。

    - **Google Directory attributes**: **ADD MAPPING** をクリックし、**Primary email** を選択します。

    - **App attributes**: 値を **email** に設定します。

1. **Finish** をクリックします。

</Procedures>

### ステップ 3: Zilliz Cloud コンソールで IdP 設定を構成する{#step-3-configure-idp-settings-in-zilliz-cloud-console}

このステップでは、Google Workspace の IdP の詳細を Zilliz Cloud に提供して、SAML 信頼関係を完了します。

<Supademo id="cme6g56mb1zs2h3pyn5cynqgb" title="Step 3: Configure IdP settings in Zilliz Cloud" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻ります。

1. **Configure Single Sign-On (SSO)** ダイアログボックスの **Identity Provider Details** カードで、[ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console)で Google Admin コンソールからダウンロードしたメタデータファイルをアップロードします。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、IdP の詳細設定で <strong>Manual</strong> モードを選択した場合、以下を構成します。</p>
    <ul>
    <li><p><strong>SSO URL</strong>: [ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console)でコピーした <strong>SSO URL</strong> をここに貼り付けます。</p></li>
    <li><p><strong>Certificate</strong>: [ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console)でコピーした <strong>Certificate</strong> をここに貼り付けます。</p></li>
    </ul>

    </Admonition>

1. 完了したら、**Save** をクリックします。

</Procedures>

## 構成後のタスク{#post-configuration-tasks}

### タスク 1: SAML アプリをユーザーに割り当てる (Google Admin コンソール){#task-1-assign-saml-app-to-users-google-admin-console}

<Supademo id="cmdwrmzn36umt9f96nzntwaxq" title="Task 1: Assign SAML app to users" />

ユーザーが SSO を介して Zilliz Cloud にアクセスできるようにするには、SAML アプリをオンにします。

<Procedures>

1. 新しく作成したアプリの詳細ページで、**User access** エリアを見つけてクリックし、サービスステータスを編集します。

1. 組織内の全員に対してサービスをオンまたはオフにするには、全員に対して **ON** または全員に対して **OFF** をクリックし、**Save** をクリックします。

1. (オプション) 組織単位に対してサービスをオンまたはオフにするには:

    1. 左側で、組織単位を選択します。

    1. サービスステータスを変更するには、**ON** または **OFF** を選択します。

    1. いずれかを選択します。

        - **Service status** が **Inherited** に設定されており、親の設定が変更されても更新された設定を維持したい場合は、**Override** をクリックします。

        - **Service status** が **Overridden** に設定されている場合は、**Inherit** をクリックして親と同じ設定に戻すか、**Save** をクリックして親の設定が変更されても新しい設定を維持します。
注: [組織構造](https://support.google.com/a/answer/4352075)の詳細については、こちらをご覧ください。

1. (オプション) 組織単位全体または組織単位内で一連のユーザーに対してサービスをオンにするには、アクセスグループを選択します。詳細については、[グループを使用してサービスアクセスをカスタマイズする](https://support.google.com/a/answer/9050643)を参照してください。

1. ユーザーが SAML アプリにサインインするために使用するメールアドレスが、Google ドメインにサインインするために使用するメールアドレスと一致していることを確認します。

</Procedures>

### タスク 2: ユーザーをプロジェクトに招待する{#task-2-invite-users-to-your-project}

ユーザーが SSO を介して Zilliz Cloud に初めてログインすると、**Organization Member** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **Organization Owner** は、適切なプロジェクトにユーザーを招待する必要があります。

- ユーザーをプロジェクトに招待する手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project)を参照してください。

プロジェクトに招待された後、**Organization Owner** は Zilliz Cloud のログイン URL をエンタープライズユーザーと共有して、SSO を介してサインインできるようにします。

セットアップまたはテストプロセス中に問題が発生した場合は、[Zilliz サポート](https://zilliz.com/contact-sales)にお問い合わせください。

## FAQ{#faq}

### SSO を介して初めてログインするユーザーに割り当てられるロールは何ですか？{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、最初の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで **Organization Member** ロールが割り当てられます。後で Zilliz Cloud コンソールでロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role-or-remove-a-collaborator)を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？{#how-do-users-access-projects-after-sso-login}

SSO を介してログインした後、ユーザーはデフォルトで **Organization Member** ロールを持ちます。特定のプロジェクトにアクセスするには、**Organization Owner** または **Project Admin** がプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### SSO でログインする前にユーザーがすでに Zilliz Cloud アカウントを持っている場合はどうなりますか？{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーがすでに Zilliz Cloud 組織に存在する場合 (メールアドレスに基づいて)、SSO を介してログインすると、元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に対して複数の SSO プロバイダーを構成できますか？{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織は、一度に **1 つのアクティブな SAML SSO 構成**のみをサポートしています。