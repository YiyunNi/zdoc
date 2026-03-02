---
title: "2025年12月 リリースノート | Cloud"
slug: /release-notes-2512
sidebar_label: "2025年12月"
beta: FALSE
notebook: FALSE
description: "2025年12月 リリースノート | Cloud"
type: origin
token: LX0RwtoEEihhNukmt1DcSQGfnjb
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート
  - コサイン距離
  - ベクトルデータベースとは
  - vectordb
  - マルチモーダルベクトルデータベース検索

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

        このリリースはMilvus v2.6.xのGAマイルストーンであり、Zilliz Cloudで本番環境に対応した安定性と完全な機能サポートを提供します。これには、Geometry、Struct、TimestampTzデータ型、ダウンタイムなしのフィールド追加、強化されたfull text search、高速化されたJSONフィルタリング、新しい再ランキング関数、INT8ベクターサポート、部分的なupsert、およびMINHASH_LSHインデックスが含まれます。

        階層型ストレージもGAに達し、アップグレードされたホット/ウォーム/コールドアーキテクチャが導入され、コールドデータアクセス課金が開始されます。詳細については、[ストレージコスト](./storage-cost#cold-data-access)を参照してください。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-12-10**

    </div>

    <div>

        ## 強化\{#enhancements}

        - Milvus Endpointの移行がGeometryおよびStructデータ型をサポートするようになり、空間形状と深くネストされた属性を持つcollectionのシームレスな移行が可能になりました。

        - 請求コンソールにAdvance残高が表示されるようになり、前払い使用量と残高がより明確に確認できるようになりました。

        - RESTful APIがAuto Scaling設定をサポートするようになり、クラスターの弾力性ポリシーをプログラムで管理できるようになりました。

        - ジョブセンターがより詳細な進捗状況の更新を提供するようになり、ユーザーはジョブのステータスと実行段階をより明確に把握できるようになりました。

        - 登録フローが簡素化されたフォームで最適化され、オンボーディングの効率と全体的なユーザーエクスペリエンスが向上しました。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-12-01**

    </div>

    <div>

        ## Volume GA (旧称 Stage)\{#volume-ga-formerly-stage}

        **StageがGAに達し**、正式に**Volume**に名称変更されたことをお知らせいたします。Volumeは、構造化されたテーブルまたは非構造化データファイルのcollectionを保持するマネージドオブジェクトストアであり、Zilliz CloudにおけるスケーラブルなデータオンボーディングとETLワークフローのための統合データレイヤーとして機能します。

        このGAリリースにおける新機能：

        - **VolumeレベルのRBAC**

            読み取り/書き込み権限に対するきめ細かなロールベースのアクセス制御。

        - **コンソールサポート**

            Zilliz CloudコンソールでVolumeを直接作成、管理、監視できます。

        - **GCPサポート**

            Volumeが**AWSとGCP**をサポートするようになり、マルチクラウドの柔軟性が可能になりました。

        GAにより、VolumeはFree Trial VolumeとPay-as-you-go Volumeの2つの課金モードをサポートするようになりました。Pay-as-you-go Volumeは、ストレージ使用量に基づいて課金が開始されます。

        詳細については、[Volumeの概要](./volume-explained)、[Volumeの管理 (SDK)](./manage-stages)、および[Volumeの管理 (コンソール)](./manage-volumes-via-console)を参照してください。

        ## 組織レベルのIPアクセス許可リスト\{#organization-level-ip-access-allowlist}

        セキュリティを強化し、企業のコンプライアンス要件を満たすため、Zilliz CloudはEnterpriseおよびBusiness Criticalプラン向けに組織レベルのIPアクセス許可リストをサポートするようになりました。

        - **きめ細かなアクセス制御**

            組織の所有者は、コンソールアクセス用の信頼できるIPv4アドレスまたはCIDR範囲を定義できます。承認されていないソースからのトラフィックはブロックされます。

        - **包括的な監査**

            すべての許可リストのライフサイクルイベント（有効化、無効化、ルール変更）はプラットフォーム監査ログに記録されます。

        詳細については、[コンソールIP許可リストの設定](./setup-console-ip-allowlist)を参照してください。

        ## MFAセキュリティアップグレード:\{#mfa-security-upgrade}

        Zilliz Cloudは、メールベースの認証よりも強力な保護を提供する**TOTPベースのMFA**（例：Google/Microsoft Authenticator）をサポートするようになりました。

        - **組織レベルの強制**: Enterpriseプランの管理者は、コンプライアンス基準を確保するために、すべての組織メンバーに対してMFAポリシーを強制できるようになりました。

        - **レガシー移行**: メールのみのMFAは非推奨になります。既存のユーザーには、認証アプリへの移行を促すプロンプトが表示されます。

        詳細については、[MFA](./multi-factor-auth)を参照してください。

    </div>

</Grid>

