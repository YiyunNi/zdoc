---
title: "Okta (SAML 2.0) | Cloud"
slug: /single-sign-on-with-okta
sidebar_label: "Okta (SAML 2.0)"
beta: FALSE
notebook: FALSE
description: "このトピックでは、SAML 2.0 プロトコルを使用して Okta でシングルサインオン (SSO) を設定する方法について説明します。 | Cloud"
type: origin
token: QUC4wfVYTi73ctkMzEec17oVnjh
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - sso
  - okta
  - 音声検索
  - セマンティック検索とは
  - 埋め込みモデル
  - 画像類似性検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Okta (SAML 2.0)

このトピックでは、SAML 2.0プロトコルを使用してOktaでシングルサインオン（SSO）を構成する方法について説明します。

このガイドでは、Zilliz Cloudがサービスプロバイダー（SP）として機能し、Oktaがアイデンティティプロバイダー（IdP）として機能します。以下の図は、Zilliz CloudとOkta管理コンソールで必要な手順を示しています。

![KywHwe7VIhcwsAbecTpcEsL3njb](https://zdoc-images.s3.us-west-2.amazonaws.com/KywHwe7VIhcwsAbecTpcEsL3njb.png)

## 開始する前に{#before-you-start}

- Zilliz Cloud組織に少なくとも1つの**Dedicated (Enterprise)**クラスターがあること。

- Okta管理コンソールへの管理者アクセス権があること。詳細については、[Okta公式ドキュメント](https://help.okta.com/en-us/content/topics/security/administrators-learn-about-admins.htm)を参照してください。

- SSOを構成するZilliz Cloud組織の組織オーナーであること。

## 構成手順{#configuration-steps}

### ステップ1：Zilliz CloudコンソールでSPの詳細にアクセスする{#step-1-access-sp-details-in-zilliz-cloud-console}

SPとして、Zilliz Cloudは、OktaでSAMLアプリを設定する際に必要な**Audience URL (SP Entity ID)**と**Single sign-on URL**を提供します。

<Supademo id="cme6l0vit2298h3pyu26whujs" title="Step 1: Access service provider details in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)にログインし、SSOを構成したい組織に移動します。

1. 左側のナビゲーションペインで、**Settings**をクリックします。

1. **Settings**ページで、**Single Sign-On (SSO)**セクションを見つけ、**Configure**をクリックします。

1. 表示されるダイアログボックスで、IdPとプロトコルとして**Okta (SAML 2.0)**を選択します。

1. **Service Provider Details**カードで、**Audience URL (SP Entity ID)**と**Single sign-on URL**をコピーします。これらの値は、[ステップ2](./single-sign-on-with-okta#step-2-create-a-saml-app-in-okta-admin-console)でOkta管理コンソールにSAMLアプリを作成する際に必要になります。

1. 完了したら、[ステップ2](./single-sign-on-with-okta#step-2-create-a-saml-app-in-okta-admin-console)に進みます。

</Procedures>

### ステップ2：Okta管理コンソールでSAMLアプリを作成する{#step-2-create-a-saml-app-in-okta-admin-console}

このステップでは、Zilliz Cloudから取得したSPの詳細でOkta（IdP）を構成します。

<Supademo id="cmdh3bndv2ym06n9n9gx8epyd" title="Step 1: Create SAML App in Okta Admin Console" />

<Procedures>

1. [Okta管理コンソール](https://login.okta.com/)にログインします。

1. 左側のナビゲーションペインで、**Applications** > **Applications**を選択します。

1. **Create App Integration**をクリックします。

1. **Create a new app integration**ダイアログボックスで、**SAML 2.0**を選択し、**Next**をクリックします。

1. 簡略化のため、**App name**を**zilliz**に設定し、**Next**をクリックします。

1. **Configure SAML**ステップの**General**領域で、以下のフィールドを構成します。

    - **Single sign-on URL**:

        - [ステップ1](./single-sign-on-with-okta#step-1-access-sp-details-in-zilliz-cloud-console)でZilliz Cloudコンソールからコピーした**Single sign-on URL**をここに貼り付けます。

        - SAMLリクエスト中の正しいルーティングを確実にするために、**"Use this for Recipient URL and Destination URL"**というラベルの付いた**チェックボックスをオンにしてください**。

    - **Audience URI (SP Entity ID)**: [ステップ1](./single-sign-on-with-okta#step-1-access-sp-details-in-zilliz-cloud-console)でZilliz Cloudコンソールからコピーした**Audience URL (SP Entity ID)**をここに貼り付けます。

1. **Attribute Statements (optional)**領域で、以下を指定します。

    - **Name**: 値を**email**に設定します。

    - **Value**: ドロップダウンリストから**user.email**を選択します。

1. **Next**をクリックし、**Finish**をクリックします。アプリページにリダイレクトされます。

1. アプリページの**Sign On**タブで、**Metadata URL**を取得し、**Copy**をクリックします。これは、[ステップ3](./single-sign-on-with-okta#step-3-configure-idp-settings-in-zilliz-cloud-console)でZilliz Cloudコンソールで必要になります。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、<strong>More details</strong>をクリックして、以下の詳細を取得します。</p>
    <ul>
    <li><p><strong>Sign on URL</strong>: URLをコピーします。これは、<a href="./single-sign-on-with-okta#step-3-configure-idp-settings-in-zilliz-on-cloud-console">ステップ3</a>で<strong>Manual</strong>モードが選択されている場合、Zilliz Cloudコンソールで必要になります。</p></li>
    <li><p><strong>Signing Certificate</strong>: <strong>Download</strong>をクリックして、証明書をローカルコンピューターに保存します。これは、<a href="./single-sign-on-with-okta#step-3-configure-idp-settings-in-zilliz-cloud-console">ステップ3</a>で<strong>Manual</strong>モードが選択されている場合、Zilliz Cloudコンソールで必要になります。</p></li>
    </ul>

    </Admonition>

</Procedures>

### ステップ3：Zilliz CloudコンソールでIdP設定を構成する{#step-3-configure-idp-settings-in-zilliz-cloud-console}

このステップでは、OktaのIdPの詳細をZilliz Cloudに提供して、SAML信頼関係を完了します。

<Supademo id="cmdh2wk6b2y8q6n9nilbi2d19" title="Step 2: Configure Okta Settings in Zilliz Cloud Console" />

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)に戻ります。

1. **Configure Single Sign-On (SSO)**ダイアログボックスの**Identity Provider Details**カードで、[ステップ2](./single-sign-on-with-okta#step-2-create-a-saml-app-in-okta-admin-console)でOkta管理コンソールからコピーした**Metadata URL**を貼り付けます。

    <Admonition type="info" icon="📘" title="Notes">

    <p>または、IdP詳細設定で<strong>Manual</strong>モードを選択した場合、以下を構成します。</p>
    <ul>
    <li><p><strong>Sign On URL</strong>: [ステップ2](./single-sign-on-with-okta#step-2-create-a-saml-app-in-okta-admin-console)でOkta管理コンソールからコピーした<strong>Sign on URL</strong>をここに貼り付けます。</p></li>
    <li><p><strong>Signing Certificate</strong>: [ステップ2](./single-sign-on-with-okta#step-2-create-a-saml-app-in-okta-admin-console)でOkta管理コンソールからダウンロードした証明書をここにアップロードします。<code>-----BEGIN CERTIFICATE-----</code>で始まり、<code>-----END CERTIFICATE-----</code>で終わる行を含む証明書全体が提供されていることを確認してください。</p></li>
    </ul>

    </Admonition>

1. 完了したら、**Save**をクリックします。

</Procedures>

## 構成後のタスク{#post-configuration-tasks}

### タスク1：SAMLアプリをユーザーに割り当てる{#task-1-assign-saml-app-to-users}

<Supademo id="cmdh6fi1g32hv6n9nea0dz3e4" title="Task 1: Assign SAML App to Users" />

ユーザーがSSO経由でZilliz Cloudにアクセスする前に、Oktaアプリケーションをユーザーに割り当てる必要があります。

<Procedures>

1. [Okta管理コンソール](https://login.okta.com/)のアプリ詳細ページで、**Assignments**をクリックします。

1. **Assign** > **Assign to People**を選択します。

1. SAMLアプリをユーザーに割り当て、変更を保存します。

1. **Save** **and** **Go Back**をクリックします。

</Procedures>

必要に応じて、すべてのユーザーに対して繰り返します。詳細については、[Oktaドキュメント](https://help.okta.com/oie/en-us/content/topics/provisioning/lcm/lcm-assign-app-groups.htm)を参照してください。

### タスク2：ユーザーをプロジェクトに招待する{#task-2-invite-users-to-your-project}

ユーザーがSSO経由でZilliz Cloudに初めてログインすると、デフォルトで**Organization Member**として登録されますが、どのプロジェクトにもアクセスできません。

- **Organization Owner**は、適切なプロジェクトにユーザーを招待する必要があります。

- ユーザーをプロジェクトに招待する手順については、[プロジェクトユーザーの管理](./project-users#invite-a-user-to-a-project)を参照してください。

プロジェクトに招待された後、**Organization** **Owner**は、Zilliz CloudログインURLをエンタープライズユーザーと共有して、SSO経由でサインインできるようにします。

セットアップまたはテストプロセス中に問題が発生した場合は、[Zillizサポート](https://zilliz.com/contact-sales)にお問い合わせください。

## FAQ{#faq}

### SSO経由で初めてログインするユーザーに割り当てられるロールは何ですか？{#what-role-is-assigned-to-users-who-log-in-via-sso-for-the-first-time}

Zilliz Cloudアカウントをまだ持っていない新規ユーザーは、最初のSSOログイン時に自動的に作成されます。これらのユーザーには、デフォルトで**Organization Member**ロールが割り当てられます。後でZilliz Cloudコンソールでロールを変更できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users#edit-a-collaborators-role-or-remove-a-collaborator)を参照してください。

### SSOログイン後、ユーザーはどのようにプロジェクトにアクセスしますか？{#how-do-users-access-projects-after-sso-login}

SSO経由でログインすると、ユーザーはデフォルトで**Organization Member**ロールを持ちます。特定のプロジェクトにアクセスするには、**Organization Owner**または**Project Admin**がプロジェクトに招待する必要があります。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### SSOでログインする前に、ユーザーがすでにZilliz Cloudアカウントを持っている場合はどうなりますか？{#what-happens-if-a-user-already-has-a-zilliz-cloud-account-before-logging-in-with-sso}

ユーザーが（メールアドレスに基づいて）Zilliz Cloud組織にすでに存在する場合、SSO経由でログインしても、元のロールと権限が保持されます。システムはメールアドレスでユーザーを照合し、既存のアカウントを上書きしません。

### 同じ組織に対して複数のSSOプロバイダーを構成できますか？{#can-i-configure-multiple-sso-providers-for-the-same-organization}

現在、各Zilliz Cloud組織は、一度に**1つのアクティブなSAML SSO構成**のみをサポートしています。