---
title: "FAQ: はじめに | CLOUD"
slug: /faq-get-started
sidebar_label: "FAQ: はじめに"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud の利用開始時に発生する可能性のある問題と、それらの解決方法をリストしています。| CLOUD"
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
- [すべてのリージョンで料金は同じですか？](#is-pricing-the-same-in-every-region)
- [無料トライアル終了後どうなりますか？](#what-happens-after-the-free-trial)
- [マーケットプレイスにおける Zilliz Cloud の料金はどうなっていますか？](#what-is-the-pricing-of-zilliz-cloud-on-marketplaces)
- [さらにクレジットを申請できますか？](#can-i-apply-for-more-credits)
- [無料トライアルを延長できますか？](#can-i-extend-my-free-trial)
- [さらに技術サポートを受けるにはどうすればよいですか？](#how-can-i-get-further-technical-support)
- [GitHub アカウントでサインアップできますか？](#can-i-sign-up-with-my-github-account)
- [サインアップ中にメール認証コードが届きませんでした。どうすればよいですか？](#during-signup-i-did-not-receive-the-email-verification-code-what-should-i-do)
- [登録が失敗したのはなぜですか？](#why-did-my-registration-fail)
- [Google または GitHub でサインアップする前に MFA を無効にする必要がありますか？](#do-i-need-to-disable-mfa-before-signing-up-with-google-or-github)

## よくある質問




### Zilliz Cloud と他のベクトル検索ソリューションとのパフォーマンス比較はありますか？\{#is-there-any-performance-comparison-between-zilliz-cloud-and-other-vector-search-solutions}

はい。[VectorDBBench](https://zilliz.com/vector-database-benchmark-tool) というベクトルデータベースベンチマークツールを使用して、Zilliz Cloud と他の主流のベクトルデータベースおよびクラウドサービスのパフォーマンスを比較できます。

### Zilliz Cloud でサポートされているインデックスタイプは何ですか？\{#which-type-of-index-is-supported-by-zilliz-cloud}

現在、Zilliz Cloud は AUTOINDEX のみをサポートしています。これは、より良い検索パフォーマンスを実現するのに役立つ独自のインデックスタイプです。詳細については、[AUTOINDEX の解説](./autoindex-explained) をご覧ください。

ただし、私たちがサポートしている [いずれかのインデックス](https://milvus.io/docs/index.md) の使用に慣れている場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us) してください。アプリケーションの要件を評価し、インデックスを有効化するお手伝いをいたします。

### Zilliz Cloud の検索レイテンシ是多少ですか？\{#what-is-the-search-latency-of-zilliz-cloud}

検索レイテンシは CU タイプとデータ量によって異なります。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>パフォーマンス最適化済み CU のレイテンシ（768 次元 100 万ベクトル）</p></th>
     <th><p>容量最適化済み CU のレイテンシ（768 次元 500 万ベクトル）</p></th>
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

### すべてのリージョンで料金は同じですか？\{#is-pricing-the-same-in-every-region}

簡単に言えば、クラウドサービスの価格はプロバイダーやリージョンによって異なることがよくあります。これらの違いには、クラウドデータベースサービスが依存する基盤となる物理リソースのコストなど、いくつかの要因が関係しています。詳細については、[料金](https://zilliz.com/pricing) をご覧ください。

### 無料トライアル終了後どうなりますか？\{#what-happens-after-the-free-trial}

無料トライアルが終了しても、フリークラスターには引き続きアクセスできます。ただし、サーバーレスクラスターおよび専用クラスター内のすべてのデータはごみ箱に移動され、30 日間保持されます。クラスターデータを安全に復元するには、支払い方法を登録してください。詳細については、[Zilliz Cloud を無料でお試しください](./free-trials#use-free-trial) を参照してください。

### マーケットプレイスにおける Zilliz Cloud の料金はどうなっていますか？\{#what-is-the-pricing-of-zilliz-cloud-on-marketplaces}

マーケットプレイスの料金条件については、[支払いと請求](./payment-billing#marketplace-pricing-terms) をご覧ください。

### さらにクレジットを申請できますか？\{#can-i-apply-for-more-credits}

仕事用メールアドレスで Zilliz Cloud に登録すると、&#36;100 の無料クレジットが付与されます。また、[マーケットプレイス](./subscribe-on-aws-marketplace) で Zilliz Cloud をサブスクライブすることで、追加で &#36;100 のクレジットを獲得できます。追加クレジットや割引については、[営業担当者にお問い合わせ](https://zilliz.com/contact-sales) ください。

### 無料トライアルを延長できますか？\{#can-i-extend-my-free-trial}

はい、可能です。Zilliz Cloud に登録すると、30 日間有効な &#36;100 のクレジットが付与されます。[支払い方法を追加](./payment-billing) することで、これらのクレジットの有効期間を 1 年に延長できます。

### さらに技術サポートを受けるにはどうすればよいですか？\{#how-can-i-get-further-technical-support}

Zilliz Cloud の [サポートポータル](https://support.zilliz.com/hc/en-us) からリクエストを送信してください。

### GitHub アカウントでサインアップできますか？\{#can-i-sign-up-with-my-github-account}

はい、ただし GitHub アカウントには公開メールアドレスが設定されている必要があります。登録前に GitHub プロフィール設定でメールアドレスを公開に設定してください。

### サインアップ中にメール認証コードが届きませんでした。どうすればよいですか？\{#during-signup-i-did-not-receive-the-email-verification-code-what-should-i-do}

認証ページで「再送信」をクリックしてください。それでも届かない場合は、スパムフォルダを確認してください。

### 登録が失敗したのはなぜですか？\{#why-did-my-registration-fail}

すでに同じメールアドレスでアカウントをお持ちかもしれません。代わりにログインをお試しください。問題が解決しない場合は、[サポートにお問い合わせ](https://support.zilliz.com/) ください。

### Google または GitHub でサインアップする前に MFA を無効にする必要がありますか？\{#do-i-need-to-disable-mfa-before-signing-up-with-google-or-github}

はい。Google または GitHub アカウントでプロバイダー管理型の MFA が有効になっている場合は、スムーズに登録できるよう、リンクする前に無効にしてください。その後、再度有効にすることができます。
