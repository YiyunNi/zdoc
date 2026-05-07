---
title: "インデックスの管理 | Cloud"
slug: /manage-indexes
sidebar_key: manage-indexes
sidebar_label: "インデックス"
beta: FALSE
notebook: FALSE
description: "SDK を使用してベクトルフィールドとスカラーフィールドのインデックスを操作する方法を学びます。"
type: origin
token: NDLBwtFIuihc5wkq37KchzqLnrc
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - インデックス
  - 管理

---

import Admonition from '@theme/Admonition';


# インデックスの管理

SDK を使用して、ベクトルフィールドとスカラーフィールドのインデックスを操作する方法を学びます。

<Admonition type="info" icon="📘" title="Notes">

<p>コレクションが自動的にインデックス作成とロードを行うかどうかは、コレクションの作成方法によって異なります。コレクションは、以下のシナリオで作成時に自動的にロードされます。</p>
<ul>
<li><p>コンソール上で。</p></li>
<li><p><a href="/reference/create-collection">RESTful API を使用する場合</a>。</p></li>
<li><p><a href="./manage-collections-sdks">インデックスパラメータを指定して適用可能な SDK を使用する場合</a>。</p></li>
</ul>
<p>自動的にロードされないコレクションを作成し、自分でインデックスの管理を開始することもできます。</p>
<p>プロジェクトエンドポイントを使用して作成されたデータベース内のコレクションおよび外部コレクションでは、インデックスを作成した後に削除することはできません。これはベクトルフィールドとスカラーフィールドの両方に適用されます。</p>

</Admonition>

## 目次\{#contents}

この章では、ベクトルフィールドとスカラーフィールドのコレクションインデックスを管理する方法について説明します。

import DocCardList from '@theme/DocCardList';

<DocCardList />