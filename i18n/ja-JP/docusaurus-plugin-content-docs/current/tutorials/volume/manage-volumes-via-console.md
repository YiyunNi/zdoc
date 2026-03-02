---
title: "ボリュームの管理 (コンソール) | Cloud"
slug: /manage-volumes-via-console
sidebar_label: "ボリュームの管理 (コンソール)"
beta: FALSE
notebook: FALSE
description: "このページでは、Webコンソールを使用してボリュームを管理する方法について説明します。 | Cloud"
type: origin
token: JwYYw2v0yi2eHBkFZuJcM7pXnnc
sidebar_position: 3
keywords: 
  - zilliz
  - ベクターデータベース
  - クラウド
  - ボリューム
  - Zilliz Cloud
  - milvusとは
  - milvusデータベース
  - milvus lite

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# ボリュームの管理 (コンソール)

このページでは、ウェブコンソールを使用してボリュームを管理する方法について説明します。

<Admonition type="info" icon="📘" title="Note">

<p>ボリュームはAWSとGoogle Cloudでのみ作成できます。Azureでボリュームを使用する必要がある場合は、<a href="http://support.zilliz.com">サポートにお問い合わせください</a>。</p>

</Admonition>

## ボリュームの作成{#create-a-volume}

ボリューム機能を試したいだけであれば、**無料トライアルボリューム**を作成してください。無料トライアルボリュームは、**組織ごとに1回のみ**作成でき、容量とファイルアップロードに制限があります。詳細については、[ボリュームの説明](./volume-explained#billing)を参照してください。

本番ワークロードの場合は、**従量課金制ボリューム**を作成してください。

以下の表は、ボリューム作成時に使用される各パラメータについて説明しています。

<table>
   <tr>
     <th><p><strong>パラメータ</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>名前</p></td>
     <td><p>ボリューム名は組織全体で一意である必要があり、64文字以内、文字またはアンダースコアで始まり、文字、数字、ハイフン、アンダースコアのみを含めることができます。</p></td>
   </tr>
   <tr>
     <td><p>説明</p></td>
     <td><p>このパラメータはオプションです。</p></td>
   </tr>
   <tr>
     <td><p>クラウドプロバイダーとリージョン</p></td>
     <td><p>ボリュームのクラウドプロバイダーとリージョンは、データのインポートまたは移行を計画しているターゲットクラスターのクラウドプロバイダーとリージョンと一致している必要があります。</p></td>
   </tr>
</table>

<Supademo id="cmi76tseu4ok8b7b4l5nods0s?utm_source=link" title=""  />

## ボリュームの表示{#view-volumes}

プロジェクト内のボリュームのリストを表示し、ボリューム名をクリックして特定のボリュームの詳細を検査できます。

![Ar8zbXfHQoQCaQxnKU4c34ednSh](https://zdoc-images.s3.us-west-2.amazonaws.com/ar8zbxfhqoqcaqxnku4c34ednsh.png "Ar8zbXfHQoQCaQxnKU4c34ednSh")

## ボリューム内のファイルまたはフォルダの管理{#manage-files-or-folders-in-a-volume}

ボリュームに保存されているファイルやフォルダをアップロード、表示、削除できます。

### ファイルまたはフォルダのアップロード{#upload-a-file-or-folder}

ウェブコンソールからのボリュームへのファイルまたはフォルダのアップロードは、現在**サポートされていません**。代わりにSDKを使用してください。[ボリュームの管理 (SDK)](./manage-stages#upload-data-into-a-volume)を参照してください。

### ファイルとフォルダの表示{#view-files-and-folders}

ボリューム内の既存のファイルとフォルダを閲覧できます。

![UOT3bP88no57f8xNqmYcjFwXnFh](https://zdoc-images.s3.us-west-2.amazonaws.com/uot3bp88no57f8xnqmycjfwxnfh.png "UOT3bP88no57f8xNqmYcjFwXnFh")

### ファイルまたはフォルダの削除{#delete-a-file-or-folder}

不要になったファイルやフォルダは、ボリュームから削除できます。削除には、ファイルやフォルダのサイズに応じて数分かかる場合があります。

<Admonition type="caution" icon="🚧" title="Warning">

<p>削除されたファイルとフォルダは**復元できません**。慎重に進めてください。</p>

</Admonition>

<Supademo id="cmidzfkoqad9sb7b44vnbfzyd?utm_source=link" title=""  />

## ボリュームの削除{#delete-a-volume}

不要になったボリュームはいつでも削除できます。無料トライアルボリュームは、組織ごとに1回しか作成できないことに注意してください。一度削除すると、無料トライアルボリュームを再度作成することはできません。

ボリュームを削除すると、**そのすべてのファイルとフォルダ**も削除されます。

<Admonition type="caution" icon="🚧" title="Warning">

<p>削除されたボリュームは**復元できません**。慎重に進めてください。</p>

</Admonition>

<Supademo id="cmi77c5554p1gb7b4sqqsm7nn?utm_source=link" title=""  />

