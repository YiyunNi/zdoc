---
title: "詳細なプラン比較 | Cloud"
slug: /select-zilliz-cloud-service-plans
sidebar_label: "プラン比較"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、多様な要件に対応するさまざまなプロジェクトプランを提供しています。ベクトルデータベースを初めて利用する方でも、エンタープライズレベルのタスクに堅牢なソリューションを必要とする方でも、適切な選択をすることで最適なパフォーマンス、スケーラビリティ、コスト効率を確保できます。このガイドは、情報に基づいた意思決定を行うのに役立ちます。 | Cloud"
type: origin
token: Ghq9wEiOOivgeIkmj2HcHC9onXe
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - クラスタープラン
  - RAG
  - NLP
  - ニューラルネットワーク
  - ディープラーニング

---

import Admonition from '@theme/Admonition';


# 詳細なプラン比較

Zilliz Cloud は、多様な要件に対応するさまざまなプロジェクトプランを提供しています。ベクトルデータベースの初心者であろうと、エンタープライズレベルのタスクに堅牢なソリューションを必要としようと、適切な選択をすることで、最適なパフォーマンス、スケーラビリティ、およびコスト効率が保証されます。このガイドは、情報に基づいた意思決定を行うのに役立ちます。

## プラン概要{#plan-overview}

Zilliz Cloud は、その提供物を5つの異なるプランに分類しています。

