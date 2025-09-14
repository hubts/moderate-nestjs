# Working Process in This Boilerplate

## Introduction

본 문서는 이 보일러플레이트(템플릿)를 활용한 백엔드 개발 프로세스에 대해서 설명합니다.

다음과 같은 준비가 완료되었다고 가정합니다.

1. Docker로 `postgres` 컨테이너가 배포됨.
2. `.env` 환경설정을 완료함.
3. `yarn start:dev` 명령어로 서버와 데이터베이스가 연동됨을 확인함.

## SDK

### 1. 시그니처 함수 정의

가장 먼저, SDK를 통해 Frontend에 전달할 도메인/인터페이스를 작성해야 합니다.

예시로, 아래 경로의 파일을 확인합니다.

```bash
./sdk/api/user/user.signature.ts
```

해당 경로의 파일은 `User` 도메인에서 API 시그니처 함수들을 정의합니다.

1. `User` 도메인을 구현하는 백엔드의 Controller 또는 프론트엔드의 Service 등을 나타냅니다.
2. `User` 도메인에서 이용할 수 있는 시그니처 메소드(Method)들을 선언합니다.
3. 각 메소드에서 이용되는 입/출력 인터페이스를 정의합니다.

시그니처 함수에서 이용되는 인터페이스들은 `user.interface.ts` 파일에서 선언합니다.

기본적으로 SDK에는 Prisma Generated Output을 활용하여, Entity 선언(타입)들이 배포되어 있습니다. 따라서 기본적으론 해당 Entity들을 모델처럼 사용할 수 있습니다.

### 2. API 속성 정의

다음으로, 해당 API 인터페이스에 따라 `User` 도메인에서 백엔드 Controller가 가지는 엔드포인트 속성을 정의합니다.

아래 경로의 파일을 확인합니다.

```bash
./sdk/api/user/user.route.ts
```

해당 경로의 파일에서 하나의 시그니처 메소드를 보면 아래와 같은 정보를 확인할 수 있습니다.

1. 해당 메소드가 호출되는 HTTP Method (ex. GET, POST, etc.)
2. 해당 메소드가 호출되는 Route 경로(Path)
3. 해당 메소드를 호출할 수 있는 권한 정의
4. 추가로 Swagger에 노출할 설명(Description)

### 3. SDK API Wrapper 정의

SDK는 `axios` 라이브러리를 활용하여, `await sdk.user.api.getMyInfo()` 와 같이 함수처럼 직접 호출 가능한 기능을 제공하고 있습니다.

이렇게 제공하려면, SDK 내에서 `axios` 를 Wrapping 하는 함수를 반환해줘야 합니다. 아래 파일을 확인합니다.

```bash
./sdk/api/user/user.api.ts
```

파일 내부를 보면, `createApiWrapper` 함수를 통해 `axios` 를 Wrapping한 값을 반환 받으며, 이를 통해 해당 Call 가능한 함수를 직접 반환하고 있습니다.

예를 들어, `getMyInfo` 라고 하는 함수를 `GET` 메소드로 새롭게 구현했다면, `axios.get` 을 기반으로 호출할 수 있도록 함수형 값을 반환해주는 것입니다.

```typescript
// API 호출형 반환 예시
export const createUserApi = (client: AxiosInstance): UserApi => {
    const api = createApiWrapper(client, UserRoute);

    return {
        getMyInfo: options => api.get("getMyInfo", options),
        updateMyInfo: (body, options) =>
            api.patch("updateMyInfo", body, options),
        getUserInfoById: (id, options) =>
            api.get("getUserInfoById", {
                ...options,
                pathParams: { id },
            }),
        getUserInfoByEmail: (email, options) =>
            api.get("getUserInfoByEmail", {
                ...options,
                pathParams: { email },
            }),
    };
};
```

여기까지 작성했다면, 프론트엔드로 SDK를 전달할 수 있으며, 백엔드에서는 구현 작업을 시작할 수 있습니다.

구현된 인터페이스를 SDK로 배포하려면 루트 디렉토리에서 아래 명령어를 이용합니다.

```bash
$ yarn sdk
```

## SRC

백엔드의 실제 구현은 `src` 경로에서 진행됩니다.

각 디렉토리 경로는 다음 구현부를 가집니다.

-   `common` : NestJS 서버에서 자주 재사용되는 기능들을 구현합니다.
-   `config` : 서버에서 이용하는 환경변수 설정들을 적용합니다.
-   `infrastructure` : 서버에서 연결하는 외부 서비스(모듈)를 구현합니다.
-   `module` : 서버의 기능들을 구현합니다.

### Controller 구현

컨트롤러 기능은 앞서 정의한 API 인터페이스에 따라 프론트엔드와이 소통 방식을 구현합니다.

아래 경로의 파일을 확인합니다.

