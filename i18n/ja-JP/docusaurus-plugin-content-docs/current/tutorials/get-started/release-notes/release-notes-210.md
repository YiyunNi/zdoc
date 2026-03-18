---
title: "リリースノート (2023年8月16日) | Cloud"
slug: /release-notes-210
sidebar_label: "2023年8月16日"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のリリースを発表できることを嬉しく思います。このリリースには、リージョンサポートの拡大、移行やサーバーレスインスタンス管理などの使いやすさの向上機能を含む、さまざまな機能強化と機能が含まれています。さらに、Bulk-insert と Dedicated Cluster のサポートにより、RESTful API を強化しました。 | Cloud"
type: origin
token: Ti5uwysf0iZhuyk4xvjcFmsSnhG
sidebar_position: 27
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2023年8月16日)

Zilliz Cloudのリリースを発表できることを嬉しく思います。このリリースには、拡張されたリージョンサポート、移行やサーバーレスインスタンス管理などの強化されたユーザビリティ機能を含む、さまざまな機能強化と機能が含まれています。さらに、RESTful APIをバルクインサートと専用クラスターのサポートで強化しました。

## Milvus互換性\{#milvus-compatibility}

このリリースは **Milvus 2.1.x** と互換性があります。

## 拡張されたリージョンサポート\{#expanded-regional-support}

Zilliz Cloudは、シンガポールのパブリッククラウドリージョン、具体的にはAWSの **ap-southeast-1** とGCPの **asia-southeast-1** を含むようにサービスを拡張しました。この拡張により、東南アジアのユーザーはより広範なリーチとより良いパフォーマンスを享受できます。

サポートされているすべてのパブリッククラウドリージョンについては、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions)を参照してください。

## 強化されたユーザビリティ機能\{#enhanced-usability-features}

- 移行のサポート:

    サーバーレスインスタンスから専用クラスターへのコレクションのシームレスな移行をサポートするようになりました。これにより、スケーリングと運用においてより高い柔軟性が提供されます。

- サーバーレスインスタンス管理:

    サーバーレスインスタンスを削除する機能により、ユーザーはリソース割り当てをより細かく制御できます。

    スケーリングと運用においてより高い柔軟性を提供するために、サーバーレスインスタンスから専用クラスターへのコレクションのシームレスな移行をサポートするようになりました。

詳細については、[クラスターの管理](./manage-cluster)を参照してください。

## RESTful APIの機能強化\{#restful-api-enhancements}

- バルクインサート

    データ取り込みプロセスを効率化するために、バルクデータインポート専用に設計された新しいRESTful APIを導入しました。この機能は、データアップロードの時間と複雑さを大幅に削減することを目的としています。詳細については、[APIリファレンス](/reference/restful/import-operations)を参照してください。

- 専用クラスターアクセス

    ユーザーにより広範な制御と柔軟性を提供するために、専用クラスターはRESTful APIを介してアクセスおよび管理できるようになり、統合と自動化がより簡単になりました。詳細については、[APIリファレンス](/reference/restful/cloud-meta)を参照してください。

