---
title: "バックアップファイルによるMilvusからZilliz Cloudへの移行 | Cloud"
slug: /via-backup-files
sidebar_label: "バックアップファイルによる移行"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、インフラストラクチャを自分で管理することなくMilvusベクトルデータベースを使用したいユーザー向けに、フルマネージドのクラウドホスト型ソリューションとしてMilvusを提供します。このトピックでは、バックアップファイルを直接アップロードしてMilvusから移行する方法について説明します。 | Cloud"
type: origin
token: IO4fwm5fJiroaoktKeIcbdkDnRb
sidebar_position: 2
keywords:
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - milvus
  - バックアップファイル

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# バックアップファイルによるMilvusからZilliz Cloudへの移行

Zilliz Cloudは、Milvus ベクトルデータベースを、インフラストラクチャを自分で管理する必要なく利用したいユーザー向けに、完全に管理されたクラウドホスト型ソリューションとして提供しています。このトピックでは、バックアップファイルを直接アップロードしてMilvusから移行する方法について説明します。

## 開始する前に\{#before-you-start}

以下の前提条件が満たされていることを確認してください。

- 移行方法に基づいて、移行に必要な準備が完了していること。

    - **ローカルファイルから**: 事前にローカルバックアップファイルを準備します。バックアップファイルの準備方法については、「[移行用のバックアップファイルを準備する](./via-backup-files#prepare-backup-files-for-migration)」を参照してください。

    - **オブジェクトストレージから**: Milvusオブジェクトストレージの公開URLとアクセス認証情報。長期または一時的な認証情報を選択できます。オブジェクトストレージURLの詳細な例については、「[FAQ](./via-backup-files#faq)」を参照してください。

    - **ボリュームから**: 非常に大きなローカルバックアップファイルの場合、まずファイルをZilliz Cloudボリュームにアップロードし、そのボリューム内のファイルパスを指定します。

- **組織オーナー**または**プロジェクト管理者**のロールが付与されていること。必要な権限がない場合は、Zilliz Cloudの組織オーナーに連絡してください。

- ターゲットクラスターのCUサイズがソースデータを収容できることを確認してください。必要なCUサイズを見積もるには、[計算ツール](https://zilliz.com/pricing?_gl=1*qro801*_ga*MzkzNTY1NDM0LjE3Mjk1MDExNzQ.*_ga_Q1F8R2NWDP*MTc0NTQ4MzY1Ni4zMDEuMS4xNzQ1NDg0MTEzLjAuMC4w*_ga_KKMVYG8YF2*MTc0NTQ4MzY1Ni4yNTIuMS4xNzQ1NDg0MTEzLjAuMC4w#calculator)を使用してください。

## 移行用のバックアップファイルを準備する\{#prepare-backup-files-for-migration}

Milvus 2.xの移行データを準備するには、

<Procedures>

1. **[milvus-backup](https://github.com/zilliztech/milvus-backup/releases)** をダウンロードします。常に最新リリースを使用してください。

    現在、Milvus 2.2以降のバージョンからZilliz Cloudクラスターにデータを移行できます。互換性のあるソースおよびターゲットのMilvusバージョンについては、「[Milvus Backup Overview](https://milvus.io/docs/milvus_backup_overview.md)」を参照してください。

1. ダウンロードしたバイナリと同じ階層に**configs**フォルダを作成し、**[backup.yaml](https://raw.githubusercontent.com/zilliztech/milvus-backup/master/configs/backup.yaml)** を**configs**フォルダにダウンロードします。

    このステップが完了すると、ワークスペースフォルダの構造は次のようになります。

    ```plaintext
    workspace
    ├── milvus-backup
    └── configs
         └── backup.yaml
    ```

1. **backup.yaml** をカスタマイズします。

    通常、このファイルをカスタマイズする必要はありません。しかし、先に進む前に、以下の設定項目が正しいかどうかを確認してください。

    ```yaml
    ...
    # milvus proxy address, compatible to milvus.yaml
    milvus:
      address: localhost
      port: 19530
      ...

    # Related configuration of minio, which is responsible for data persistence for Milvus.
    minio:
      # Milvus storage configs, make them the same with milvus config
      storageType: "minio" # support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative
      # You can use "gcpnative" for the Google Cloud Platform provider. Uses service account credentials for authentication.
      address: localhost # Address of MinIO/S3
      port: 9000   # Port of MinIO/S3
      bucketName: "a-bucket" # Milvus Bucket name in MinIO/S3, make it the same as your milvus instance
      backupBucketName: "a-bucket" # Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath
      rootPath: "files" # Milvus storage root path in MinIO/S3, make it the same as your milvus instance
      ...
    ```

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><p>Docker Composeを使用してインストールされたMilvusインスタンスの場合、<code>minio.bucketName</code>のデフォルト値は<code>a-bucket</code>で、<code>rootPath</code>のデフォルト値は<code>files</code>です。</p></li>
    <li><p>Kubernetes上にインストールされたMilvusインスタンスの場合、<code>minio.bucketName</code>のデフォルト値は<code>milvus-bucket</code>で、<code>rootPath</code>のデフォルト値は<code>file</code>です。</p></li>
    </ul>

    </Admonition>

1. Milvus インストールのバックアップを作成します。

    ```plaintext
    ./milvus-backup --config backup.yaml create -n my_backup
    ```

1. バックアップファイルを取得します。

    ```plaintext
    ./milvus-backup --config backup.yaml get -n my_backup
    ```

1. バックアップファイルを確認します。

    - `minio.address` と `minio.port` を S3 バケットに設定した場合、バックアップファイルはすでに S3 バケットにあります。

    - `minio.address` と `minio.port` を Minio バケットに設定した場合、Minio Console または **mc** クライアントを使用してダウンロードできます。

        - [Minio Console](https://min.io/docs/minio/kubernetes/upstream/administration/minio-console.html) からダウンロードするには、Minio Console にログインし、`minio.address` で指定されたバケットを見つけ、バケット内のファイルを選択し、**ダウンロード** をクリックしてダウンロードします。

        - [**mc** クライアント](https://min.io/docs/minio/linux/reference/minio-mc.html#mc-install) を使用する場合は、次のようにします。

            ```plaintext
            # Minioホストを設定
            mc alias set my_minio https://<minio_endpoint> <accessKey> <secretKey>

            # 利用可能なバケットをリスト表示
            mc ls my_minio

            # バケットからファイルをダウンロード
            mc cp --recursive my_minio/<your-bucket-path> <local_dir_path>
            ```

1. ダウンロードしたアーカイブを解凍し、**backup**フォルダの内容のみをZilliz Cloudにアップロードします。

</Procedures>

## Zilliz Cloudへのデータ移行\{#migrate-data-to-zilliz-cloud}

バックアップファイルが準備できたら、ローカルファイル、オブジェクトストレージ、またはボリュームからデータを移行できます。

<Supademo id="cmbhd2wj85jktsn1rnjmi4t5o" title="Zilliz Cloud - Migrate from Milvus via Backup File Demo" />

<Admonition type="info" icon="📘" title="Notes">

<p>ソースコレクションですでに全文検索が有効になっている場合、Zilliz Cloudは移行後にターゲットコレクションでその機能設定を保持します。これらの継承された設定は変更できません。</p>

</Admonition>

## 移行プロセスの監視\{#monitor-the-migration-process}

**Migrate**をクリックすると、移行ジョブが生成されます。[ジョブ](./job-center)ページで移行の進行状況を確認できます。ジョブのステータスが**進行中**から**成功**に変わると、移行は完了です。

<Supademo id="cme9my2nn4b64h3pyiyvsakqb" title="Zilliz Cloud - Monitor the Migration Process" />

<Admonition type="info" icon="📘" title="Notes">

<p>移行後、ターゲットクラスター内のコレクション数とエンティティ数がデータソースと一致することを確認してください。不一致が見つかった場合は、エンティティが不足しているコレクションを削除して再度移行してください。</p>

</Admonition>

## 移行後\{#post-migration}

移行ジョブが完了したら、次の点に注意してください。

- **インデックス作成**: 移行プロセスは、移行されたコレクションに対して[AUTOINDEX](./autoindex-explained)を自動的に作成します。

- **手動ロードが必要です**: 自動インデックス作成にもかかわらず、移行されたコレクションは検索またはクエリ操作にすぐに利用できるわけではありません。検索およびクエリ機能を有効にするには、Zilliz Cloudでコレクションを手動でロードする必要があります。詳細については、[Load & Release](./load-release-collections)を参照してください。

## 移行ジョブのキャンセル\{#cancel-migration-job}

移行プロセスで問題が発生した場合は、次の手順でトラブルシューティングを行い、移行を再開できます。

<Procedures>

1. [ジョブ](./job-center)ページで、失敗した移行ジョブを特定し、キャンセルします。

1. **Actions**列の**View Details**をクリックして、エラーログにアクセスします。

</Procedures>

## FAQ\{#faq}

1. **オブジェクトストレージバケットに保存されているバックアップファイルから移行する場合、どのような形式のURLに従うべきですか？**

    次の表は、異なるオブジェクトストレージサービスのURLの例を示しています。バックアップファイルから移行する場合、バックアップフォルダのみを選択できることに注意してください。

    <table>
       <tr>
         <th colspan="2"><p><strong>クラウドオブジェクトストレージ</strong></p></th>
         <th><p><strong>URL形式</strong></p></th>
       </tr>
       <tr>
         <td rowspan="3"><p><strong>Amazon S3</strong></p></td>
         <td><p>AWSオブジェクトURL、仮想ホストスタイル</p></td>
         <td><p><i>http</i>s://\<bucket_name>.s3.\<region-code>.amazonaws.com/\<folder_name>/</p></td>
       </tr>
       <tr>
         <td><p>AWSオブジェクトURL、パススタイル</p></td>
         <td><p><i>http</i>s://s3.\<region-code>.amazonaws.com/\<bucket_name>/\<folder_name>/</p></td>
       </tr>
       <tr>
         <td><p>Amazon S3 URI</p></td>
         <td><p>s3://\<bucket_name>/\<folder_name>/</p></td>
       </tr>
       <tr>
         <td rowspan="2"><p><strong>Google Cloud Storage</strong></p></td>
         <td><p>GSC公開URL</p></td>
         <td><p><i>http</i>s://storage.cloud.google.com/\<bucket_name>/\<folder_name>/</p></td>
       </tr>
       <tr>
         <td><p>GSC gsutil URI</p></td>
         <td><p>gs://\<bucket_name>/\<folder_name>/</p></td>
       </tr>
       <tr>
         <td colspan="2"><p><strong>Azure Blob Storage</strong></p></td>
         <td><p><i>http</i>s://\<storage_account>.blob.core.windows.net/\<container>/\<folder>/</p></td>
       </tr>
    </table>