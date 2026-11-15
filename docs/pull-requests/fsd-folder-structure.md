# [Refactor] Next.js App Router용 FSD 폴더 구조 설정

## 🔗 연관된 이슈

closes #

## 📝 작업 내용

1. Next.js App Router 프로젝트에 FSD(Feature-Sliced Design) 레이어를 위한 폴더 구조를 추가했습니다.

   ```text
   src/
   ├── app/        # Next.js 라우트, 레이아웃, 전역 프로바이더
   ├── views/      # FSD pages 레이어: 라우트별 화면 조합
   ├── widgets/    # 독립적인 큰 UI 블록
   ├── features/   # 사용자가 수행하는 행동
   ├── entities/   # 핵심 비즈니스 개념
   └── shared/     # 도메인과 무관한 재사용 코드
       ├── api/
       ├── config/
       ├── ui/
       └── utils/
   ```

2. 아직 구현되지 않은 레이어는 `.gitkeep`으로만 관리합니다. 화면, 라우트, 도메인 모델, 목 데이터, 기능 UI는 추가하지 않았습니다.

3. 레이어별 책임과 의존성 규칙은 `docs/architecture/fsd.md`에 문서화했습니다.

## 💬 공유 사항

이번 작업은 화면 구현 전, 기능이 늘어났을 때도 일관되게 확장할 수 있는 기준을 먼저 설정하는 것을 목표로 합니다.

기술 유형 중심의 `components`, `hooks`, `utils` 구조는 프로젝트가 커질수록 특정 기능과 관련된 파일이 여러 폴더에 흩어질 수 있습니다. FSD는 이벤트 생성, 초대장 공유, 참석 응답처럼 사용자 가치와 도메인 기준으로 코드를 배치할 수 있도록 합니다.

```text
views → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어만 import합니다.
- 같은 레이어의 다른 슬라이스는 직접 import하지 않습니다.
- 실제 슬라이스를 만들 때 `index.ts`를 public API로 사용합니다.
- `app/**/page.tsx`는 Next.js 라우팅에 집중하고, 화면 구현은 추후 `views`에서 조합합니다.

### `pages` 대신 `views`를 사용하는 이유

FSD에서 화면 조합 레이어는 일반적으로 `pages`라 부르지만, Next.js는 `src/pages`를 Pages Router의 예약 디렉터리로 인식합니다. 현재 프로젝트는 App Router를 사용하므로, 충돌을 피하기 위해 FSD pages 레이어의 물리 폴더명을 `src/views`로 사용했습니다.

```text
src/app   → Next.js App Router의 라우팅 레이어
src/views → FSD pages 레이어
```

## 📸 스크린샷

- UI 변경 없음

## ETC

- 이후 기능 구현 시 필요한 레이어에만 슬라이스를 추가합니다.
  - 이벤트 도메인: `entities/event`
  - 이벤트 생성: `features/create-event`
  - 초대장 공유: `features/share-invitation`
  - 이벤트 상세 화면: `views/event-detail`
- 빈 기능 폴더를 미리 만들지 않아, 현재 구조가 실제 구현 범위보다 과도하게 커지지 않도록 했습니다.
