---
title: "インデックスの管理 | BYOC"
slug: /manage-indexes
sidebar_key: manage-indexes
sidebar_label: "インデックス"
beta: FALSE
notebook: FALSE
description: "SDK を使用して、ベクトルフィールドおよびスカラーフィールド上のインデックスを操作する方法を学びます。 | BYOC"
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

コレクションが自動的にインデックス作成およびロードされるかどうかは、コレクションの作成方法によって異なります。コレクションは、以下のシナリオで作成時に自動的にロードされます。

- コンソール上で作成した場合。

- [RESTful API を使用する](/reference/create-collection)場合。

- [インデックスパラメータを指定して該当する SDK を使用する](./manage-collections-sdks)場合。

自動的にロードされないコレクションを作成し、自分でインデックスの管理を開始することもできます。

プロジェクトエンドポイントを使用して作成したデータベース内のコレクションおよび外部コレクションでは、インデックスを作成した後に削除することはできません。これはベクトルフィールドとスカラーフィールドの両方に適用されます。

</Admonition>

## 目次\{#contents}

この章では、ベクトルフィールドとスカラーフィールドのコレクションインデックスを管理する方法について説明します。

import DocCardList from '@theme/DocCardList';

<DocCardList />