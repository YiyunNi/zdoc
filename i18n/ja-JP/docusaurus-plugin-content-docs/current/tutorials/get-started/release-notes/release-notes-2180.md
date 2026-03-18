---
title: "リリースノート (2025年7月15日) | Cloud"
slug: /release-notes-2180
sidebar_label: "2025年7月15日"
beta: FALSE
notebook: FALSE
description: "今回のリリースでは、Zilliz Cloud は運用効率、柔軟性、ユーザーエクスペリエンスの向上を目的とした、いくつかの強力な機能強化を導入しました。これには、クラスターレベルのスケジュールされた自動スケーリングのサポート、新しいMerge Data APIを介したスキーマ進化、合理化されたデータ取り込みのためのクラウドネイティブなデータ層であるステージの導入、クロスデータベース選択によるクラスターレベルのバックアップからの部分的な復元、およびJSON PathインデックスのUIサポートが含まれます。これらの機能は、GenAI時代において、ユーザーが複雑なワークロードをより効果的に管理し、メンテナンスのオーバーヘッドを削減し、開発サイクルを加速することを可能にします。 | Cloud"
type: origin
token: WBONwyqFAi02DTkCG41c93wCn6e
sidebar_position: 8
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2025年7月15日)

今回のリリースでは、Zilliz Cloud は運用効率、柔軟性、ユーザーエクスペリエンスの向上を目的とした、いくつかの強力な機能強化を導入します。これには、クラスターレベルのスケジュールされたオートスケーリングのサポート、新しいMerge データ APIによるスキーマ進化、合理化されたデータ取り込みのためのクラウドネイティブなデータレイヤーであるステージの導入、クロスデータベース選択によるクラスターレベルのバックアップからの部分復元、およびJSONパスインデックスのUIサポートが含まれます。これらの機能は、GenAI時代において、ユーザーが複雑なワークロードをより効果的に管理し、メンテナンスのオーバーヘッドを削減し、開発サイクルを加速することを可能にします。

## Milvus互換性\{#milvus-compatibility}

このリリース以降に作成されたすべてのZilliz Cloudクラスターは、**Milvus v2.5.x**と互換性があり、Milvus v2.5.xのすべての機能は**一般提供**されています。

