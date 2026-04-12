---
title: "アクセスログの設定 | BYOC"
slug: /configure-access-logs
sidebar_label: "アクセスログの設定"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud におけるアクセスログの有効化、設定調整、無効化を含む完全なライフサイクルについて説明します。| BYOC"
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

このガイドでは、Zilliz Cloud におけるアクセスログの有効化、設定の調整、無効化というライフサイクル全体について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>このリリースでは、検索またはクエリクラスのアクション（Search、HybridSearch、Query）のみをログに記録します。全アクションリストのサポートは今後のリリースで予定されています。</p>

</Admonition>

## 始める前に\{#before-you-start}

- ターゲットクラスターと同じリージョンで構成されたオブジェクトストレージ統合（AWS S3、Google Cloud Storage、または Azure Blob Storage）。セットアップ手順については、[AWS S3 との統合](./integrate-with-aws-s3)、[Google Cloud Storage との統合](./integrate-with-gcp)、または [Azure Blob Storage との統合](./integrate-with-azure-blob-storage) を参照してください。

- プロジェクトに対する**組織オーナー**または**プロジェクト管理者**の権限。必要な権限をお持ちでない場合は、Zilliz Cloud 管理者にお問い合わせください。

## アクセスログを有効にする\{#enable-access-logs}

<Supademo id="cmn5r1yif3u0fz3qmiev350yz" title=""  />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) を開き、ターゲットクラスターに移動します。

1. クラスター設定ページで、**アクセスログ**タブをクリックし、次に**有効化**をクリックします。

1. **アクセスログ設定**ダイアログボックスで、以下の設定を行います：

    - **ストレージ統合**: ログファイルが配信される統合ストレージバケットを選択します。

    - **ディレクトリ**: 監査ログを保存するためのバケット内のディレクトリを指定します。

    - **サンプリングレート**: ログに記録するクエリの割合を設定します。100% のレートですべての操作がキャプチャされます。高ボリュームのワークロードの場合、低いレート（例：1%）にすることで、統計的有意性を保ちながらストレージコストを削減できます。

    - **アクション**: アクセスログエントリとして記録される操作タイプ（例：Search または HybridSearch）を指定します。

    - **出力フィールド**: オブジェクトストレージに書き込まれる各アクセスログエントリに含まれるメタデータフィールドを指定します。**常に含まれる**とマークされたフィールドはすべてのエントリで記録され、選択されたフィールドが追加でキャプチャされます。

1. **保存**をクリックします。ログファイルは数分以内にバケットに表示され始め、パス規約 `/<クラスターID>/Access/<Date>/<HH:MM:SS>-<UUID>.log` に従います。

</Procedures>

## アクセスログ設定を編集する\{#edit-access-log-settings}

アクセスログを無効にせずに、いつでもサンプリングレートや出力フィールドを調整できます。

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) を開き、クラスターに移動します。

1. クラスター設定ページで、**アクセスログ**タブをクリックします。

1. **編集**をクリックします。

1. 必要に応じて**サンプリングレート**または**出力フィールド**を調整します。

1. **保存**をクリックします。更新された設定は、新しいログエントリに対して直ちに有効になります。バケット内の既存のログファイルには影響しません。

</Procedures>

## アクセスログを無効にする\{#disable-access-logs}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) を開き、クラスターに移動します。

1. クラスター設定ページで、**アクセスログ**タブをクリックします。

1. **無効化**をクリックします。新しいログエントリは直ちに停止します。既存のログファイルはバケットに残ります。アクセスログの請求は、無効化されると停止します。

</Procedures>