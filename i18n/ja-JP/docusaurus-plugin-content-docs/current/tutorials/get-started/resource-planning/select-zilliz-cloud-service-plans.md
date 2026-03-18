---
title: "詳細プラン比較 | Cloud"
slug: /select-zilliz-cloud-service-plans
sidebar_label: "プラン比較"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、多様なニーズに対応するさまざまなプロジェクトプランを提供しています。ベクトルデータベースを初めて利用する場合でも、エンタープライズレベルのタスクに対応する堅牢なソリューションが必要な場合でも、適切な選択を行うことで、最適なパフォーマンス、スケーラビリティ、コスト効率を実現できます。このガイドは、情報に基づいた意思決定をサポートします。| Cloud"
type: origin
token: Ghq9wEiOOivgeIkmj2HcHC9onXe
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスタープラン

---

import Admonition from '@theme/Admonition';


# 詳細なプラン比較

Zilliz Cloud は、多様な要件に対応するさまざまなプロジェクトプランを提供しています。ベクトルデータベースを初めて利用する場合でも、エンタープライズレベルのタスクに堅牢なソリューションが必要な場合でも、適切な選択を行うことで、最適なパフォーマンス、スケーラビリティ、コスト効率を確保できます。このガイドは、情報に基づいた意思決定をサポートします。

## プランの概要\{#plan-overview}

Zilliz Cloud は、その提供内容を 5 つの異なるプランに分類しています。

