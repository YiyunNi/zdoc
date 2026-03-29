---
title: "Zilliz CLI | Cloud"
slug: /cli/cli/overview
sidebar_label: "Overview"
sidebar_position: 0
---

# Zilliz CLI

The Zilliz Command Line Interface (CLI) provides a command-line tool for managing your Zilliz Cloud resources and performing data operations.

## Features

- **Cloud Management** - Manage clusters, projects, volumes, and backups
- **Configuration** - Configure authentication, alerts, and CLI settings
- **Data Operations** - Manage collections, databases, indexes, and perform vector searches

## Quick Start

### Install

```bash
pip install zilliz-cli
```

### Authenticate

```bash
zilliz login
```

### Create a Cluster

```bash
zilliz cluster create --name my-cluster --type serverless
```

## Command Categories

### [Cloud Management](./cli/CloudManagement/CloudManagement-Cluster/Cluster-create)
- [Backup](./cli/CloudManagement/CloudManagement-Backup/Backup-create) - Create, restore, and manage backups
- [Billing](./cli/CloudManagement/CloudManagement-Billing/Billing-bindcard) - View invoices and usage
- [Cluster](./cli/CloudManagement/CloudManagement-Cluster/Cluster-create) - Create, suspend, resume, and delete clusters
- [Project](./cli/CloudManagement/CloudManagement-Project/Project-create) - Manage projects
- [Volume](./cli/CloudManagement/CloudManagement-Volume/Volume-create) - Manage storage volumes

### [Configuration](./cli/Configuration/Configuration-Auth/Auth-login)
- [Auth](./cli/Configuration/Configuration-Auth/Auth-login) - Login, logout, and switch accounts
- [Configure](./cli/Configuration/Configuration-Configure/Configure-clear) - Set and get configuration values
- [Context](./cli/Configuration/Configuration-Context/Context-current) - Manage CLI contexts
- [Alert](./cli/Configuration/Configuration-Alert/Alert-create) - Create and manage alerts
- [Completion](./cli/Configuration/Configuration-Completion/Completion-install) - Shell completion setup

### [Data Operations](./cli/DataOperations/DataOperations-Collection/Collection-create)
- [Collection](./cli/DataOperations/DataOperations-Collection/Collection-create) - Create, describe, and manage collections
- [Database](./cli/DataOperations/DataOperations-Database/Database-create) - Manage databases
- [Index](./cli/DataOperations/DataOperations-Index/Index-create) - Create and manage indexes
- [Vector](./cli/DataOperations/DataOperations-Vector/Vector-delete) - Insert, search, and query vectors
- [User/Role](./cli/DataOperations/DataOperations-Role/Role-create) - Manage users and roles

## Get Started

- [Authenticate](./cli/Configuration/Configuration-Auth/Auth-login)
- [Create a Cluster](./cli/CloudManagement/CloudManagement-Cluster/Cluster-create)
- [Create a Collection](./cli/DataOperations/DataOperations-Collection/Collection-create)
