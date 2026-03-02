---
title: "データのインポート (コンソール) | BYOC"
slug: /import-data-on-web-ui
sidebar_label: "コンソール"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud コンソールで準備したデータをインポートする方法について説明します。 | BYOC"
type: origin
token: KkdswLx2bi4bgCkY6bEc7Do9neh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - データインポート
  - コンソール
  - milvus lite
  - milvus benchmark
  - managed milvus
  - サーバーレス ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# データのインポート (コンソール)

このページでは、Zilliz Cloud コンソールで準備されたデータをインポートする方法について説明します。

## Web UI でデータをインポートする{#import-data-on-the-web-ui}

データファイルが準備できたら、データインポートのためにオブジェクトストレージバケットにアップロードできます。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>1つのcollectionで、最大10,000件の実行中または保留中のインポートジョブを持つことができます。</p></li>
<li><p>Webコンソールは、最大1GBのローカルJSONまたはParquetファイルのアップロードをサポートしています。より大きなファイルの場合は、代わりに<a href="./import-data-on-web-ui#remote-files-from-an-object-storage-bucket">オブジェクトストレージからアップロードする</a>ことをお勧めします。データインポートで問題が発生した場合は、<a href="https://support.zilliz.com/hc/en-us">サポートチケットを作成してください</a>。</p></li>
</ul>

</Admonition>

### オブジェクトストレージバケットからのリモートファイル{#remote-files-from-an-object-storage-bucket}

リモートファイルをインポートするには、まずそれらをリモートバケットにアップロードする必要があります。BulkWriterツールを使用して、生のデータをサポートされている形式に簡単に変換し、結果ファイルをアップロードできます[BulkWriterツールの使用](./use-bulkwriter)。

準備したファイルをリモートバケットにアップロードしたら、オブジェクトストレージサービスを選択し、リモートバケット内のファイルへのパスと、Zilliz Cloudがバケットからデータをプルするためのバケット認証情報を入力します。

データのセキュリティ要件に基づいて、データインポート中に長期認証情報または短期トークンのいずれかを使用できます。

認証情報の取得に関する詳細については、以下を参照してください。

- Amazon S3: [長期認証情報を使用した認証](https://docs.aws.amazon.com/sdkref/latest/guide/access-iam-users.html)

- Google Cloud Storage: [サービスアカウントのHMACキーの管理](https://cloud.google.com/storage/docs/authentication/managing-hmackeys)

- Azure Blob Storage: [アカウントアクセスキーの表示](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

短期トークンの使用に関する詳細については、[このFAQ](/docs/faq-data-import#can-i-use-short-term-credentials-when-importing-data-from-an-object-storage-service)を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloudでは、クラスターをホストするクラウドプロバイダーに関係なく、任意のオブジェクトストレージサービスから任意のZilliz Cloudクラスターにデータをインポートできるようになりました。たとえば、AWS S3バケットからGCPにデプロイされたZilliz Cloudクラスターにデータをインポートできます。</p>

</Admonition>

<Supademo id="cme7xfbw40096xf0irz21196r?utm_source=link" title=""  />

## 結果の確認{#verify-results}

インポートジョブの進行状況とステータスは、[ジョブ](./job-center)ページで確認できます。

## サポートされているオブジェクトパス{#supported-object-paths}

適用可能なオブジェクトパスについては、[ストレージオプション](./data-import-storage-options)および[フォーマットオプション](./data-import-format-options)を参照してください。

## 関連トピック{#related-topics}

- [ストレージオプション](./data-import-storage-options)

- [フォーマットオプション](./data-import-format-options)

- [RESTful API を介したデータインポート](./import-data-via-restful-api)

- [SDK を介したデータインポート](./import-data-via-sdks)

- [データインポートハンズオン](./data-import-zero-to-hero)

