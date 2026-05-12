---
title: "その他の IdP (SAML 2.0) | Cloud"
slug: /single-sign-on-with-other-idp
sidebar_key: single-sign-on-with-other-idp
sidebar_label: "その他の IdP (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0 プロトコルをサポートする任意の ID プロバイダー (IdP) を使用して、Zilliz Cloud でシングルサインオン (SSO) を構成する方法について説明します。"
type: origin
token: WDOJwtKkAijW4gkUpQhcAL0Rn1d
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - sso
  - その他
  - idp

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Other IdP (SAML 2.0)

このトピックでは、SAML 2.0 プロトコルをサポートする任意の ID プロバイダー (IdP) を使用して、Zilliz Cloud でシングルサインオン (SSO) を設定する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz Cloud では、[Okta](./single-sign-on-with-okta)、[Google Workspace](./single-sign-on-with-google-workspace)、[Microsoft Entra](./single-sign-on-with-microsoft-entra) 向けの専用統合ガイドを提供していますが、標準準拠の SAML 2.0 IdP であれば、**Other IdP (SAML 2.0)** オプションを使用できます。

</Admonition>

## 開始前\{#before-you-start}

- Zilliz Cloud 組織に、少なくとも 1 つの **Dedicated (Enterprise)** クラスターが存在すること。

- SSO を設定する Zilliz Cloud 組織で、**組織オーナー** であること。

- 使用予定の IdP への管理者アクセス権を持っていること。

- IdP 固有の設定の詳細については、使用する IdP の公式ドキュメントを参照してください。

## 設定手順\{#configuration-steps}

### ステップ 1: Zilliz Cloud コンソールでサービスプロバイダーの詳細にアクセスする\{#step-1-access-service-provider-details-in-zilliz-cloud-console}

<Supademo id="cme6sledl274yh3py7hf96vo1" title="Step 1: Access service provider details in Zilliz Cloud" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインし、SSO を設定する組織に移動します。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **Settings** ページで、**Single Sign-On (SSO)** セクションを見つけ、**Configure** をクリックします。

1. 表示されたダイアログボックスで、IdP およびプロトコルとして **Other IdP (SAML)** を選択します。

1. **サービスプロバイダーの詳細** カードで、以下の値をコピーします。

    - **SP エンティティID**

    - **ACS URL**

</Procedures>

