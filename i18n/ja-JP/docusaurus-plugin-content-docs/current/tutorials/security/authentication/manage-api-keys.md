---
title: "API キー | Cloud"
slug: /manage-api-keys
sidebar_label: "API キー"
beta: FALSE
notebook: FALSE
description: "API キーは、Zilliz Cloud のコントロールプレーンおよびデータプレーンのリソースにアクセスするために、API または SDK 呼び出しを行うユーザーまたはアプリケーションを認証するために使用されます。API キーは、名前や ID などの独自のプロパティを持つ英数字の文字列です。"
type: origin
token: BRsZwqOUTiBbrPk9b5WcvFgTnze
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - クラスター認証情報
  - api キー
  - 音声類似性検索
  - Elastic ベクトルデータベース
  - Pinecone vs Milvus
  - Chroma vs Milvus

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# APIキー

APIキーは、Zilliz CloudのコントロールプレーンおよびデータプレーンリソースにアクセスするためにAPIまたはSDKコールを行うユーザーまたはアプリケーションを認証するために使用されます。APIキーは、名前やIDなどの独自のプロパティを持つ英数字の文字列です。

## APIキーの概要{#overview-of-api-keys}

Zilliz Cloudは、多様なユーザー要件を満たすために2種類のAPIキーを提供しています。

