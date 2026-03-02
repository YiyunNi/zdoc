---
title: "インデックスの管理 | Cloud"
slug: /manage-indexes
sidebar_label: "インデックスの管理"
beta: FALSE
notebook: FALSE
description: "SDK を介してベクトルフィールドとスカラーフィールドのインデックスを操作する方法を学びます。 | Cloud"
type: origin
token: NDLBwtFIuihc5wkq37KchzqLnrc
sidebar_position: 4
keywords: 
  - zilliz
  - vector database
  - cloud
  - インデックス
  - 管理
  - Dense embedding
  - Faiss vector database
  - Chroma vector database
  - nlp search

---

import Admonition from '@theme/Admonition';


# インデックスの管理

SDKを介して、ベクトルフィールドとスカラフィールドのインデックスを操作する方法を学びます。

<Admonition type="info" icon="📘" title="Notes">

<p>コレクションが自動的にインデックスされ、ロードされるかどうかは、コレクションの作成方法によって異なります。コレクションは、以下のシナリオで作成時に自動的にロードされます。</p>
<ul>
<li><p>コンソール上。</p></li>
<li><p><a href="/reference/create-collection">RESTful APIを使用する</a>。</p></li>
<li><p><a href="./manage-collections-sdks">インデックスパラメータを指定した該当するSDKを使用する。</a></p></li>
</ul>
<p>自動的にロードされないコレクションを作成し、自分でインデックスの管理を開始することもできます。</p>

</Admonition>

## 目次{#contents}

この章では、ベクトルフィールドとスカラフィールドのコレクションインデックスを管理する方法について説明します。

import DocCardList from '@theme/DocCardList';

<DocCardList />