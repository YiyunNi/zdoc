---
title: "Okta (OIDC) | Cloud"
slug: /openid-connect
sidebar_key: openid-connect
sidebar_label: "Okta (OIDC)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、OpenID Connect (OIDC) プロトコルを使用して Okta でシングルサインオン (SSO) を構成する方法について説明します。"
type: origin
token: OQ2ZwpH9ki5EZIkwK21cghexnOh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - sso

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Okta (OIDC)

このトピックでは、OpenID Connect (OIDC) プロトコルを使用して Okta でシングルサインオン (SSO) を設定する方法について説明します。

このガイドでは、Zilliz Cloud がサービスプロバイダー (SP) として機能し、Okta が ID プロバイダー (IdP) として機能します。次の図は、Zilliz Cloud と Okta コンソールで必要な手順を示しています。

![EfRWwnbKNhcXEwbL7EBcB66inrd](https://zdoc-images.s3.us-west-2.amazonaws.com/EfRWwnbKNhcXEwbL7EBcB66inrd.png)

## 開始前の準備\{#before-you-start}

- Zilliz Cloud 組織に少なくとも 1 つの **Dedicated (Enterprise)** クラスターがあること。

- Okta コンソールへの管理者アクセス権があること。詳細については、[Okta 公式ドキュメント](https://help.okta.com/en-us/content/topics/security/administrators-learn-about-admins.htm) を参照してください。

- SSO を設定する Zilliz Cloud 組織で、組織オーナーであること。

## 設定手順\{#configuration-steps}

### ステップ 1: Zilliz Cloud コンソールで SP の詳細にアクセスする\{#step-1-access-sp-details-in-zilliz-cloud-console}

SP として、Zilliz Cloud は Okta で OIDC アプリを設定する際に必要な **シングルサインオンURL** を提供します。

<Supademo id="cme89wf1w3eaoh3pytd3723ao" title="Step 1: Access service provider details in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインし、SSO を設定する組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけ、**Configure** をクリックします。

1. 表示されたダイアログボックスで、IdP およびプロトコルとして **Okta (OIDC)** を選択します。

1. **サービスプロバイダーの詳細** カードで、**シングルサインオンURL** をコピーします。これは、Okta コンソールで OIDC アプリを作成する [ステップ 2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console) で必要になります。

1. 完了したら、[ステップ 2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console) に進みます。

</Procedures>

### ステップ 2: Okta コンソールで OIDC アプリを設定する\{#step-2-set-up-an-oidc-app-in-okta-console}

このステップでは、Zilliz Cloud から取得した SP の詳細を使用して Okta (IdP) を設定します。

<Supademo id="cme8abl5c3ei3h3pywbc9z740" title="Step 1: Create SAML App in Okta Console" />

<Procedures>

1. [Okta Admin コンソール](https://login.okta.com/) にログインします。

1. 左側のナビゲーションペインで、**アプリケーション** > **アプリケーション** を選択します。

1. **Create App Integration** をクリックします。

1. **Create a new app integration** ダイアログボックスで、サインイン方法として **OIDC - OpenID Connect** を選択し、アプリケーションタイプとして **Webアプリケーション** を選択します。**Next** をクリックします。

1. 新しい Web アプリ連携を次の設定で構成します：

    - **アプリ連携名**: アプリ連携名をカスタマイズします（例: **zilliz**）。

    - **サインインリダイレクトURI**: [ステップ 1](./openid-connect#step-1-access-sp-details-in-zilliz-cloud-console) で Zilliz Cloud コンソールからコピーした **シングルサインオンURL** をここに貼り付けます。

    - **制御されたアクセス**: 特定のグループアクセスを設定しない場合は、**Skip group assignment for now** を選択します。

1. **Save** をクリックします。すると、アプリの詳細ページにリダイレクトされます。

1. アプリの詳細ページで、次の情報を取得します：

    - **クライアントID**

    - **クライアントシークレット**

    - **Oktaドメイン**

    これらの値は、[ステップ 3](./openid-connect#step-3-configure-idp-settings-in-zilliz-cloud-console) で Zilliz Cloud コンソールで必要になります。

</Procedures>

### ステップ 3: Zilliz Cloud コンソールで IdP 設定を構成する\{#step-3-configure-idp-settings-in-zilliz-cloud-console}

このステップでは、Okta の IdP の詳細を Zilliz Cloud に提供して、OIDC の信頼関係を完了します。

<Supademo id="cme8af32q3elth3pyaygkdnmo" title="Step 3: Configure Okta settings in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) に戻ります。

1. **Configure Single Sign-On (SSO)** ダイアログボックスの **IDプロバイダーの詳細** カードで、次の項目を設定します：

    - **Okta Domain**: [ステップ 2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console) で Okta コンソールからコピーした **Oktaドメイン** を貼り付けます。

    - **クライアントID**: [ステップ 2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console) で Okta コンソールからコピーした **クライアントID** を貼り付けます。

    - **クライアントシークレット**: [ステップ 2](./openid-connect#step-2-set-up-an-oidc-app-in-okta-console) で Okta コンソールからコピーした **クライアントシークレット** を貼り付けます。

1. 完了したら、**Save** をクリックします。次に、**OK** をクリックします。

</Procedures>

## 設定後のタスク\{#post-configuration-tasks}

### タスク 1: ユーザーに OIDC アプリを割り当てる\{#task-1-assign-oidc-app-to-users}

<Supademo id="cme8ahjdm3epjh3pyg6a3k93k" title="Task 1: Assign OIDC app to users" />

ユーザーが SSO を介して Zilliz Cloud にアクセスできるようにする前に、OIDC アプリをユーザーに割り当てる必要があります：

<Procedures>

1. [Okta Admin コンソール](https://login.okta.com/) のアプリ詳細ページで、**割り当て** をクリックします。

1. **Assign** > **Assign to People** を選択します。

1. OIDC アプリをユーザーに割り当て、変更を保存します。

1. **Save** **and** **戻る** をクリックします。次に、**Done** をクリックします。

</Procedures>

必要に応じてすべてのユーザーに対して繰り返します。詳細については、[Okta ドキュメント](https://help.okta.com/oie/en-us/content/topics/provisioning/lcm/lcm-assign-app-groups.htm) を参照してください。

### タスク 2: ユーザーをプロジェクトに招待する\{#task-2-invite-users-to-your-project}

ユーザーが初めて SSO を介して Zilliz Cloud にログインすると、**組織メンバー** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **組織オーナー** が適切なプロジェクトに招待する必要があります。

- プロジェクトにユーザーを招待する手順については、[Manage Project Users](./project-users#invite-a-user-to-a-project) を参照してください。

プロジェクトに招待された後、**組織オーナー** は Zilliz Cloud のログイン URL をエンタープライズユーザーと共有し、SSO を介してサインインできるようにします。

<Admonition type="info" icon="📘" title="Notes">

<p>組織で SSO 強制が有効になっている場合、組織レベルでの直接メンバー招待は無効になります。代わりに IdP を通じてユーザーをプロビジョニングする必要があります。プロジェクトレベルでメンバーを招待する場合、既存の組織メンバーのみを招待できます。</p>

</Admonition>

設定またはテストプロセス中に問題が発生した場合は、[Zilliz サポート](https://zilliz.com/contact-sales) にお問い合わせください。

### タスク 3: (オプション) SSO 強制を有効にする\{#task-3-optional-enable-sso-enforcement}

SSO 接続が完全に設定され、テストされた後、オプションで **SSO 強制** を有効にして、すべての組織メンバーが SSO を介してのみログインするように要求できます。有効にすると、メンバーはメール/パスワードまたはサードパーティアカウント（Google、GitHub）を使用してサインインできなくなります。

<Admonition type="danger" icon="🚧" title="Warning">

<p>この機能を有効にすると、パスワードで現在サインインしているすべてのメンバーが直ちにログアウトされ、SSO 以外のログイン方法がブロックされます。</p>

</Admonition>

<Supademo id="cml4tlban34cozsadvi68n666" title=""  />

詳細については、[Enforce SSO in Your Organization](./enforce-sso-in-your-organization) を参照してください。

## FAQ\{#faq}

### SSO で初めてログインするユーザーに割り当てられるロールは何ですか？\{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、初回の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで **組織メンバー** ロールが割り当てられます。後で Zilliz Cloud コンソールでロールを変更できます。詳細な手順については、[Manage Project Users](./project-users#edit-a-collaborators-role) を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？\{#how-do-users-access-projects-after-sso-login}

SSO でログインした後、ユーザーにはデフォルトで **組織メンバー** ロールが割り当てられます。特定のプロジェクトにアクセスするには、**組織オーナー** または **プロジェクト管理者** がプロジェクトに招待する必要があります。詳細な手順については、[Manage Project Users](./project-users) を参照してください。

### SSO でログインする前に既に Zilliz Cloud アカウントを持っているユーザーはどうなりますか？\{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーが既に Zilliz Cloud 組織に存在する場合（メールアドレスに基づく）、SSO でログインしても元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に複数の SSO プロバイダーを設定できますか？\{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織では、一度にアクティブな SAML SSO 設定は **1 つ** のみサポートされています。