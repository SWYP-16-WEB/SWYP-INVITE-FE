# Feature-Sliced Design 구조

이 프로젝트는 Next.js App Router 위에 FSD 레이어를 구성합니다. 현재는 화면 및 도메인 구현 없이 폴더 구조와 의존성 규칙만 설정합니다.

```text
src/
├── app/                         # Next.js 라우트, 레이아웃, 전역 프로바이더
├── views/                       # FSD pages 레이어: 라우트별 화면 조합
├── widgets/                     # 독립적인 큰 UI 블록
├── features/                    # 사용자가 수행하는 행동
├── entities/                    # 핵심 비즈니스 개념
└── shared/                      # 도메인과 무관한 재사용 코드
    ├── api/                     # 공통 HTTP 클라이언트 및 API 설정
    ├── config/                  # 환경·상수 설정
    ├── ui/                      # 공통 UI 컴포넌트
    └── utils/                   # 공통 유틸리티
```

## `views`를 사용하는 이유

FSD의 pages 레이어는 이 프로젝트에서 `src/views`로 표기합니다. Next.js가 `src/pages`를 Pages Router의 예약 디렉터리로 인식하므로, App Router와의 충돌을 막기 위한 결정입니다.

## 의존성 규칙

```text
views → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어만 import합니다.
- 같은 레이어의 다른 슬라이스는 직접 import하지 않습니다.
- 각 슬라이스를 만들 때는 `index.ts`로 public API를 노출합니다.
- `app/**/page.tsx`는 라우팅만 담당하며, 구현된 화면이 생기면 `views`의 public API를 사용합니다.

새 기능이 실제로 시작될 때 해당 레이어에 슬라이스를 추가합니다. 예를 들어 이벤트 도메인은 `entities/event`, 이벤트 생성 동작은 `features/create-event`에 둡니다.
