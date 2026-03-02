---
title: "データのインポート (コンソール) | Cloud"
slug: /import-data-on-web-ui
sidebar_label: "コンソール"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud コンソールで準備したデータをインポートする方法について説明します。"
type: origin
token: KkdswLx2bi4bgCkY6bEc7Do9neh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - コンソール
  - milvus database
  - milvus lite
  - milvus benchmark
  - managed milvus

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# データのインポート (コンソール)

このページでは、Zilliz Cloud コンソールで準備したデータをインポートする方法について説明します。

## Web UI でデータをインポートする{#import-data-on-the-web-ui}

データファイルが準備できたら、ローカルドライブから直接インポートするか、AWS S3 や Google Cloud GCS、Azure Blob Storage などのオブジェクトストレージバケットにアップロードしてデータをインポートできます。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>1 つのコレクションで最大 10,000 件の実行中または保留中のインポートジョブを持つことができます。</p></li>
<li><p>Web コンソールは、最大 1 GB のローカル JSON または Parquet ファイルのアップロードをサポートしています。より大きなファイルの場合は、代わりに<a href="./import-data-on-web-ui#remote-files-from-an-object-storage-bucket">オブジェクトストレージからアップロードする</a>ことをお勧めします。データのインポートで問題が発生した場合は、<a href="https://support.zilliz.com/hc/en-us">サポートチケットを作成してください</a>。</p></li>
</ul>

</Admonition>

### ローカルファイル{#local-file}

Zilliz Cloud は、ローカルの JSON または Parquet ファイルからのデータインポートをサポートしています。データが NumPy 形式で準備されている場合は、[オブジェクトストレージバケット](./import-data-on-web-ui#remote-files-from-an-object-storage-bucket)からインポートしてください。

ローカルファイルからデータをインポートするには、ファイルをアップロードエリアにドラッグアンドドロップし、**Import** をクリックします。

<Supademo id="cme7x3fgv388ch3pyymi6ek0q?utm_source=link" title=""  />

### オブジェクトストレージバケットからのリモートファイル{#remote-files-from-an-object-storage-bucket}

リモートファイルをインポートするには、まずそれらをリモートバケットにアップロードする必要があります。BulkWriter ツールを使用して、生データをサポートされている形式に簡単に変換し、結果ファイルをアップロードできます。

準備したファイルをリモートバケットにアップロードしたら、オブジェクトストレージサービスを選択し、リモートバケット内のファイルへのパスとバケットの認証情報を入力して、Zilliz Cloud がバケットからデータをプルできるようにします。

データのセキュリティ要件に基づいて、データインポート中に長期認証情報または短期トークンのいずれかを使用できます。

認証情報の取得に関する詳細については、以下を参照してください。

- Amazon S3: [長期認証情報を使用した認証](https://docs.aws.amazon.com/sdkref/latest/guide/access-iam-users.html)

- Google Cloud Storage: [サービスアカウントの HMAC キーの管理](https://cloud.google.com/storage/docs/authentication/managing-hmackeys)

- Azure Blob Storage: [アカウントアクセスキーの表示](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

短期トークンの使用に関する詳細については、[この FAQ](/docs/faq-data-import#can-i-use-short-term-credentials-when-importing-data-from-an-object-storage-service) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud では、クラウドプロバイダーがホストするクラスターに関係なく、任意のオブジェクトストレージサービスから任意の Zilliz Cloud クラスターにデータをインポートできるようになりました。たとえば、AWS S3 バケットから GCP にデプロイされた Zilliz Cloud クラスターにデータをインポートできます。</p>

</Admonition>

<Supademo id="cme7xfbw40096xf0irz21196r?utm_source=link" title=""  />

### ボリュームにアップロードされたファイル{#files-uploaded-to-a-volume}

ローカルファイルが非常に大きい (> 1GB) 場合は、まず[ファイルをボリュームにアップロード](./manage-stages#upload-data-into-a-volume)してから、ボリュームからインポートできます。

準備したファイルをボリュームにアップロードしたら、ファイルパスをコピーして、ファイルをコレクションにインポートし続けます。

<Supademo id="cmidzr662adilb7b4d7l45rnf?utm_source=link" title=""  />

## 結果の確認{#verify-results}

インポートジョブの進行状況とステータスは、[ジョブ](./job-center)ページで確認できます。

## サポートされているオブジェクトパス{#supported-object-paths}

適用可能なオブジェクトパスについては、[ストレージオプション](./data-import-storage-options)と[フォーマットオプション](./data-import-format-options)を参照してください。

## 関連トピック{#related-topics}

- [ストレージオプション](./data-import-storage-options)

- [フォーマットオプション](./data-import-format-options)

- [RESTful API を介したデータインポート](./import-data-via-restful-api)

- [SDK を介したデータインポート](./import-data-via-sdks)

- [データインポートハンズオン](./data-import-zero-to-hero)

