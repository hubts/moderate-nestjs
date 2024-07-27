<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Moderate REST API Backend

## 👀 Overview

`moderate-nestjs` 는 [NestJS](https://github.com/nestjs/nest) 프레임워크를 기반으로 하여 [여러 기능](#-features)들을 구현한 **백엔드 템플릿(Template)** 입니다. 이미 우리가 사용할 수 있는 유명하고 다양한 템플릿들이 있지만, 이 템플릿은 좀더 가볍고 직관적인 기능들을 추구하여 누구나 자신의 입맛대로 수정 및 보완할 수 있도록 하였습니다. 특히, NestJS를 일반적으로 이해한 수준의 개발자를 대상으로, 너무 비약적인 레벨업보다는 적당한(Moderate) 수준으로 개선된 기능들을 통하여, 백엔드 구축에 대한 약간의 불편함들을 해소하는 데에 그 목적이 있습니다. 결론적으로, 이 템플릿을 통해 좀더 쉽고 빠르게 NestJS 백엔드 시스템을 구축하는 것이 주된 목표입니다.

이 템플릿에서는,

-   NestJS(이하 Nest) 프레임워크를 이용하여 API 서버를 구성합니다.
-   PostgreSQL(이하 Postgres) 데이터베이스를 구축합니다.
-   데이터베이스와 연결하는 ORM으로써, Prisma 를 이용합니다.
-   구현된 Nest 및 Postgres 는 Docker Container 로 실행, 배포됩니다.

> _TBD: Postgres 데이터베이스를 관찰하기 위한 일종의 PG Admin으로써, Hasura (GraphQL Engine)를 연동하는 것에 대한 문서가 업데이트될 예정입니다._

_**여러분은 이 템플릿을 통해, 여러분만의 백엔드 시스템을 보다 간결하고 쉽게 시작, 구현, 배포할 수 있습니다.**_

## 🔩 Background

> _본 문단은 템플릿을 구성하는 Nest 와 Postgres 에 대한 약간의 배경지식을 설명합니다. 이미 알고 있는 지식이라면 건너 뛰어도 무방합니다._

여러분이 개발자라면, 백엔드를 처음 접하더라도, 백엔드 시스템의 최초 구성인 API 서버와 데이터베이스의 구성을 알고 있을 것입니다. 이 템플릿은 딱 그 수준의 백엔드 시스템을 구성할 때 도움을 주기 위해 구현되었습니다.

이 템플릿의 백엔드 시스템은 크게 Nest 서버와 Postgres 데이터베이스로 구성되어 있습니다. Postgres 데이터베이스는 영구적인(Persistent) 데이터를 저장할 수 있도록 하고, Nest 서버는 외부 요청에 대하여 우리가 원하는 로직들을 통해 데이터를 처리하고 관리하도록 합니다.

### NestJS

Nest 는 기존 JavaScript로 구현하는 Node.js를, TypeScript 서버로 구현할 수 있도록 개발된 프레임워크입니다. Type을 명시함으로써 좀더 안전하고 견고한 코딩을 할 수 있다는 장점부터, OOP (Object Oriented Programming), FP (Functional Programming) 등, 기존 백엔드 프레임워크로 유명한 JAVA SpringBoot의 기능들을 유사하게 구현한 장점들이 존재하는 프레임워크입니다. Nest 에 대하여 좀더 자세히 알고 싶다면 [공식문서](https://nestjs.com/)를 참고하세요.

이 템플릿에서 Nest 는 다음과 같은 역할을 수행합니다.

-   Nest 서버는 REST API 서버로 구현되어, 클라이언트의 외부 요청을 수신하고 처리합니다.
-   Nest 서버는 여러분의 데이터 도메인을 관리하고 주요 비즈니스 로직들을 실행합니다.
-   Nest 서버는 JWT 발급 및 검증을 기반으로, API에 대한 유저 권한(Permission)을 제어합니다.

### Postgres

Postgres 는 오픈소스 기반의 관계형 데이터베이스 시스템(RDBMS: Relational Database Management System)입니다. 물론, 여러분이 다루는 시스템이나 목적, 상황에 따라 MySQL과 같은 데이터베이스를 이용할 수도 있지만, Postgres 또한 충분히 많은 예시들이 존재하고 다른 서비스들과의 연동 및 지원 측면에서 다양한 장점들을 가지고 있기 때문에, 이 템플릿에서는 Postgres 를 추천합니다. 특히, 오픈소스로 인해 기술에 대한 지속적인 업데이트 지원이 있고, 데이터베이스 무결성과 신뢰성을 보장하는 ACID Compatibility, JSON 및 JSONB 타입 지원의 특성들이 필요하다면 Postgres 의 사용을 적극 권장합니다. Postgres 에 대하여 더 파악하고 싶다면 [공식문서](https://www.postgresql.org/docs/)를 참고하세요.

이 템플릿에서 Postgres 는 다음과 같은 역할을 수행합니다.

-   Postgres 는 데이터를 저장하는 데이터베이스입니다.
-   Nest 서버는 Postgres 데이터베이스에 연결하여 데이터를 저장, 수정, 조회, 삭제합니다.

## 📝 Skills

| Key Point       | Use / Implementation / Connection |
| --------------- | --------------------------------- |
| Framework       | NestJS                            |
| Language        | TypeScript                        |
| Package Manager | yarn                              |
| Architecture    | Monolith, CQRS                    |
| Documentation   | Swagger                           |
| ORM             | Prisma                            |
| Database        | Postgres                          |
| Deployment      | Dockerlized                       |

## 😎 Implementation Features

-   [x] Architecture from CQRS Pattern (but, not event-driven)
-   [x] Focusing on Code Sharing for Collaboration
-   [x] Swagger Documentation
-   [x] Health Checker & Throttler
-   [x] Cache on Database
-   [x] Custom Logging System
-   [x] JWT Authentication
-   [x] User/Auth Examples
-   [x] Linting and CI test by `Husky`
-   [x] Git version management by `commitizen`
-   [x] Docker Versioning and Deployment

## 🚀 Start

### 1. Prerequisites

> _Docker 엔진을 이미 설치하였고 `docker-compose` 명령어를 사용할 수 있다면, 이 단계를 스킵하세요._

우리는 Nest 와 Postgres 서버를 Docker Container 로 배포 및 실행하기 때문에 `docker` 명령어와 `docker-compose` 명령어를 이용할 수 있어야 합니다.

Docker 는 [데스크톱 앱](https://docs.docker.com/get-docker/) 형태나 [엔진](https://docs.docker.com/engine/install/) 형태로 설치할 수 있습니다. 관련하여 Docker 를 설치할 수 있는 몇가지 명령어를 [docker-install](./docs/1.docker-install.md) 문서에 작성해 두었습니다. Docker 설치가 완료되면 대부분의 경우 `docker-compose` 명령어가 함께 설치됩니다. 만약 함께 설치되지 않았다면, 별도로 설치하시기 바랍니다.

### 2. Cloning

이 템플릿 레포지토리를 Cloning 합니다:

```bash
$ git clone https://github.com/hubts/moderate-nestjs.git
```

### 3. Environment Settings

Nest 와 Postgres 서버를 실행하기 위해 몇가지 세팅을 수행해야 합니다. 이 세팅은 대부분 _`.env`_ 에 해당하는 환경변수 파일을 작성하는 것입니다. Postgres 디렉토리와 현재 Nest 소스코드 디렉토리 경로에서 각각 예시 파일 _`.env.example`_ 파일들을 확인할 수 있습니다.

#### 3.1. Postgres Setting

Postgres 데이터베이스를 Docker Container 로 배포하기 위해 해당 디렉토리의 [문서](./postgres/README.md)를 확인하시기 바랍니다. 해당 문서의 단계를 따르면, 데이터베이스에 대한 세팅한 뒤 실행할 수 있게 됩니다. 데이터베이스를 실행한 정보를 기반으로 Prisma 를 위한 아래 `DATABASE_URL` 을 구성하시기 바랍니다.

```bash
DATABASE_URL="postgresql://${username}:${password}@${localhost}:${5432}/${dbname}?schema=${schema}"
```

`${변수명}` 에 해당하는 모든 값들을 실제 값으로 대치하여 URL을 완성합니다.

#### 3.2. Nest Setting

Nest 서버에 대한 세팅은 예시 환경변수 _`.env.example`_ 파일을 복사하여 _`.env`_ 파일을 생성한 뒤, 필요한 환경변수들을 작성하는 것입니다.

설정해야 하는 환경변수들은 아래와 같습니다:

-   `ENV` : 서버 환경(로컬, 개발, 운영 등)을 결정합니다. 이는 Logging 레벨 등에 영향을 줄 수 있습니다.
-   `PORT` : 서버 Listening 포트번호입니다.
-   `EXTERNAL_ENDPOINT` : 서버에 접근하게 되는 외부 엔드포인트를 의미하며, Swagger OpenAPI의 서버 URL로 이용됩니다. NestJS에서 제공하는 환경변수 대치가 올바르게 적용되면 `${변수}` 문법을 사용할 수 있으나, 만약 올바르게 적용되지 않는다면 직접 작성해 주어야 합니다.

-   `DATABASE_URL*` : Prisma 가 연동할, 실행된 데이터베이스의 URL(연결주소)를 입력합니다.
-   `THROTTLER_*` : Throttler 설정입니다. 일정 시간(TTL) 내에 허용하는 최대 요청 개수(Limit)를 정의합니다.
-   `JWT_*` : JWT 설정입니다 (이어서 설명합니다).

Nest 서버는 JWT Authentication(인증)을 통해 유저 권한 제어를 수행합니다. Nest 서버는 접근 토큰 (Access token)을 발행하고, 외부 클라이언트 요청에 동봉된 토큰을 검증합니다. 이 과정에 필요한 키 쌍을 환경변수로 입력해 주어야 합니다. 별도의 알고리즘을 사용해도 되지만, 이 템플릿에서는 RSA256 을 권장합니다. 키 쌍을 생성하기 위해 아래 스크립트를 실행하세요:

```bash
$ ./script/util/jwt-key-generation.sh
```

새로운 RSA 키 쌍이 생성되고 터미널에 출력될 것입니다. 출력된 키들을 복사하여 환경변수 `JWT_*` 값들에 입력하면 됩니다.

### 4. Run

#### 4.1. Run database

상기 [문단](#31-postgres-setting)을 통해 데이터베이스를 실행합니다.

### 4.2. Install dependencies

Nest 서버 실행에 필요한 종속성(패키지)들을 설치합니다:

```bash
$ yarn # or 'yarn install'
```

### 4.3. Prisma Sync

Nest 서버 환경변수 _`.env`_ 파일의 `DATABASE_URL` 환경변수를 작성하였고 종속성 설치를 통해 `prisma` 패키지가 설치하였다면, Prisma 명령어를 이용할 수 있습니다:

```bash
$ yarn prisma [command]
```

처음 배포한 데이터베이스에는 별도의 Schema 및 Table 이 정의되어 있지 않습니다. 우리가 서버에서 다루게 될 Schema 는 _`prisma/schema.prisma`_ 파일을 시작으로 정의됩니다. 초기 비어있는 상태에서 해당 Schema 를 데이터베이스에 동기화시키기 위해 아래 명령어 이용합니다:

```bash
$ yarn prisma:sync
```

해당 명령어에는 Nest 서버가 해당 Schema 를 기반으로 Table 정보를 Type 으로 받아들일 수 있게 되는 `generate` 명령어와 데이터베이스에 해당 Schema 를 밀어넣는 `db push` 명령어가 포함되어 있습니다.

### 4.3. Run server

이제 아래 명령어를 통해 Nest 서버를 실행합니다:

```bash
# Start
$ yarn start

# Start with watch mode (to debug)
$ yarn start:dev
```

Nest 서버가 실행되고 각종 Log 를 통해 실행 결과를 확인할 수 있습니다.

### 4.4. Deployment

만약 Docker Container 로 Nest 서버를 실행하려면 아래 명령어를 이용합니다:

```bash
$ yarn deploy
```

스크립트를 통해 서버의 Docker Image 를 생성하고 실행합니다.

단, 서버가 Docker Container 로 배포되는 경우 환경변수에서 이용했던 `localhost` 값 등은 Container 간에 적용되지 않기 때문에 실제 데이터베이스와의 연동을 위하여 외부 Host 주소를 이용하거나, Docker Container 간 Network 를 통일하거나, `host.docker.internal` 등 Container 주소 연결을 위한 설정을 반드시 수행해야 합니다.

## 💡 Other Features

### Git

이 템플릿에는 `commitizen` 을 이용하여 형상관리를 할 수 있도록 스크립트 및 명령어가 설정되어 있습니다:

```bash
$ yarn git [version|patch|minor|major|...]
```

해당 [스크립트](./script/skyrocket.sh)를 확인하거나, 위 명령어를 통해 형상관리를 직접 수행해 보도록 합니다.
