---
title: "SDK のインストール | Cloud"
slug: /install-sdks
sidebar_label: "SDK のインストール"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、マネージド Milvus ベクトルデータベースをサービスとして提供します。クラスター接続を容易にするために、Python](./install-sdks#install-pymilvus-python-sdk)、[Java](./install-sdks#install-java-sdk)、[Go](./install-sdks#install-go-sdk)、または [Node.js の4つのSDKオプションがあります。"
type: origin
token: J274wT61xiEM4fkYeL8cMb4Pnbd
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - sdk
  - milvus
  - Faiss
  - 動画検索
  - AI の幻覚
  - AI エージェント

---

import Admonition from '@theme/Admonition';


# SDKのインストール

Zilliz Cloudは、マネージドなMilvusベクトルデータベースをサービスとして提供しています。クラスター接続を容易にするために、[Python](./install-sdks#install-pymilvus-python-sdk)、[Java](./install-sdks#install-java-sdk)、[Go](./install-sdks#install-go-sdk)、または[Node.js](./install-sdks#install-nodejs-sdk)の4つのSDKオプションがあります。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>Zilliz Cloudは、バージョン互換性を確保するためにクラスターを常にアップグレードしています。詳細については、<a href="./organization-settings">組織設定の管理</a>ページをご覧ください。SDKのバージョン不一致により接続の問題が発生した場合は、互換性のあるSDKバージョンに戻すよう提供されるプロンプトに従ってください。メンテナンス後、SDKを安心してアップグレードできるようになったことをお知らせします。</p></li>
<li><p>以下のすべてのSDKには、安定版とベータ版の両方があります。安定版は一般的なクラスター向けであり、ベータ版はベータクラスターに対応しています。クラスターをベータ版にアップグレードした場合は、SDKもベータ版にアップグレードしてください。</p></li>
</ul>

</Admonition>

## PyMilvusのインストール: Python SDK{#install-pymilvus-python-sdk}

PyMilvusはMilvusのPython SDKです。[GitHubでソースコード](https://github.com/milvus-io/pymilvus)にアクセスできます。

<Admonition type="info" icon="📘" title="Notes">

<p>インストールする前に、<strong>Python</strong>のバージョンが<strong>3.8</strong>以上であることを確認してください。</p>

</Admonition>

```bash
# Install pymilvus compatible with Milvus v2.5.x
python -m pip install pymilvus==2.5.16

# Update PyMilvus to the newest version
python -m pip install --upgrade pymilvus

# Verify installation success
python -m pip list | grep pymilvus
```

お使いのクラスターが **Milvus v2.6.x (Public Preview)** と互換性がある場合は、上記のコマンドの `2.5.16` を `2.6.3` に変更してください。

## Node.js SDKのインストール{#install-nodejs-sdk}

MilvusのNode.js SDKには、**npm**または**yarn**を使用します。[GitHubのソースコード](https://github.com/milvus-io/milvus-sdk-node)にアクセスしてください。

<Admonition type="info" icon="📘" title="Notes">

<p>インストールする前に、<strong>Node.js</strong>のバージョンが<strong>14</strong>以上であることを確認してください。</p>

</Admonition>

```bash
# Install Node.js SDK compatible with Milvus v2.5.x
npm install @zilliz/milvus2-sdk-node@2.5.13
# Alternatively,
yarn add @zilliz/milvus2-sdk-node@2.5.13

# Upgrade to the latest version
npm update @zilliz/milvus2-sdk-node
# Alternatively,
yarn upgrade @zilliz/milvus2-sdk-node

# Verify installation
npm list | grep @zilliz/milvus2-sdk-node
# or
yarn list | grep @zilliz/milvus2-sdk-node
```

このSDKは、CommonJSまたはES6モジュールのいずれかとして使用できます。通常、`npm init`プロジェクトではCommonJSを使用します。`npm init es6`プロジェクトでは、ES6が推奨されます。

```javascript
// Import the SDK as a CommonJS module
const { MilvusClient } = require("@zilliz/milvus2-sdk-node")

// Import the SDK as a ES6 module
import { MilvusClient } from "@zilliz/milvus2-sdk-node"
```

クラスターが **Milvus v2.6.x (Public Preview)** と互換性がある場合は、上記のコマンドの `2.5.13` を `2.6.4` に変更してください。

## Java SDK のインストール{#install-java-sdk}

SDK を入手するには、Apache Maven または Gradle/Grails を使用します。[GitHub のソースコード](https://github.com/milvus-io/milvus-sdk-java)にアクセスしてください。

- Apache Maven の場合、`pom.xml` の依存関係に以下を追加します。

    ```xml
    <!-- Install Java SDK compatible with Milvus v2.5.x -->
    <dependency>
         <groupId>io.milvus</groupId>
         <artifactId>milvus-sdk-java</artifactId>
         <version>2.5.14</version>
     </dependency>
    ```

- Gradle/Grails の場合、以下を実行します。

    ```bash
    # Install Java SDK compatible with Milvus v2.5.x
    compile 'io.milvus:milvus-sdk-java:2.5.14'
    ```

クラスターが **Milvus v2.6.x (Public Preview)** と互換性がある場合は、上記のコマンドの `2.5.14` を `2.6.6` に変更してください。

## Go SDKのインストール\{#install-go-sdk}

Go SDKは `go get` を介して利用できます。[GitHubでソースコード](https://github.com/milvus-io/milvus-sdk-go)を参照してください。

```bash
# Install Go SDK compatible with Milvus v2.5.x
go get -u github.com/milvus-io/milvus-sdk-go/v2@v2.5.6
```

お使いのクラスターが **Milvus v2.6.x (Public Preview)** と互換性がある場合は、上記のコマンドの `2.5.6` を `2.6.1` に変更してください。