```bash
./src/module/user/user.controller.ts
```

컨트롤러에서는 앞서 구현한 API 인터페이스를 import 하여, 실제 호출부를 구현하면 됩니다.

NestJS에서 기본적으로 제공하는 데코레이터를 Wrapping한 `@Route` 데코레이터를 이용하여, 각 호출 메소드를 정의하는 `Route` 값들을 넣어주고, 시그니처 메소드를 연결하여 구현합니다.

예를 들어, 아래와 같이 구현 가능합니다.

```typescript
@Route.Get(UserRoute.getMyInfo, {
    summary: "내 정보 찾기",
    success: {
        message: SUCCESS_MESSAGE.USER.FOUND,
        description: "내 공개/개인 정보",
        example: typia.random<UserPrivateInfo>(),
    },
    errors: ["USER_NOT_FOUND", "PROFILE_NOT_FOUND"],
})
async getMyInfo(
    @Requestor() requestor: User
): Promise<SuccessResponseDto<UserPrivateInfo>> {
    const data = await this.userFacade.getMyInfo(requestor);
    return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, data);
}
```

-   `@Route.Get` 은 GET 메소드를 이용하는 API임을 나타냅니다.
-   `@Route.Get` 의 첫번째 인자는 해당 시그니처 메소드의 정보를 지정합니다.
-   두번째 인자는 Swagger에 명시할 요약, 성공 타입, 에러타입 등을 명시합니다.
-   메소드의 입력값은 상황에 따라, `@Query`, `@Param`, `@Body` 등 기존 NestJS 데코레이터를 이용합니다.
-   `SuccessResponseDto` 에 해당하는 공통 타입으로 감싼 응답 값을 주도록 합니다.

여기서 원래 NestJS는 DTO를 Class로 직접 선언해주어 Swagger에 노출 및 Validation에 사용하도록 해야 하지만, `typia` 기능을 이용하여 인터페이스를 기반한 Validation을 가능하게 하였습니다. 따라서, 공통적으로 반환되는 `SuccessResponseDto` 외에는 모두 인터페이스를 그대로 이용할 수 있습니다.

단, 해당 validation을 추가하기 위해서는 `typia.assert<T>(input)` 등의 형태로 `input` 값에 대해 직접 검사를 수행해 주어야 합니다.

### Facade 및 기타 구현

본 템플릿은 기본적으로 Facade 패턴 구현을 권장합니다. 당연히 단일 `Service` 구현으로 만들어도 됩니다만, 기능의 원자적 구현 및 파일 분리 등을 목적으로 해당 패턴을 이용하고 있습니다.

대표적으로 다음과 같은 구현 영역이 존재합니다. (`User` 도메인을 기반으로 설명합니다.)

-   `UserFacade` : Database Transaction 처리 및 구현된 `Service` 기능들을 집약하고, `Controller`로 내보내는 기능들을 조립하는 레이어입니다. 여러 서비스 및 여러 기능에 걸쳐, 한눈에 해당 API 기능의 목적을 볼 수 있어야 합니다.
-   `service/UserService` : 단일 비즈니스 로직을 구현하는 서비스 레이어입니다. 여기서 단일 비즈니스 로직은 '하나의 목적'을 가진 행동으로 제한합니다. 여러 목적을 가진 경우, 각 기능들은 분리되어야 합니다.
-   `repository/UserRepository` : Database Repository를 구현하는 레이어입니다. Database ORM(Prisma) 영역을 감싸 서비스 레이어에서 편리하게 호출할 수 있도록 합니다.
-   `domain/*` : 서비스 주입 없이 직접적인 단일 함수들을 구현하는 레이어입니다. 보통 서비스에서 비즈니스 로직을 구현할 때 필요한 라이브러리 영역이나, 도메인 영역을 구현합니다.

### 정리

실제 개발 영역에서는 다음과 같은 순서로 작업이 가능합니다.

1. SDK에서 구현하고자 하는 기능을 Controller에서 명세합니다.
    - `GET` 메소드를 사용
    - 입/출력 값이 어떤 값인지 정의
    - 기타 필요한 API Spec, Method Options들을 정의 (Swagger 용도 포함)
2. Facade에서 구현하고자 하는 기능을 쪼개어 나열해 봅니다.
    - 대부분 Controller의 호출/반환을 그대로 사용
    - 로직적으로 어떤 기능들이 필요한지 정의
    - 이미 구현된 서비스 기능들과 구현해야 하는 기능들을 구분
3. Service에서 비즈니스 로직을 구현
    - 필요한 경우 Repository에서 기능 구현
    - 필요한 경우 Domain에서 기능 구현
    - 이들을 활용하여, 단일 기능을 구현 완료
4. Facade에서 구현된 서비스 기능들을 조립
    - 예상하고 구현했던 기능들을 조립하여 API 구현을 완료
