---
title: "Google Workspace (SAML 2.0) | Cloud"
slug: /single-sign-on-with-google-workspace
sidebar_key: single-sign-on-with-google-workspace
sidebar_label: "Google Workspace (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0 プロトコルを使用して Google Workspace でシングルサインオン（SSO）を構成する方法について説明します。"
type: origin
token: OLAEwETZtitiNFkkA9JcE5YZnXf
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - sso
  - google
  - workspace

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Google Workspace (SAML 2.0)

このトピックでは、SAML 2.0 プロトコルを使用して Google Workspace でシングルサインオン（SSO）を設定する方法について説明します。

このガイドでは、Zilliz Cloud がサービスプロバイダー（SP）として、Google Workspace が ID プロバイダー（IdP）として機能します。以下の図は、Zilliz Cloud と Google Admin コンソールで必要な手順を示しています。

![LsmAwFbPthojH3bLRtEcogRinwc](https://zdoc-images.s3.us-west-2.amazonaws.com/LsmAwFbPthojH3bLRtEcogRinwc.png)

## 開始前の準備\{#before-you-start}

- Zilliz Cloud 組織に少なくとも 1 つの **Dedicated (Enterprise)** クラスターが存在すること。

- Google Admin コンソールで Admin ロールを持っていること。

- SSO を設定する Zilliz Cloud 組織で 組織オーナー であること。

## 設定手順\{#configuration-steps}

### ステップ 1: Zilliz Cloud コンソールで SP 詳細にアクセスする\{#step-1-access-sp-details-in-zilliz-cloud-console}

SP として、Zilliz Cloud は Google Admin で SAML アプリを設定する際に必要な **エンティティID** と **ACS URL** を提供します。

<Supademo id="cme6flmz31zk2h3py5y8zv82m" title="Step 1: Access service provider details in Zilliz Cloud" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインし、SSO を設定したい組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけ、**Configure** をクリックします。

1. 表示されたダイアログボックスで、IdP とプロトコルとして **Google Workspace (SAML 2.0)** を選択します。

1. **サービスプロバイダーの詳細** カードで、**エンティティID** と **ACS URL** をコピーします。これらの値は、Google Admin コンソールで SAML アプリを作成する [ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console) で必要になります。

    <Admonition type="info" icon="📘" title="Notes">

    または、ここで **SSO URL** と **Certificate** をコピーすることもできます。この場合、[ステップ 3](./single-sign-on-with-google-workspace#step-3-configure-idp-settings-in-zilliz-cloud-console) で Manual モードで IdP 詳細を設定する必要があります。

    </Admonition>

1. 完了したら、[ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console) に進みます。

</Procedures>

### ステップ 2: Google Admin コンソールでカスタム SAML アプリを作成する\{#step-2-create-a-custom-saml-app-in-google-admin-console}

このステップでは、Zilliz Cloud から取得した SP 詳細を使用して、Google Workspace（IdP）を設定します。

<Supademo id="cmdwjibf16qq99f96c9uz5n8i" title="Step 2: Create SAML app in Google Admin" />

<Procedures>

1. [Google Admin コンソール](https://admin.google.com/)にログインします。

1. 左側のナビゲーションペインで、**アプリ** > **Webおよびモバイルアプリ** を選択します。次に、**Add app** > **Add custom SAML app** を選択します。

1. アプリ名をカスタマイズします（例: **zilliz**）そして **CONTINUE** をクリックします。

1. 表示されたページで、**Option 1: ダウンロード IdP metadata** から IdP メタデータをダウンロードします。これは、Zilliz Cloud コンソールで IdP 設定を行う [ステップ 3](./single-sign-on-with-google-workspace#step-3-configure-idp-settings-in-zilliz-cloud-console) で必要になります。次に、**Continue** をクリックします。

    <Admonition type="info" icon="📘" title="Notes">

    または、**Option 2: Copy the SSO URL, entity ID, and certificate** からそれぞれ **SSO URL**、**エンティティID**、**Certificate** を取得します。これらは、[ステップ 3](./single-sign-on-with-google-workspace#step-3-configure-idp-settings-in-zilliz-cloud-console) で **Manual** モードが選択された場合に Zilliz Cloud コンソールで必要になります。

    </Admonition>

1. **サービスプロバイダーの詳細** セクションで、以下を設定します。

    - **ACS URL**: [ステップ 1](./single-sign-on-with-google-workspace#step-1-access-sp-details-in-zilliz-cloud-console) で Zilliz Cloud コンソールからコピーした **ACS URL** を貼り付けます。

    - **エンティティID**: [ステップ 1](./single-sign-on-with-google-workspace#step-1-access-sp-details-in-zilliz-cloud-console) で Zilliz Cloud コンソールからコピーした **エンティティID** を貼り付けます。

    完了したら、**Continue** をクリックします。

1. **属性** セクションで、以下を設定します。

    - **Googleディレクトリ属性**: **ADD MAPPING** をクリックし、**プライマリメール** を選択します。

    - **アプリ属性**: 値を **email** に設定します。

1. **完了** をクリックします。

</Procedures>

### ステップ 3: Zilliz Cloud コンソールで IdP 設定を構成する\{#step-3-configure-idp-settings-in-zilliz-cloud-console}

このステップでは、Google Workspace の IdP 詳細を Zilliz Cloud に提供して、SAML 信頼関係を完了します。

<Supademo id="cme6g56mb1zs2h3pyn5cynqgb" title="Step 3: Configure IdP settings in Zilliz Cloud" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻ります。

1. **Configure Single Sign-On (SSO)** ダイアログボックスの **IDプロバイダーの詳細** カードで、[ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console) で Google Admin コンソールからダウンロードしたメタデータファイルをアップロードします。

    <Admonition type="info" icon="📘" title="Notes">

    または、IdP 詳細設定で **Manual** モードを選択した場合は、以下を設定します。

    - **SSO URL**: [ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console) でコピーした **SSO URL** をここに貼り付けます。

    - **Certificate**: [ステップ 2](./single-sign-on-with-google-workspace#step-2-create-a-custom-saml-app-in-google-admin-console) でコピーした **Certificate** をここに貼り付けます。

    </Admonition>

1. 完了したら、**Save** をクリックします。

</Procedures>

## 設定後のタスク\{#post-configuration-tasks}

### タスク 1: ユーザーに SAML アプリを割り当てる（Google Admin コンソール）\{#task-1-assign-saml-app-to-users-google-admin-console}

<Supademo id="cmdwrmzn36umt9f96nzntwaxq" title="Task 1: Assign SAML app to users" />

ユーザーが SSO を介して Zilliz Cloud にアクセスできるようにする前に、SAML アプリを有効にします。

<Procedures>

1. 新しく作成したアプリの詳細ページで、**ユーザーアクセス** エリアを見つけ、サービスステータスを編集するためにクリックします。

1. 組織内の全員に対してサービスをオンまたはオフにするには、**ON** for everyone または **OFF** for everyone をクリックし、**Save** をクリックします。

1. （オプション）組織単位に対してサービスをオンまたはオフにするには:

    1. 左側で組織単位を選択します。

    1. サービスステータス を変更するには、**ON** または **OFF** を選択します。

    1. いずれかを選択します。

        - **サービスステータス** が **継承済み** に設定されていて、親の設定が変更されても更新された設定を保持したい場合は、**上書き** をクリックします。

        - **サービスステータス** が **上書き済み** に設定されている場合は、親と同じ設定に戻すために **継承する** をクリックするか、親の設定が変更されても新しい設定を保持するために **Save** をクリックします。
注: [organizational structure](https://support.google.com/a/answer/4352075) の詳細についてはこちらを参照してください。

1. （オプション）組織単位をまたがる、または組織単位内のユーザーのセットに対してサービスをオンにするには、アクセスグループを選択します。詳細については、[Use groups to customize service access](https://support.google.com/a/answer/9050643) を参照してください。

1. ユーザーが SAML アプリにサインインするために使用するメールアドレスが、Google ドメインにサインインするために使用するメールアドレスと一致していることを確認します。

</Procedures>

### タスク 2: ユーザーをプロジェクトに招待する\{#task-2-invite-users-to-your-project}

ユーザーが初めて SSO を介して Zilliz Cloud にログインすると、**組織メンバー** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **組織オーナー** が適切なプロジェクトに招待する必要があります。

- プロジェクトにユーザーを招待する手順については、[Manage Project Users](./project-users#invite-a-user-to-a-project) を参照してください。

プロジェクトに招待された後、**Organization** **オーナー** は Zilliz Cloud のログイン URL をエンタープライズユーザーと共有し、SSO を介してサインインできるようにします。

設定またはテストプロセス中に問題が発生した場合は、[Zilliz support](https://zilliz.com/contact-sales) にお問い合わせください。

### タスク 3: （オプション）SSO 強制を有効にする\{#task-3-optional-enable-sso-enforcement}

SSO 接続が完全に設定され、テストされた後、オプションで **SSO enforcement** を有効にして、すべての組織メンバーに SSO を介してのみログインすることを要求できます。有効にすると、メンバーはメール/パスワードやサードパーティアカウント（Google、GitHub）を使用してサインインできなくなります。

<Admonition type="danger" icon="🚧" title="Warning">

この機能を有効にすると、現在パスワードでサインインしているすべてのメンバーが直ちにログアウトされ、SSO 以外のログイン方法がブロックされます。

</Admonition>

<Supademo id="cml4tlban34cozsadvi68n666" title=""  />

詳細については、[Enforce SSO in Your Organization](./enforce-sso-in-your-organization) を参照してください。

## FAQ\{#faq}

### SSO で初めてログインするユーザーに割り当てられるロールは何ですか？\{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、初回の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで **組織メンバー** ロールが割り当てられます。後で Zilliz Cloud コンソールでロールを変更できます。詳細な手順については、[Manage Project Users](./project-users#edit-a-collaborators-role) を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？\{#how-do-users-access-projects-after-sso-login}

SSO でログイン後、ユーザーにはデフォルトで **組織メンバー** ロールが付与されます。特定のプロジェクトにアクセスするには、**組織オーナー** または **プロジェクト管理者** がプロジェクトに招待する必要があります。詳細な手順については、[Manage Project Users](./project-users) を参照してください。

### SSO でログインする前に既に Zilliz Cloud アカウントを持っているユーザーはどうなりますか？\{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーが既に Zilliz Cloud 組織に存在する場合（メールアドレスに基づく）、SSO でログインしても元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に複数の SSO プロバイダーを設定できますか？\{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織では、同時に **1 つのアクティブな SAML SSO 設定** のみがサポートされています。