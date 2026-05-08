---
title: "Vector | Go | v2"
slug: /go/v2-Vector
sidebar_key: v2-Vector
sidebar_label: "Vector"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Interface for vector data. Implementations include FloatVector, BinaryVector, Float16Vector, BFloat16Vector, Int8Vector, and Text. | Go | v2"
type: docx
token: CE0odAFVdoh2ehxNFRecD8WEn3f
sidebar_position: 16
keywords: 
  - what are vector databases
  - vector databases comparison
  - Faiss
  - Video search
  - zilliz
  - zilliz cloud
  - cloud
  - Vector
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# Vector

Interface for vector data. Implementations include FloatVector, BinaryVector, Float16Vector, BFloat16Vector, Int8Vector, and Text.

```go
type Vector interface {
    Dim() int
    Serialize() []byte
    FieldType() FieldType
}
```

**METHODS:**

- `Dim() int`

    Returns the dimensionality of the vector.

- `Serialize() []byte`

    Serializes the vector data to bytes.

- `FieldType() FieldType`

    Returns the FieldType enum value for this vector type.

## Example\{#example}

```go
// Vector is typically obtained from API calls or constructors
// TODO: Usage example
```
