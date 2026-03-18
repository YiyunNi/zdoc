---
title: "FAQ: セキュリティ | BYOC"
slug: /faq-security
sidebar_label: "FAQ: セキュリティ"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud プラットフォームにおけるデータセキュリティに関連する潜在的な問題について説明します。これには、認証局、証明書の有効期間、証明書の有効期限を確認する手順、サポートされている Transport Layer Security (TLS) バージョン、および認証方法が含まれます。| BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 12

---

# FAQ: セキュリティ

このトピックでは、Zilliz Cloud プラットフォーム上のデータセキュリティに関連する可能性のある問題について説明します。具体的には、証明機関（CA）、証明書の有効期間、証明書の有効期限を確認する手順、サポートされているトランスポート層セキュリティ（TLS）のバージョン、および認証方法について取り上げます。

## 目次

- [Zilliz Cloud クラスターエンドポイントの証明機関は何ですか？](#what-is-the-certificate-authority-for-zilliz-cloud-cluster-endpoints)
- [私の Zilliz Cloud クラスターの証明書の有効期間はどのくらいですか？](#what-is-the-certificate-validity-period-for-my-zilliz-cloud-cluster)
- [証明書が失効しているかどうかを確認するにはどうすればよいですか？](#how-can-i-check-whether-a-certificate-expires)
- [Zilliz Cloud でサポートされている TLS バージョンはどれですか？](#which-tls-versions-are-supported-on-zilliz-cloud)
- [Zilliz Cloud は mTLS をサポートしていますか？](#does-zilliz-cloud-support-mtls)

## よくある質問




### Zilliz Cloud クラスターエンドポイントの証明機関は何ですか？\{#what-is-the-certificate-authority-for-zilliz-cloud-cluster-endpoints}

Zilliz Cloud は、AWS、Google Cloud Platform (GCP)、および Microsoft Azure 上でホストされる Zilliz Cloud クラスターの証明書を発行・署名するために **Let's Encrypt** を使用しています。

さらに、AWS 上の Zilliz Cloud クラスターについては、証明書の発行とローテーションに **AWS Certificate Manager (ACM)** を使用しています。

### 私の Zilliz Cloud クラスターの証明書の有効期間はどのくらいですか？\{#what-is-the-certificate-validity-period-for-my-zilliz-cloud-cluster}

お客様の Zilliz Cloud クラスターに対して発行された証明書は、発行日から **90 日間** 有効であり、有効期限の **30 日前** に自動的にローテーションされます。

### 証明書が失効しているかどうかを確認するにはどうすればよいですか？\{#how-can-i-check-whether-a-certificate-expires}

次のコマンドを実行して、Zilliz Cloud クラスターの証明書が失効しているかどうかを確認できます。

以下の例では、GCP に `inxx-xxxxxxxxxxxxxxxxx` というインスタンス ID のクラスターを作成済みであることを前提としています。対象のクラスターエンドポイントが `:443` などの正しいポート番号で終わるようにしてください。

```bash
echo | openssl s_client -showcerts -connect inxx-xxxxxxxxxxxxxxxxx.gcp-us-west1.vectordb.zillizcloud.com:443 2> /dev/null | openssl x509 -noout -enddate
```

コマンドの出力は、以下のようなものになります。

```bash
notAfter=Jul  7 06:58:17 2025 GMT
```

### Zilliz Cloud でサポートされている TLS バージョンはどれですか？\{#which-tls-versions-are-supported-on-zilliz-cloud}

セキュリティ上の理由から、Zilliz Cloud では **TLS 1.2** および **TLS 1.2+** のみがサポートされています。TLS 1.0 および TLS 1.1 はサポートされていません。

### Zilliz Cloud は mTLS をサポートしていますか？\{#does-zilliz-cloud-support-mtls}

Zilliz Cloud は現在、ワンウェイ TLS 認証のみをサポートしており、双方向 TLS 認証はサポートされていません。