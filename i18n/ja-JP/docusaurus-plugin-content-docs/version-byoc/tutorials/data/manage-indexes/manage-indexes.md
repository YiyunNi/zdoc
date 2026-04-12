---
title: "インデックスの管理 | BYOC"
slug: /manage-indexes
sidebar_label: "インデックス"
beta: FALSE
notebook: FALSE
description: "SDK を使用して、ベクトルフィールドおよびスカラーフィールドのインデックスを操作する方法を学びます。| BYOC"
type: origin
token: NDLBwtFIuihc5wkq37KchzqLnrc
sidebar_position: 4
keywords: 
  - zilliz
  - vector database
  - クラウド
  - インデックス
  - 管理

sidebar_key: "data/manage-indexes"
---

import Admonition from '@theme/Admonition';


# インデックスの管理

SDK を使用してベクターおよびスカラーフィールドのインデックスを操作する方法について学びます。

<Admonition type="info" icon="📘" title="Notes">

<p>コレクションが自動的にインデックス作成およびロードされるかどうかは、コレクションの作成方法に依存します。以下のシナリオでは、コレクションは作成時に自動的にロードされます。</p>
<ul>
<li><p>コンソール上での作成時。</p></li>
<li><p><a href="/reference/create-collection">RESTful API を使用した作成時</a>。</p></li>
<li><p><a href="./manage-collections-sdks">適用可能な SDK を使用してインデックスパラメータを指定して作成した場合</a>。</p></li>
</ul>
<p>自動ロードされないコレクションを作成し、自分でインデックスの管理を開始することもできます。</p>

</Admonition>

## 目次\{#contents}

この章では、ベクターおよびスカラーフィールドにおけるコレクションのインデックスを管理する方法について説明します。

import DocCardList from '@theme/DocCardList';

<DocCardList />