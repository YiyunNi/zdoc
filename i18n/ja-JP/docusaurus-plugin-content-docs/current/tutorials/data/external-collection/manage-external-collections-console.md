---
title: "外部コレクションの管理（コンソール） | Cloud"
slug: /manage-external-collections-console
sidebar_key: manage-external-collections-console
sidebar_label: "コンソールで"
beta: PUBLIC
notebook: FALSE
description: "このページでは、Zilliz Cloud の Web コンソールを使用して外部コレクションを管理する方法について説明します。"
type: origin
token: W04nwxHqNiqyrykxMZOcu4ianle
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 外部コレクション

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# 外部コレクションの管理（コンソール）

このページでは、Zilliz Cloud Web コンソールを使用して外部コレクションを管理する方法について説明します。

## 外部コレクションの作成\{#create-an-external-collection}

開始する前に、[外部ボリューム](./external-volume) を作成しておいてください。

<Supademo id="cmokttyiy05dxpimdm3d8vnxv" title=""  />

<Admonition type="info" icon="📘" title="**Notes**">

オンデマンドコンピュートデータベースで作成された外部コレクションは、インデックスの削除をサポートしません。

</Admonition>

## データの更新\{#refresh-data}

![ZEAOwzCoThf80KbhYbgcsJgJnhg](https://zdoc-images.s3.us-west-2.amazonaws.com/ZEAOwzCoThf80KbhYbgcsJgJnhg.png)

## クエリモードの有効化\{#enable-query-mode}

開始する前に、ベクトルインデックスを削除しておいてください。

![ZF6gw5l8rh3zT9bsgv8c52Y5nNb](https://zdoc-images.s3.us-west-2.amazonaws.com/ZF6gw5l8rh3zT9bsgv8c52Y5nNb.png)

## 外部コレクションの削除\{#drop-an-external-collection}

外部コレクションを削除しても、Zilliz Cloud 上のスキーマ、マニフェスト、およびインデックスのみが削除されます。データはオブジェクトストレージ内に保持されたままです。

<Supademo id="cmokvd5hr06grpimd8ugly112" title=""  />

