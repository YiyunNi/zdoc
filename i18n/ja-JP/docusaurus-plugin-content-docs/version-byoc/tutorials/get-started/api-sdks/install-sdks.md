---
title: "SDK のインストール | BYOC"
slug: /install-sdks
sidebar_key: install-sdks
sidebar_label: "SDK をインストール"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、マネージド Milvus ベクトルデータベースをサービスとして提供します。クラスター接続を容易にするために、Python](./install-sdks#install-pymilvus-python-sdk)、[Java](./install-sdks#install-java-sdk)、[Go](./install-sdks#install-go-sdk)、[Node.js](./install-sdks#install-nodejs-sdk) の 4 つの SDK オプションがあります。 | BYOC"
type: origin
token: J274wT61xiEM4fkYeL8cMb4Pnbd
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - sdk
  - milvus

---

import Admonition from '@theme/Admonition';


# SDK のインストール

Zilliz Cloud は、マネージド Milvus ベクトルデータベースをサービスとして提供しています。クラスター接続を容易にするために、[Python](./install-sdks#install-pymilvus-python-sdk)、[Java](./install-sdks#install-java-sdk)、[Go](./install-sdks#install-go-sdk)、[Node.js](./install-sdks#install-nodejs-sdk) の 4 つの SDK オプションが用意されています。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>Zilliz Cloud は、バージョンの互換性を確保するためにクラスターを継続的にアップグレードしています。詳細については、<a href="./organization-settings">組織設定の管理</a> ページをご覧ください。SDK のバージョン不一致による接続問題が発生した場合は、互換性のある SDK バージョンに戻すよう、表示されたプロンプトに従ってください。メンテナンス完了後に通知いたしますので、その後は安心して SDK をアップグレードできます。</p></li>
<li><p>以下のすべての SDK には、安定版とベータ版の両方が用意されています。安定版は一般的なクラスター向け、ベータ版はベータクラスター向けです。クラスターをベータ版にアップグレードした場合は、SDK もベータ版にアップグレードしていることを確認してください。</p></li>
</ul>

</Admonition>

## SDK 互換性\{#sdk-compatibility}

以下の表に、各 Milvus バージョンと互換性のある SDK バージョンを示します。

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

## PyMilvus のインストール: Python SDK\{#install-pymilvus-python-sdk}

PyMilvus は Milvus の Python SDK です。[GitHub のソースコード](https://github.com/milvus-io/pymilvus) にアクセスできます。

<Admonition type="info" icon="📘" title="Notes">

<p>インストール前に、<strong>Python</strong> のバージョンが <strong>3.8</strong> よりも新しいことを確認してください。</p>

</Admonition>

```bash
# Install pymilvus compatible with Milvus v2.5.x
python -m pip install pymilvus==2.5.18

# Update PyMilvus to the newest version
python -m pip install --upgrade pymilvus

# Verify installation success
python -m pip list | grep pymilvus
```

クラスターが **Milvus v2.6.x (パブリックプレビュー)** に対応している場合は、上記のコマンド内の `2.5.18` を `2.6.9` に変更してください。

## Install Node.js SDK\{#install-nodejs-sdk}

Milvus の Node.js SDK は、**npm** または **yarn** を使用してインストールします。[GitHub のソースコード](https://github.com/milvus-io/milvus-sdk-node) にアクセスしてください。

<Admonition type="info" icon="📘" title="Notes">

<p>インストール前に、<strong>Node.js</strong> のバージョンが <strong>14</strong> 以上であることを確認してください。</p>

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

この SDK は CommonJS モジュールとしても、ES6 モジュールとしても使用できます。通常、`npm init` プロジェクトでは CommonJS を使用し、`npm init es6` プロジェクトでは ES6 を使用することを推奨します。

```javascript
// Import the SDK as a CommonJS module
const { MilvusClient } = require("@zilliz/milvus2-sdk-node")

// Import the SDK as a ES6 module
import { MilvusClient } from "@zilliz/milvus2-sdk-node"
```

クラスターが **Milvus v2.6.x (パブリックプレビュー)** と互換性がある場合は、上記のコマンド内の `2.5.13` を `2.6.10` に変更してください。

## Java SDK のインストール\{#install-java-sdk}

Apache Maven または Gradle/Grails を使用して SDK を取得します。[GitHub のソースコード](https://github.com/milvus-io/milvus-sdk-java) にアクセスしてください。

- Apache Maven を使用する場合は、`pom.xml` の依存関係に以下を追加します:

    ```xml
    <!-- Install Java SDK compatible with Milvus v2.5.x -->
    <dependency>
         <groupId>io.milvus</groupId>
         <artifactId>milvus-sdk-java</artifactId>
         <version>2.5.15</version>
     </dependency>
    ```

- Gradle/Grails の場合、次を実行します:

    ```bash
    # Install Java SDK compatible with Milvus v2.5.x
    compile 'io.milvus:milvus-sdk-java:2.5.15'
    ```

クラスターが **Milvus v2.6.x (パブリックプレビュー)** に対応している場合は、上記のコマンド内の `2.5.15` を `2.6.14` に変更してください。

## Go SDK のインストール\{#install-go-sdk}

Go SDK は `go get` で入手できます。[GitHub のソースコード](https://github.com/milvus-io/milvus-sdk-go) を確認してください。

```bash
# Install Go SDK compatible with Milvus v2.5.x
go get -u github.com/milvus-io/milvus-sdk-go/v2@v2.5.6
```

クラスターが **Milvus v2.6.x (パブリックプレビュー)** と互換性がある場合は、上記のコマンド内の `2.5.6` を `2.6.1` に変更してください。