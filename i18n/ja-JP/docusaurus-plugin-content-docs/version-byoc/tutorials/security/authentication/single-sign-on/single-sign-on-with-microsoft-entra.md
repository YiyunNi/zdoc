---
title: "Microsoft Entra (SAML 2.0) | BYOC"
slug: /single-sign-on-with-microsoft-entra
sidebar_key: single-sign-on-with-microsoft-entra
sidebar_label: "Microsoft Entra (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0 プロトコルを使用して Microsoft Entra でシングルサインオン（SSO）を構成する方法について説明します。 | BYOC"
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

このトピックでは、SAML 2.0 プロトコルを使用して Microsoft Entra でシングルサインオン（SSO）を構成する方法について説明します。

このガイドでは、Zilliz Cloud がサービスプロバイダー（SP）として、Microsoft Entra が ID プロバイダー（IdP）として機能します。次の図は、Zilliz Cloud と Microsoft Entra 管理センターで必要な手順を示しています。

![M3UywWSZHhlwTHbkjI8c6jTinGh](https://zdoc-images.s3.us-west-2.amazonaws.com/M3UywWSZHhlwTHbkjI8c6jTinGh.png)

## 開始前の準備\{#before-you-start}

- Zilliz Cloud 組織に、少なくとも 1 つの **Dedicated (Enterprise)** クラスターがあること。

- Microsoft Entra 管理センターにアクセスできること。詳細については、[Microsoft Entra ドキュメント](https://learn.microsoft.com/en-us/entra/fundamentals/entra-admin-center) を参照してください。

- SSO を構成する Zilliz Cloud 組織の組織オーナーであること。

## 構成手順\{#configuration-steps}

### 手順 1: Zilliz Cloud コンソールで SP の詳細にアクセスする\{#step-1-access-sp-details-in-zilliz-cloud-console}

SP として、Zilliz Cloud は **識別子（エンティティID）** と **応答 URL（アサーションコンシューマーサービス URL）** を提供します。これらは、Microsoft Entra で SAML アプリケーションを設定する際に必要となります。

 <Supademo id="cme7yk5zy38k0h3pyor6ovyvh" title="Step 1: Access service provider details in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインし、SSO を構成したい組織に移動します。

1. 左側のナビゲーションペインで、**設定** をクリックします。

1. **設定** ページで、**シングルサインオン（SSO）** セクションを見つけ、**設定** をクリックします。

1. 表示されたダイアログボックスで、IdP およびプロトコルとして **Microsoft Entra (SAML 2.0)** を選択します。

1. **サービスプロバイダーの詳細** カードで、**識別子（エンティティID）** と **応答 URL（アサーションコンシューマーサービス URL）** をコピーします。これらの値は、Microsoft Entra 管理センターでアプリケーションを設定する [手順 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で必要となります。

1. 完了したら、[手順 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) に進みます。

</Procedures>

### 手順 2: Microsoft Entra 管理センターでアプリケーションを設定する\{#step-2-set-up-an-application-in-microsoft-entra-admin-center}

この手順では、Zilliz Cloud から取得した SP の詳細を使用して、Microsoft Entra（IdP）を構成します。

<Supademo id="cme7ynp8r38ksh3pyaghg664m" title="Set up an application in Microsoft Entra admin center" />

<Procedures>

1. [Microsoft Entra 管理センター](https://aad.portal.azure.com/?ad=in-text-link) にログインします。

1. 左側のナビゲーションペインで、**エンタープライズアプリ** をクリックします。

1. 表示されたページで、**新しいアプリケーション** をクリックします。次に、**独自のアプリケーションを作成** をクリックします。

1. **独自のアプリケーションを作成** パネルで、アプリケーション名を **zilliz** に設定し、**ギャラリーにないその他のアプリケーションを統合する（非ギャラリー）** オプションを選択します。

1. 次に、**作成** をクリックします。完了すると、アプリケーションが作成され、アプリケーションの詳細ページにリダイレクトされます。

1. アプリケーションの詳細ページで、**シングルサインオン** > **SAML** を選択します。

1. **基本SAML構成** セクションで、**編集** をクリックします。

1. **識別子（エンティティID）** 領域で、**識別子の追加** をクリックします。次に、[手順 1](./single-sign-on-with-microsoft-entra#step-1-access-sp-details-in-zilliz-cloud-console) で Zilliz Cloud コンソールからコピーした **識別子（エンティティID）** をテキストボックスに貼り付けます。

1. **応答 URL（アサーションコンシューマーサービス URL）** 領域で、**応答 URL の追加** をクリックします。次に、[手順 1](./single-sign-on-with-microsoft-entra#step-1-access-sp-details-in-zilliz-cloud-console) で Zilliz Cloud コンソールからコピーした **応答 URL（アサーションコンシューマーサービス URL）** をテキストボックスに貼り付けます。

1. **保存** をクリックします。

1. 完了したら、作成したアプリケーションの **シングルサインオン** パネルに戻り、**アプリのフェデレーションメタデータ URL** をコピーします。これは、[手順 3](./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console) で Zilliz Cloud コンソールで必要となります。

    <Admonition type="info" icon="📘" title="Notes">

    または、次の詳細を取得します。

    - **SAML 証明書** セクションで、**ダウンロード** をクリックして **証明書（Base64）** を保存します。これは、[手順 3](./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console) で **手動** モードが選択された場合に Zilliz Cloud コンソールで必要となります。

    - **zilliz の設定** セクションで、**ログイン URL** をコピーします。これは、[手順 3](./single-sign-on-with-microsoft-entra#step-3-configure-idp-settings-in-zilliz-cloud-console) で **手動** モードが選択された場合に Zilliz Cloud コンソールで必要となります。

    </Admonition>

</Procedures>

### 手順 3: Zilliz Cloud コンソールで IdP 設定を構成する\{#step-3-configure-idp-settings-in-zilliz-cloud-console}

この手順では、Microsoft Entra の IdP の詳細を Zilliz Cloud に提供して、SAML の信頼関係を完了します。

 <Supademo id="cme7yxwoh38qih3pycwf88tzi" title="Configure IdP settings in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) に戻ります。

1. **シングルサインオン（SSO）の設定** ダイアログボックスの **IDプロバイダーの詳細** カードで、[手順 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で Microsoft Entra 管理センターからコピーした **アプリのフェデレーションメタデータ URL** を貼り付けます。

    <Admonition type="info" icon="📘" title="Notes">

    または、IdP の詳細構成で **手動** モードを選択した場合は、次のように構成します。

    - **ログイン URL**: [手順 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で Microsoft Entra 管理センターからコピーしたログイン URL をここに貼り付けます。

    - **証明書（Base64）**: [手順 2](./single-sign-on-with-microsoft-entra#step-2-set-up-an-application-in-microsoft-entra-admin-center) で Microsoft Entra 管理センターからダウンロードした証明書をここにアップロードします。`-----BEGIN CERTIFICATE-----` で始まり `-----END CERTIFICATE-----` で終わる行を含め、証明書の内容全体が提供されていることを確認してください。

    </Admonition>

1. 完了したら、**保存** をクリックします。

</Procedures>

## 構成後のタスク\{#post-configuration-tasks}

### タスク 1: Microsoft Entra アプリケーションをユーザーに割り当てる\{#task-1-assign-microsoft-entra-application-to-users}

 <Supademo id="cme7z3h7r38s8h3py95vf8g4m" title="Task 1: Assign Microsoft Entra application to users" />

ユーザーが SSO を介して Zilliz Cloud にアクセスできるようにするには、Microsoft Entra アプリケーションをユーザーに割り当てる必要があります。

<Procedures>

1. [Microsoft Entra 管理センター](https://aad.portal.azure.com/?ad=in-text-link) のアプリケーションページで、**ユーザーとグループ** > **+ ユーザー/グループの追加** を選択します。

1. アプリケーションへのアクセスを許可するユーザーまたはグループを選択します。

</Procedures>

詳細については、[Microsoft Entra ドキュメント](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal) を参照してください。

### タスク 2: ユーザーをプロジェクトに招待する\{#task-2-invite-users-to-your-project}

ユーザーが初めて SSO を介して Zilliz Cloud にログインすると、**組織メンバー** として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **組織オーナー** が適切なプロジェクトに招待する必要があります。

- プロジェクトにユーザーを招待する手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project) を参照してください。

プロジェクトに招待された後、**組織オーナー** は Zilliz Cloud のログイン URL をエンタープライズユーザーと共有し、SSO を介してサインインできるようにします。

セットアップやテストの過程で問題が発生した場合は、[Zilliz サポート](https://zilliz.com/contact-sales) にお問い合わせください。

### タスク 3: （オプション）SSO 強制を有効にする\{#task-3-optional-enable-sso-enforcement}

SSO 接続が完全に構成され、テストされた後、オプションで **SSO 強制** を有効にして、すべての組織メンバーに SSO を介したログインを必須にすることができます。有効にすると、メンバーはメール/パスワードやサードパーティアカウント（Google、GitHub）を使用してサインインできなくなります。

<Admonition type="danger" icon="🚧" title="Warning">

この機能を有効にすると、現在パスワードでサインインしているすべてのメンバーが直ちにログアウトされ、SSO 以外のログイン方法がブロックされます。

</Admonition>

<Supademo id="cml4tlban34cozsadvi68n666" title=""  />

詳細については、[組織での SSO の強制](./enforce-sso-in-your-organization) を参照してください。

## FAQ\{#faq}

### SSO で初めてログインしたユーザーに割り当てられるロールは何ですか？\{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloud アカウントをまだ持っていない新規ユーザーは、初回の SSO ログイン時に自動的に作成されます。これらのユーザーには、デフォルトで **組織メンバー** ロールが割り当てられます。後で Zilliz Cloud コンソールでロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role) を参照してください。

### SSO ログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？\{#how-do-users-access-projects-after-sso-login}

SSO でログインした後、ユーザーにはデフォルトで **組織メンバー** ロールが付与されます。特定のプロジェクトにアクセスするには、**組織オーナー** または **プロジェクト管理者** がプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users) を参照してください。

### SSO でログインする前に既に Zilliz Cloud アカウントを持っているユーザーはどうなりますか？\{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーが既に Zilliz Cloud 組織に存在する場合（メールアドレスに基づく）、SSO でログインしても元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に複数の SSO プロバイダーを構成できますか？\{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各 Zilliz Cloud 組織では、同時にアクティブな SAML SSO 構成は **1 つ** のみサポートされています。