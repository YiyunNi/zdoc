---
title: "リリースノート (2023年10月17日) | Cloud"
slug: /release-notes-230
sidebar_label: "2023年10月17日"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、EUにAWSフランクフルトリージョンを立ち上げました。この拡張に伴い、検索機能とデータ管理効率を向上させるベータ機能として、Range Search、Upsert、およびCosine Metric Typeを導入します。追加機能には、API Key Access、Retrieve Raw Vectors、JSONCONTAINS Filter、およびEntity Countが含まれます。ユーザーエクスペリエンス向上のため、RBAC、請求、料金計算、アカウント管理、およびサービスの安定性における改善も実施されました。"
type: origin
token: MocQwCCItiHYEbkkJtOcROPTnod
sidebar_position: 23
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート
  - ANNS
  - ベクトル検索
  - knnアルゴリズム
  - HNSW

---

import Admonition from '@theme/Admonition';


# リリースノート (2023年10月17日)

AWSフランクフルトリージョン（EU）の開設を発表できることを嬉しく思います。この拡張に伴い、Range Search、Upsert、Cosine Metric Typeのベータ版機能を導入し、検索機能とデータ管理効率を向上させます。追加機能には、API Key Access、Retrieve Raw Vectors、JSON_CONTAINS Filter、およびEntity Countが含まれます。また、RBAC、請求、料金計算、アカウント管理、およびサービスの安定性において、ユーザーエクスペリエンスを向上させるための注目すべき改善も実施されました。

## Milvus互換性{#milvus-compatibility}

このリリースは、**Milvus 2.2.x** および **Milvus 2.3.x (ベータ版)** と互換性があります。

## 新しいAWSリージョン：フランクフルト (aws-eu-central-1) - 稼働開始{#new-aws-region-frankfurt-aws-eu-central-1-now-live}

新しいAWSフランクフルトリージョンを発表できることを嬉しく思います。これは、ヨーロッパのユーザーベースにより良く対応するために設計されました。このリージョンは、強化されたサポートを提供するだけでなく、AWS Marketplaceの支払いオプションの利便性も提供します。利用可能なすべてのクラウドリージョンについては、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions)を参照してください。

## 革新的なベータ機能{#innovative-beta-features}

専用クラスターで利用可能な最新のベータ機能で未来を探索してください。これらの機能強化を体験するために今すぐアップグレードしてください。

- *Range Search*

    [Range Search](./range-search)でクエリを再定義し、検索の半径を設定できます。従来のANN Searchとは異なり、Range Searchは指定された半径内のすべてのベクトルを含めることを保証し、より包括的なビューを提供します。

- *Upsert*

    「更新」と「挿入」を融合した[Upsert](./upsert-entities)で、動的なデータセットをシームレスに管理します。変更が頻繁なデータセットの効率が向上します。

- *Cosine Metric Type*

    [Cosine](./search-metrics-explained#cosine-similarity)、[Inner Product](./search-metrics-explained#inner-product-ip)、および[Euclidean Distance](./search-metrics-explained#euclidean-distance-l2)のサポートにより、高度なベクトル検索を体験してください。Cosineメトリックは、事前のベクトル正規化の必要性を排除し、検索プロセスを合理化します。

- *アクセス制御*

    [API Key](./manage-api-keys)または[ユーザー名とパスワード認証](./cluster-credentials)を使用して、専用クラスターとサーバーレスインスタンスに安全にアクセスします。

- *Raw Vectorsの返却*

    [検索パラメーター](./single-vector-search#use-output-fields)でベクトルフィールドを指定して、検索結果の一部として受け取ります。

- *JSON_CONTAINSフィルター*

    [JSON_CONTAINS演算子](./json-filtering-operators)を使用して、JSONフィールド値に基づいてフィルタリング条件を指定することで、検索をさらに絞り込みます。

- *Entity Count*

    データ管理を改善するために、[ロードされたコレクション内のエンティティの総数](./single-vector-search#use-output-fields)の概要をすばやく取得します。

## 改善点{#enhancements}

全体的なエクスペリエンスを向上させるために、いくつかの改善も実施しました。

- *RBACの新しいロール*

    より合理化されたコラボレーションのために、プロジェクトの共同作業者に[プロジェクトメンバーロール](./project-users)を付与します。

- *請求の最適化*

    合理化されたプロセスにより、より効率的な請求管理をお楽しみください。

- *高度な[料金計算ツール](https://zilliz.com/pricing#calculator)*

    プライマリキー、ベクトルフィールド、および文字列フィールドを組み合わせた包括的な見積もりを取得し、より正確な料金概要を提供します。

- *セルフサービスアカウント削除*

    プロファイルをより詳細に制御するために、[自分のアカウント](./email-accounts#close-your-account)または[組織](./organization-settings#delete-organization)を簡単に削除できます。

- *安定性の向上*

    サービスの信頼性を向上させるために、既知の問題に対処しました。

イノベーションとパフォーマンスが融合するZilliz Cloudをお選びいただきありがとうございます！