- **Standard:** Standard プランは、重要度の低いワークロード向けに調整されています。プロトタイプやテスト環境に最適です。[Zilliz Cloud Pricing](https://zilliz.com/pricing) で詳細をご覧ください。

- **Enterprise:** Enterprise プランは、エンタープライズグレードの信頼性と制御を提供します。本番アプリケーションに最適です。[Zilliz Cloud Pricing](https://zilliz.com/pricing) で詳細をご覧ください。

- **Business Critical**: Business Critical プランは、最高の回復力を備えた規制対応型です。ヘルスケア、金融、ミッションクリティカルなシステムに最適です。Business Critical プランを選択するには、[営業担当者にお問い合わせください](http://zilliz.com/contact-sales)。

- **Bring Your Own Cloud (BYOC):** BYOC プランは、カスタムインフラストラクチャ、強化されたデータ保護、およびコンプライアンスを優先する組織向けに設計されています。SaaS Dedicated クラスターと同じ機能とエクスペリエンスを提供します。BYOC プランを選択するには、[営業担当者にお問い合わせください](http://zilliz.com/contact-sales)。

## プラン比較{#plan-comparison}

以下のセクションでは、プランとデプロイオプションを比較し、各プランで利用可能な特定の機能を詳述します。

### デプロイメント{#deployment}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p>環境</p></td>
     <td><p>共有</p></td>
     <td><p>共有</p></td>
     <td><p>専用</p></td>
     <td><p>専用</p></td>
     <td><p>専用</p></td>
     <td><p>専用</p></td>
   </tr>
   <tr>
     <td><p><a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a></p></td>
     <td><p>AWS, GCP</p></td>
     <td><p>AWS, GCP</p></td>
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a>を参照してください。</p></td>
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a>を参照してください。</p></td>
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a>を参照してください。</p></td>
     <td><p>ユーザーのVPC</p></td>
   </tr>
   <tr>
     <td><p>クエリCU数 </p></td>
     <td><p>シングルクエリCU</p></td>
     <td><p>自動スケール。設定不要</p></td>
     <td><ul><li><p>最大32クエリCU。(Web UIで32クエリCU以下のクラスターを直接作成できます。より大きなクエリCUについては、<a href="https://zilliz.com/contact-sales">営業担当者にお問い合わせください</a>。</p></li><li><p>増分: 1, 2, 4, 8, 12, 16, 20, 24, 28, 32。</p></li></ul></td>
     <td><ul><li><p>最大1,024クエリCU。より大きなクエリCUについては、<a href="https://zilliz.com/contact-sales">営業担当者にお問い合わせください</a>。</p></li><li><p>増分: 1, 2, 4, 8, 12, 16, 20, 24, 28, 32,…,64, 72, 80, 88,…,256, 272, 288, …,1024 <em>(注: クエリCUが8より大きい場合、増分は4CUになります。クエリCUが64より大きい場合、増分は8CUになります。クエリCUが256より大きい場合、増分は16CUになります。)</em></p></li></ul></td>
     <td><ul><li><p>最大256クエリCU。より大きなクエリCUについては、<a href="https://zilliz.com/contact-sales">営業担当者にお問い合わせください</a>。</p></li><li><p>増分: 1, 2, 4, 8, 12, 16, 20, 24, 28, 32,…,64, 72, 80, 88,…,256, 272, 288, …,1024 <em>(注: クエリCUが8より大きい場合、増分は4CUになります。クエリCUが64より大きい場合、増分は8CUになります。クエリCUが256より大きい場合、増分は16CUになります。)</em></p></li></ul></td>
     <td><p>カスタマイズ可能</p></td>
   </tr>
   <tr>
     <td><p><a href="./scale-query-cu">コンピューティングスケーリング</a></p></td>
     <td></td>
     <td><p>システム管理の自動スケーリング</p><p>(設定不要)</p></td>
     <td><p>32 CUへの手動スケーリング</p></td>
     <td><p>設定可能な自動スケーリング</p><p>1,024 CU以上への手動スケーリング</p></td>
     <td><p>設定可能な自動スケーリング</p><p>1,024 CU以上への手動スケーリング</p></td>
     <td><p>設定可能な自動スケーリング</p><p>1,024 CU以上への手動スケーリング</p></td>
   </tr>
   <tr>
     <td><p><a href="./cu-types-explained">クラスタータイプ</a>オプション</p></td>
     <td></td>
     <td></td>
     <td><p>3つのオプション:</p><ul><li><p>パフォーマンス最適化CU</p></li><li><p>容量最適化CU</p></li><li><p>階層型ストレージCU</p></li></ul></td>
     <td><p>3つのオプション:</p><ul><li><p>パフォーマンス最適化CU</p></li><li><p>容量最適化CU</p></li><li><p>階層型ストレージCU</p></li></ul></td>
     <td><p>3つのオプション:</p><ul><li><p>パフォーマンス最適化CU</p></li><li><p>容量最適化CU</p></li><li><p>階層型ストレージCU</p></li></ul></td>
     <td><p>2つのオプション</p><ul><li><p>パフォーマンス最適化CU</p></li><li><p>容量最適化CU</p></li></ul></td>
   </tr>
   <tr>
     <td><p>最大コレクション数</p></td>
     <td><p>5コレクション</p></td>
     <td><p>クラスターあたり10コレクション</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud Limits</a>を参照してください。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud Limits</a>を参照してください。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud Limits</a>を参照してください。</p></td>
     <td><p>カスタマイズ可能</p></td>
   </tr>
   <tr>
     <td><p>稼働時間SLA</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>99.95%</p></td>
     <td><p>99.99% (マルチレプリカが有効な場合)</p></td>
     <td><p>99.95%</p></td>
   </tr>
</table>

### 高可用性{#high-availability}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p>アベイラビリティゾーン</p></td>
     <td></td>
     <td><p>シングル</p></td>
     <td><p>シングル</p></td>
     <td><p>複数</p></td>
     <td><p>複数</p></td>
     <td><p>複数</p></td>
   </tr>
   <tr>
     <td><p><a href="./manage-replica">レプリカ</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>スナップショット</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>グローバルクラスター</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
</table>

### データ管理{#data-managment}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="./offline-migration">クロス・クラスター・マイグレーション</a></p></td>
     <td></td>
     <td><p>Freeクラスターから</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./zero-downtime-migration">ゼロダウンタイムマイグレーション</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-external-sources">外部ソースからのマイグレーション</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./manage-stages">ステージ</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./import-data">高速データインポート</a></p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./use-recycle-bin">ごみ箱</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

### データセキュリティとコンプライアンス{#data-security-and-compliance}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p>OAuth 2.0</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./single-sign-on">エンタープライズSSO</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>顧客管理暗号化キー (CMEK)</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p><a href="./multi-factor-auth">MFA</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./auditing">監査</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./manage-api-keys">APIキー管理</a></p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./data-security#data-encryption">転送中および保存中のデータ暗号化</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./backup-and-restore">バックアップと復元</a></p></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./backup-to-other-regions">クロスリージョンバックアップ</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./setup-whitelist">IPアドレスアクセス制御</a></p></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./setup-a-private-link">プライベートネットワーキング</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="https://zilliz.com/trust-center">SOC 2 Type II および ISO/ICE 27001 準拠、GDPR 対応</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="https://zilliz.com/trust-center">HIPPA 対応</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

### 可観測性{#observability}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="./view-cluster-metric-charts">リアルタイム監視ダッシュボードによる詳細なメトリクス</a></p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./manage-project-alerts">アラート</a></p></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./integrate-with-third-parties">アラートと監視の統合</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./job-center">ジョブセンター</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

### ロールベースのアクセス制御{#role-based-access-control}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="./access-control-overview">組織およびプロジェクトのRBAC</a></p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./access-control">データプレーンRBAC</a></p></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

### 統合とツール{#integrations-and-tools}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="/reference/restful">制御およびデータプレーン操作のための直感的なRESTful API</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="/reference/python">複数のプログラミング言語で利用可能な使いやすいSDK</a> (Python, Java, Go, および Node.js SDK)</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="https://zilliz.com/vector-transport-service">VTS (Vector Transport Service)</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="https://zilliz.com/vdbbench-leaderboard">VectorDBBench</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

### テクニカルサポート{#technical-support}

<table>
   <tr>
     <th colspan="2"></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (Business Critical)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td colspan="2"><p>オンコール対応</p></td>
     <td></td>
     <td><p>営業時間内</p></td>
     <td><p>営業時間内</p></td>
     <td><p>24時間365日</p></td>
     <td><p>24時間365日</p></td>
     <td></td>
   </tr>
   <tr>
     <td rowspan="4"><p>初回応答SLA</p></td>
     <td><p>緊急</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>30分オンコール</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>緊急</p></td>
     <td></td>
     <td><p>4時間</p></td>
     <td><p>4時間</p></td>
     <td><p>1時間</p></td>
     <td><p>1時間</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>高</p></td>
     <td></td>
     <td><p>1営業日</p></td>
     <td><p>1営業日</p></td>
     <td><p>4時間</p></td>
     <td><p>4時間</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>中/通常</p></td>
     <td></td>
     <td><p>2営業日</p></td>
     <td><p>2営業日</p></td>
     <td><p>1営業日</p></td>
     <td><p>1営業日</p></td>
     <td></td>
   </tr>
   <tr>
     <td rowspan="6"><p>サポートオプション</p></td>
     <td><p>コミュニティ</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>サポートボット</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>メール/チケットポータル</p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>Slackチャンネル</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>Zoom/Meet/Teams</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>担当サポートエンジニア</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td rowspan="4"><p>アーキテクチャガイダンス</p></td>
     <td><p>一般</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>ユースケース固有</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>コードレビュー</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>ライブコンサルテーション</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