機能の利用可能性の詳細については、[現在の機能の利用可能性](./feature-availability#current-feature-availability)を参照してください。

## Merge データ APIによるスキーマ進化 | プライベート\{#schema-evolution-via-merge-data-api}

GenAI時代では、ビジネスロジックの迅速な反復により、これまで以上に頻繁なスキーマ変更が求められますが、それらは依然としてコストがかかり、運用が複雑です。スキーマを更新することは、多くの場合、コレクションの再構築を意味します。つまり、データをエクスポートし、新しいフィールドをマージし、すべてを最初から再インポートすることです。この手動プロセスは時間がかかり、エラーが発生しやすく、多くの場合、長時間の書き込みダウンタイムが必要です。

この課題に対処するため、Zillizは自動スキーマ進化のための新しい**バッチETL機能**を導入します。このリリースの一環として、ETLサービスの下に新しい**Merge データ RESTful API**が追加され、ユーザーは単一のAPI呼び出しで大規模なスキーマ更新を実行できるようになります。このAPIを使用すると、既存のコレクション（ベース）を外部ファイル（プライマリキーと新しいフィールドを含む）とマージして、更新されたスキーマを持つ新しいコレクション（ターゲット）を生成できます。検証後、ユーザーはエイリアスを更新するだけで、最小限の混乱で切り替えることができます。

内部的には、Merge データ APIは、分散バッチ処理エンジンとステージ、バックアップ、結合、インポートを単一の操作に統合します。ユーザーは各ステップを手動で調整する必要がなくなります。データ検証からインポートまでのプロセス全体が自動的に処理されます。これにより、運用上の負担が劇的に軽減され、スキーマ更新が**日単位ではなく時間単位**で完了できるようになります。

<Admonition type="info" icon="📘" title="Notes">

<p>マージプロセス中、データの一貫性を確保するために、ベースコレクションへの書き込みを一時停止する必要があります。</p>

</Admonition>

この機能は現在**プライベートプレビュー**です。アカウントで有効にするには、[サポートにお問い合わせください](https://support.zilliz.com/hc/en-us)。関連するRESTful APIリファレンスページについては、[Merge データ](/reference/restful/merge-data-v2)を参照してください。

## ステージの紹介：Zilliz Cloudのデータレイヤー | プライベート\{#introducing-stage-the-data-layer-of-zilliz-cloud}

**ステージ**は、まったく新しい機能であり、**Zilliz Cloudの基盤となるデータレイヤー**です。

ステージは、非構造化データのためのマネージドなクラウドネイティブなステージングエリアを提供します。これは、スケーラブルなデータ移動をサポートするために特別に構築されており、ベクトルクラスターへのデータのアップロード、キャッシュ、準備を含み、Zillizサービス全体でETLワークフローのための統合レイヤーとして機能します。

この初期リリース（**プライベートプレビュー**）では、ユーザーは次のことができます。

- RESTful APIを介して**ステージを管理**する（[作成](/reference/restful/create-volume-v2)、[リスト](/reference/restful/list-volumes-v2)、[削除](/reference/restful/delete-volume-v2)を含む）

- **ステージを共有ステージングレイヤーとして使用**して、**移行**と**インポート**の両方のサービスでデータオンボーディングを合理化する：

    - **移行**: ローカルMilvus環境からZilliz Cloudへのデータを単一のステップでシームレスに移行します。以前は、ユーザーは手動でバックアップを作成し、ファイルをS3にアップロードし、インポートジョブを個別にトリガーする必要がありました。ステージを使用すると、プロセスが統合され、高速になり、エラーがはるかに少なくなります。詳細については、[ステージを介したMilvusからZilliz Cloudへの移行](./via-stage)を参照してください。

    - **インポート**: インポートジョブはステージをステージングバックエンドとして受け入れるようになり、オブジェクトストレージへの依存を減らし、トークンの有効期限切れを回避し、直接クラウドストレージアクセスを持たないユーザーがZilliz Cloudにデータを簡単に移動できるようにします。詳細については、[インポートジョブの作成](/reference/restful/create-import-jobs-v2)を参照し、**リクエストボディ**で**Use ステージ**を選択してください。

ステージは、バックアップ、インポート、ETLサービスなどの追加サービスとまもなく統合され、Zilliz Cloud内での非構造化データ処理、データ共有、パイプライン駆動型ワークロードのサポートを拡張します。

この機能は現在**プライベートプレビュー**です。アカウントで有効にするには、[サポートにお問い合わせください](https://support.zilliz.com/hc/en-us)。

## スケジュールされたクラスターのスケーリングが利用可能になりました\{#scheduled-cluster-scaling-now-available}

Zilliz Cloudは、**クラスターレベル**での**スケジュールされたスケーリング**をサポートするようになり、予測可能なワークロードパターンに基づいてリソース割り当てを事前に制御できるようになりました。

![EKkTb21RooyES7x1alDcKL66nyh](https://zdoc-images.s3.us-west-2.amazonaws.com/ekktb21rooyes7x1aldckl66nyh.png "EKkTb21RooyES7x1alDcKL66nyh")

- **CUとレプリカのスケジュールベースのオートスケーリング:** CUとレプリカを自動的にスケーリングするための特定のスケジュールを定義できるようになりました。営業時間中のピークトラフィックを処理するためにリソースを簡単にスケールアップし、夜間や週末などの静かな期間にはスケールダウンして、手動介入なしでコストを最適化できます。

- **可視性と制御の強化:** このアップデートにより、スケーリングスケジュールの視覚的な表現が導入され、オートスケーリング構成の透明性が向上します。

- **プロアクティブな監査:** リソースの提供とコストに関する安心感を提供する、透明性の高いメール通知システムと監査証跡を提供します。

詳細については、[クラスターのオートスケーリング](./scale-query-cu)を参照してください。

## クロスデータベース選択によるクラスターレベルのバックアップからの部分復元\{#partial-restore-from-cluster-level-backups-with-cross-database-selection}

**クラスターレベルのバックアップ**から特定の**データベース**と**コレクション**を選択的に復元できるようになりました。これには、複数のデータベースにまたがるコレクションも含まれます。この機能強化により、回復時間が短縮され、クラスター全体を回復することなく、復元するデータをきめ細かく制御できます。

![Sd5PbeR5poupNlx6nM6cCrdxnTd](https://zilliz-cloud-docs-images.s3.us-west-2.amazonaws.com/sd5pber5poupnlx6nm6ccrdxntd.png "Sd5PbeR5poupNlx6nM6cCrdxnTd")

詳細については、[部分的なクラスターの復元](./restore-from-snapshot#restore-a-partial-cluster)を参照してください。

## Zilliz CloudコンソールでJSONパスインデックスを作成する\{#create-json-path-indexes-on-zilliz-cloud-console}

Zilliz Cloudは、Webコンソールから直接JSONパスインデックスを作成できるようになり、半構造化データに対するクエリを高速化することが容易になりました。この機能は、JSONフィールドと動的フィールドの両方をサポートし、柔軟で高性能なフィルタリングを実現します。

![PDbobfoUDolZd4xKR8kcDXqIn0f](https://zdoc-images.s3.us-west-2.amazonaws.com/pdbobfoudolzd4xkr8kcdxqin0f.png "PDbobfoUDolZd4xKR8kcDXqIn0f")

JSONパスインデックスの詳細については、[JSONフィールド内の値のインデックス作成](./use-json-fields)および[動的フィールド内のキーのインデックス作成](./enable-dynamic-field#index-keys-in-the-dynamic-field)を参照してください。

## BYOCプロジェクトインスタンスクォータ設定が利用可能になりました\{#byoc-project-instance-quota-settings-now-available}

**Zilliz Cloudは、BYOCプロジェクトのカスタムインスタンスクォータ設定をサポートするようになりました。**このアップデートにより、柔軟性が向上し、サービスのリソース境界を明確に定義することでコストを最適化できます。

![OHwLbK4X5odr2gxJ6LicTawHn3f](https://zdoc-images.s3.us-west-2.amazonaws.com/ohwlbk4x5odr2gxJ6LicTawHn3f.png "OHwLbK4X5odr2gxJ6LicTawHn3f")

- **プロジェクトリソースのオートスケーリング制御:** 弾力的なリソースモードと固定リソースモードを簡単に切り替えられるようになりました。最小インスタンス数と最大インスタンス数を設定して弾力性を有効にするか、サービスグループのリソースを固定サイズにロックします。

- **動的な構成:** コンソールのプロジェクトステータスページからノードグループのリソースとクォータを直接表示および調整できるようになり、実行中のプロジェクトのリソース割り当てを簡単に変更できます。

- **独立したインデックスサービスクォータ:** Zilliz Cloudは、インデックスノードグループのリソースクォータを個別に設定できるようになり、異なるワークロードパターンに合わせてパフォーマンスとリソース割り当てを微調整できます。

詳細については、[AWSへのBYOCのデプロイ](/docs/byoc/deploy-byoc-aws)、[AWSへのBYOC-Iのデプロイ](/docs/byoc/deploy-byoc-i-aws)、および[GCPへのBYOCのデプロイ](/docs/byoc/deploy-byoc-gcp)を参照してください。

## その他の機能強化\{#other-enhancements}

- クラスターレベルのバックアップ復元を実行する際に、RBAC構成を復元するかどうかを選択できるようになりました。

    ![KNJ8bzQaroYqzWxsgUhcjduAn7c](https://zdoc-images.s3.us-west-2.amazonaws.com/knj8bzqaroyqzwxsguhcjduan7c.png "KNJ8bzQaroYqzWxsgUhcjduAn7c")

    <Admonition type="info" icon="📘" title="Notes">

    <p>この設定は、新しく作成されたバックアップにのみ適用されます。</p>

    </Admonition>

- **プライベートプレビュー**および**パブリックプレビュー**の機能を使用する前に、それらについて学ぶことができます。これらの機能を使用するには、[Zilliz Cloudサポート](https://support.zilliz.com/hc/en-us)にお問い合わせください。

    ![JFjPbrK00oEVsvx4kntc101Snfb](https://zdoc-images.s3.us-west-2.amazonaws.com/jfjpbrk00oevsvx4kntc101snfb.png "JFjPbrK00oEVsvx4kntc101Snfb")

- インポートリクエストあたりの合計ファイルサイズが100GBから1TBに増加しました。

- 手動で作成されたバックアップの保持期間は、組織が凍結された後、永続的ではなく30日間に変更され、ストレージコストの節約に役立ちます。

