---
title: "グローバルクラスターの管理 | Cloud"
slug: /manage-global-cluster
sidebar_label: "グローバルクラスターの管理"
beta: FALSE
notebook: FALSE
description: "このガイドでは、グローバルクラスターを管理する方法について説明します。 | Cloud"
type: origin
token: DW9wwFlgAiwOhBk2PgucY4URnke
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - milvus
  - グローバルクラスター

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# グローバルクラスターを管理する

このガイドでは、グローバルクラスターを管理する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>ビジネスクリティカル</strong>プロジェクトの<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## 開始する前に\{#before-you-start}

- プロジェクト管理者であることを確認してください。

- プライマリークラスターとセカンダリークラスターの両方を一時停止することはできません。

## クラスターのステータスを監視する\{#monitor-cluster-status}

プライマリークラスターとセカンダリークラスターのステータス、およびデータレプリケーションのステータスを監視できます。

<table>
   <tr>
     <th><p><strong>クラスターのステータス</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>CREATING</strong></p></td>
     <td><p>クラスターが作成中です。</p></td>
   </tr>
   <tr>
     <td><p><strong>RUNNING</strong></p></td>
     <td><p>クラスターは正常に稼働しています。</p></td>
   </tr>
   <tr>
     <td><p><strong>ABNORMAL</strong></p></td>
     <td><p>クラスターで問題が検出されました。<a href="http://support.zilliz.com">サポートにお問い合わせください</a>。</p></td>
   </tr>
   <tr>
     <td><p><strong>SWITCHING</strong></p></td>
     <td><p>Zilliz Cloudは、プライマリークラスターとセカンダリークラスター間でプライマリーの役割を切り替えています。</p></td>
   </tr>
   <tr>
     <td><p><strong>FENCED</strong></p></td>
     <td><p>スイッチオーバーまたはフェイルオーバー後、元のプライマリークラスターは「Fenced」ステータスになり、すべての書き込みリクエストを拒否します。</p></td>
   </tr>
   <tr>
     <td><p><strong>REBUILDING</strong></p></td>
     <td><p>グローバルクラスターを復元すると、そのすべての元のセカンダリークラスターは「Rebuilding」ステータスに移行します。</p></td>
   </tr>
</table>

## スイッチオーバー\{#switchover}

計画的なリージョンローテーションのために、セカンダリークラスターをプライマリーロールに昇格させるスイッチオーバーを実行できます。

ボタンをクリックすると、古いプライマリークラスターと新しいプライマリークラスター間のデータが完全に同期されたときにスイッチオーバーが実行されます。

以下のデモは、スイッチオーバーを実行する方法を示しています。

<Supademo id="cmkauk6rl1hqrke4xpnketcbq" title=""  />

## セカンダリークラスターを追加する\{#add-secondary-clusters}

リージョンカバレッジを向上させるために、既存のグローバルクラスターに異なるリージョンの追加のセカンダリークラスターを追加できます。

<Admonition type="info" icon="📘" title="Notes">

<p>グローバルクラスターは最大5つのセカンダリークラスターしか持つことができません。</p>

</Admonition>

以下のデモは、セカンダリークラスターを追加する方法を示しています。

<Supademo id="cmkat4dkp1h55ke4xyc8i7c9y" title=""  />

## プライマリークラスターをスケーリングする\{#scale-primary-cluster}

グローバルクラスターの容量を増やすには、そのプライマリークラスターのクエリCUをスケーリングできます。プライマリークラスターのクエリCUへの変更は、すべてのセカンダリークラスターに自動的に同期されます。

プライマリークラスターのクエリCUをスケーリングする方法の詳細については、「[クエリCUをスケーリングする](./scale-query-cu)」を参照してください。

現在、グローバルクラスターのレプリカスケーリングはサポートされていません。

## セカンダリークラスターを削除する\{#drop-secondary-cluster}

クラスターを削除する方法の詳細については、「[クラスターを管理する](./manage-cluster#drop-cluster)」を参照してください。

## グローバルクラスターを削除する\{#drop-global-cluster}

グローバルクラスターを削除するには、まずすべてのセカンダリークラスターを削除し、次にプライマリークラスターを削除します。グローバルクラスターはプライマリークラスターとともに自動的に削除されます。

