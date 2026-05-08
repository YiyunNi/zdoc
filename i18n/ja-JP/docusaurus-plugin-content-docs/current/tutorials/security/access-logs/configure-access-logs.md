---
title: "アクセスログの設定 | Cloud"
slug: /configure-access-logs
sidebar_key: configure-access-logs
sidebar_label: "アクセスログを設定"
beta: PUBLIC
notebook: FALSE
description: "このガイドでは、Zilliz Cloud でのアクセスログの有効化、設定の調整、無効化を含む、ライフサイクル全体について説明します。"
type: origin
token: QPgEwd4qziOa5RkgJR2c9gpnn3b
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - アクセス
  - ログ
  - 設定

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# アクセスログの設定

このガイドでは、Zilliz Cloud 上のアクセスログの有効化、設定の調整、および無効化を含む、ライフサイクル全体について説明します。

<Admonition type="info" icon="📘" title="Notes">

- このリリースでは、検索またはクエリクラスのアクションのみをログに記録します：Search、HybridSearch、および Query。完全なアクションリストのサポートは、将来のリリースで予定されています。

- このリリースでは、監査ログとアクセスログは相互に排他的です — 一度に有効にできるのはどちらか一方のみです。

- アクセスログは、**Enterprise** プロジェクトの **Dedicated** クラスタでのみ利用可能です。クラスタが異なるプランまたはクラスタタイプの場合は、アップグレードを検討してください。

</Admonition>

## 開始前に\{#before-you-start}

- 対象クラスタと同じリージョンに設定されたオブジェクトストレージ統合（AWS S3、Google Cloud Storage、または Azure Blob Storage）。設定手順については、[AWS S3 との統合](./integrate-with-aws-s3)、[Google Cloud Storage との統合](./integrate-with-gcp)、または [Azure Blob Storage との統合](./integrate-with-azure-blob-storage) を参照してください。

- プロジェクトの **組織オーナー**、**プロジェクト管理者**、または **Cluster Admin** の権限。必要な権限がない場合は、Zilliz Cloud 管理者に連絡してください。

## アクセスログの有効化\{#enable-access-logs}

<Supademo id="cmn5r1yif3u0fz3qmiev350yz" title=""  />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) を開き、対象のクラスタに移動します。

1. クラスタ設定ページで、**Access Log** タブをクリックし、**Enable** をクリックします。

1. **Access Log Settings** ダイアログボックスで、以下の設定を構成します：

    - **ストレージ統合**: ログファイルが配信される統合ストレージバケットを選択します。

    - **Directory**: アクセスログを保存するバケット内のディレクトリを指定します。

    - **Sampling Rate**: ログに記録するクエリの割合を設定します。100% のレートではすべての操作をキャプチャします。高ボリュームのワークロードでは、低いレート（例：1%）を設定することで、統計的な有意性を保ちながらストレージコストを削減できます。

    - **Actions**: アクセスログエントリとして記録する操作タイプ（例：Search または HybridSearch）を指定します。

    - **Output Fields**: オブジェクトストレージに書き込まれる各アクセスログエントリに含めるメタデータフィールドを指定します。**Always included** とマークされたフィールドはすべてのエントリに記録され、選択したフィールドは追加でキャプチャされます。

1. **Save** をクリックします。ログファイルは数分以内にバケットに表示され、パス規則 `/<クラスターID>/Access/<Date>/<HH:MM:SS>-<UUID>.log` に従います。

</Procedures>

## アクセスログ設定の編集\{#edit-access-log-settings}

アクセスログを無効化せずに、サンプリングレートと出力フィールドをいつでも調整できます。

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) を開き、クラスタに移動します。

1. クラスタ設定ページで、**Access Log** タブをクリックします。

1. **Edit** をクリックします。

1. 必要に応じて **Sampling Rate** または **Output Fields** を調整します。

1. **Save** をクリックします。更新された設定は新しいログエントリに対して即座に有効になります。バケット内の既存のログファイルには影響しません。

</Procedures>

## アクセスログの無効化\{#disable-access-logs}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) を開き、クラスタに移動します。

1. クラスタ設定ページで、**Access Log** タブをクリックします。

1. **Disable** をクリックします。新しいログエントリは即座に停止します。既存のログファイルはバケットに残ります。アクセスログの請求は無効化後に停止します。

</Procedures>