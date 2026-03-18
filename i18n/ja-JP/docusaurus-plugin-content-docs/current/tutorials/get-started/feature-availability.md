---
title: "機能の可用性 | Cloud"
slug: /feature-availability
sidebar_label: "機能の可用性"
beta: FALSE
notebook: FALSE
description: "最終更新日：2025年10月13日 | Cloud"
type: origin
token: HpbSwzS6kiW9gikHpQ0cUZLWnlc
sidebar_position: 17
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 機能の可用性

---

import Admonition from '@theme/Admonition';


# 機能の可用性

*最終更新日: 2025年10月13日*

機能の**利用可能フェーズ**は、Zilliz Cloudにおけるその機能の成熟度、安定性、推奨される使用法を示します。以下は、機能のライフサイクル段階の概要と、ユーザーにとってそれが何を意味するかです。

![YBh6wiorGhbetoba42DchATjnVm](https://zdoc-images.s3.us-west-2.amazonaws.com/YBh6wiorGhbetoba42DchATjnVm.png)

- **プライベートプレビュー:**

    - **定義:** プライベートプレビューの機能は活発に開発中であり、変更される可能性があります。Zilliz Cloud内で実装およびテストされていますが、完全な使いやすさ、安定性、およびエッジケースの網羅は完了していない場合があります。

    - **アクセス**: デフォルトでは利用できません。[Zillizサポート](http://support.zilliz.com)に連絡してアクセスをリクエストしてください。

    - **使用法**: 本番ワークロードでの使用は意図されていません。

- **パブリックプレビュー:**

    - **定義:** パブリックプレビューの機能は、本番環境に近い状態であり、一般提供 (GA) に達するまでに大幅な変更はほとんどありません。

    - **アクセス**: クラスターのMilvusバージョンをアップグレードすると、通常はデフォルトで有効になります。クラスターが古いバージョンのMilvusを実行している場合、一部の機能にアクセスできない場合があります。そのような場合は、[サポートに連絡](http://support.zilliz.com)してクラスターをアップグレードしてください。

    - **使用法:** 本番環境での使用は推奨されません。

- **一般提供 (GA):**

    - **定義:** GA機能は完全にリリースされ、本番環境に対応しており、積極的にサポートされています。

    - **アクセス**: ほとんどのユーザーに対してデフォルトで有効になっていますが、価格に関する考慮事項があるエンタープライズ機能など、一部の機能は[営業担当者に連絡](https://zilliz.com/contact-sales)してアクティベーションを依頼する必要があります。

    - **使用法**: 本番環境での使用。

- **非推奨通知:**

    - **定義:** このフェーズの機能はまだ機能しておりアクセス可能ですが、重要なバグ修正を除いて、活発な開発は行われていません。

    - **アクセス**: まだ利用可能ですが、正式な非推奨通知がメールで発行されています。

    - **使用法**: 将来的に機能が削除されるため、新しいソリューションへの移行を開始するために[当社の専門家にご相談ください](https://zilliz.com/contact-sales)。

- **非推奨:**

    - **定義:** この機能はZilliz Cloudから完全に削除されており、アクセスもサポートもされなくなりました。

    - **アクセス**: 利用不可。

## 機能の利用可能フェーズを特定する方法\{#how-to-identify-a-features-availability-phase}

各機能の利用可能フェーズは、Zilliz Cloudドキュメントで対応するラベルによって示されます。特に明記されていない限り、機能は一般提供されていると見なされます。

## 現在の機能の可用性\{#current-feature-availability}

### プライベートプレビュー\{#private-preview}

- [抽出、変換、ロード (ETL)](/reference/restful/merge-data-v2)

- [ゼロダウンタイム移行](./zero-downtime-migration)

- [バックアップファイルのエクスポート](./export-backup-files)

- [ホスト型モデル](./hosted-models)

<Admonition type="info" icon="📘" title="Notes">

<p>これらの機能へのアクセスをリクエストするには、<a href="http://support.zilliz.com">Zillizサポート</a>にお問い合わせください。</p>

</Admonition>

### パブリックプレビュー\{#public-preview}

- [埋め込み](./model-based-functions)および[再ランク付け](./reranking)機能

<Admonition type="info" icon="📘" title="Notes">

<p>これらの機能にアクセスするには、クラスターのMilvusバージョンをアップグレードしてください。</p>

</Admonition>

### 非推奨通知\{#deprecation-notice}

- [NumPyファイルからのデータインポート](./data-import-numpy)

- [RESTful API (V1)](/reference/restful/v1)

### 非推奨\{#deprecated}

- パイプライン