これらの値は、IdP で SAML アプリケーションを作成する [ステップ 2](./single-sign-on-with-other-idp#step-2-create-a-saml-app-in-your-idp-console) で必要になります。

### ステップ 2: IdP コンソールで SAML アプリを作成する\{#step-2-create-a-saml-app-in-your-idp-console}

正確な手順は使用する IdP によって異なります。一般的な手順は以下の通りです。

<Procedures>

1. IdP の管理者コンソールにサインインします。

1. 新しい SAML 2.0 アプリケーション（SAML 接続または統合と呼ばれることもあります）を作成します。

1. サービスプロバイダー情報の入力を求められたら、以下を入力します。

    - [ステップ 1](./single-sign-on-with-other-idp#step-1-access-service-provider-details-in-zilliz-cloud-console) でコピーした **SP エンティティID**

    - [ステップ 1](./single-sign-on-with-other-idp#step-1-access-service-provider-details-in-zilliz-cloud-console) でコピーした **ACS URL**

1. アプリケーションを保存し、以下のいずれかの形式で IdP 設定を取得します。

    - **Option 1 – メタデータURL/File**: ほとんどの IdP は、必要な SAML メタデータをすべて含むダウンロード可能な XML ファイルまたは公開 URL を提供します。

    - **オプション2 – 手動**: メタデータが利用できない場合は、IdP から以下を収集します。

        - **IdP SSO URL** (Zilliz Cloud が認証リクエストを送信するエンドポイント)

        - **x.509証明書** (`-----BEGIN CERTIFICATE-----` および `-----END CERTIFICATE-----` の行を含む)

    この情報は [ステップ 3](./single-sign-on-with-other-idp#step-3-configure-idp-settings-in-zilliz-cloud-console) で使用します。

</Procedures>

### ステップ 3: Zilliz Cloud コンソールで IdP 設定を構成する\{#step-3-configure-idp-settings-in-zilliz-cloud-console}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) に戻ります。

1. Configure Single Sign-On (SSO) ダイアログボックスの **IDプロバイダーの詳細** カードで、以下のいずれかの方法を選択します。

    **Option 1 – メタデータURL/File**

    - IdP からコピーした **メタデータURL** を貼り付けるか、ダウンロードした Metadata XML ファイルをアップロードします。

    - Zilliz Cloud は、証明書を含む必要な IdP 詳細を自動的にインポートします。

    **オプション2 – 手動**

    - IdP から取得した **IdP SSO URL** を入力します。

    - X.509 形式で IdP 署名証明書をアップロードまたは貼り付けます。`-----BEGIN CERTIFICATE-----` および `-----END CERTIFICATE-----` の行が含まれていることを確認してください。

1. **Save** をクリックします。

</Procedures>

## 設定後のタスク\{#post-configuration-tasks}

### タスク 1: IdP で SAML アプリをユーザーに割り当てる\{#task-1-assign-saml-app-to-users-in-your-idp}

ユーザーが SSO でサインインできるようにするには、IdP で SAML アプリへのアクセス権を付与する必要があります。

- アプリを特定のユーザーまたはグループに割り当てます。

- 割り当てられた各ユーザーのメールアドレスが、Zilliz Cloud アカウントのメールアドレスと一致していることを確認します。

### タスク 2: プロジェクトにユーザーを招待する\{#task-2-invite-users-to-your-project}

ユーザーが初めて SSO で Zilliz Cloud にログインすると、**組織メンバー** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **組織オーナー** が適切なプロジェクトに招待する必要があります。

- プロジェクトへのユーザー招待の詳細手順については、[Manage Project Users](./project-users#invite-a-user-to-a-project) を参照してください。

プロジェクトに招待された後、**Organization** **オーナー** は Zilliz Cloud のログイン URL をエンタープライズユーザーと共有し、SSO でサインインできるようにします。

設定またはテストの過程で問題が発生した場合は、[Zilliz support](https://zilliz.com/contact-sales) にお問い合わせください。

### タスク 3: (オプション) SSO 強制を有効にする\{#task-3-optional-enable-sso-enforcement}

SSO 接続の設定とテストが完了したら、オプションで **SSO enforcement** を有効にして、すべての組織メンバーが SSO を介してのみログインすることを要求できます。有効にすると、メンバーはメール/パスワードまたはサードパーティアカウント（Google、GitHub）を使用してサインインできなくなります。

<Admonition type="danger" icon="🚧" title="Warning">

この機能を有効にすると、パスワードで現在サインインしているすべてのメンバーが直ちにログアウトされ、SSO 以外のログイン方法がブロックされます。

</Admonition>

<Supademo id="cml4tlban34cozsadvi68n666" title=""  />

詳細については、[Enforce SSO in Your Organization](./enforce-sso-in-your-organization) を参照してください。

## FAQ\{#faq}

### SSO で初めてログインするユーザーに割り当てられるロールは何ですか？\{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、初回の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで **組織メンバー** ロールが割り当てられます。ロールは後で Zilliz Cloud コンソールで変更できます。詳細な手順については、[Manage Project Users](./project-users#edit-a-collaborators-role) を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？\{#how-do-users-access-projects-after-sso-login}

SSO でログイン後、ユーザーにはデフォルトで **組織メンバー** ロールが付与されます。特定のプロジェクトにアクセスするには、**組織オーナー** または **プロジェクト管理者** がプロジェクトに招待する必要があります。詳細な手順については、[Manage Project Users](./project-users) を参照してください。

### SSO でログインする前に既に Zilliz Cloud アカウントを持っているユーザーはどうなりますか？\{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーが既に Zilliz Cloud 組織に存在する場合（メールアドレスに基づく）、SSO でログインしても元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に複数の SSO プロバイダーを設定できますか？\{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織では、同時にアクティブにできる SAML SSO 設定は **1 つ** のみです。