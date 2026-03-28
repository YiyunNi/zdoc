---
title: "Access Log Reference | Cloud"
slug: /access-log-reference
sidebar_label: "Access Log Reference"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "Access logs are delivered in JSON Lines format - one JSON object per line. Each line is a self-contained JSON object representing a single operation. The following example shows a log entry of the Search operation | Cloud"
type: origin
token: TeLbw6guCimFLgkQWdmcZB2unMd
sidebar_position: 3
keywords: 
  - zilliz
  - vector database
  - cloud
  - access
  - logs
  - reference

---

import Admonition from '@theme/Admonition';


# Access Log Reference

Access logs are delivered in [JSON Lines](https://jsonlines.org/) format - one JSON object per line. Each line is a self-contained JSON object representing a single operation. The following example shows a log entry of the Search operation:

```json
{
    "action": "Search",
    "database": "Database1",
    "log_type": "Access",
    "user": "key-xxxxxxxxxx",
    "cluster_id": "in01-668744cf5e27e2d",
    "timestamp": 1742798170636,
    "trace_id": "90c09bcd04d8f41871ebe2c3aa7126d4",
    "result": 0,
    "interface": "Restful",
    "params": {
        "sdk": "Python",
        "expr": "",
        "collection": "medium_articles",
        "partition": "partition1",
        "input_params": {
            "anns_field": "",
            "offset": "0",
            "params": "{}",
            "round_decimal": "-1",
            "topk": "3"
        },
        "output_fields": ["title", "link", "id"],
        "consistency_level": 2,
        "execution_time": "2.924823ms",
        "ids": [
            "53d85e82-8fa0-4569-8dc9-7ecb2f9cc264",
            "9ead30cf-fa05-450a-8704-76c994dae0f2",
            "b85acff9-2375-4105-9baf-e82dea772a24"
        ],
        "scores": [0.11, 0.12, 0.13]
    }
}
```

In practice, each entry occupies a single line in the `.log` file. The sections below describe each field in detail.

## Log field schema\{#log-field-schema}

<table>
   <tr>
     <th><p><strong>Field</strong></p></th>
     <th><p><strong>Required</strong></p></th>
     <th><p><strong>Type</strong></p></th>
     <th><p><strong>Description</strong></p></th>
     <th><p><strong>Example</strong></p></th>
   </tr>
   <tr>
     <td><p><code>action</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>The operation name. See <a href="./access-log-reference#supported-actions">Supported actions</a>.</p></td>
     <td><p><code>"Search"</code></p></td>
   </tr>
   <tr>
     <td><p><code>database</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>The database where the operation occurred.</p></td>
     <td><p><code>"Database1"</code></p></td>
   </tr>
   <tr>
     <td><p><code>log_type</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>Log category: <code>"Access"</code>, <code>"Audit",</code> or <code>"Slow"</code>.</p></td>
     <td><p><code>"Access"</code></p></td>
   </tr>
   <tr>
     <td><p><code>user</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>The user or API key that issued the request.</p></td>
     <td><p><code>"key-xxxxxxxxxx"</code></p></td>
   </tr>
   <tr>
     <td><p><code>cluster_id</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>The unique identifier of the cluster.</p></td>
     <td><p><code>"in01-668744cf5e27e2d"</code></p></td>
   </tr>
   <tr>
     <td><p><code>timestamp</code></p></td>
     <td><p>Yes</p></td>
     <td><p>int</p></td>
     <td><p>Unix timestamp in milliseconds (13 digits) when the proxy received the request.</p></td>
     <td><p><code>1742798170636</code></p></td>
   </tr>
   <tr>
     <td><p><code>trace_id</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>A unique ID for the operation. Use this to correlate multiple log entries belonging to the same request.</p></td>
     <td><p><code>"90c09bcd04d8f41871ebe2c3aa7126d4"</code></p></td>
   </tr>
   <tr>
     <td><p><code>result</code></p></td>
     <td><p>Yes</p></td>
     <td><p>int</p></td>
     <td><p>The operation result code. 0 indicates success; non-zero values indicate errors.</p></td>
     <td><p><code>0</code></p></td>
   </tr>
   <tr>
     <td><p><code>interface</code></p></td>
     <td><p>Yes</p></td>
     <td><p>string</p></td>
     <td><p>The interface type: <code>"Restful"</code> or <code>"SDK"</code>.</p></td>
     <td><p><code>"Restful"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params</code></p></td>
     <td><p>Yes</p></td>
     <td><p>object</p></td>
     <td><p>Action-specific parameters. See <a href="./access-log-reference#params-fields">below</a> for nested fields.</p></td>
     <td><p>--</p></td>
   </tr>
</table>

### params fields\{#params-fields}

<table>
   <tr>
     <th><p>Field</p></th>
     <th><p>Required</p></th>
     <th><p>Type</p></th>
     <th><p>Description</p></th>
     <th><p>Example</p></th>
   </tr>
   <tr>
     <td><p><code>params.sdk</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>The SDK language, recorded when interface is SDK.</p></td>
     <td><p><code>"Python"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.expr</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>The filter expression passed with the request.</p></td>
     <td><p><code>""</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.collection</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>The name of the target collection. Required for Search, HybridSearch, and Query actions.</p></td>
     <td><p><code>"medium_articles"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.partition</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>The target partition, if specified.</p></td>
     <td><p><code>"partition1"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.input_params</code></p></td>
     <td><p>No</p></td>
     <td><p>object</p></td>
     <td><p>Input parameters for the operation (offset, limit, etc.).</p></td>
     <td><p><code>\{"limit": "10", "offset": "0"}</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.output_fields</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p>The output fields requested in the query.</p></td>
     <td><p><code>["title", "id"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.consistency_level</code></p></td>
     <td><p>No</p></td>
     <td><p>int</p></td>
     <td><p>The consistency level used for the operation.</p></td>
     <td><p><code>2</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.execution_time</code></p></td>
     <td><p>No</p></td>
     <td><p>string</p></td>
     <td><p>Server-side execution time in milliseconds, measured from when the proxy receives the full payload to when it begins sending the response. Does not include network transit time.</p></td>
     <td><p><code>"2.924823ms"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.ids</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p>The value of the primary key in the query result. Appears only for Search, HybridSearch, and Query actions when output fields are configured to include it.</p></td>
     <td><p><code>["53d85e82-...", "9ead30cf-..."]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.scores</code></p></td>
     <td><p>No</p></td>
     <td><p>array</p></td>
     <td><p>The similarity scores corresponding to each entry in <code>params.ids</code>. Appears only for Search, HybridSearch, and Query actions.</p></td>
     <td><p><code>[0.11, 0.12, 0.13]</code></p></td>
   </tr>
</table>

## Supported actions\{#supported-actions}

This release logs search- or query-class actions only:

<table>
   <tr>
     <th><p>Action</p></th>
     <th><p>Description</p></th>
   </tr>
   <tr>
     <td><p>Search</p></td>
     <td><p>Vector similarity search</p></td>
   </tr>
   <tr>
     <td><p>HybridSearch</p></td>
     <td><p>Multi-vector search with reranking</p></td>
   </tr>
   <tr>
     <td><p>Query</p></td>
     <td><p>Scalar filtering query</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>Support for additional actions is planned for a future release.</p>

</Admonition>

## File path and naming\{#file-path-and-naming}

Log files are organized in your object storage bucket with the following path structure:

```plaintext
/<Cluster ID>/<Log type>/<Date>/<File name><File name suffix>
```

<table>
   <tr>
     <th><p><strong>Component</strong></p></th>
     <th><p><strong>Format</strong></p></th>
     <th><p><strong>Example</strong></p></th>
   </tr>
   <tr>
     <td><p>Cluster ID</p></td>
     <td><p>The cluster's unique identifier</p></td>
     <td><p><code>in03-c7be749d5f403ad</code></p></td>
   </tr>
   <tr>
     <td><p>Log type</p></td>
     <td><p>access, audit, or slow</p></td>
     <td><p><code>access</code></p></td>
   </tr>
   <tr>
     <td><p>Date</p></td>
     <td><p>ISO date (YYYY-MM-DD)</p></td>
     <td><p><code>2024-12-20</code></p></td>
   </tr>
   <tr>
     <td><p>File name</p></td>
     <td><p>HH:MM:SS-&lt;UUID&gt;, where HH:MM:SS is the UTC time and &lt;UUID&gt; is a random string for uniqueness</p></td>
     <td><p><code>09:16:53-jz5l7D8Q</code></p></td>
   </tr>
   <tr>
     <td><p>File name suffix</p></td>
     <td><p>.log</p></td>
     <td><p><code>.log</code></p></td>
   </tr>
</table>

Full path example:

```plaintext
/in03-c7be749d5f403ad/access/2024-12-20/09:16:53-jz5l7D8Q.log
```

