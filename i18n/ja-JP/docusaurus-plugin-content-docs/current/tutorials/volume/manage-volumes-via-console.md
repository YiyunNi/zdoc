---
title: "ボリュームの管理 (コンソール) | Cloud"
slug: /manage-volumes-via-console
sidebar_label: "ボリュームの管理 (コンソール)"
beta: FALSE
notebook: FALSE
description: "このページでは、Web コンソールを使用してボリュームを管理する方法について説明します。| Cloud"
type: origin
token: JwYYw2v0yi2eHBkFZuJcM7pXnnc
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ボリューム

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# ボリュームの管理 (コンソール)

このページでは、Web コンソールを使用してボリュームを管理する方法について説明します。

<Admonition type="info" icon="📘" title="Note">

<p>ボリュームは AWS および Google Cloud でのみ作成できます。Azure でボリュームを使用する必要がある場合は、<a href="http://support.zilliz.com">サポートにお問い合わせください</a>。</p>

</Admonition>

## ボリュームの作成\{#create-a-volume}

ボリューム機能を試すだけであれば、**無料トライアルボリューム**を作成してください。無料トライアルボリュームは**組織ごとに 1 回**のみ作成でき、容量とファイルアップロードに制限があります。詳細については、[ボリュームの説明](./volume-explained#billing) をご覧ください。

本番ワークロードの場合は、**従量課金ボリューム**を作成してください。

以下の表は、ボリューム作成時に使用する各パラメータについて説明しています。

<table>
   <tr>
     <th><p><strong>パラメータ</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>Name</p></td>
     <td><p>ボリューム名は組織全体で一意である必要があり、64 文字以下で、文字またはアンダースコアで始まり、文字、数字、ハイフン、アンダースコアのみを含めることができます。</p></td>
   </tr>
   <tr>
     <td><p>Description</p></td>
     <td><p>このパラメータはオプションです。</p></td>
   </tr>
   <tr>
     <td><p>クラウドプロバイダーとリージョン</p></td>
     <td><p>ボリュームのクラウドプロバイダーとリージョンは、データのインポートまたは移行先となるターゲットクラスターのクラウドプロバイダーおよびリージョンと一致している必要があります。</p></td>
   </tr>
</table>

<Supademo id="cmi76tseu4ok8b7b4l5nods0s?utm_source=link" title=""  />

## ボリュームの表示\{#view-volumes}

プロジェクト内のボリューム一覧を表示し、ボリューム名をクリックして特定のボリュームの詳細を確認できます。

![Ar8zbXfHQoQCaQxnKU4c34ednSh](https://zdoc-images.s3.us-west-2.amazonaws.com/ar8zbxfhqoqcaqxnku4c34ednsh.png "Ar8zbXfHQoQCaQxnKU4c34ednSh")

## ボリューム内のファイルまたはフォルダーの管理\{#manage-files-or-folders-in-a-volume}

ボリュームに保存されているファイルまたはフォルダーのアップロード、表示、削除が可能です。

### ファイルまたはフォルダーのアップロード\{#upload-a-file-or-folder}

Web コンソールからボリュームへのファイルまたはフォルダーのアップロードは現在**サポートされていません**。代わりに SDK を使用してください。詳細は [ボリュームの管理 (SDK)](./manage-stages#upload-data-into-a-volume) を参照してください。

### ファイルとフォルダーの表示\{#view-files-and-folders}

ボリューム内の既存のファイルとフォルダーを閲覧できます。

![UOT3bP88no57f8xNqmYcjFwXnFh](https://zdoc-images.s3.us-west-2.amazonaws.com/uot3bp88no57f8xnqmycjfwxnfh.png "UOT3bP88no57f8xNqmYcjFwXnFh")

### ファイルまたはフォルダーの削除\{#delete-a-file-or-folder}

ファイルまたはフォルダーが不要になった場合、ボリュームから削除できます。削除には、ファイルまたはフォルダーのサイズに応じて数分かかる場合があります。

<Admonition type="caution" icon="🚧" title="Warning">

<p>削除されたファイルおよびフォルダーは<strong>復元できません</strong>。慎重に進めてください。</p>

</Admonition>

<Supademo id="cmidzfkoqad9sb7b44vnbfzyd?utm_source=link" title=""  />

## ボリュームの削除\{#delete-a-volume}

不要になったボリュームはいつでも削除できます。なお、無料トライアルボリュームは組織ごとに 1 回のみ作成可能です。一度削除すると、二度と無料トライアルボリュームを作成することはできません。

ボリュームを削除すると、その中に含まれる**すべてのファイルとフォルダー**も削除されます。

<Admonition type="caution" icon="🚧" title="Warning">

<p>削除されたボリュームは<strong>復元できません</strong>。慎重に進めてください。</p>

</Admonition>

<Supademo id="cmi77c5554p1gb7b4sqqsm7nn?utm_source=link" title=""  />

