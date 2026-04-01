---
displayed_sidebar: cliSidebar
slug: /
beta: FALSE
notebook: FALSE
sidebar_position: 1
---

import Admonition from '@theme/Admonition';


# Zilliz CLI Reference

The Zilliz Command Line Interface () provides a command-line tool for managing your Zilliz Cloud resources and performing data operations.

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

### [Cloud Management]()
- [Backup]() - Create, restore, and manage backups
- [Billing]() - View invoices and usage
- [Cluster]() - Create, suspend, resume, and delete clusters
- [Project]() - Manage projects
- [Volume]() - Manage storage volumes

### [Configuration]()
- [Auth]() - Login, logout, and switch accounts
- [Configure]() - Set and get configuration values
- [Context]() - Manage CLI contexts
- [Alert]() - Create and manage alerts
- [Completion]() - Shell completion setup

### [Data Operations]()
- [Collection]() - Create, describe, and manage collections
- [Database]() - Manage databases
- [Index]() - Create and manage indexes
- [Vector]() - Insert, search, and query vectors
- [User/Role]() - Manage users and roles

## Get Started

- [Authenticate]()
- [Create a Cluster]()
- [Create a Collection]()
