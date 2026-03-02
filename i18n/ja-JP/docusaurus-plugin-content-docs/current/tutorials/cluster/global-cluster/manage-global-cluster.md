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
  - cloud
  - milvus
  - グローバルクラスター
  - Agentic RAG
  - rag llm architecture
  - private llms
  - nn search

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# グローバルクラスターの管理

このガイドでは、グローバルクラスターを管理する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Business Critical</strong>プロジェクトの<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## 開始する前に{#before-you-start}

- プロジェクト管理者であることを確認してください。

- プライマリークラスターとセカンダリークラスターの両方を一時停止することはできません。

## クラスターの状態を監視する{#monitor-cluster-status}

プライマリークラスターとセカンダリークラスターの状態、およびデータレプリケーションの状態を監視できます。

<table>
   <tr>
     <th><p><strong>クラスターの状態</strong></p></th>
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
     <td><p>Zilliz Cloudは、プライマリークラスターとセカンダリークラスターの間でプライマリーの役割を切り替えています。</p></td>
   </tr>
   <tr>
     <td><p><strong>FENCED</strong></p></td>
     <td><p>スイッチオーバーまたはフェイルオーバー後、元のプライマリークラスターは「Fenced」状態になり、すべての書き込みリクエストを拒否します。</p></td>
   </tr>
   <tr>
     <td><p><strong>REBUILDING</strong></p></td>
     <td><p>グローバルクラスターを復元すると、そのすべての元のセカンダリークラスターは「Rebuilding」状態に移行します。</p></td>
   </tr>
</table>

## スイッチオーバー{#switchover}

計画的なリージョンローテーションのために、スイッチオーバーを実行してセカンダリークラスターをプライマリーロールに昇格させることができます。

ボタンをクリックすると、古いプライマリークラスターと新しいプライマリークラスター間のデータが完全に同期されたときにスイッチオーバーが行われます。

以下のデモは、スイッチオーバーを実行する方法を示しています。

<Supademo id="cmkauk6rl1hqrke4xpnketcbq" title=""  />

## セカンダリークラスターの追加{#add-secondary-clusters}

リージョンカバレッジを向上させるために、既存のグローバルクラスターに異なるリージョンの追加のセカンダリークラスターを追加できます。

<Admonition type="info" icon="📘" title="Notes">

<p>グローバルクラスターは、最大5つのセカンダリークラスターしか持つことができません。</p>

</Admonition>

以下のデモは、セカンダリークラスターを追加する方法を示しています。

<Supademo id="cmkat4dkp1h55ke4xyc8i7c9y" title=""  />

## セカンダリークラスターの削除{#drop-secondary-cluster}

グローバルクラスター内のすべてのセカンダリークラスターを削除すると、通常の非グローバルクラスターに戻ります。クラスターを削除する方法の詳細については、「[クラスターの管理](./manage-cluster#drop-cluster)」を参照してください。

