---
title: "リリースノート (2023年10月17日) | Cloud"
slug: /release-notes-230
sidebar_label: "2023年10月17日"
beta: FALSE
notebook: FALSE
description: "Zilliz CloudのAWSフランクフルトリージョン（EU）の開設を発表できることを嬉しく思います。この拡張に伴い、検索機能とデータ管理効率を向上させるベータ機能として、Range Search、Upsert、Cosine Metric Typeを導入します。追加機能には、API Key Access、Retrieve Raw Vectors、JSONCONTAINS Filter、およびEntity Countが含まれます。ユーザーエクスペリエンス向上のため、RBAC、請求、料金計算、アカウント管理、およびサービス安定性における注目すべき改善も実施されました。"
type: origin
token: MocQwCCItiHYEbkkJtOcROPTnod
sidebar_position: 24
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2023年10月17日)

AWSフランクフルトリージョンをEUでローンチしたことをお知らせします。この拡張に伴い、ベータ機能としてRange Search、Upsert、コサイン メトリックタイプを導入し、検索機能とデータ管理効率を向上させます。追加機能には、APIキー Access、Retrieve Raw Vectors、JSON_CONTAINS Filter、およびエンティティ数が含まれます。RBAC、請求、価格計算、アカウント管理、およびサービス安定性における注目すべき改善も、ユーザーエクスペリエンス向上のために実装されました。

## Milvus互換性\{#milvus-compatibility}

このリリースは、**Milvus 2.2.x** および **Milvus 2.3.x (ベータ版)** と互換性があります。

## 新しいAWSリージョン：フランクフルト (aws-eu-central-1) - ライブ中\{#new-aws-region-frankfurt-aws-eu-central-1-now-live}

新しいAWSフランクフルトリージョンを発表できることを嬉しく思います。これは、ヨーロッパのユーザーベースにより良く対応するために設計されています。このリージョンは、強化されたサポートを提供するだけでなく、AWS Marketplaceの支払いオプションの利便性も提供します。利用可能なすべてのクラウドリージョンについては、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions)を参照してください。

## 革新的なベータ機能\{#innovative-beta-features}

専用クラスターで利用可能な最新のベータ機能で未来を探索してください。これらの機能強化を体験するために今すぐアップグレードしてください：

- *Range Search*

    [Range Search](./range-search)でクエリを再定義し、検索の半径を設定できるようにします。従来のANN Searchとは異なり、Range Searchは指定された半径内のすべてのベクトルを含めることを保証し、より包括的なビューを提供します。

- *Upsert*

    「更新」と「挿入」を融合した[Upsert](./upsert-entities)で、動的なデータセットをシームレスに管理します。変更が頻繁なデータセットで効率が向上します。

- *コサイン メトリックタイプ*

    [コサイン](./search-metrics-explained#cosine-similarity)、[内積](./search-metrics-explained#inner-product-ip)、および[ユークリッド距離](./search-metrics-explained#euclidean-distance-l2)のサポートにより、高度なベクトル検索を体験してください。コサインメトリックは、事前のベクトル正規化の必要性を排除し、検索プロセスを効率化します。

- *アクセス制御*

    [APIキー](./manage-api-keys)または[ユーザー名とパスワード認証](./cluster-credentials)を使用して、専用クラスターとサーバーレスインスタンスに安全にアクセスします。

- *生のベクトルを返す*

    検索結果の一部として受け取るために、[検索パラメーター](./single-vector-search#use-output-fields)でベクトルフィールドを指定します。

- *JSON_CONTAINSフィルター*

    [JSON_CONTAINS演算子](./json-filtering-operators)を使用して検索をさらに絞り込み、JSONフィールド値に基づいてフィルタリング条件を指定できるようにします。

- *エンティティ数*

    データ管理を改善するために、[ロードされたコレクション内のエンティティの総数](./single-vector-search#use-output-fields)の概要をすばやく取得します。

## 強化点\{#enhancements}

全体的なエクスペリエンスを向上させるために、いくつかの強化も実装しました。

- *RBACの新しいロール*

    より効率的なコラボレーションのために、プロジェクト共同作業者に[プロジェクトメンバーロール](./project-users)を付与します。

- *請求の最適化*

    効率化されたプロセスにより、より効率的な請求管理をお楽しみください。

- *高度な[料金計算ツール](https://zilliz.com/pricing#calculator)*

    プライマリキー、ベクトルフィールド、および文字列フィールドを組み合わせて、より正確な価格概要を提供する包括的な見積もりを取得します。

- *セルフサービスアカウント削除*

    プロファイルをより詳細に制御するために、[自分のアカウント](./email-accounts#close-your-account)または[組織](./organization-settings#delete-organization)を簡単に削除できます。

- *安定性の向上*

    サービスの信頼性を向上させるために、既知の問題に対処しました。

イノベーションとパフォーマンスが出会うZilliz Cloudをお選びいただきありがとうございます！