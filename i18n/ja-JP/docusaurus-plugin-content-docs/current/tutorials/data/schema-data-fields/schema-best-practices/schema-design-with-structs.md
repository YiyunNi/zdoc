---
title: "構造体の配列によるデータモデル設計 | Cloud"
slug: /schema-design-with-structs
sidebar_label: "構造体によるデータモデル"
beta: FALSE
notebook: FALSE
description: "現代のAIアプリケーション、特にIoT（モノのインターネット）や自動運転の分野では、通常、リッチで構造化されたイベントに基づいて推論を行います。例えば、タイムスタンプとベクトル埋め込みを持つセンサー読み取り値、エラーコードと音声スニペットを持つ診断ログ、位置、速度、シーンコンテキストを持つトリップセグメントなどです。これらは、データベースがネストされたデータの取り込みと検索をネイティブにサポートすることを要求します。 | Cloud"
type: origin
token: VOkIwd5adiziGQkoDO1cRoRFnre
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - schema
  - スキーマ設計
  - ハンズオン
  - 構造体
  - 構造体の配列
  - DiskANN
  - 疎ベクトル
  - ベクトル次元
  - ANN検索

---

import Admonition from '@theme/Admonition';


# 構造体の配列によるデータモデル設計

最新のAIアプリケーション、特にIoT（モノのインターネット）や自動運転の分野では、通常、リッチで構造化されたイベントに基づいて推論が行われます。例えば、タイムスタンプとベクトル埋め込みを持つセンサーの読み取り値、エラーコードと音声スニペットを持つ診断ログ、位置、速度、シーンコンテキストを持つトリップセグメントなどです。これには、データベースがネストされたデータの取り込みと検索をネイティブにサポートする必要があります。

Zilliz Cloudは、ユーザーに原子的な構造イベントをフラットなデータモデルに変換するよう求める代わりに、構造体の配列を導入します。この配列内の各構造体は、スカラーとベクトルを保持でき、セマンティックな整合性を維持します。

## 構造体の配列の必要性{#why-array-of-structs}

自動運転からマルチモーダル検索まで、最新のAIアプリケーションは、ネストされた異種データにますます依存しています。従来のフラットなデータモデルでは、「**多くの注釈付きチャンクを持つ1つのドキュメント**」や「**複数の観測された操作を持つ1つの運転シーン**」のような複雑な関係を表現するのに苦労します。ここで、Zilliz Cloudの構造体の配列データ型が威力を発揮します。

構造体の配列を使用すると、構造化された要素の順序付きセットを保存できます。各構造体には、スカラーフィールドとベクトル埋め込みの独自の組み合わせが含まれます。これにより、次の用途に最適です。

- **階層データ**: 多くのテキストチャンクを持つ書籍や、多くの注釈付きフレームを持つビデオなど、複数の子レコードを持つ親エンティティ。

- **マルチモーダル埋め込み**: 各構造体は、テキスト埋め込みと画像埋め込み、およびメタデータなど、複数のベクトルを保持できます。

- **時系列データまたはシーケンシャルデータ**: 配列フィールド内の構造体は、時系列イベントまたは段階的なイベントを自然に表現します。

JSONブロブを保存したり、複数のコレクションにデータを分割したりする従来の回避策とは異なり、構造体の配列は、Zilliz Cloud内でネイティブなスキーマ強制、ベクトルインデックス作成、および効率的なストレージを提供します。

## スキーマ設計ガイドライン{#schema-design-guidelines}

[検索のためのデータモデル設計](./schema-design-hands-on)で説明されているすべてのガイドラインに加えて、データモデル設計で構造体の配列を使用し始める前に、次の点も考慮する必要があります。

### 構造体スキーマの定義{#define-the-struct-schema}

コレクションに配列フィールドを追加する前に、内部の構造体スキーマを定義します。構造体内の各フィールドは、明示的に型指定されたスカラー（**VARCHAR**、**INT**、**BOOLEAN**など）またはベクトル（**FLOAT_VECTOR**）である必要があります。

取得または表示に使用するフィールドのみを含めることで、構造体スキーマを簡潔に保つことをお勧めします。未使用のメタデータで肥大化させないでください。

### 最大容量を慎重に設定する{#set-the-max-capacity-thoughtfully}

各配列フィールドには、配列フィールドが各エンティティに対して保持できる要素の最大数を指定する属性があります。ユースケースの上限に基づいてこれを設定します。たとえば、ドキュメントごとに1,000のテキストチャンク、または運転シーンごとに100の操作などです。

