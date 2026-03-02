---
title: "MCP Server | Cloud"
slug: /zilliz-mcp-server
sidebar_label: "MCP Server"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、AIエージェントが標準化されたModel Context Protocol (MCP) を介してZilliz Cloudとシームレスに連携できるようにするMCPサーバーを提供します。このページでは、Zilliz MCP Serverをローカルでセットアップし、お好みのAIエージェントと連携させる方法を説明します。"
type: origin
token: WRFqwygyNiZ0YJkmsfwcGEsSn4d
sidebar_position: 13
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - mcp
  - milvus
  - mcp server
  - サーバーレスベクトルデータベース
  - milvus オープンソース
  - milvus の仕組み
  - Zilliz ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# MCPサーバー

Zilliz Cloudは、AIエージェントが標準化された[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)を介してZilliz Cloudとシームレスに連携できるようにする[MCPサーバー](https://github.com/zilliztech/zilliz-mcp-server/tree/master)を提供しています。このページでは、Zilliz MCPサーバーをローカルでセットアップし、お好みのAIエージェントで使用する方法を説明します。

## 開始する前に{#before-you-start}

以下を確認してください。

- Zilliz Cloud APIキーを取得していること。

    [このページ](./manage-api-keys#create-an-api-key)のガイドに従って作成できます。

- Python 3.10以降のバージョンがインストールされていること。

    インストールされているPythonのバージョンを確認するには、ターミナルで次のコマンドを実行します。

    ```bash
    python3 -V
    ```

    利用可能なPythonリリースについては、[ダウンロードページ](https://www.python.org/downloads/)を参照してください。

- uvをインストールし、PATHに追加しました。

    インストールされているuvのバージョンを確認するには、ターミナルで次のコマンドを実行します。

    ```bash
    uv -V
    ```

    [このページ](https://github.com/astral-sh/uv?tab=readme-ov-file#installation)のガイドに従ってインストールできます。

## 手順{#procedure}

Zilliz MCP Server を実行するには、設定を準備し、お好みの AI エージェントに追加する必要があります。

### ステップ 1: Zilliz MCP Server の設定を準備する{#step-1-prepare-zilliz-mcp-server-configuration}

Zilliz MCP Server は、以下のいずれかのモードで設定できます。

#### ローカルモード (標準入出力){#local-mode-standard-inputoutput}

このモードでは、Zilliz MCP Server は、お好みの AI エージェントと同じマシン上でローカルに実行され、AI エージェントが Zilliz MCP Server のライフサイクルを直接管理します。

AI エージェントが実行されるマシンに Python と uv をインストールしたら、`YOUR-API-KEY` を十分な権限を持つ有効な Zilliz Cloud API キーに置き換えて、以下のサーバー設定を使用できます。 

```json
{
  "mcpServers": {
    "zilliz-mcp-server": {
      "command": "uvx",
      "args": ["zilliz-mcp-server"],
      "env": {
          "ZILLIZ_CLOUD_TOKEN": "YOUR-API-KEY"
      }
    }
  }
}
```

#### サーバーモード (Streamable HTTP){#server-mode-streamable-http}

複数のマシンで動作する複数のAIエージェント間でZilliz MCP Serverを共有したい場合は、Zilliz MCP Serverをサーバーモードで実行します。これには、設定を準備する前に、Zilliz MCP Serverリポジトリをクローンし、別のマシンでサーバーを起動する必要があります。

<Procedures>

1. Zilliz MCP Serverリポジトリをクローンします。

    ```bash
    git clone https://github.com/zilliztech/zilliz-mcp-server.git
    cd zilliz-mcp-server
    ```

1. 環境変数ファイル (**.env**) を作成します。

    ```bash
    cp example.env .env
    ```

1. Zilliz Cloud APIキーを**.env**ファイルに追加します。

    **.env**ファイルは以下のようになります。`ZILLIZ_CLOUD_TOKEN=`の末尾に、十分な権限を持つ有効なZilliz Cloud APIキーを追記してください。

    ```bash
    # Zilliz MCP Server Configuration
    # Copy this file to .env and fill in your actual values
    
    # Zilliz Cloud Configuration
    
    ZILLIZ_CLOUD_TOKEN=
    ZILLIZ_CLOUD_URI=https://api.cloud.zilliz.com
    ZILLIZ_CLOUD_FREE_CLUSTER_REGION=gcp-us-west1
    
    # MCP Server Configuration
    
    # Port for MCP server when using HTTP/SSE transports (default: 8000)
    MCP_SERVER_PORT=8000
    # Host for MCP server when using HTTP/SSE transports (default: localhost)
    MCP_SERVER_HOST=localhost
    ```

    Zilliz MCP Server はデフォルトで `localhost*:*8000` で起動します。`MCP_SERVER_HOST` と `MCP_SERVER_PORT` を適切な値に設定することで、これを変更できます。

1. Zilliz MCP Server を起動します。

    ```bash
    uv run src/zilliz_mcp_server/server.py --transport streamable-http
    ```

1. サーバー設定を準備します。

    Zilliz MCP Serverはデフォルトで`localhost*:*8000`で起動します。上記の**.env**ファイルでサーバー設定を変更した場合は、以下の設定のURLを正しいものに更新してください。

    ```json
    {
      "mcpServers": {
        "zilliz-mcp-server": {
          "url": "http://localhost:8000/mcp",
          "transport": "streamable-http",
          "description": "Zilliz Cloud and Milvus MCP Server"
        }
      }
    }
    ```

</Procedures>

### ステップ2：設定をお好みのAIエージェントに追加する{#step-2-add-the-configuration-to-your-preferred-ai-agent}

MCPは、アプリケーションがLLMにコンテキストを提供する方法を標準化するオープンプロトコルです。多くのAI駆動型アプリケーションがこれをサポートしています。このステップでは、AIコードエディタであるCursorに設定を追加する方法を学びます。

<Procedures>

1. Cursorを起動し、トップメニューバーで**Cursor** > **Settings** > **Cursor Settings**を選択します。

1. 左側のナビゲーションペインから**Tools & Integrations**を選択します。

1. **Add Custom MCP**をクリックします。これにより`mcp.json`が開きます。

1. [ステップ1](./zilliz-mcp-server#step-1-prepare-zilliz-mcp-server-configuration)で準備した設定をコピーし、開いたファイルに貼り付けます。

1. ファイルを保存し、**Tools & Integrations**に戻ります。**MCP Tools**にZilliz MCP Serverがリストされ、AIエージェントが呼び出せるツールが表示されます。

    ![D8YHbAKHQoEskbx23bNcj3jCnDg](https://zdoc-images.s3.us-west-2.amazonaws.com/d8yhbakhqoeskbx23bncj3jcndg.png "D8YHbAKHQoEskbx23bNcj3jCnDg")

</Procedures>

Zilliz MCP Serverをお好みのAIアプリケーションに追加する手順は非常に似ています。AIアプリケーション固有の指示に従って設定を追加できます。

## 利用可能なツール{#available-tools}

Zilliz MCP Serverは、Zilliz Cloudと対話するための以下のツールを提供します。

### コントロールプレーンツール{#control-plane-tools}

これらのツールは、コントロールプレーン上のプロジェクトやクラスターなどのリソースを管理するために使用されます。

<table>
   <tr>
     <th><p>ツール</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>list_projects</code></p></td>
     <td><p>Zilliz Cloudアカウント内のすべてのプロジェクトをリストします。</p></td>
   </tr>
   <tr>
     <td><p><code>list_clusters</code></p></td>
     <td><p>プロジェクト内のすべてのクラスターをリストします。</p></td>
   </tr>
   <tr>
     <td><p><code>create_free_cluster</code></p></td>
     <td><p>新しい無料ティアのMilvusクラスターを作成します。</p></td>
   </tr>
   <tr>
     <td><p><code>describe_cluster</code></p></td>
     <td><p>特定のクラスターに関する詳細情報を取得します。</p></td>
   </tr>
   <tr>
     <td><p><code>suspend_cluster</code></p></td>
     <td><p>コストを節約するために実行中のクラスターを一時停止します。</p></td>
   </tr>
   <tr>
     <td><p><code>resume_cluster</code></p></td>
     <td><p>一時停止されたクラスターを再開します。</p></td>
   </tr>
   <tr>
     <td><p><code>query_cluster_metrics</code></p></td>
     <td><p>クラスターのさまざまなパフォーマンスメトリクスをクエリします。</p></td>
   </tr>
</table>

### データプレーンツール{#data-plane-tools}

これらのツールは、データベースやコレクションなどのリソースを管理し、データプレーン上でベクトル検索を実行するために使用されます。

<table>
   <tr>
     <th><p>ツール名</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>list_databases</code></p></td>
     <td><p>特定のクラスター内のすべてのデータベースをリストします。</p></td>
   </tr>
   <tr>
     <td><p><code>list_collections</code></p></td>
     <td><p>データベース内のすべてのコレクションをリストします。</p></td>
   </tr>
   <tr>
     <td><p><code>create_collection</code></p></td>
     <td><p>指定されたschemaで新しいcollectionを作成します。</p></td>
   </tr>
   <tr>
     <td><p><code>describe_collection</code></p></td>
     <td><p>schemaを含むcollectionに関する詳細情報を取得します。</p></td>
   </tr>
   <tr>
     <td><p><code>insert_entities</code></p></td>
     <td><p>entity（ベクトルを持つデータレコード）をcollectionに挿入します。</p></td>
   </tr>
   <tr>
     <td><p><code>delete_entities</code></p></td>
     <td><p>IDまたはフィルター式に基づいてcollectionからentityを削除します。</p></td>
   </tr>
   <tr>
     <td><p><code>search</code></p></td>
     <td><p>collectionに対してベクトル類似性検索を実行します。</p></td>
   </tr>
   <tr>
     <td><p><code>query</code></p></td>
     <td><p>スカラーフィルター式に基づいてentityをクエリします。</p></td>
   </tr>
   <tr>
     <td><p><code>hybrid_search</code></p></td>
     <td><p>ベクトル類似性とスカラーフィルターを組み合わせたハイブリッド検索を実行します。</p></td>
   </tr>
</table>

## トラブルシューティング{#troubleshooting}

1. **AIエージェントがZilliz MCP Serverにツールがゼロであると報告するのはなぜですか？**

    これは通常、**Python**や**uv**などの特定の依存関係が不足していることが原因です。これらが適切にインストールされていることを確認してください。詳細については、[始める前に](./zilliz-mcp-server#before-you-start)を参照してください。