- **パーソナルAPIキー**: ユーザー登録時に自動的に生成され、各キーはユーザーのアカウントにリンクされ、ユーザーが所属する組織およびプロジェクト内のユーザーのロールの権限を継承します。アカウントユーザーが組織を離れると、関連するパーソナルキーは自動的に削除されます。[組織オーナー](./organization-users#organization-roles)または[プロジェクト管理者](./project-users#project-roles)として、Zilliz Cloudウェブコンソールで2種類のパーソナルAPIキーを確認できます。

    - **ご自身のパーソナルAPIキー**: ご自身専用のパーソナルキーです。このAPIキーを表示およびコピーできます。

    - **メンバーのパーソナルAPIキー**: 組織またはプロジェクト内の他のユーザーに属する既存のパーソナルキーのリストです。これらのキーの名前とIDのみを表示でき、キー自体は表示できません。

- **カスタマイズされたAPIキー**: **組織オーナー**および**プロジェクト管理者**が、Zilliz Cloudアカウントを持たないアプリケーションまたは外部ユーザーのために手動で作成します。これらのキーは、長期的なアクセスニーズに最適であり、APIキーの最初の作成者が組織を離れた場合でもサービスの継続性を保証します。

以下の図は、APIキーのロールとリソースアクセスを示しています。

![Ec7wwrAnFhGIZFbJTWwc57bVn0f](https://zdoc-images.s3.us-west-2.amazonaws.com/Ec7wwrAnFhGIZFbJTWwc57bVn0f.png)

以下の表は、割り当てられたロールに基づくAPIキーのアクセス範囲の詳細を示しています。ロールと権限の詳細については、[アクセス制御](./access-control)を参照してください。

<table>
   <tr>
     <th colspan="2"><p><strong>APIキーのロール</strong></p></th>
     <th><p><strong>アクセスレベル</strong></p></th>
   </tr>
   <tr>
     <td colspan="2"><p>組織オーナー</p></td>
     <td><p>プロジェクト、クラスター、ボリュームを含む組織内のすべてのリソースに対する完全な管理者アクセス。</p></td>
   </tr>
   <tr>
     <td colspan="2"><p>組織請求管理者</p></td>
     <td><p>組織の請求のみに対する管理者アクセス。組織内のプロジェクト、クラスター、ボリュームへのアクセスはありません。</p></td>
   </tr>
   <tr>
     <td rowspan="3"><p>組織メンバー</p></td>
     <td><p>プロジェクト管理者</p></td>
     <td><p>指定されたプロジェクトに対する完全な管理者アクセス、およびデフォルトでプロジェクト内のすべてのクラスターとボリュームに対する完全な管理者アクセス。</p></td>
   </tr>
   <tr>
     <td><p>プロジェクト読み書き</p></td>
     <td><p>指定されたプロジェクトに対する読み書きアクセス、およびデフォルトでプロジェクト内のすべてのクラスターとボリュームに対する読み書きアクセス。</p></td>
   </tr>
   <tr>
     <td><p>プロジェクト読み取り専用</p></td>
     <td><p>指定されたプロジェクトに対する読み取り専用アクセス、およびデフォルトでプロジェクト内のすべてのクラスターとボリュームに対する読み取り専用アクセス。</p></td>
   </tr>
</table>

### 制限事項{#limits-and-restrictions}

- 各組織は最大100個のカスタマイズされたAPIキーを持つことができます。

- APIキーの管理権限は、組織およびプロジェクト内でのユーザーのロールによって影響を受けます。具体的な権限は以下の通りです。

    <table>
       <tr>
         <th rowspan="2"></th>
         <th rowspan="2"><p><strong>組織オーナー</strong></p></th>
         <th rowspan="2"><p><strong>組織請求管理者</strong></p></th>
         <th colspan="3"><p><strong>組織メンバー</strong></p></th>
       </tr>
       <tr>
         <td><p><strong>プロジェクト管理者</strong></p></td>
         <td><p><strong>プロジェクト読み書き</strong></p></td>
         <td><p><strong>プロジェクト読み取り専用</strong></p></td>
       </tr>
       <tr>
         <td colspan="6"><p><strong>ご自身のパーソナルAPIキー</strong></p></td>
       </tr>
       <tr>
         <td><p>作成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
       </tr>
       <tr>
         <td><p>表示とコピー</p></td>
         <td><p>✔️</p></td>
         <td><p>✔️ </p></td>
         <td><p>✔️</p></td>
         <td><p>✔️</p></td>
         <td><p>✔️</p></td>
       </tr>
       <tr>
         <td><p>編集</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>リセット</p></td>
         <td><p>✔️</p></td>
         <td><p>✔️</p></td>
         <td><p>✔️</p></td>
         <td><p>✔️</p></td>
         <td><p>✔️</p></td>
       </tr>
       <tr>
         <td><p>削除</p></td>
         <td><p>ユーザーが組織を離れると自動削除</p></td>
         <td><p>ユーザーが組織を離れると自動削除</p></td>
         <td><p>ユーザーが組織を離れると自動削除</p></td>
         <td><p>ユーザーが組織を離れると自動削除</p></td>
         <td><p>ユーザーが組織を離れると自動削除</p></td>
       </tr>
       <tr>
         <td colspan="6"><p><strong>メンバーのパーソナルAPIキー</strong></p></td>
       </tr>
       <tr>
         <td><p>作成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
         <td><p>自動生成</p></td>
       </tr>
       <tr>
         <td><p>名前とIDの表示</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>コピー</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>編集</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>リセット</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>削除</p></td>
         <td><p>メンバーが組織を離れると自動削除</p></td>
         <td><p>メンバーが組織を離れると自動削除</p></td>
         <td><p>メンバーが組織を離れると自動削除</p></td>
         <td><p>メンバーが組織を離れると自動削除</p></td>
         <td><p>メンバーが組織を離れると自動削除</p></td>
       </tr>
       <tr>
         <td colspan="6"><p><strong>カスタマイズされたAPIキー</strong></p></td>
       </tr>
       <tr>
         <td><p>作成</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>表示とコピー</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>編集</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>リセット</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
       <tr>
         <td><p>削除</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✔️</p></td>
         <td><p>✘</p></td>
         <td><p>✘</p></td>
       </tr>
    </table>

## APIキーの作成{#create-an-api-key}

Zilliz Cloudが各組織ユーザーのために自動生成するパーソナルキーとは別に、カスタマイズされたキーを作成できます。**組織オーナー**と**プロジェクト管理者**のみがカスタマイズされたAPIキーを作成できます。

<Procedures>

1. 組織の**API Keys**ページに移動します。**+ API Key**をクリックします。

    ![create-api-key](https://zdoc-images.s3.us-west-2.amazonaws.com/create-api-key.png "create-api-key")

1. **API Key Name**を入力し、**API Key Access**を設定します。

    ![Nwd5bLDAuolLrUxo8nWcAHU5nub](https://zdoc-images.s3.us-west-2.amazonaws.com/nwd5bldauollruxo8nwcahu5nub.png "Nwd5bLDAuolLrUxo8nWcAHU5nub")

    - **API Key Name:** 名前は64文字を超えないようにしてください。

    - **API Key Access**: 適切な組織およびプロジェクトのロールを割り当てることで、現在のカスタマイズされたAPIキーのアクセス範囲を定義します。よりきめ細かいアクセス制御のために、**Restrict Access to Specific Clusters and Volumes**をチェックすることで、キーがアクセスできるクラスターとボリュームを制限できます。

        <Admonition type="info" icon="📘" title="Notes">

        <p><a href="./project-users">プロジェクト管理者</a>の場合、このユーザーがAPIキーに付与できる権限は、ユーザー自身の権限範囲に限定されます。</p>

        </Admonition>

</Procedures>

## APIキーの表示{#view-api-keys}

組織の**API Keys**ページに移動します。表示は、特定の[ロール](./manage-api-keys#limits-and-restrictions)によって異なる場合があります。

- **組織オーナー**として、ご自身のパーソナルキー、すべてのメンバーのパーソナルキー、およびすべてのカスタマイズされたキーを表示できます。

- **プロジェクト管理者**として、ご自身のパーソナルキー、メンバーのパーソナルキー、およびご自身の権限範囲内のカスタマイズされたキーを表示できます。たとえば、*ユーザー1*が*プロジェクトA*のプロジェクト管理者のみであり、*キー1*が*プロジェクトA*、*B*、*C*への管理者アクセス権を持っている場合、*キー1*のアクセス範囲が*ユーザー1*の権限を超えるため、*ユーザー1*には表示されません。

- **組織請求管理者**、**プロジェクト読み書き**、または**プロジェクト読み取り専用**として、ご自身のパーソナルAPIキーのみを表示できます。

以下のスクリーンショットは、**組織オーナー**のAPIキーの表示を示しています。

![KKONbcCa3o4qr9xJlhlcQMwinRd](https://zdoc-images.s3.us-west-2.amazonaws.com/kkonbcca3o4qr9xjlhlcqmwinrd.png "KKONbcCa3o4qr9xJlhlcQMwinRd")

## APIキーの編集{#edit-an-api-key}

現在、カスタマイズされたAPIキーのみを編集できます。パーソナルキーはアカウントユーザーに紐付けられているため、編集できません。パーソナルキーのアクセス範囲を変更するには、まずユーザーの組織およびプロジェクトのロールを調整する必要があります。ユーザーのロールへの変更は、キーのアクセス権限に自動的に反映されます。

以下の手順は、カスタマイズされたAPIキーを編集する方法を説明しています。

<Procedures>

1. 組織の**API Keys**ページに移動します。アクション列の**...**をクリックし、**Edit**をクリックします。

    ![edit-api-key](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-api-key.png "edit-api-key")

1. APIキーの**API Key Name**と**API Key Access**を編集します。

    ![JXeubHidbokaTax90eZcrmA9nIg](https://zdoc-images.s3.us-west-2.amazonaws.com/jxeubhidbokatax90ezcrma9nig.png "JXeubHidbokaTax90eZcrmA9nIg")

    - **API Key Name:** 名前は64文字を超えないようにしてください。

    - **API Key Access**: 適切な組織およびプロジェクトのロールを割り当てることで、現在のカスタマイズされたAPIキーのアクセス範囲を定義します。よりきめ細かいアクセス制御のために、**Restrict Access to Specific Clusters and Volumes**をチェックすることで、キーがアクセスできるクラスターとボリュームを制限できます。

        <Admonition type="info" icon="📘" title="Notes">

        <p><a href="./project-users">プロジェクト管理者</a>の場合、このユーザーがAPIキーに付与できる権限は、ユーザー自身の権限範囲に限定されます。</p>

        </Admonition>

</Procedures>

## APIキーのリセット{#reset-an-api-key}

パーソナルまたはカスタマイズされたAPIキーが侵害されたと思われる場合は、直ちにリセットする必要があります。

<Admonition type="caution" icon="🚧" title="Warning">

<p>この操作により、現在のAPIキーがリセットされ、無効になります。このキーを使用しているアプリケーションコードは、新しいキー値で関連コードを更新するまで機能しなくなります。</p>

</Admonition>

キーの種類によってプロセスが異なります。

- **パーソナルAPIキーのリセット**: ロールに関係なく、ご自身のパーソナルAPIキーのみをリセットできます。

    ![reset-personal-api-keys](https://zdoc-images.s3.us-west-2.amazonaws.com/reset-personal-api-keys.png "reset-personal-api-keys")

- **カスタマイズされたAPIキーのリセット**: 組織オーナーとプロジェクト管理者のみがカスタマイズされたAPIキーをリセットできます。

    ![reset-customized-api-keys](https://zdoc-images.s3.us-west-2.amazonaws.com/reset-customized-api-keys.png "reset-customized-api-keys")

## APIキーの削除{#delete-an-api-key}

カスタマイズされたAPIキーが不要になった場合は、できるだけ早く削除する必要があります。**組織オーナー**と**プロジェクト管理者**のみがカスタマイズされたAPIキーを削除できます。

パーソナルキーは手動で削除できません。ただし、対応するユーザーが組織を離れると、自動的に無効化され削除されます。

以下のスクリーンショットは、カスタマイズされたAPIキーを削除する方法を示しています。

<Admonition type="caution" icon="🚧" title="Warning">

<p>APIキーを削除すると、そのキーを使用しているサービスに対するZilliz Cloudリソースへのアクセスが元に戻せない形で終了します。</p>

</Admonition>

![delete-customized-api-keys](https://zdoc-images.s3.us-west-2.amazonaws.com/delete-customized-api-keys.png "delete-customized-api-keys")