- **Standard:** Standard プランは、重要度の低いワークロード向けに設計されています。プロトタイプやテスト環境に最適です。詳細については、[Zilliz Cloud の料金](https://zilliz.com/pricing) をご覧ください。

- **Enterprise:** Enterprise プランは、エンタープライズグレードの信頼性と制御機能を提供します。本番アプリケーションに最適です。詳細については、[Zilliz Cloud の料金](https://zilliz.com/pricing) をご覧ください。

- **ビジネスクリティカル**: ビジネスクリティカル プランは、規制対応可能で最大限の回復力を備えています。医療、金融、ミッションクリティカルなシステムに最適です。ビジネスクリティカル プランを選択するには、[営業担当にお問い合わせください](http://zilliz.com/contact-sales)。

- **Bring Your Own Cloud (BYOC):** BYOC プランは、カスタムインフラストラクチャ、強化されたデータ保護、コンプライアンスを優先する組織向けに設計されています。SaaS Dedicated クラスターと同じ機能とエクスペリエンスを提供します。BYOC プランを選択するには、[営業担当にお問い合わせください](http://zilliz.com/contact-sales)。

## プラン比較\{#plan-comparison}

以下のセクションでは、各プランとデプロイメントオプションを比較し、各プランで利用可能な特定の機能について詳述します。

### デプロイメント\{#deployment}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
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
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a> を参照してください。</p></td>
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a> を参照してください。</p></td>
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a> を参照してください。</p></td>
     <td><p>ユーザーの VPC</p></td>
   </tr>
   <tr>
     <td><p>クエリ CU 数 </p></td>
     <td><p>単一クエリ CU</p></td>
     <td><p>自動スケーリング。設定不要</p></td>
     <td><ul><li><p>最大 32 クエリ CU。（Web UI で直接 32 クエリ CU 以下のクラスターを作成できます。それ以上のクエリ CU については、<a href="https://zilliz.com/contact-sales">営業担当にお問い合わせください</a>。）</p></li><li><p>増分：1, 2, 4, 8, 12, 16, 20, 24, 28, 32。</p></li></ul></td>
     <td><ul><li><p>最大 1,024 クエリ CU。それ以上のクエリ CU については、<a href="https://zilliz.com/contact-sales">営業担当にお問い合わせください</a>。</p></li><li><p>増分：1, 2, 4, 8, 12, 16, 20, 24, 28, 32,…,64, 72, 80, 88,…,256, 272, 288, …,1024 <em>(注：クエリ CU が 8 より大きい場合、増分は 4 CU になります。クエリ CU が 64 より大きい場合、増分は 8 CU になります。クエリ CU が 256 より大きい場合、増分は 16 CU になります。)</em></p></li></ul></td>
     <td><ul><li><p>最大 256 クエリ CU。それ以上のクエリ CU については、<a href="https://zilliz.com/contact-sales">営業担当にお問い合わせください</a>。</p></li><li><p>増分：1, 2, 4, 8, 12, 16, 20, 24, 28, 32,…,64, 72, 80, 88,…,256, 272, 288, …,1024 <em>(注：クエリ CU が 8 より大きい場合、増分は 4 CU になります。クエリ CU が 64 より大きい場合、増分は 8 CU になります。クエリ CU が 256 より大きい場合、増分は 16 CU になります。)</em></p></li></ul></td>
     <td><p>カスタマイズ可能</p></td>
   </tr>
   <tr>
     <td><p><a href="./scale-query-cu">コンピューティングのスケーリング</a></p></td>
     <td></td>
     <td><p>システム管理による自動スケーリング</p><p>(設定不要)</p></td>
     <td><p>手動スケーリング</p><p>32 CU まで</p></td>
     <td><p>設定可能な自動スケーリング</p><p>1,024 CU 以上への手動スケーリング</p></td>
     <td><p>設定可能な自動スケーリング</p><p>1,024 CU 以上への手動スケーリング</p></td>
     <td><p>設定可能な自動スケーリング</p><p>1,024 CU 以上への手動スケーリング</p></td>
   </tr>
   <tr>
     <td><p><a href="./cu-types-explained">クラスタータイプ</a> オプション</p></td>
     <td></td>
     <td></td>
     <td><p>3 つのオプション：</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li><li><p>ティアードストレージ CU</p></li></ul></td>
     <td><p>3 つのオプション：</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li><li><p>ティアードストレージ CU</p></li></ul></td>
     <td><p>3 つのオプション：</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li><li><p>ティアードストレージ CU</p></li></ul></td>
     <td><p>2 つのオプション</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li></ul></td>
   </tr>
   <tr>
     <td><p>最大コレクション数</p></td>
     <td><p>5 コレクション</p></td>
     <td><p>クラスターあたり 10 コレクション。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud の制限</a> を参照してください。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud の制限</a> を参照してください。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud の制限</a> を参照してください。</p></td>
     <td><p>カスタマイズ可能</p></td>
   </tr>
   <tr>
     <td><p>稼働率 SLA</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>99.95%</p></td>
     <td><p>99.99% (マルチレプリカが有効な場合)</p></td>
     <td><p>99.95%</p></td>
   </tr>
</table>

### 高可用性\{#high-availability}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p>アベイラビリティーゾーン</p></td>
     <td></td>
     <td><p>単一</p></td>
     <td><p>単一</p></td>
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

### データ管理\{#data-managment}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="./offline-migration">クラスター間移行</a></p></td>
     <td></td>
     <td><p>Free クラスターから</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./zero-downtime-migration">ダウンタイムゼロ移行</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./migrate-from-external-sources">外部ソースからの移行</a></p></td>
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

### データセキュリティとコンプライアンス\{#data-security-and-compliance}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
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
     <td><p><a href="./single-sign-on">エンタープライズ SSO</a></p></td>
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
     <td><p><a href="./manage-api-keys">API キー管理</a></p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./data-security#data-encryption">転送中および保存時のデータ暗号化</a></p></td>
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
     <td><p><a href="./backup-to-other-regions">リージョン間バックアップ</a></p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./setup-whitelist">IP アドレスアクセス制御</a></p></td>
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

### 可観測性\{#observability}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="./view-cluster-metric-charts">リアルタイム監視ダッシュボードを備えたきめ細かいメトリクス</a></p></td>
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
     <td><p><a href="./integrate-with-third-parties">アラートおよび監視の統合</a></p></td>
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

### ロールベースのアクセス制御\{#role-based-access-control}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="./access-control-overview">組織およびプロジェクト RBAC</a></p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="./access-control">データプレーン RBAC</a></p></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

### 統合とツール\{#integrations-and-tools}

<table>
   <tr>
     <th></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td><p><a href="/reference/restful">コントロールプレーンおよびデータプレーン操作のための直感的な RESTful API</a></p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p><a href="/reference/python">複数のプログラミング言語に対応した使いやすい SDK</a> (Python、Java、Go、Node.js SDK)</p></td>
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

### テクニカルサポート\{#technical-support}

<table>
   <tr>
     <th colspan="2"></th>
     <th><p><strong>Free</strong></p></th>
     <th><p><strong>Serverless</strong></p></th>
     <th><p><strong>Dedicated (Standard)</strong></p></th>
     <th><p><strong>Dedicated (Enterprise)</strong></p></th>
     <th><p><strong>Dedicated (ビジネスクリティカル)</strong></p></th>
     <th><p><strong>Bring Your Own Cloud (BYOC)</strong></p></th>
   </tr>
   <tr>
     <td colspan="2"><p>オンコール対応時間</p></td>
     <td></td>
     <td><p>営業時間内</p></td>
     <td><p>営業時間内</p></td>
     <td><p>24/7/365</p></td>
     <td><p>24/7/365</p></td>
     <td></td>
   </tr>
   <tr>
     <td rowspan="4"><p>初回応答 SLA</p></td>
     <td><p>緊急</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>オンコール 30 分</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>重要</p></td>
     <td></td>
     <td><p>4 時間</p></td>
     <td><p>4 時間</p></td>
     <td><p>1 時間</p></td>
     <td><p>1 時間</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>高</p></td>
     <td></td>
     <td><p>1 営業日</p></td>
     <td><p>1 営業日</p></td>
     <td><p>4 時間</p></td>
     <td><p>4 時間</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>中/通常</p></td>
     <td></td>
     <td><p>2 営業日</p></td>
     <td><p>2 営業日</p></td>
     <td><p>1 営業日</p></td>
     <td><p>1 営業日</p></td>
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
     <td><p>E メール/チケットポータル</p></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
   <tr>
     <td><p>Slack チャンネル</p></td>
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
     <td><p>専任サポートエンジニア</p></td>
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
     <td><p>ライブ相談</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

