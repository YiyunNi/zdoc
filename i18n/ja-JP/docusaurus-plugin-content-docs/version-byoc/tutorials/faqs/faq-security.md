---
title: "FAQ: セキュリティ | BYOC"
slug: /faq-security
sidebar_label: "FAQ: セキュリティ"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud プラットフォームにおけるデータセキュリティに関する潜在的な問題について説明します。具体的には、認証局、証明書の有効期間、証明書の有効期限を確認する手順、サポートされている Transport Layer Security (TLS) バージョン、および認証方法について扱います。 | BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 12

---

# FAQ: セキュリティ

このトピックでは、Zilliz Cloudプラットフォームにおけるデータセキュリティに関連する潜在的な問題について説明します。これには、認証局、証明書の有効期間、証明書の有効期限を確認する手順、サポートされているTransport Layer Security (TLS)バージョン、および認証方法が含まれます。

## 目次

- [Zilliz Cloudクラスターエンドポイントの認証局は何ですか？](#what-is-the-certificate-authority-for-zilliz-cloud-cluster-endpoints)
- [Zilliz Cloudクラスターの証明書の有効期間はどのくらいですか？](#what-is-the-certificate-validity-period-for-my-zilliz-cloud-cluster)
- [証明書の有効期限が切れているかどうかを確認するにはどうすればよいですか？](#how-can-i-check-whether-a-certificate-expires)
- [Zilliz CloudでサポートされているTLSバージョンは何ですか？](#which-tls-versions-are-supported-on-zilliz-cloud)
- [Zilliz CloudはmTLSをサポートしていますか？](#does-zilliz-cloud-support-mtls)

## FAQ




### Zilliz Cloudクラスターエンドポイントの認証局は何ですか？{#what-is-the-certificate-authority-for-zilliz-cloud-cluster-endpoints}

Zilliz Cloudは、AWS、Google Cloud Platform (GCP)、およびMicrosoft AzureでホストされているZilliz Cloudクラスターの証明書の発行と署名に**Let's Encrypt**を使用しています。

さらに、Zilliz Cloudは、AWS上のZilliz Cloudクラスターの証明書の発行とローテーションに**AWS Certificate Manager (ACM)**を採用しています。

### Zilliz Cloudクラスターの証明書の有効期間はどのくらいですか？{#what-is-the-certificate-validity-period-for-my-zilliz-cloud-cluster}

Zilliz Cloudクラスターの証明書は、発行日から**90日間**有効であり、有効期限の**30日前**に自動的にローテーションされます。

### 証明書の有効期限が切れているかどうかを確認するにはどうすればよいですか？{#how-can-i-check-whether-a-certificate-expires}

Zilliz Cloudクラスターの証明書の有効期限が切れているかどうかを確認するには、次のコマンドを実行します。

次のコマンド例では、GCPでクラスターを作成し、そのインスタンスIDが`inxx-xxxxxxxxxxxxxxxxx`であると仮定しています。ターゲットクラスターのエンドポイントが`:443`などの正しいポート番号で終わっていることを確認してください。

```bash
echo | openssl s_client -showcerts -connect inxx-xxxxxxxxxxxxxxxxx.gcp-us-west1.vectordb.zillizcloud.com:443 2> /dev/null | openssl x509 -noout -enddate
```

コマンド出力は以下のようになります。

```bash
notAfter=Jul  7 06:58:17 2025 GMT
```

### Zilliz CloudでサポートされているTLSバージョンは何ですか？{#which-tls-versions-are-supported-on-zilliz-cloud}

セキュリティ上の理由から、Zilliz Cloudは**TLS 1.2**および**TLS 1.2+**のみをサポートしています。TLS 1.0およびTLS 1.1はサポートされていません。

### Zilliz CloudはmTLSをサポートしていますか？{#does-zilliz-cloud-support-mtls}

Zilliz Cloudは現在、一方向TLS認証のみをサポートしており、双方向TLS認証はサポートしていません。