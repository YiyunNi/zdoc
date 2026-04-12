---
title: "2025 年 12 月リリースノート | Cloud"
slug: /release-notes-2512
sidebar_label: "2025 年 12 月"
beta: FALSE
notebook: FALSE
description: "2025 年 12 月の Zilliz Cloud リリースノートです。"
type: origin
token: LX0RwtoEEihhNukmt1DcSQGfnjb
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 2025年12月リリースノート

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-12-26**

    </div>

    <div>

        ## Milvus v2.6 GA\{#milvus-v26-ga}

        本リリースは、Milvus v2.6.x のGA（一般 Availability）マイルストーンを達成し、Zilliz Cloud上でプロダクションレディな安定性と完全な機能サポートを提供します。これには、ジオメトリ、構造体、TimestampTzデータ型、ダウンタイムなしでのフィールド追加、強化された全文検索、高速化されたJSONフィルタリング、新しいリランキング関数、INT8ベクトルサポート、部分的なアップサート、およびMINHASH_LSHインデックスが含まれます。

        ティアードストレージもGAに到達し、アップグレードされたホット/ウォーム/コールドアーキテクチャを導入するとともに、コールドデータへのアクセスに対して課金を開始します。詳細については、[ストレージコスト](./storage-cost#cold-data-access)をご参照ください。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-12-10**

    </div>

    <div>

        ## 機能強化\{#enhancements}

        - Milvusエンドポイントの移行がジオメトリおよび構造体データ型をサポートするようになり、空間形状や深くネストされた属性を持つコレクションをシームレスに移行できるようになりました。

        - 課金コンソールに前払い残高（Advance balance）が表示されるようになり、プリペイド利用状況と残高をより明確に把握できるようになりました。

        - RESTful APIがAuto Scaling設定をサポートするようになり、クラスタのスケーラビリティポリシーをプログラムで管理できるようになりました。

        - ジョブセンターがより詳細な進捗状況を提供し、ユーザーがジョブのステータスと実行ステージをより明確に把握できるようになりました。

        - 登録フローが簡略化されたフォームにより最適化され、オンボーディング効率と全体的なユーザーエクスペリエンスが向上しました。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-12-01**

    </div>

    <div>

        ## ボリューム GA（旧称：ステージ）\{#volume-ga-formerly-stage}

        **ステージがGAに到達**し、正式に **ボリューム** へと名称変更されたことをお知らせします。ボリュームは、構造化テーブルまたは非構造化データファイルのコレクションを保持するマネージドオブジェクトストアであり、Zilliz Cloudにおけるスケーラブルなデータ取り込みおよびETLワークフローのための統一データレイヤーとして機能します。

        今回のGAリリースでは、以下の新機能が追加されました：

        - **ボリュームレベルRBAC** 

            読み取り/書き込み権限に対するきめ細かなロールベースアクセス制御。

        - **コンソールサポート**

            Zilliz Cloudコンソールから直接ボリュームを作成・管理・監視可能。

        - **GCPサポート** 

            ボリュームが **AWSおよびGCP** をサポートし、マルチクラウドの柔軟性を実現。

        GAに伴い、ボリュームは「Free Trial ボリューム」と「Pay-as-you-go ボリューム」の2つの課金モードをサポートします。Pay-as-you-go ボリュームは、ストレージ使用量に基づいて課金されます。

        詳細については、[ボリュームの概要](./volume-explained)、[ボリュームの管理（SDK）](./manage-stages)、および[ボリュームの管理（コンソール）](./manage-volumes-via-console)をご参照ください。

        ## 組織レベルIPアクセス許可リスト\{#organization-level-ip-access-allowlist}

        セキュリティ強化およびエンタープライズコンプライアンス要件を満たすため、Zilliz CloudではEnterpriseプランおよびビジネスクリティカルプラン向けに組織レベルのIPアクセス許可リストをサポートします。

        - **きめ細かなアクセス制御** 

            組織オーナーがコンソールアクセス用の信頼済みIPv4アドレスまたはCIDR範囲を定義でき、承認されていない送信元からのトラフィックはブロックされます。

        - **包括的な監査**

            許可リストのライフサイクルイベント（有効化、無効化、ルール変更）すべてがプラットフォーム監査ログに記録されます。

        詳細については、[コンソールIP許可リストの設定](./setup-console-ip-allowlist)をご参照ください。

        ## MFAセキュリティアップグレード:\{#mfa-security-upgrade}

        Zilliz Cloudでは、Eメールベースの認証よりも強固な保護を提供する **TOTPベースのMFA**（例：Google/Microsoft Authenticator）をサポートします。

        - **組織レベルでの適用**: Enterpriseプランの管理者は、組織内の全メンバーに対してMFAの必須ポリシーを適用し、コンプライアンス基準を確保できます。

        - **レガシー移行**: EメールのみのMFAは非推奨となります。既存ユーザーには認証アプリへの移行が促されます。

        詳細については、[MFA](./multi-factor-auth)をご参照ください。

    </div>

</Grid>

