---
title: "バックアップツールによるMilvusからZilliz Cloudへの移行 | Cloud"
slug: /via-stage
sidebar_label: "バックアップツールによる移行"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、Milvusからのデータ移行のためのバックアップツールを提供しています。このバックアップツールを使用すると、ユーザーは複雑な詳細を手動で処理することなく、より簡単かつ効率的にデータ移行を実行でき、使いやすさと成功率が大幅に向上します。 | Cloud"
type: origin
token: IxO5wZ1meiYrTckUPkQca9JOnbS
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - milvus
  - バックアップファイル
  - ボリューム
  - マルチモーダルRAG
  - LLMの幻覚
  - ハイブリッド検索
  - 語彙検索

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# バックアップツールによるMilvusからZilliz Cloudへの移行

Zilliz Cloudは、Milvusからのデータ移行のためのバックアップツールを提供しています。このバックアップツールを使用すると、ユーザーは複雑な詳細を手動で処理することなく、より簡単かつ効率的にデータ移行を実行でき、使いやすさと成功率が大幅に向上します。

この機能は、次のようなさまざまな移行シナリオにおける運用上の複雑さを解消します。

- ローカルバックアップファイルで移行する際のファイルサイズの制限。

- バケットベースの移行を使用する際に、異なるクラウドプロバイダーのクラウドストレージバケット構成を理解すること。

- エンドポイントベースの移行を実行する際に、Milvusインスタンスエンドポイントのネットワークアクセシビリティを確保すること。

## 開始する前に{#before-you-start}

- **Organization Owner**または**Project Admin**ロールが付与されていること。必要な権限がない場合は、Zilliz Cloud Organization Ownerに連絡してください。

- ターゲットクラスターのクエリCU数がソースデータに対応できることを確認してください。必要なクエリCU数を推定するには、[計算ツール](https://zilliz.com/pricing?_gl=1*qro801*_ga*MzkzNTY1NDM0LjE3Mjk1MDExNzQ.*_ga_Q1F8R2NWDP*MTc0NTQ4MzY1Ni4zMDEuMS4xNzQ1NDg0MTEzLjAuMC4w*_ga_KKMVYG8YF2*MTc0NTQ4MzY1Ni4yNTIuMS4xNzQ0ODQxMTMuMC4w.0#calculator)を使用してください。

## 手順{#procedure}

この手順では、Milvus Backupを使用してバックアップファイルを準備し、Zilliz Cloudにアップロードして、指定されたターゲットZilliz Cloudクラスターに移行します。

<Procedures>

1. **[milvus-backup](https://github.com/zilliztech/milvus-backup/releases)**をダウンロードします。常に最新リリースを使用してください。

    現在、Milvus 2.2以降のバージョンからZilliz Cloudクラスターにデータを移行できます。互換性のあるソースおよびターゲットMilvusバージョンの詳細については、[Milvus Backup Overview](https://milvus.io/docs/milvus_backup_overview.md)を参照してください。

1. ダウンロードしたバイナリと同じ階層に**configs**フォルダーを作成し、**[backup.yaml](https://raw.githubusercontent.com/zilliztech/milvus-backup/master/configs/backup.yaml)**を**configs**フォルダーにダウンロードします。

    この手順が完了すると、ワークスペースフォルダーの構造は次のようになります。

    ```plaintext
    workspace
    ├── milvus-backup
    └── configs
         └── backup.yaml
    ```

1. **backup.yaml** をカスタマイズします。

    1. 以下の設定項目を設定します。

        ```yaml
        ...
        cloud:
          address: https://api.cloud.zilliz.com
          apikey: <your-api-key>
        ...
        ```

        - `cloud.address`

            Zilliz Cloud Control Planeのエンドポイント。`https://api.cloud.zilliz.com`。

        - `cloud.apikey`

            移行ターゲットクラスターを操作するのに十分な権限を持つ有効なZilliz Cloud APIキー。詳細については、[APIキーの管理](./manage-api-keys)を参照してください。

    1. 以下の設定項目が正しいか確認します。

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
    <li><p>Docker Compose を使用してインストールされた Milvus インスタンスの場合、<code>minio.bucketName</code> はデフォルトで <code>a-bucket</code> に、<code>rootPath</code> はデフォルトで <code>files</code> になります。</p></li>
    <li><p>Kubernetes にインストールされた Milvus インスタンスの場合、<code>minio.bucketName</code> はデフォルトで <code>milvus-bucket</code> に、<code>rootPath</code> はデフォルトで <code>file</code> になります。</p></li>
    </ul>

    </Admonition>

1. Milvus インストールのバックアップを作成します。

    ```bash
    ./milvus-backup --config backup.yaml create -n my_backup
    
    # my_backup is the name of the backup file 
    # and will be used in the migrate command
    ```

1. ターゲットとなるZilliz Cloudクラスターを作成し、クラスターIDを控えて、以下のコマンドを実行して移行を開始します。

    ```bash
    ./milvus-backup migrate --cluster_id inxx-xxxxxxxxxxxxxxx -n my_backup
    
    # cluster_id is the ID of the target Zilliz Cloud cluster
    # my_backup is the name of the backup file created in the above command
    
    # The command output is similar to the following:
    # Successfully triggered migration with backup name: my_backup target cluster: inxx-xxxxxxxxxxxxxxx migration job id: job-xxxxxxxxxxxxxxxxxxx.
    # You can check the progress of the migration job in Zilliz Cloud console.
    ```

    このコマンドを実行すると、Milvus Backup は準備されたバックアップファイルを Zilliz Cloud プラットフォームにアップロードし、移行ジョブを作成し、ジョブ ID をコマンド出力として返します。

    <Admonition type="info" icon="📘" title="Notes">

    <p>Zilliz Cloud プラットフォームにアップロードされたバックアップファイルは、アップロード後 <strong>3</strong> 日間保持され、その後削除されます。</p>

    </Admonition>

</Procedures>

## 移行プロセスの監視{#monitor-the-migration-process}

**Migrate** をクリックすると、移行ジョブが生成されます。[Jobs](./job-center) ページで移行の進行状況を確認できます。ジョブのステータスが **In Progress** から **Successful** に変わると、移行は完了です。

<Admonition type="info" icon="📘" title="Notes">

<p>移行後、ターゲットクラスター内の collection と entity の数がデータソースと一致することを確認してください。不一致が見つかった場合は、entity が不足している collection を削除し、再移行してください。</p>

</Admonition>

![verify_collection](https://zdoc-images.s3.us-west-2.amazonaws.com/verify_collection.png "verify_collection")

## 移行後{#post-migration}

移行ジョブが完了したら、次の点に注意してください。

- **インデックス作成**: 移行プロセスは、移行された collection に対して [AUTOINDEX](./autoindex-explained) を自動的に作成します。

- **手動ロードが必要**: 自動インデックス作成にもかかわらず、移行された collection は検索またはクエリ操作にすぐには利用できません。検索およびクエリ機能を有効にするには、Zilliz Cloud で collection を手動でロードする必要があります。詳細については、[Load & Release](./load-release-collections) を参照してください。

## 移行ジョブのキャンセル{#cancel-migration-job}

移行プロセスで問題が発生した場合は、次の手順でトラブルシューティングを行い、移行を再開できます。

<Procedures>

1. [Jobs](./job-center) ページで、失敗した移行ジョブを特定し、キャンセルします。

1. **Actions** 列の **View Details** をクリックして、エラーログにアクセスします。

</Procedures>