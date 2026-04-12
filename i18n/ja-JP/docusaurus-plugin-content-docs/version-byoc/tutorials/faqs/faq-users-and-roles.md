---
title: "FAQ: ユーザーとロール | BYOC"
slug: /faq-users-and-roles
sidebar_label: "FAQ: ユーザーとロール"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud でユーザー、ロール、アクセスに関連して発生する可能性のある問題とその解決策を一覧にしています。| BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 8

---

# FAQ: ユーザーとロール

このトピックでは、Zilliz Cloud でユーザー、ロール、アクセスに関する問題が発生した場合の対処方法を紹介します。

## 目次

- [組織から退脱できますか？](#can-i-leave-my-organization)
- [組織名を編集するにはどうすればよいですか？](#how-can-i-edit-my-organization-name)
- [同僚やチームメンバーを招待して共同作業を行うにはどうすればよいですか？](#how-can-i-invite-a-colleague-or-teammate-to-collaborate)
- [特定の権限またはカスタム特権グループを持つロールを作成できますか？](#can-i-create-a-role-with-specific-privileges-or-custom-privilege-groups)

## よくある質問




### 組織から退脱できますか？\{#can-i-leave-my-organization}

組織のメンバーである場合、自由に組織から退脱できます。

組織オーナーである場合は、組織内に自分以外のオーナーが存在する場合にのみ退脱可能です。組織には少なくとも1名のオーナーが必要であり、唯一のオーナーは組織から退脱できません。

### 組織名を編集するにはどうすればよいですか？\{#how-can-i-edit-my-organization-name}

1. 組織を選択します。

1. 左側のナビゲーションで **Settings** をクリックします。

1. **Organization** **Settings** ページの **組織情報** セクションで、**Edit** をクリックします。

1. 新しい組織名を入力し、**Confirm** をクリックします。

1. 組織名が正常に変更された旨のメッセージが表示されます。

### 同僚やチームメンバーを招待して共同作業を行うにはどうすればよいですか？\{#how-can-i-invite-a-colleague-or-teammate-to-collaborate}

組織オーナーの場合、ユーザーを組織に招待できます。詳しくは、[Manage Organization Users](./organization-users) を参照してください。

組織メンバーの場合、他のユーザーを招待するには組織オーナーに依頼してください。

また、Zilliz Cloud ではプロジェクトへのユーザー招待もサポートしています。プロジェクト管理者の場合、他のユーザーをプロジェクトに招待できます。詳しくは、[Manage Project Users](./project-users) を参照してください。

### 特定の権限またはカスタム特権グループを持つロールを作成できますか？\{#can-i-create-a-role-with-specific-privileges-or-custom-privilege-groups}

はい、可能です。まず、[サポートチケットを作成](http://support.zilliz.com) していただき、この機能を有効化させてください。機能が有効化されると、SDK を使用してこのタスクを実行できるようになります。詳細については、[Privileges & Privilege Groups](./cluster-privileges#custom-privilege-groups) を参照してください。
