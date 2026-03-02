---
title: "Okta (OIDC) | BYOC"
slug: /openid-connect
sidebar_label: "Okta (OIDC)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、OpenID Connect (OIDC) プロトコルを使用して Okta でシングルサインオン (SSO) を構成する方法について説明します。 | BYOC"
type: origin
token: OQ2ZwpH9ki5EZIkwK21cghexnOh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - sso
  - LLMs
  - 機械学習
  - RAG
  - NLP

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Okta (OIDC)

このトピックでは、OpenID Connect (OIDC) プロトコルを使用して Okta でシングルサインオン (SSO) を構成する方法について説明します。

このガイドでは、Zilliz Cloud がサービスプロバイダー (SP) として機能し、Okta がアイデンティティプロバイダー (IdP) として機能します。次の図は、Zilliz Cloud および Okta コンソールでの必要な手順を示しています。

![EfRWwnbKNhcXEwbL7EBcB66inrd](https://zdoc-images.s3.us-west-2.amazonaws.com/EfRWwnbKNhcXEwbL7EBcB66inrd.png)

## 開始する前に\{#before-you-start}

- Zilliz Cloud 組織に少なくとも1つの**Dedicated (Enterprise)** クラスターがあること。

- Okta コンソールへの管理者アクセス権があること。詳細については、[Okta 公式ドキュメント](https://help.okta.com/en-us/content/topics/security/administrators-learn-about-admins.htm)を参照してください。

- SSO を構成する Zilliz Cloud 組織の組織オーナーであること。

## 設定手順\{#configuration-steps}

### ステップ1: Zilliz Cloud コンソールで SP の詳細にアクセスする\{#step-1-access-sp-details-in-zilliz-cloud-console}

SP として、Zilliz Cloud は Okta で OIDC アプリを設定する際に必要な**シングルサインオン URL** を提供します。

<Supademo id="cme89wf1w3eaoh3pytd3723ao" title="ステップ1: Zilliz Cloud コンソールでサービスプロバイダーの詳細にアクセスする" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインし、SSO を構成したい組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけ、**Configure** をクリックします。

1. 表示されるダイアログボックスで、IdP とプロトコルとして **Okta (OIDC)** を選択します。

1. **Service Provider Details** カードで、**Single sign-on URL** をコピーします。これは、[ステップ2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console)で Okta コンソールに OIDC アプリを作成する際に必要になります。

1. 完了したら、[ステップ2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console)に進みます。

</Procedures>

### ステップ2: Okta コンソールで OIDC アプリを設定する\{#step-2-set-up-an-oidc-app-in-okta-console}

このステップでは、Zilliz Cloud から取得した SP の詳細で Okta (IdP) を構成します。

<Supademo id="cme8abl5c3ei3h3pywbc9z740" title="ステップ1: Okta コンソールで SAML アプリを作成する" />

<Procedures>

1. [Okta Admin コンソール](https://login.okta.com/)にログインします。

1. 左側のナビゲーションペインで、**Applications** > **Applications** を選択します。

1. **Create App Integration** をクリックします。

1. **Create a new app integration** ダイアログボックスで、サインイン方法として **OIDC - OpenID Connect** を選択し、アプリケーションタイプとして **Web Application** を選択します。**Next** をクリックします。

1. 次の設定で新しい Web アプリ統合を設定します。

    - **App integration name**: アプリ統合名をカスタマイズします (例: **zilliz**)。

    - **Sign-in redirect URIs**: [ステップ1](./openid-connect#step-1-access-sp-details-in-zilliz-cloud-console)で Zilliz Cloud コンソールからコピーした**シングルサインオン URL** をここに貼り付けます。

    - **Controlled access**: 特定のグループアクセスを設定しない限り、**Skip group assignment for now** を選択します。

1. **Save** をクリックします。その後、アプリの詳細ページにリダイレクトされます。

1. アプリの詳細ページで、次の情報を取得します。

    - **Client ID**

    - **Client Secret**

    - **Okta domain**

    これらの値は、[ステップ3](./openid-connect#step-3-configure-idp-settings-in-zilliz-cloud-console)で Zilliz Cloud コンソールで必要になります。

</Procedures>

### ステップ3: Zilliz Cloud コンソールで IdP 設定を構成する\{#step-3-configure-idp-settings-in-zilliz-cloud-console}

このステップでは、Okta の IdP の詳細を Zilliz Cloud に提供して、OIDC 信頼関係を完了します。

<Supademo id="cme8af32q3elth3pyaygkdnmo" title="ステップ3: Zilliz Cloud コンソールで Okta 設定を構成する" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻ります。

1. **Configure Single Sign-On (SSO)** ダイアログボックスの **Identity Provider Details** カードで、次のように構成します。

    - **Okta Domain**: [ステップ2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console)で Okta コンソールからコピーした**Okta domain** を貼り付けます。

    - **Client ID**: [ステップ2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console)で Okta コンソールからコピーした**Client ID** を貼り付けます。

    - **Client Secret**: [ステップ2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console)で Okta コンソールからコピーした**Client Secret** を貼り付けます。

1. 完了したら、**Save** をクリックします。次に、**OK** をクリックします。

</Procedures>

## 設定後のタスク\{#post-configuration-tasks}

### タスク1: OIDC アプリをユーザーに割り当てる\{#task-1-assign-oidc-app-to-users}

<Supademo id="cme8ahjdm3epjh3pyg6a3k93k" title="タスク1: OIDC アプリをユーザーに割り当てる" />

ユーザーが SSO を介して Zilliz Cloud にアクセスする前に、OIDC アプリをユーザーに割り当てる必要があります。

<Procedures>

1. [Okta Admin コンソール](https://login.okta.com/)のアプリ詳細ページで、**Assignments** をクリックします。

1. **Assign** > **Assign to People** を選択します。

1. OIDC アプリをユーザーに割り当て、変更を保存します。

1. **Save** **and** **Go Back** をクリックします。次に、**Done** をクリックします。

</Procedures>

必要に応じて、すべてのユーザーに対して繰り返します。詳細については、[Okta ドキュメント](https://help.okta.com/oie/en-us/content/topics/provisioning/lcm/lcm-assign-app-groups.htm)を参照してください。

### タスク2: ユーザーをプロジェクトに招待する\{#task-2-invite-users-to-your-project}

ユーザーが初めて SSO 経由で Zilliz Cloud にログインすると、**Organization Member** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **Organization Owner** は、適切なプロジェクトにユーザーを招待する必要があります。

- ユーザーをプロジェクトに招待する方法のステップバイステップの手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project)を参照してください。

プロジェクトに招待された後、**Organization** **Owner** は Zilliz Cloud ログイン URL をエンタープライズユーザーと共有して、SSO 経由でサインインできるようにします。

セットアップまたはテストプロセス中に問題が発生した場合は、[Zilliz サポート](https://zilliz.com/contact-sales)にお問い合わせください。

## FAQ\{#faq}

### SSO 経由で初めてログインするユーザーに割り当てられるロールは何ですか？\{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、最初の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで**Organization Member** ロールが割り当てられます。後で Zilliz Cloud コンソールでロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role-or-or-remove-a-collaborator)を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？\{#how-do-users-access-projects-after-sso-login}

SSO 経由でログインした後、ユーザーはデフォルトで**Organization Member** ロールを持ちます。特定のプロジェクトにアクセスするには、**Organization Owner** または **Project Admin** がプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### ユーザーが SSO でログインする前に Zilliz Cloud アカウントをすでに持っている場合はどうなりますか？\{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーがすでに Zilliz Cloud 組織に存在する場合 (メールアドレスに基づく)、SSO 経由でログインしても元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に対して複数の SSO プロバイダーを構成できますか？\{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織は、一度に**1つのアクティブな SAML SSO 構成**のみをサポートしています。