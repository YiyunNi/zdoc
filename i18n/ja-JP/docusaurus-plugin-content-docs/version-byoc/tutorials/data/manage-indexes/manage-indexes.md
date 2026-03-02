---
title: "インデックスの管理 | BYOC"
slug: /manage-indexes
sidebar_label: "インデックスの管理"
beta: FALSE
notebook: FALSE
description: "SDK を介して、ベクトルフィールドとスカラーフィールドのインデックスを操作する方法を学びます。 | BYOC"
type: origin
token: NDLBwtFIuihc5wkq37KchzqLnrc
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - インデックス
  - 管理
  - ベクトル次元
  - ANN検索
  - ベクトル埋め込みとは
  - ベクトルデータベースチュートリアル

---

import Admonition from '@theme/Admonition';


# インデックスの管理

SDK を介してベクトルフィールドとスカラフィールドのインデックスを操作する方法を学びます。

<Admonition type="info" icon="📘" title="Notes">

<p>コレクションが自動的にインデックスされ、ロードされるかどうかは、コレクションの作成方法によって異なります。コレクションは、以下のシナリオで作成時に自動的にロードされます。</p>
<ul>
<li><p>コンソール上。</p></li>
<li><p><a href="/reference/create-collection">RESTful API を使用する場合</a>。</p></li>
<li><p><a href="./manage-collections-sdks">インデックスパラメータを指定して該当する SDK を使用する場合。</a></p></li>
</ul>
<p>自動的にロードされないコレクションを作成し、自分でインデックスの管理を開始することもできます。</p>

</Admonition>

## 目次{#contents}

この章では、ベクトルフィールドとスカラフィールドのコレクションインデックスを管理する方法について説明します。

import DocCardList from '@theme/DocCardList';

<DocCardList />