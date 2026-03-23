---
title: "2025年12月 リリースノート | Cloud"
slug: /release-notes-2512
sidebar_label: "2025年12月"
beta: FALSE
notebook: FALSE
description: "2025年12月のZilliz Cloudリリースノートです。"
type: origin
token: LX0RwtoEEihhNukmt1DcSQGfnjb
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
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

        このリリースはMilvus v2.6.xのGAマイルストーンを記念するもので、Zilliz Cloud上で本番環境に対応した安定性と完全な機能サポートを提供します。これには、ジオメトリ、構造体、TimestampTzデータ型、ダウンタイムなしのフィールド追加、強化された全文検索、高速化されたJSONフィルタリング、新しい再ランキング機能、INT8ベクトルサポート、部分的なアップサート、およびMINHASH_LSHインデックスが含まれます。

        階層型ストレージもGAに達し、アップグレードされたホット/ウォーム/コールドアーキテクチャが導入され、コールドデータアクセスに対する課金が開始されます。詳細については、[ストレージコスト](./storage-cost#cold-data-access)を参照してください。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-12-10**

    </div>

    <div>

        ## 強化点\{#enhancements}

        - Milvus Endpointの移行がジオメトリおよび構造体データ型をサポートするようになり、空間形状や深くネストされた属性を持つコレクションのシームレスな移行が可能になりました。

        - 請求コンソールにAdvance残高が表示されるようになり、前払い使用量と残高がより明確に確認できるようになりました。

        - RESTful APIがオートスケーリング設定をサポートするようになり、クラスターの弾力性ポリシーをプログラムで管理できるようになりました。

        - ジョブセンターがより詳細な進捗状況の更新を提供するようになり、ユーザーはジョブのステータスと実行ステージをより明確に把握できるようになりました。

        - 登録フローが簡素化されたフォームで最適化され、オンボーディングの効率と全体的なユーザーエクスペリエンスが向上しました。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-12-01**

    </div>

    <div>

        ## ボリューム GA (旧ステージ)\{#volume-ga-formerly-stage}

        **ステージがGAに到達しました**し、正式に**ボリューム**に名称変更されたことをお知らせします。ボリュームは、構造化されたテーブルまたは非構造化データファイルのコレクションを保持するマネージドオブジェクトストアであり、Zilliz CloudにおけるスケーラブルなデータオンボーディングおよびETLワークフローのための統合データレイヤーとして機能します。

        このGAリリースにおける新機能：

        - **ボリュームレベルRBAC**

            読み取り/書き込み権限に対するきめ細かいロールベースのアクセス制御。

        - **コンソールサポート**

            Zilliz Cloudコンソールで直接ボリュームを作成、管理、監視できます。

        - **GCPサポート**

            ボリュームは**AWSとGCP**をサポートし、マルチクラウドの柔軟性を実現します。

        GAに伴い、ボリュームはFree Trial ボリュームとPay-as-you-go ボリュームの2つの課金モードをサポートします。Pay-as-you-go ボリュームはストレージ使用量に基づいて課金が開始されます。

        詳細については、[ボリュームの概要](./volume-explained)、[ボリュームの管理 (SDK)](./manage-stages)、および[ボリュームの管理 (コンソール)](./manage-volumes-via-console)を参照してください。

        ## 組織レベルのIPアクセス許可リスト\{#organization-level-ip-access-allowlist}

        セキュリティを強化し、企業のコンプライアンス要件を満たすため、Zilliz CloudはEnterpriseおよびビジネスクリティカルプラン向けに組織レベルのIPアクセス許可リストをサポートするようになりました。

        - **きめ細かなアクセス制御**

            組織の所有者は、コンソールアクセス用の信頼できるIPv4アドレスまたはCIDR範囲を定義できます。未承認のソースからのトラフィックはブロックされます。

        - **包括的な監査**

            すべての許可リストのライフサイクルイベント（有効化、無効化、ルール変更）はプラットフォーム監査ログに記録されます。

        詳細については、[コンソールIP許可リストの設定](./setup-console-ip-allowlist)を参照してください。

        ## MFAセキュリティアップグレード:\{#mfa-security-upgrade}

        Zilliz Cloudは**TOTPベースのMFA**（例：Google/Microsoft Authenticator）をサポートするようになり、Eメールベースの認証よりも強力な保護を提供します。

        - **組織レベルでの適用**: Enterpriseプランの管理者は、コンプライアンス基準を確保するために、すべての組織メンバーに対してMFAポリシーを強制できるようになりました。

        - **レガシー移行**: EメールのみのMFAは非推奨になります。既存のユーザーは認証アプリへの移行を促されます。

        詳細については、[MFA](./multi-factor-auth)を参照してください。

    </div>

</Grid>

