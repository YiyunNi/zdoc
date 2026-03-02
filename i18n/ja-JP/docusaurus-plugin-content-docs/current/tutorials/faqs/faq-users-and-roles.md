---
title: "FAQ: ユーザーとロール | CLOUD"
slug: /faq-users-and-roles
sidebar_label: "FAQ: ユーザーとロール"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud で発生する可能性のあるユーザー、ロール、およびアクセスに関する問題と、それに対応する解決策をリストアップします。 | CLOUD"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 8

---

# FAQ: ユーザーとロール

このトピックでは、Zilliz Cloud で発生する可能性のあるユーザー、ロール、アクセスに関する問題と、それに対応する解決策をリストアップします。

## 目次

- [組織を離れることはできますか？](#can-i-leave-my-organization)
- [組織名を編集するにはどうすればよいですか？](#how-can-i-edit-my-organization-name)
- [同僚やチームメイトを招待して共同作業するにはどうすればよいですか？](#how-can-i-invite-a-colleague-or-teammate-to-collaborate)
- [特定の権限またはカスタム権限グループを持つロールを作成できますか？](#can-i-create-a-role-with-specific-privileges-or-custom-privilege-groups)

## よくある質問




### 組織を離れることはできますか？{#can-i-leave-my-organization}

組織のメンバーであれば、自由に組織を離れることができます。

組織の所有者である場合、組織内で最後の所有者でない場合にのみ組織を離れることができます。組織には少なくとも1人の所有者が必要であり、組織内の唯一の所有者は組織を離れることはできません。

### 組織名を編集するにはどうすればよいですか？{#how-can-i-edit-my-organization-name}

1. 組織を選択します。

1. 左側のナビゲーションで **Settings** をクリックします。

1. **Organization Settings** ページの **Organization Information** セクションで、**Edit** をクリックします。

1. 新しい組織名を入力し、**Confirm** をクリックします。

1. 組織名が正常に変更されたというメッセージが表示されます。

### 同僚やチームメイトを招待して共同作業するにはどうすればよいですか？{#how-can-i-invite-a-colleague-or-teammate-to-collaborate}

組織の所有者であれば、ユーザーを組織に招待できます。詳細な手順については、[組織ユーザーの管理](./organization-users)を参照してください。

組織のメンバーである場合、組織の所有者に連絡して他のユーザーを招待できます。

さらに、Zilliz Cloud はプロジェクトへのユーザー招待もサポートしています。プロジェクト管理者であれば、他のプロジェクトユーザーをプロジェクトに招待できます。詳細な手順については、[プロジェクトユーザーの管理](./project-users)を参照してください。

### 特定の権限またはカスタム権限グループを持つロールを作成できますか？{#can-i-create-a-role-with-specific-privileges-or-custom-privilege-groups}

はい、できます。この機能を有効にするには、まず[サポートチケットを作成](http://support.zilliz.com)する必要があります。この機能が有効になったら、SDK を使用してこのタスクを完了できます。詳細については、[権限と権限グループ](./cluster-privileges#custom-privilege-groups)を参照してください。
