---
title: "クラスター認証情報 | BYOC"
slug: /cluster-credentials
sidebar_label: "クラスター認証情報"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、トークンを使用してユーザーの身元を認証します。トークンは、クラスター認証情報またはAPIキーのいずれかです。このガイドでは、クラスター認証情報による認証について説明します。 | BYOC"
type: origin
token: YmsVwIzOBinv4OklCfmc2nyznAe
sidebar_position: 3
keywords: 
  - Zilliz
  - ベクターデータベース
  - クラウド
  - クラスター認証情報
  - ハイブリッドベクター検索
  - 動画の重複排除
  - 動画類似性検索
  - ベクター検索

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# クラスター認証情報

Zilliz Cloudは、トークンを使用してユーザーの身元を認証します。トークンは、クラスター認証情報またはAPIキーのいずれかです。このガイドでは、クラスター認証情報による認証について説明します。

クラスター認証情報は、ユーザー名とパスワードのペア（`user:password`）で構成され、クラスター操作のリクエストを認証および承認するために使用されます。

クラスターをセットアップする際、Zilliz Cloudは、`Admin`ロールを持つデフォルトのクラスターユーザー`db_admin`を作成し、クラスターへの完全なアクセスを許可します。デフォルトユーザーのパスワードは、クラスター作成時に一度だけ表示されるため、メモを取り、適切な場所に安全に保管することが重要です。

デフォルトの`db_admin`ユーザー以外にも、認証用のパスワードを持つクラスターユーザーを[作成](./cluster-users#create-a-cluster-user)できます。

## パスワードのリセット{#reset-password}

ユーザーのパスワードを忘れた場合や、漏洩した疑いがある場合は、パスワードをリセットできます。

- **コンソールでユーザーパスワードをリセットする**

    ![reset-cluster-user-password](https://zdoc-images.s3.us-west-2.amazonaws.com/reset-cluster-user-password.png "reset-cluster-user-password")

- **プログラムでユーザーパスワードをリセットする**

    RESTful APIまたはSDKを使用して、プログラムでユーザーパスワードをリセットできます。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    from pymilvus import MilvusClient
    client = MilvusClient(
        uri="https://inxx-xxxxxxxxxxxx.api.gcp-us-west1.zillizcloud.com:19530",
        token="user:password"
    )
    
    client.update_password(
        user_name="user_1",
        old_password="P@ssw0rd",
        new_password="NewP@ssw0rd"
    )
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    UpdatePasswordReq updatePasswordReq = UpdatePasswordReq.builder()
            .userName("user_1")
            .password("P@ssw0rd")
            .newPassword("NewP@ssw0rd")
            .build();
    client.updatePassword(updatePasswordReq);
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    milvusClient.updateUser({
       username: 'user_1',
       newPassword: 'NewP@ssw0rd',
       oldPassword: 'P@ssw0rd',
     })
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    import (
       "context"
       "google.golang.org/grpc"
       "github.com/milvus-io/milvus/v2/milvusclient"
    )
    
    userName := "user_1"
    oldpass := "P@ssw0rd"
    newpass := "NewP@ssw0rd"
    opts := client.NewUpdatePasswordOption(userName, oldpass, newpass)
    
    onFinish := func(ctx context.Context, err error) {
        if err != nil {
            fmt.Printf("gRPC call finished with error: %v\n", err)
        } else {
            fmt.Printf("gRPC call finished successfully")
        }
    }
    
    callOption := grpc.OnFinish(onFinish)
    
    err := mclient.UpdatePassword(context.Background(), opts, callOpts)
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    curl --request POST \
    --url "${CLUSTER_ENDPOINT}/v2/vectordb/users/update_password" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{
        "newPassword": "NewP@ssw0rd",
        "userName": "user_1",
        "password": "P@ssw0rd*"
    }'
    ```

    </TabItem>
    </Tabs>