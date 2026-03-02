---
title: "その他のIdP (SAML 2.0) | Cloud"
slug: /single-sign-on-with-other-idp
sidebar_label: "その他のIdP (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0プロトコルをサポートする任意のIDプロバイダー（IdP）を使用して、Zilliz Cloudでシングルサインオン（SSO）を構成する方法について説明します。"
type: origin
token: WDOJwtKkAijW4gkUpQhcAL0Rn1d
sidebar_position: 5
keywords: 
  - zilliz
  - ベクターデータベース
  - cloud
  - sso
  - その他
  - idp
  - 動画検索
  - AI幻覚
  - AIエージェント
  - セマンティック検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# その他のIdP (SAML 2.0)

このトピックでは、SAML 2.0プロトコルをサポートする任意のIDプロバイダー（IdP）を使用して、Zilliz Cloudでシングルサインオン（SSO）を構成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloudは、<a href="./single-sign-on-with-okta">Okta</a>、<a href="./single-sign-on-with-google-workspace">Google Workspace</a>、<a href="./single-sign-on-with-microsoft-entra">Microsoft Entra</a>専用の統合ガイドを提供していますが、<strong>その他のIdP (SAML 2.0)</strong>オプションを使用すれば、SAML 2.0に準拠した任意のIdPを使用できます。</p>

</Admonition>

## 開始する前に{#before-you-start}

- Zilliz Cloud組織に少なくとも1つの**Dedicated (Enterprise)**クラスターがあること。

- SSOを構成するZilliz Cloud組織の**Organization Owner**であること。

- 使用する予定のIdPへの管理者アクセス権があること。

- IdP固有のセットアップの詳細については、IdPの公式ドキュメントを参照してください。

## 設定手順{#configuration-steps}

### ステップ1: Zilliz Cloudコンソールでサービスプロバイダーの詳細にアクセスする{#step-1-access-service-provider-details-in-zilliz-cloud-console}

<Supademo id="cme6sledl274yh3py7hf96vo1" title="Step 1: Access service provider details in Zilliz Cloud" />

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)にログインし、SSOを構成したい組織に移動します。

1. 左側のナビゲーションペインで、**Settings**をクリックします。

1. **Settings**ページで、**Single Sign-On (SSO)**セクションを見つけて、**Configure**をクリックします。

1. 表示されるダイアログボックスで、IdPとプロトコルとして**Other IdP (SAML)**を選択します。

1. **Service Provider Details**カードで、以下の値をコピーします。

    - **SP Entity ID**

    - **ACS URL**

</Procedures>

これらの値は、IdPでSAMLアプリケーションを作成する際の[ステップ2](./single-sign-on-with-other-idp#step-2-create-a-saml-app-in-your-idp-console)で必要になります。

### ステップ2: IdPコンソールでSAMLアプリを作成する{#step-2-create-a-saml-app-in-your-idp-console}

正確なプロセスはIdPによって異なります。一般的には次のとおりです。

<Procedures>

1. IdPの管理者コンソールにサインインします。

1. 新しいSAML 2.0アプリケーション（SAML接続または統合と呼ばれることもあります）を作成します。

1. サービスプロバイダー情報の提供を求められたら、以下を入力します。

    - [ステップ1](./single-sign-on-with-other-idp#step-1-access-service-provider-details-in-zilliz-cloud-console)の**SP Entity ID**。

    - [ステップ1](./single-sign-on-with-other-idp#step-1-access-service-provider-details-in-zilliz-cloud-console)の**ACS URL**。

1. アプリケーションを保存し、以下のいずれかの形式でIdP構成を取得します。

    - **オプション1 – メタデータURL/ファイル**: ほとんどのIdPは、必要なSAMLメタデータすべてを含むダウンロード可能なXMLファイルまたは公開URLを提供します。

    - **オプション2 – 手動**: メタデータが利用できない場合は、IdPから以下を収集します。

        - **IdP SSO URL**（Zilliz Cloudが認証リクエストを送信するエンドポイント）

        - **x.509証明書**（`-----BEGIN CERTIFICATE-----`と`-----END CERTIFICATE-----`の行を含む）

    この情報は、[ステップ3](./single-sign-on-with-other-idp#step-3-configure-idp-settings-in-zilliz-cloud-console)で使用します。

</Procedures>

### ステップ3: Zilliz CloudコンソールでIdP設定を構成する{#step-3-configure-idp-settings-in-zilliz-cloud-console}

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)に戻ります。

1. シングルサインオン（SSO）設定ダイアログボックスの**Identity Provider Details**カードで、以下のいずれかの方法を選択します。

    **オプション1 – メタデータURL/ファイル**

    - IdPからコピーした**Metadata URL**を貼り付けるか、ダウンロードしたMetadata XMLファイルをアップロードします。

    - Zilliz Cloudは、証明書を含む必要なIdPの詳細を自動的にインポートします。

    **オプション2 – 手動**

    - IdPから**IdP SSO URL**を入力します。

    - X.509形式のIdP署名証明書をアップロードまたは貼り付けます。`-----BEGIN CERTIFICATE-----`と`-----END CERTIFICATE-----`の行が含まれていることを確認してください。

1. **Save**をクリックします。

</Procedures>

## 構成後のタスク{#post-configuration-tasks}

### タスク1: IdPでユーザーにSAMLアプリを割り当てる{#task-1-assign-saml-app-to-users-in-your-idp}

ユーザーがSSO経由でサインインする前に、IdPでSAMLアプリへのアクセス権を付与する必要があります。

- アプリを特定のユーザーまたはグループに割り当てます。

- 割り当てられた各ユーザーのメールアドレスが、Zilliz Cloudアカウントのメールアドレスと一致していることを確認します。

### タスク2: ユーザーをプロジェクトに招待する{#task-2-invite-users-to-your-project}

ユーザーがSSO経由でZilliz Cloudに初めてログインすると、**Organization Member**として登録されますが、デフォルトではどのプロジェクトにもアクセスできません。

- **Organization Owner**は、適切なプロジェクトにユーザーを招待する必要があります。

- ユーザーをプロジェクトに招待する手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project)を参照してください。

プロジェクトに招待された後、**Organization Owner**はZilliz CloudログインURLをエンタープライズユーザーと共有し、SSO経由でサインインできるようにします。

セットアップまたはテストプロセス中に問題が発生した場合は、[Zillizサポート](https://zilliz.com/contact-sales)にお問い合わせください。

## FAQ{#faq}

### SSO経由で初めてログインするユーザーに割り当てられるロールは何ですか？{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloudアカウントをまだ持っていない新規ユーザーは、最初のSSOログイン時に自動的に作成されます。これらのユーザーには、デフォルトで**Organization Member**ロールが割り当てられます。後でZilliz Cloudコンソールでロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role-or-remove-a-collaborator)を参照してください。

### SSOログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？{#how-do-users-access-projects-after-sso-login}

SSO経由でログインした後、ユーザーはデフォルトで**Organization Member**ロールを持ちます。特定のプロジェクトにアクセスするには、**Organization Owner**または**Project Admin**がプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### SSOでログインする前に、ユーザーがすでにZilliz Cloudアカウントを持っている場合はどうなりますか？{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーが（メールアドレスに基づいて）Zilliz Cloud組織にすでに存在する場合、SSO経由でログインしても、元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きすることはありません。

### 同じ組織に対して複数のSSOプロバイダーを構成できますか？{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各Zilliz Cloud組織は、一度に**1つのアクティブなSAML SSO構成**のみをサポートしています。