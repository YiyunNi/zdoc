---
title: "SDKのインストール | Cloud"
slug: /install-sdks
sidebar_label: "SDKのインストール"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、マネージドなMilvusベクトルデータベースをサービスとして提供しています。クラスター接続を容易にするために、Python、Java、Go、またはNode.jsの4つのSDKオプションがあります。"
type: origin
token: J274wT61xiEM4fkYeL8cMb4Pnbd
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - sdk
  - milvus

---

import Admonition from '@theme/Admonition';


# SDK をインストールする

Zilliz Cloud は、マネージド Milvus ベクトルデータベースをサービスとして提供しています。クラスター接続を容易にするために、[Python](./install-sdks#install-pymilvus-python-sdk)、[Java](./install-sdks#install-java-sdk)、[Go](./install-sdks#install-go-sdk)、または [Node.js](./install-sdks#install-nodejs-sdk) の 4 つの SDK オプションがあります。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>Zilliz Cloud は、バージョン互換性を確保するためにクラスターを常にアップグレードしています。詳細については、<a href="./organization-settings">組織設定の管理</a>ページをご覧ください。SDK バージョンの不一致により接続の問題が発生した場合は、表示されるプロンプトに従って互換性のある SDK バージョンに戻してください。メンテナンス後に通知が届き、その後は心配なく SDK をアップグレードできます。</p></li>
<li><p>以下のすべての SDK には、安定版とベータ版の両方があります。安定版は一般的なクラスター向けであり、ベータ版はベータクラスターに対応しています。クラスターをベータ版にアップグレードした場合は、SDK もベータ版にアップグレードしてください。</p></li>
</ul>

</Admonition>

## SDK の互換性\{#sdk-compatibility}

次の表は、各 Milvus バージョンの互換性のある SDK バージョンを示しています。

<table>
   <tr>
     <th><p><strong>Milvus バージョン</strong></p></th>
     <th><p><strong>Python SDK</strong></p></th>
     <th><p><strong>Node.js SDK</strong></p></th>
     <th><p><strong>Java SDK</strong></p></th>
     <th><p><strong>Go SDK</strong></p></th>
   </tr>
   <tr>
     <td><p><code>2.6.x</code></p></td>
     <td><p><code>2.6.9</code></p></td>
     <td><p><code>2.6.10</code></p></td>
     <td><p><code>2.6.14</code></p></td>
     <td><p><code>2.6.2</code></p></td>
   </tr>
   <tr>
     <td><p><code>2.5.x</code></p></td>
     <td><p><code>2.5.18</code></p></td>
     <td><p><code>2.5.13</code></p></td>
     <td><p><code>2.5.15</code></p></td>
     <td><p><code>2.5.6</code></p></td>
   </tr>
</table>

## PyMilvus をインストールする: Python SDK\{#install-pymilvus-python-sdk}

PyMilvus は Milvus の Python SDK です。[GitHub でソースコードにアクセス](https://github.com/milvus-io/pymilvus)できます。

<Admonition type="info" icon="📘" title="Notes">

<p>インストールする前に、<strong>Python</strong> のバージョンが <strong>3.8</strong> 以上であることを確認してください。</p>

</Admonition>

```bash
# Install pymilvus compatible with Milvus v2.5.x
python -m pip install pymilvus==2.5.18

# Update PyMilvus to the newest version
python -m pip install --upgrade pymilvus

# Verify installation success
python -m pip list | grep pymilvus
```

お使いのクラスターが **Milvus v2.6.x (パブリックプレビュー)** と互換性がある場合は、上記のコマンドの `2.5.18` を `2.6.9` に変更してください。

## Node.js SDKをインストールする\{#install-nodejs-sdk}

MilvusのNode.js SDKには、**npm**または**yarn**を使用します。 [GitHub](https://github.com/milvus-io/milvus-sdk-node)でソースコードにアクセスできます。

<Admonition type="info" icon="📘" title="Notes">

<p>インストールする前に、お使いの <strong>Node.js</strong> のバージョンが <strong>14</strong> 以降であることを確認してください。</p>

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

このSDKは、CommonJSまたはES6モジュールのどちらとしても使用できます。通常、`npm init`プロジェクトにはCommonJSを使用します。`npm init es6`プロジェクトにはES6が推奨されます。

```javascript
// Import the SDK as a CommonJS module
const { MilvusClient } = require("@zilliz/milvus2-sdk-node")

// Import the SDK as a ES6 module
import { MilvusClient } from "@zilliz/milvus2-sdk-node"
```

クラスターが **Milvus v2.6.x (パブリックプレビュー)** と互換性がある場合は、上記のコマンドの `2.5.13` を `2.6.10` に変更してください。

## Java SDK のインストール\{#install-java-sdk}

SDK を入手するには、Apache Maven または Gradle/Grails を使用します。[GitHub でソースコード](https://github.com/milvus-io/milvus-sdk-java)にアクセスしてください。

- Apache Maven の場合、`pom.xml` の依存関係に以下を追加します。

    ```xml
    <!-- Install Java SDK compatible with Milvus v2.5.x -->
    <dependency>
         <groupId>io.milvus</groupId>
         <artifactId>milvus-sdk-java</artifactId>
         <version>2.5.15</version>
     </dependency>
    ```

- Gradle/Grails の場合、以下を実行します。

    ```bash
    # Install Java SDK compatible with Milvus v2.5.x
    compile 'io.milvus:milvus-sdk-java:2.5.15'
    ```

お使いのクラスターが **Milvus v2.6.x (パブリックプレビュー)** と互換性がある場合は、上記のコマンドの `2.5.15` を `2.6.14` に変更してください。

## Go SDKのインストール\{#install-go-sdk}

Go SDKは`go get`で利用できます。 [GitHubでソースコード](https://github.com/milvus-io/milvus-sdk-go)をご覧ください。

```bash
# Install Go SDK compatible with Milvus v2.5.x
go get -u github.com/milvus-io/milvus-sdk-go/v2@v2.5.6
```

クラスターが **Milvus v2.6.x (パブリックプレビュー)** と互換性がある場合は、上記のコマンドの `2.5.6` を `2.6.1` に変更してください。