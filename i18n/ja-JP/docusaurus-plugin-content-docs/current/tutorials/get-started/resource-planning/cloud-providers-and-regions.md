---
title: "クラウドプロバイダーとリージョン | Cloud"
slug: /cloud-providers-and-regions
sidebar_label: "クラウドプロバイダーとリージョン"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、パブリッククラウド上でベクトルデータベースクラスターを提供するクラウドベースのサービスです。当社のサービスを利用すると、選択したパブリッククラウドプラットフォーム上に独自のベクトルデータベースクラスターを簡単に作成・管理できます。 | Cloud"
type: origin
token: CPLrwghdWiSvGBkdeEecGjgLnSb
sidebar_position: 5
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - プロバイダー
  - リージョン
  - LLMs
  - 機械学習
  - RAG
  - NLP

---

import Admonition from '@theme/Admonition';


# クラウドプロバイダーとリージョン

Zilliz Cloudは、パブリッククラウド上でベクターデータベースクラスターを提供するクラウドベースのサービスです。当社のサービスを利用すると、選択したパブリッククラウドプラットフォーム上で独自のベクターデータベースクラスターを簡単に作成および管理できます。

Zilliz Cloudは、Amazon Web Services (AWS)、Google Cloud Platform (GCP)、およびMicrosoft Azureのさまざまなリージョンでクラスターを提供しています。新しいリージョンをリクエストするには、[お問い合わせ](https://zilliz.com/cloud-region-request?)ください。

## AWS\{#aws}

Zilliz Cloudは、AWS上での無料、サーバーレス、および専用クラスターのデプロイをサポートしています。

<table>
   <tr>
     <th><p><strong>大陸</strong></p></th>
     <th><p><strong>リージョン</strong></p></th>
     <th><p><strong>場所</strong></p></th>
     <th><p><strong>無料クラスター</strong></p></th>
     <th><p><strong>サーバーレスクラスター</strong></p></th>
     <th><p><strong>専用クラスター</strong></p></th>
   </tr>
   <tr>
     <td rowspan="4"><p>北米</p></td>
     <td><p>us-east-1</p></td>
     <td><p>N. Virginia, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>us-east-2</p></td>
     <td><p>Ohio, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>us-west-2</p></td>
     <td><p>Oregon, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>ca-central-1</p></td>
     <td><p>カナダ (中央)</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>ヨーロッパ</p></td>
     <td><p>eu-central-1</p></td>
     <td><p>フランクフルト, ドイツ</p></td>
     <td><p>はい</p></td>
     <td><p>はい</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td rowspan="2"><p>アジア</p></td>
     <td><p>ap-northeast-1</p></td>
     <td><p>東京, 日本</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>ap-southeast-1</p></td>
     <td><p>シンガポール</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>オセアニア</p></td>
     <td><p>ap-southeast-2</p></td>
     <td><p>シドニー, オーストラリア</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
</table>

クラスタータイプに関する詳細については、[クラスタープランの選択](./select-zilliz-cloud-service-plans)を参照してください。

## GCP\{#gcp}

無料、サーバーレス、および専用クラスターはGCPにデプロイできます。

<table>
   <tr>
     <th><p><strong>大陸</strong></p></th>
     <th><p><strong>リージョン</strong></p></th>
     <th><p><strong>場所</strong></p></th>
     <th><p><strong>無料クラスター</strong></p></th>
     <th><p><strong>サーバーレスクラスター</strong></p></th>
     <th><p><strong>専用クラスター</strong></p></th>
   </tr>
   <tr>
     <td rowspan="3"><p>北米</p></td>
     <td><p>us-west1</p></td>
     <td><p>オレゴン, USA</p></td>
     <td><p>はい</p></td>
     <td><p>はい</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>us-east4</p></td>
     <td><p>バージニア, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>us-central1</p></td>
     <td><p>アイオワ, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>ヨーロッパ</p></td>
     <td><p>europe-west3</p></td>
     <td><p>フランクフルト, ドイツ</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>アジア</p></td>
     <td><p>asia-southeast1</p></td>
     <td><p>シンガポール</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
</table>

クラスタータイプに関する詳細については、[クラスタープランの選択](./select-zilliz-cloud-service-plans)を参照してください。

## Microsoft Azure\{#microsoft-azure}

Zilliz Cloudは、Microsoft Azure上での専用クラスターのデプロイをサポートしています。

<table>
   <tr>
     <th><p><strong>大陸</strong></p></th>
     <th><p><strong>リージョン</strong></p></th>
     <th><p><strong>場所</strong></p></th>
     <th><p><strong>無料クラスター</strong></p></th>
     <th><p><strong>サーバーレスクラスター</strong></p></th>
     <th><p><strong>専用クラスター</strong></p></th>
   </tr>
   <tr>
     <td rowspan="3"><p>北米</p></td>
     <td><p>East US</p></td>
     <td><p>バージニア, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>East US 2</p></td>
     <td><p>バージニア, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>Central US</p></td>
     <td><p>アイオワ, USA</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td rowspan="2"><p>ヨーロッパ</p></td>
     <td><p>Germany West Central</p></td>
     <td><p>フランクフルト, ドイツ</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>North Europe</p></td>
     <td><p>アイルランド</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
   <tr>
     <td><p>アジア</p></td>
     <td><p>Central India</p></td>
     <td><p>プネ, インド</p></td>
     <td><p>いいえ</p></td>
     <td><p>いいえ</p></td>
     <td><p>はい</p></td>
   </tr>
</table>

クラスタープランに関する詳細については、[適切なクラスタープランの選択](./select-zilliz-cloud-service-plans)を参照してください。

## 関連トピック\{#related-topics}

- [適切なクラスタープランの選択](./select-zilliz-cloud-service-plans)

- [適切なCUの選択](./cu-types-explained)

