---
title: "FAQ: 認証 | Cloud"
slug: /faq-authentication
sidebar_label: "FAQ: 認証"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud での本人確認中に発生する可能性のある問題と、それに対応する解決策を一覧で紹介します。| CLOUD"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 11

---

# FAQ: 認証

このトピックでは、Zilliz Cloud での本人確認中に発生する可能性のある問題と、それに対応する解決策を一覧にしています。

## 目次

- [Zilliz Cloud クラスタへの接続に使用したパスワードを忘れた場合はどうすればよいですか？](#what-can-i-do-if-i-forget-the-password-used-to-connect-to-my-zilliz-cloud-cluster)

## よくある質問




BYOC デプロイメントでは、データプレーンの RESTful API エンドポイントを呼び出す際に、ターゲットクラスタのユーザー名とパスワードをコロンで区切った文字列（例：`username:password`）を認証トークンとして使用します。

### Zilliz Cloud クラスタへの接続に使用したパスワードを忘れた場合はどうすればよいですか？\{#what-can-i-do-if-i-forget-the-password-used-to-connect-to-my-zilliz-cloud-cluster}

パスワードを忘れた場合は、パスワードをリセットできます。ただし、デフォルトユーザーのパスワードを忘れた場合は、新しいパスワードを持つ新しいユーザーを作成できます。詳細については、[クラスタ資格情報 (コンソール)](./cluster-credentials) およびクラスタ資格情報 (SDK) を参照してください。
