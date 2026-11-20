# Feature-Sliced Design 구조

이 프로젝트는 Next.js App Router 위에 FSD의 **최소 규칙(app + views + shared)** 만 적용합니다. 현재 프로젝트 규모와 개발 일정을 고려해 `entities`, `features`, `widgets` 레이어는 미리 만들지 않고, 필요가 생겼을 때 팀 논의 후 추가합니다.

```text
src/
├── app/                         # Next.js 라우트, 레이아웃, 전역 설정
├── views/                       # FSD pages 레이어: 화면 단위 코드
└── shared/                      # 도메인과 무관한 재사용 코드
    ├── api/                     # 공통 HTTP 클라이언트 및 API 설정
    ├── assets/                  # 정적 자원
    │   ├── svg/                 # 원본 SVG (직접 추가)
    │   ├── icons/               # SVGR 생성 아이콘 컴포넌트 (자동 생성)
    │   └── index.ts             # 아이콘 barrel (자동 생성)
    ├── config/                  # 환경·상수 설정
    ├── layout/                  # 공통 레이아웃 컴포넌트 (barrel 자동 생성)
    ├── ui/                      # 공통 UI 컴포넌트 (barrel 자동 생성)
    └── utils/                   # 공통 유틸리티
```

## `views`를 사용하는 이유

FSD의 pages 레이어는 이 프로젝트에서 `src/views`로 표기합니다. Next.js가 `src/pages`를 Pages Router의 예약 디렉터리로 인식하므로, App Router와의 충돌을 막기 위한 결정입니다.

```text
src/app   → Next.js App Router의 라우팅 레이어
src/views → FSD pages 레이어
```

## 의존성 규칙

```text
app → views → shared
```

- 상위 레이어는 하위 레이어만 import합니다. (`shared`는 `views`·`app`을 import하지 않습니다.)
- `views`의 서로 다른 화면 슬라이스는 직접 import하지 않습니다. 공통으로 필요한 코드는 `shared`로 옮깁니다.
- 각 슬라이스를 만들 때는 `index.ts`로 public API를 노출합니다.
- `app/**/page.tsx`는 라우팅만 담당하며, 화면 구현은 `views`의 public API를 사용합니다.

## 레이어 추가 기준

아래와 같은 필요가 생기면 **팀 논의 후** 해당 레이어를 추가하고, 이 문서의 구조와 의존성 규칙을 함께 갱신합니다.

| 레이어     | 추가 시점                                                        |
| ---------- | ---------------------------------------------------------------- |
| `entities` | 여러 화면에서 이벤트/초대장 데이터를 공통으로 다루게 될 때       |
| `features` | 초대장 공유, 참석 응답처럼 독립적인 사용자 행동과 로직이 생길 때 |
| `widgets`  | 여러 기능과 도메인을 조합한 큰 UI 블록이 재사용될 때             |

레이어를 모두 추가하면 의존 방향은 `app → views → widgets → features → entities → shared`가 됩니다.
