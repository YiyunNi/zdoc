---
title: "リリースノート (2023年8月16日) | Cloud"
slug: /release-notes-210
sidebar_label: "2023年8月16日"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudのリリースを発表できることを大変嬉しく思います。このリリースには、対応リージョンの拡大、移行やサーバーレスインスタンス管理といった使いやすさの向上機能など、さまざまな機能強化と新機能が含まれています。さらに、Bulk-insertとDedicated Clusterのサポートにより、RESTful APIも強化されました。 | Cloud"
type: origin
token: Ti5uwysf0iZhuyk4xvjcFmsSnhG
sidebar_position: 26
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - 質問応答システム
  - llm-as-a-judge
  - ハイブリッドベクトル検索
  - 動画の重複排除

---

import Admonition from '@theme/Admonition';


# リリースノート (2023年8月16日)

Zilliz Cloudのリリースを発表できることを嬉しく思います。このリリースには、地域サポートの拡大や、移行やサーバーレスインスタンス管理などの使いやすさの強化を含む、さまざまな機能強化と機能が含まれています。さらに、Bulk-insertとDedicated Clusterのサポートにより、RESTful APIを強化しました。

## Milvus互換性{#milvus-compatibility}

このリリースは **Milvus 2.1.x** と互換性があります。

## 地域サポートの拡大{#expanded-regional-support}

Zilliz Cloudは、シンガポールのパブリッククラウドリージョン、具体的にはAWSの**ap-southeast-1**とGCPの**asia-southeast-1**を含むようにサービスを拡大しました。この拡大により、東南アジアのユーザーはより広範なリーチと優れたパフォーマンスを享受できます。

サポートされているすべてのパブリッククラウドリージョンについては、[Cloud Providers & Regions](./cloud-providers-and-regions)を参照してください。

## 強化された使いやすさの機能{#enhanced-usability-features}

- 移行サポート:

    サーバーレスインスタンスから専用クラスターへのコレクションのシームレスな移行をサポートするようになりました。これにより、スケーリングと操作の柔軟性が向上します。

- サーバーレスインスタンス管理:

    サーバーレスインスタンスを削除する機能により、ユーザーはリソース割り当てをより細かく制御できます。

    スケーリングと操作の柔軟性を高めるために、サーバーレスインスタンスから専用クラスターへのコレクションのシームレスな移行をサポートするようになりました。

詳細については、[Manage Cluster](./manage-cluster)を参照してください。

## RESTful APIの強化{#restful-api-enhancements}

- バルクインサート

    データ取り込みプロセスを効率化するために、バルクデータインポート専用の新しいRESTful APIを導入しました。この機能は、データアップロードの時間と複雑さを大幅に削減することを目的としています。詳細については、[APIリファレンス](/reference/restful/import-operations)を参照してください。

- 専用クラスターアクセス

    ユーザーに幅広い制御と柔軟性を提供するために、専用クラスターはRESTful APIを介してアクセスおよび管理できるようになり、統合と自動化がより簡単になりました。詳細については、[APIリファレンス](/reference/restful/cloud-meta)を参照してください。