過度に高い値はメモリを浪費するため、配列フィールド内の構造体の最大数を決定するためにいくつかの計算を行う必要があります。

### 構造体内のベクトルフィールドのインデックス作成{#index-vector-fields-in-structs}

インデックス作成は、コレクション内のベクトルフィールドと構造体で定義されたベクトルフィールドの両方を含むベクトルフィールドに必須です。構造体内のベクトルフィールドの場合、インデックスタイプとして`AUTOINDEX`を、メトリックタイプとして`MAX_SIM`シリーズを使用する必要があります。

適用されるすべての制限の詳細については、[制限](./use-array-of-structs#limits)を参照してください。

## 実世界の例：自動運転のためのCoVLAデータセットのモデリング{#a-real-world-example-modeling-the-covla-dataset-for-autonomous-driving}

[Turing Motors](https://tur.ing/posts/s1QUA1uh)によって導入され、WACV 2025で採択されたComprehensive Vision-Language-Action (CoVLA) データセットは、自動運転におけるVision-Language-Action (VLA) モデルのトレーニングと評価のための豊富な基盤を提供します。通常ビデオクリップである各データポイントには、生の視覚入力だけでなく、次のことを記述する構造化されたキャプションも含まれています。

- **自車両の動作**（例：「対向車に道を譲りながら左に合流する」）

- 存在する**検出されたオブジェクト**（例：先行車両、歩行者、信号機）

- シーンのフレームレベルの**キャプション**

この階層的でマルチモーダルな性質は、構造体の配列機能の理想的な候補となります。CoVLAデータセットの詳細については、[CoVLAデータセットウェブサイト](https://turingmotors.github.io/covla-ad/)を参照してください。

### ステップ1：データセットをコレクションスキーマにマッピングする{#step-1-map-the-dataset-into-a-collection-schema}

CoVLAデータセットは、10,000のビデオクリップ、合計80時間以上の映像からなる大規模なマルチモーダル運転データセットです。20Hzのレートでフレームをサンプリングし、各フレームに詳細な自然言語キャプションと、車両の状態および検出されたオブジェクトの座標に関する情報が注釈付けされています。

データセットの構造は次のとおりです。

```python
├── video_1                                       (VIDEO) # video.mp4
│   ├── video_id                                  (INT)
│   ├── video_url                                 (STRING)
│   ├── frames                                    (ARRAY)
│   │   ├── frame_1                               (STRUCT)
│   │   │   ├── caption                           (STRUCT) # captions.jsonl
│   │   │   │   ├── plain_caption                 (STRING)
│   │   │   │   ├── rich_caption                  (STRING)
│   │   │   │   ├── risk                          (STRING)
│   │   │   │   ├── risk_correct                  (BOOL)
│   │   │   │   ├── risk_yes_rate                 (FLOAT)
│   │   │   │   ├── weather                       (STRING)
│   │   │   │   ├── weather_rate                  (FLOAT)
│   │   │   │   ├── road                          (STRING)
│   │   │   │   ├── road_rate                     (FLOAT)
│   │   │   │   ├── is_tunnel                     (BOOL)
│   │   │   │   ├── is_tunnel_yes_rate            (FLOAT)
│   │   │   │   ├── is_highway                    (BOOL)
│   │   │   │   ├── is_highway_yes_rate           (FLOAT)
│   │   │   │   ├── has_pedestrain                (BOOL)
│   │   │   │   ├── has_pedestrain_yes_rate       (FLOAT)
│   │   │   │   ├── has_carrier_car               (BOOL)
│   │   │   ├── traffic_light                     (STRUCT) # traffic_lights.jsonl
│   │   │   │   ├── index                         (INT)
│   │   │   │   ├── class                         (STRING)
│   │   │   │   ├── bbox                          (LIST<FLOAT>)
│   │   │   ├── front_car                         (STRUCT) # front_cars.jsonl
│   │   │   │   ├── has_lead                      (BOOL)
│   │   │   │   ├── lead_prob                     (FLOAT)
│   │   │   │   ├── lead_x                        (FLOAT)
│   │   │   │   ├── lead_y                        (FLOAT)
│   │   │   │   ├── lead_speed_kmh                (FLOAT)
│   │   │   │   ├── lead_a                        (FLOAT)
│   │   ├── frame_2                               (STRUCT)
│   │   ├── ...                                   (STRUCT)
│   │   ├── frame_n                               (STRUCT)
├── video_2
├── ...
├── video_n
```

CoVLAデータセットの構造は高度に階層的であり、収集されたデータは複数の`.jsonl`ファイルと`.mp4`形式のビデオクリップに分割されていることがわかります。

Zilliz Cloudでは、JSONフィールドまたはArray-of-Structsフィールドを使用して、collection schema内にネストされた構造を作成できます。ベクトル埋め込みがネストされた形式の一部である場合、Array-of-Structsフィールドのみがサポートされます。ただし、Array内のStruct自体は、それ以上のネストされた構造を含むことはできません。CoVLAデータセットを必須の関係を保持しながら保存するには、不要な階層を削除し、データをフラット化してZilliz Cloud collection schemaに適合させる必要があります。

以下の図は、次のschemaで示されているように、このデータセットをモデル化する方法を示しています。

![PATjwyoKzhPELnb14kBcnAEAnGv](https://zdoc-images.s3.us-west-2.amazonaws.com/PATjwyoKzhPELnb14kBcnAEAnGv.png)

上記の図は、ビデオクリップの構造を示しており、以下のフィールドで構成されています。

- `video_id`は主キーとして機能し、INT64型の整数を受け入れます。

- `states`は、現在のビデオの各フレームにおける自車両の状態を含む生のJSONボディです。

- `captions`はStructの配列で、各Structには以下のフィールドがあります。

    - `frame_id`は、現在のビデオ内の特定のフレームを識別します。

    - `plain_caption`は、天候、道路状況などの周囲の環境を含まない現在のフレームの説明であり、`plain_cap_vector`はその対応するベクトル埋め込みです。

    - `rich_caption`は、周囲の環境を含む現在のフレームの説明であり、`rich_cap_vector`はその対応するベクトル埋め込みです。

    - `risk`は、現在のフレームで自車両が直面するリスクの説明であり、`risk_vector`はその対応するベクトル埋め込みです。

    - `road`、`weather`、`is_tunnel`、`has_pedestrain`など、フレームのその他すべての属性。

- `traffic_lights`は、現在のフレームで識別されたすべての信号機を含むJSONボディです。

- `front_cars`もStructの配列で、現在のフレームで識別されたすべての先行車を含みます。

### ステップ2: schemaを初期化する{#step-2-initialize-the-schemas}

まず、caption Struct、front_cars Struct、およびcollectionのschemaを初期化する必要があります。

- Caption Structのschemaを初期化します。

    ```python
    client = MilvusClient("YOUR_CLUSTER_ENDPOINT")
    
    # create the schema for the caption struct
    schema_for_caption = client.create_struct_field_schema()
    
    schema_for_caption.add_field(
        field_name="frame_id",
        datatype=DataType.INT64,
        description="ID of the frame to which the ego vehicle's behavior belongs"
    )
    
    schema_for_caption.add_field(
        field_name="plain_caption",
        datatype=DataType.VARCHAR,
        max_length=1024,
        description="plain description of the ego vehicle's behaviors"
    )
    
    schema_for_caption.add_field(
        field_name="plain_cap_vector",
        datatype=DataType.FLOAT_VECTOR,
        dim=768,
        description="vectors for the plain description of the ego vehicle's behaviors"
    )
    
    schema_for_caption.add_field(
        field_name="rich_caption",
        datatype=DataType.VARCHAR,
        max_length=1024,
        description="rich description of the ego vehicle's behaviors"
    )
    
    schema_for_caption.add_field(
        field_name="rich_cap_vector",
        datatype=DataType.FLOAT_VECTOR,
        dim=768,
        description="vectors for the rich description of the ego vehicle's behaviors"
    )
    
    schema_for_caption.add_field(
        field_name="risk",
        datatype=DataType.VARCHAR,
        max_length=1024,
        description="description of the ego vehicle's risks"
    )
    
    schema_for_caption.add_field(
        field_name="risk_vector",
        datatype=DataType.FLOAT_VECTOR,
        dim=768,
        description="vectors for the description of the ego vehicle's risks"
    )
    
    schema_for_caption.add_field(
        field_name="risk_correct",
        datatype=DataType.BOOL,
        description="whether the risk assessment is correct"
    )
    
    schema_for_caption.add_field(
        field_name="risk_yes_rate",
        datatype=DataType.FLOAT,
        description="probability/confidence of risk being present"
    )
    
    schema_for_caption.add_field(
        field_name="weather",
        datatype=DataType.VARCHAR,
        max_length=50,
        description="weather condition"
    )
    
    schema_for_caption.add_field(
        field_name="weather_rate",
        datatype=DataType.FLOAT,
        description="probability/confidence of the weather condition"
    )
    
    schema_for_caption.add_field(
        field_name="road",
        datatype=DataType.VARCHAR,
        max_length=50,
        description="road type"
    )
    
    schema_for_caption.add_field(
        field_name="road_rate",
        datatype=DataType.FLOAT,
        description="probability/confidence of the road type"
    )
    
    schema_for_caption.add_field(
        field_name="is_tunnel",
        datatype=DataType.BOOL,
        description="whether the road is a tunnel"
    )
    
    schema_for_caption.add_field(
        field_name="is_tunnel_yes_rate",
        datatype=DataType.FLOAT,
        description="probability/confidence of the road being a tunnel"
    )
    
    schema_for_caption.add_field(
        field_name="is_highway",
        datatype=DataType.BOOL,
        description="whether the road is a highway"
    )
    
    schema_for_caption.add_field(
        field_name="is_highway_yes_rate",
        datatype=DataType.FLOAT,
        description="probability/confidence of the road being a highway"
    )
    
    schema_for_caption.add_field(
        field_name="has_pedestrian",
        datatype=DataType.BOOL,
        description="whether there is a pedestrian present"
    )
    
    schema_for_caption.add_field(
        field_name="has_pedestrian_yes_rate",
        datatype=DataType.FLOAT,
        description="probability/confidence of pedestrian presence"
    )
    
    schema_for_caption.add_field(
        field_name="has_carrier_car",
        datatype=DataType.BOOL,
        description="whether there is a carrier car present"
    )
    ```

- フロントカースタクトのスキーマを初期化する

    <Admonition type="info" icon="📘" title="Notes">

    <p>フロントカーはベクトル埋め込みを伴いませんが、データサイズがJSONフィールドの最大値を超えるため、Structの配列として含める必要があります。</p>

    </Admonition>

    ```python
    schema_for_front_car = client.create_struct_field_schema()
    
    schema_for_front_car.add_field(
        field_name="frame_id",
        datatype=DataType.INT64,
        description="ID of the frame to which the ego vehicle's behavior belongs"
    )
    
    schema_for_front_car.add_field(
        field_name="has_lead",
        datatype=DataType.BOOL,
        description="whether there is a leading vehicle"
    )
    
    schema_for_front_car.add_field(
        field_name="lead_prob",
        datatype=DataType.FLOAT,
        description="probability/confidence of the leading vehicle's presence"
    )
    
    schema_for_front_car.add_field(
        field_name="lead_x",
        datatype=DataType.FLOAT,
        description="x position of the leading vehicle relative to the ego vehicle"
    )
    
    schema_for_front_car.add_field(
        field_name="lead_y",
        datatype=DataType.FLOAT,
        description="y position of the leading vehicle relative to the ego vehicle"
    )
    
    schema_for_front_car.add_field(
        field_name="lead_speed_kmh",
        datatype=DataType.FLOAT,
        description="speed of the leading vehicle in km/h"
    )
    
    schema_for_front_car.add_field(
        field_name="lead_a",
        datatype=DataType.FLOAT,
        description="acceleration of the leading vehicle"
    )
    ```

- コレクションのスキーマを初期化する

    ```python
    schema = client.create_schema()
    
    schema.add_field(
        field_name="video_id",
        datatype=DataType.VARCHAR,
        description="primary key",
        max_length=16,
        is_primary=True,
        auto_id=False
    )
    
    schema.add_field(
        field_name="video_url",
        datatype=DataType.VARCHAR,
        max_length=512,
        description="URL of the video"
    )
    
    schema.add_field(
        field_name="captions",
        datatype=DataType.ARRAY,
        element_type=DataType.STRUCT,
        struct_schema=schema_for_caption,
        max_capacity=600,
        description="captions for the current video"
    )
    
    schema.add_field(
        field_name="traffic_lights",
        datatype=DataType.JSON,
        description="frame-specific traffic lights identified in the current video"
    )
    
    schema.add_field(
        field_name="front_cars",
        datatype=DataType.ARRAY,
        element_type=DataType.STRUCT,
        struct_schema=schema_for_front_car,
        max_capacity=600,
        description="frame-specific leading cars identified in the current video"
    )
    ```

### ステップ3：インデックスパラメータの設定\{#step-3-set-index-parameters}

すべてのベクトルフィールドはインデックス付けする必要があります。要素Struct内のベクトルフィールドをインデックス付けするには、インデックスタイプとして`AUTOINDEX`を使用し、埋め込みリスト間の類似性を測定するために`MAX_SIM`シリーズメトリックタイプを使用する必要があります。

```python
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="captions[plain_cap_vector]", 
    index_type="AUTOINDEX", 
    metric_type="MAX_SIM_COSINE", 
    index_name="captions_plain_cap_vector_idx", # mandatory for now
    index_params={"M": 16, "efConstruction": 200}
)

index_params.add_index(
    field_name="captions[rich_cap_vector]", 
    index_type="AUTOINDEX", 
    metric_type="MAX_SIM_COSINE", 
    index_name="captions_rich_cap_vector_idx", # mandatory for now
    index_params={"M": 16, "efConstruction": 200}
)

index_params.add_index(
    field_name="captions[risk_vector]", 
    index_type="AUTOINDEX", 
    metric_type="MAX_SIM_COSINE", 
    index_name="captions_risk_vector_idx", # mandatory for now
    index_params={"M": 16, "efConstruction": 200}
)
```

JSONフィールド内のフィルタリングを高速化するために、これらのフィールドに対してJSONシュレッディングを有効にすることをお勧めします。

### ステップ4: コレクションの作成{#step-4-create-a-collection}

スキーマとインデックスの準備ができたら、次のようにターゲットコレクションを作成できます。

```python
client.create_collection(
    collection_name="covla_dataset",
    schema=schema,
    index_params=index_params
)
```

### ステップ5: データを挿入する{#step-5-insert-the-data}

Turing Motosは、CoVLAデータセットを複数のファイルで整理しています。これには、生のビデオクリップ（`.mp4`）、状態（`states.jsonl`）、キャプション（`captions.jsonl`）、信号機（`traffic_lights.jsonl`）、および前方の車（`front_cars.jsonl`）が含まれます。

これらのファイルから各ビデオクリップのデータピースをマージし、データを挿入する必要があります。以下は、特定のビデオクリップのデータピースをマージするスクリプトです。

```python
import json
from openai import OpenAI

openai_client = OpenAI(
    api_key='YOUR_OPENAI_API_KEY',
)

video_id = "0a0fc7a5db365174" # represent a single video with 600 frames

# get all front car records in the specified video clip
entries = []
front_cars = []
with open('data/front_car/{}.jsonl'.format(video_id), 'r') as f:
    for line in f:
        entries.append(json.loads(line))

for entry in entries:
    for key, value in entry.items():
        value['frame_id'] = int(key)
        front_cars.append(value)

# get all traffic lights identified in the specified video clip
entries = []
traffic_lights = []
frame_id = 0
with open('data/traffic_lights/{}.jsonl'.format(video_id), 'r') as f:
    for line in f:
        entries.append(json.loads(line))

for entry in entries:
    for key, value in entry.items():
        if not value or (value['index'] == 1 and key != '0'):
            frame_id+=1

        if value:
            value['frame_id'] = frame_id
            traffic_lights.append(value)
        else:
            value_dict = {}
            value_dict['frame_id'] = frame_id
            traffic_lights.append(value_dict)

# get all captions generated in the video clip and convert them into vector embeddings
entries = []
captions = []
with open('data/captions/{}.jsonl'.format(video_id), 'r') as f:
    for line in f:
        entries.append(json.loads(line))

def get_embedding(text, model="embeddinggemma:latest"):
    response = openai_client.embeddings.create(input=text, model=model)
    return response.data[0].embedding

# Add embeddings to each entry
for entry in entries:
    # Each entry is a dict with a single key (e.g., '0', '1', ...)
    for key, value in entry.items():
        value['frame_id'] = int(key)  # Convert key to integer and assign to frame_id

        if "plain_caption" in value and value["plain_caption"]:
            value["plain_cap_vector"] = get_embedding(value["plain_caption"])
        if "rich_caption" in value and value["rich_caption"]:
            value["rich_cap_vector"] = get_embedding(value["rich_caption"])
        if "risk" in value and value["risk"]:
            value["risk_vector"] = get_embedding(value["risk"])

        captions.append(value)

data = {
    "video_id": video_id,
    "video_url": "https://your-storage.com/{}".format(video_id),
    "captions": captions,
    "traffic_lights": traffic_lights,
    "front_cars": front_cars
}
```

データを適切に処理したら、次のように挿入できます。

```python
client.insert(
    collection_name="covla_dataset",
    data=[data]
)

# {'insert_count': 1, 'ids': ['0a0fc7a5db365174'], 'cost': 0}
```

