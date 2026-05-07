---
title: "プランの詳細比較 | Cloud"
slug: /select-zilliz-cloud-service-plans
sidebar_key: select-zilliz-cloud-service-plans
sidebar_label: "プラン比較"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、多様な要件に対応する幅広いプロジェクトプランを提供しています。ベクトルデータベースを初めて利用する方から、エンタープライズレベルのタスクに堅牢なソリューションを必要とする方まで、適切な選択により最適なパフォーマンス、スケーラビリティ、コスト効率を確保できます。このガイドでは、十分な情報に基づいた判断を行うための参考となります。"
type: origin
token: Ghq9wEiOOivgeIkmj2HcHC9onXe
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - クラスタープラン

---

import Admonition from '@theme/Admonition';


# プラン詳細比較

Zilliz Cloud は、多様な要件に対応する幅広いプロジェクトプランを提供しています。ベクトルデータベースの初心者であっても、エンタープライズレベルのタスクに堅牢なソリューションが必要な場合でも、適切な選択により最適なパフォーマンス、スケーラビリティ、コスト効率を確保できます。このガイドでは、十分な情報に基づいた意思決定を支援します。

## プラン概要\{#plan-overview}

Zilliz Cloud は、提供サービスを5つの異なるプランに分類しています。

- **Standard:** Standard プランは、非クリティカルなワークロード向けに設計されています。プロトタイプやテスト環境に最適です。詳細については、[Zilliz Cloud 料金](https://zilliz.com/pricing) を参照してください。

- **Enterprise:** Enterprise プランは、エンタープライズグレードの信頼性と制御機能を提供します。本番アプリケーションに最適です。詳細については、[Zilliz Cloud 料金](https://zilliz.com/pricing) を参照してください。

- **ビジネスクリティカル**: ビジネスクリティカル プランは、規制対応が完了しており、最大限の耐障害性を備えています。医療、金融、ミッションクリティカルなシステムに最適です。ビジネスクリティカル プランを選択するには、[営業部門にお問い合わせ](http://zilliz.com/contact-sales) ください。

- **Bring Your Own Cloud (BYOC):** BYOC プランは、カスタムインフラストラクチャ、強化されたデータ保護、およびコンプライアンスを優先する組織向けに設計されています。SaaS Dedicated クラスターと同じ機能と体験を提供します。BYOC プランを選択するには、[営業部門にお問い合わせ](http://zilliz.com/contact-sales) ください。

## プラン比較\{#plan-comparison}

以下のセクションでは、プランとデプロイメントオプションを比較し、各プランで利用可能な特定の機能について詳しく説明します。

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
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a>を参照してください。</p></td>
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a>を参照してください。</p></td>
     <td><p>AWS, GCP, Azure</p><p>詳細については、<a href="./cloud-providers-and-regions">クラウドプロバイダーとリージョン</a>を参照してください。</p></td>
     <td><p>ユーザーの VPC</p></td>
   </tr>
   <tr>
     <td><p>クエリ CU 数 </p></td>
     <td><p>シングルクエリ CU</p></td>
     <td><p>自動スケール。設定不要</p></td>
     <td><ul><li><p>最大 32 クエリ CU。（Web UI で最大 32 クエリ CU のクラスターを直接作成できます。それ以上のクエリ CU が必要な場合は、<a href="https://zilliz.com/contact-sales">営業部門にお問い合わせ</a>ください。</p></li><li><p>増分: 1, 2, 4, 8, 12, 16, 20, 24, 28, 32。</p></li></ul></td>
     <td><ul><li><p>最大 1,024 クエリ CU。それ以上のクエリ CU が必要な場合は、<a href="https://zilliz.com/contact-sales">営業部門にお問い合わせ</a>ください。</p></li><li><p>増分: 1, 2, 4, 8, 12, 16, 20, 24, 28, 32,…,64, 72, 80, 88,…,256, 272, 288, …,1024 <em>(注: クエリ CU が 8 を超える場合、増分は 4 CU ずつ増加します。クエリ CU が 64 を超える場合、増分は 8 CU ずつ増加します。クエリ CU が 256 を超える場合、増分は 16 CU ずつ増加します。)</em></p></li></ul></td>
     <td><ul><li><p>最大 256 クエリ CU。それ以上のクエリ CU が必要な場合は、<a href="https://zilliz.com/contact-sales">営業部門にお問い合わせ</a>ください。</p></li><li><p>増分: 1, 2, 4, 8, 12, 16, 20, 24, 28, 32,…,64, 72, 80, 88,…,256, 272, 288, …,1024 <em>(注: クエリ CU が 8 を超える場合、増分は 4 CU ずつ増加します。クエリ CU が 64 を超える場合、増分は 8 CU ずつ増加します。クエリ CU が 256 を超える場合、増分は 16 CU ずつ増加します。)</em></p></li></ul></td>
     <td><p>カスタマイズ可能</p></td>
   </tr>
   <tr>
     <td><p><a href="./scale-query-cu">コンピューティングスケーリング</a></p></td>
     <td></td>
     <td><p>システム管理の自動スケーリング</p><p>（設定不要）</p></td>
     <td><p>手動スケーリングで</p><p>32 CU まで</p></td>
     <td><p>設定可能な自動スケーリング</p><p>手動スケーリングで 1,024 CU 以上</p></td>
     <td><p>設定可能な自動スケーリング</p><p>手動スケーリングで 1,024 CU 以上</p></td>
     <td><p>設定可能な自動スケーリング</p><p>手動スケーリングで 1,024 CU 以上</p></td>
   </tr>
   <tr>
     <td><p><a href="./cu-types-explained">クラスタータイプ</a> オプション</p></td>
     <td></td>
     <td></td>
     <td><p>3 オプション:</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li><li><p>階層型ストレージ CU</p></li></ul></td>
     <td><p>3 オプション:</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li><li><p>階層型ストレージ CU</p></li></ul></td>
     <td><p>3 オプション:</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li><li><p>階層型ストレージ CU</p></li></ul></td>
     <td><p>2 オプション</p><ul><li><p>パフォーマンス最適化済み CU</p></li><li><p>容量最適化済み CU</p></li></ul></td>
   </tr>
   <tr>
     <td><p>最大コレクション数</p></td>
     <td><p>5 コレクション</p></td>
     <td><p>クラスターあたり 10 コレクション。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud 制限</a>を参照してください。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud 制限</a>を参照してください。</p></td>
     <td><p>詳細については、<a href="./limits#collections">Zilliz Cloud 制限</a>を参照してください。</p></td>
     <td><p>カスタマイズ可能</p></td>
   </tr>
   <tr>
     <td><p>稼働時間 SLA</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>99.95%</p></td>
     <td><p>99.99%（マルチレプリカが有効な場合）</p></td>
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
     <td><p>可用性ゾーン</p></td>
     <td></td>
     <td><p>シングル</p></td>
     <td><p>シングル</p></td>
     <td><p>マルチ</p></td>
     <td><p>マルチ</p></td>
     <td><p>マルチ</p></td>
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
     <td><p><a href="./offline-migration">クラスター間マイグレーション</a></p></td>
     <td></td>
     <td><p>Free クラスターから</p></td>
     <td><p>✔</p></td>
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
     <td><p><a href="null">ステージ</a></p></td>
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
     <td><p>カスタマー管理の暗号化キー (CMEK)</p></td>
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
     <td><p><a href="./backup-to-other-regions">クロスリージョンバックアップ</a></p></td>
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
     <td><p><a href="./setup-a-private-link">プライベートネットワーク</a></p></td>
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

### オブザーバビリティ\{#observability}

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
     <td><p><a href="./view-cluster-metric-charts">きめ細かいメトリクスとリアルタイムモニタリングダッシュボード</a></p></td>
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
     <td><p><a href="./integrate-with-third-parties">アラートおよびモニタリング統合</a></p></td>
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
     <td><p><a href="/reference/python">複数のプログラミング言語に対応したユーザーフレンドリーな SDK</a>（Python、Java、Go、および Node.js SDK）</p></td>
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
     <td colspan="2"><p>オンコール対応</p></td>
     <td></td>
     <td><p>営業時間内</p></td>
     <td><p>営業時間内</p></td>
     <td><p>24/7/365</p></td>
     <td><p>24/7/365</p></td>
     <td></td>
   </tr>
   <tr>
     <td rowspan="4"><p>初回対応 SLA</p></td>
     <td><p>緊急</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>30 分オンコール</p></td>
     <td></td>
   </tr>
   <tr>
     <td><p>緊急</p></td>
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
     <td><p>Eメール/チケットポータル</p></td>
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
     <td><p>ライブコンサルテーション</p></td>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     <td><p>✔</p></td>
     <td><p>✔</p></td>
   </tr>
</table>

