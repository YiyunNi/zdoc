---
title: "FAQ: 始め方 | BYOC"
slug: /faq-get-started
sidebar_label: "FAQ: 始め方"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud の利用開始時に発生する可能性のある問題と、それらの解決策を一覧で紹介します。| BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 1

---

# FAQ: 始め方

このトピックでは、Zilliz Cloud の利用開始時に発生する可能性のある問題と、それに対応する解決策を一覧にしています。

## 目次

- [Zilliz Cloud と他のベクトル検索ソリューションとのパフォーマンス比較はありますか？](#is-there-any-performance-comparison-between-zilliz-cloud-and-other-vector-search-solutions)
- [Zilliz Cloud でサポートされているインデックスタイプは何ですか？](#which-type-of-index-is-supported-by-zilliz-cloud)
- [Zilliz Cloud の検索レイテンシ是多少ですか？](#what-is-the-search-latency-of-zilliz-cloud)
- [さらに技術サポートを受けるにはどうすればよいですか？](#how-can-i-get-further-technical-support)
- [GitHub アカウントでサインアップできますか？](#can-i-sign-up-with-my-github-account)
- [サインアップ中にメール認証コードが届きませんでした。どうすればよいですか？](#during-signup-i-did-not-receive-the-email-verification-code-what-should-i-do)
- [登録が失敗したのはなぜですか？](#why-did-my-registration-fail)
- [Google または GitHub でサインアップする前に MFA を無効にする必要がありますか？](#do-i-need-to-disable-mfa-before-signing-up-with-google-or-github)

## よくある質問




### Zilliz Cloud と他のベクトル検索ソリューションとのパフォーマンス比較はありますか？\{#is-there-any-performance-comparison-between-zilliz-cloud-and-other-vector-search-solutions}

はい。[VectorDBBench](https://zilliz.com/vector-database-benchmark-tool) というベクトルデータベースのベンチマークツールを使用して、Zilliz Cloud と他の主流のベクトルデータベースおよびクラウドサービスのパフォーマンスを比較できます。

### Zilliz Cloud でサポートされているインデックスタイプは何ですか？\{#which-type-of-index-is-supported-by-zilliz-cloud}

現在、Zilliz Cloud は AUTOINDEX のみをサポートしています。これは、より良い検索パフォーマンスを実現するのに役立つ独自のインデックスタイプです。詳細については、[AUTOINDEX の解説](./autoindex-explained) をご覧ください。

ただし、私たちがサポートしている [いずれかのインデックス](https://milvus.io/docs/index.md) の使用に慣れている場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us) してください。アプリケーションの要件を評価し、インデックスを有効化するお手伝いをいたします。

### Zilliz Cloud の検索レイテンシ是多少ですか？\{#what-is-the-search-latency-of-zilliz-cloud}

検索レイテンシは、CU タイプとデータ量によって異なります。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>パフォーマンス最適化済み CU のレイテンシ（768 次元、100 万ベクトル）</p></th>
     <th><p>容量最適化済み CU のレイテンシ（768 次元、500 万ベクトル）</p></th>
   </tr>
   <tr>
     <td><p>10</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>100</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>250</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>1000</p></td>
     <td><p>10 - 20 ms</p></td>
     <td><p>50 - 100 ms</p></td>
   </tr>
</table>

テスト結果の詳細については、[適切な CU の選択](./cu-types-explained) をご覧ください。

### さらに技術サポートを受けるにはどうすればよいですか？\{#how-can-i-get-further-technical-support}

Zilliz Cloud の [サポートポータル](https://support.zilliz.com/hc/en-us) にてリクエストを送信してください。

### GitHub アカウントでサインアップできますか？\{#can-i-sign-up-with-my-github-account}

はい、ただし GitHub アカウントには公開メールアドレスが必要です。登録前に GitHub プロフィール設定でメールアドレスを公開に設定してください。

### サインアップ中にメール認証コードが届きませんでした。どうすればよいですか？\{#during-signup-i-did-not-receive-the-email-verification-code-what-should-i-do}

認証ページで「再送信」をクリックしてください。それでも届かない場合は、スパムフォルダを確認してください。

### 登録が失敗したのはなぜですか？\{#why-did-my-registration-fail}

同じメールアドレスですでにアカウントを持っている可能性があります。代わりにログインを試みてください。問題が解決しない場合は、[サポートにお問い合わせ](https://support.zilliz.com/) ください。

### Google または GitHub でサインアップする前に MFA を無効にする必要がありますか？\{#do-i-need-to-disable-mfa-before-signing-up-with-google-or-github}

はい。Google または GitHub アカウントでプロバイダー管理型の MFA が有効になっている場合は、スムーズに登録できるよう、リンクする前に無効にしてください。後で再度有効にすることができます。
