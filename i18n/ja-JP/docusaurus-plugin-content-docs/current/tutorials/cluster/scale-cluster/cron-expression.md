---
title: "Cron式 | Cloud"
slug: /cron-expression
sidebar_label: "Cron式"
beta: FALSE
notebook: FALSE
description: "Cron式は、特定の時間にスケーリングタスクを実行するためのスケジュールを定義します。 | Cloud"
type: origin
token: UwfQwgneji2a7tkPa1rcQ7Rhnwc
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - クラスター
  - 管理
  - cron式

---

import Admonition from '@theme/Admonition';


# Cron式

cron式は、特定の時間にスケーリングタスクを実行するためのスケジュールを定義します。

このガイドでは、**Unix cron**形式（標準の**5フィールド**構文）について、**分単位**の粒度で説明します。スケジュールは、**すべてのフィールドが一致**したときにトリガーされます。cronスケジュールは、選択したタイムゾーンで評価されます。

## 式の形式とフィールド値\{#expression-format-and-field-values}

cron式は、空白で区切られた5つの時間と日付のフィールドで構成されます。 

```bash
* * * * *
│ │ │ │ └── day of week
│ │ │ └──── month
│ │ └────── day of month
│ └──────── hour
└────────── minute
```

<table>
   <tr>
     <th><p><strong>フィールド</strong></p></th>
     <th><p><strong>有効な値の範囲</strong></p></th>
     <th><p><strong>注釈</strong></p></th>
   </tr>
   <tr>
     <td><p><code>minute</code></p></td>
     <td><p>[0 - 59]</p></td>
     <td><p>--</p></td>
   </tr>
   <tr>
     <td><p><code>hour</code></p></td>
     <td><p>[0 - 23]</p></td>
     <td><p>24時間表記。</p><p>CRON式の<code>hour</code>フィールドの値が<code>17</code>の場合、このフィールドは<code>午後5時00分</code>から<code>午後5時59分</code>までの任意の時刻に一致します。</p></td>
   </tr>
   <tr>
     <td><p><code>day of month</code></p></td>
     <td><p>[1 - 31]</p></td>
     <td><p>すべての月に31日があるわけではありません。日数が少ない月に<code>31</code>をスケジュールした場合、その月にはスケジュールされたスケーリングタスクは実行されません。</p></td>
   </tr>
   <tr>
     <td><p><code>month</code></p></td>
     <td><p>[1 -12]</p></td>
     <td><p>--</p></td>
   </tr>
   <tr>
     <td><p><code>day of week</code></p></td>
     <td><p>[0 - 6]</p></td>
     <td><p><code>0</code>は<code>日曜日</code>、<code>1</code>は<code>月曜日</code>、<code>2</code>は<code>火曜日</code>などを表します。</p></td>
   </tr>
</table>

## 特殊文字と演算子\{#special-characters-and-operators}

これらの演算子は、ほとんどのフィールドで使用できます。

<table>
   <tr>
     <th><p><strong>演算子</strong></p></th>
     <th><p><strong>意味</strong></p></th>
     <th><p><strong>例</strong></p></th>
   </tr>
   <tr>
     <td><p><code>&ast;</code></p></td>
     <td><p>任意の値</p></td>
     <td><p><code>&ast; &ast; &ast; &ast; &ast;</code> は毎分実行されます。</p></td>
   </tr>
   <tr>
     <td><p><code>,</code></p></td>
     <td><p>値のリスト</p></td>
     <td><p><code>0 9,17 &ast; &ast; &ast;</code> は毎日09:00と17:00に実行されます。</p></td>
   </tr>
   <tr>
     <td><p><code>-</code></p></td>
     <td><p>値の範囲</p></td>
     <td><p><code>0 9-17 &ast; &ast; &ast;</code> は09:00から17:00まで毎時実行されます。</p></td>
   </tr>
   <tr>
     <td><p><code>/</code></p></td>
     <td><p>ステップ値 (N単位ごと)</p><p>注: 範囲とステップを組み合わせることもできます。</p></td>
     <td><p><code>&ast;/5 &ast; &ast; &ast; &ast;</code> は5分ごとに実行されます。</p><p><code>10-50/10 &ast; &ast; &ast; &ast;</code> は毎時10分、20分、30分、40分、50分に実行されます。</p></td>
   </tr>
</table>

## 例\{#examples}

このセクションでは、直接使用できる[シンプルなテンプレート](./cron-expression#simple-templates)をいくつか紹介します。演算子の組み合わせを使用する複雑な式が必要な場合は、[こちら](./cron-expression#common-scenarios)の例を参照してください。

### シンプルなテンプレート\{#simple-templates}

<table>
   <tr>
     <th><p><strong>ユースケース</strong></p></th>
     <th><p><strong>Cron式</strong></p></th>
     <th><p><strong>意味</strong></p></th>
   </tr>
   <tr>
     <td><p>毎分</p></td>
     <td><p><code>&ast; &ast; &ast; &ast; &ast;</code></p></td>
     <td><p>毎分実行</p></td>
   </tr>
   <tr>
     <td><p>5分ごと</p></td>
     <td><p><code>&ast;/5 &ast; &ast; &ast; &ast;</code></p></td>
     <td><p>5分ごとに実行</p></td>
   </tr>
   <tr>
     <td><p>毎時</p></td>
     <td><p><code>0 &ast; &ast; &ast; &ast;</code></p></td>
     <td><p>毎時開始時に実行</p></td>
   </tr>
   <tr>
     <td><p>毎日09:30</p></td>
     <td><p><code>30 9 &ast; &ast; &ast;</code></p></td>
     <td><p>毎日09:30に実行</p></td>
   </tr>
   <tr>
     <td><p>平日09:00</p></td>
     <td><p><code>0 9 &ast; &ast; 1-5</code></p></td>
     <td><p>月曜日から金曜日の09:00に実行</p></td>
   </tr>
   <tr>
     <td><p>毎月1日の09:00</p></td>
     <td><p><code>0 9 1 &ast; &ast;</code></p></td>
     <td><p>毎月1日の09:00に実行</p></td>
   </tr>
   <tr>
     <td><p>毎週日曜日の09:00</p></td>
     <td><p><code>0 9 &ast; &ast; 0</code></p></td>
     <td><p>毎週日曜日の09:00に実行</p></td>
   </tr>
   <tr>
     <td><p>1日2回</p></td>
     <td><p><code>0 9,21 &ast; &ast; &ast;</code></p></td>
     <td><p>毎日09:00と21:00に実行</p></td>
   </tr>
</table>

### 一般的なシナリオ\{#common-scenarios}

以下の例は、一般的なワークロードパターンに基づいて、スケジュールされたスケーリングタスクのUnix cron式を記述する方法を示しています。

**例1: 平日のピーク時間帯にスケールアップし、平日のオフピーク時間帯にスケールダウンする**

これを行うには、ピーク時間帯とオフピーク時間帯の2つのスケジュールを作成します。

- **ピーク時間帯:** `* 9-18 * * 1-5`
月曜日から金曜日の09:00から18:59まで毎分実行されます。

- **オフピーク時間帯:** `* 0-8,19-23 * * 1-5`
月曜日から金曜日の00:00から08:59までと19:00から23:59まで毎分実行されます。

**例2: 週末の低コストモード + 月曜日の復元**

これを行うには、週末用と月曜日の復元用の2つのスケジュールを作成します。

- **週末:** `* * * * 0,6`
土曜日と日曜日に毎分実行されます。

- **月曜日の復元:** `0 9 * * 1`
毎週月曜日の09:00に実行されます。

