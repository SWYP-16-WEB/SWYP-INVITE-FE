# [Init] SVGR 아이콘 생성 및 Barrel Export 자동화 설정

## 🔗 연관된 이슈

closes #6

## 📝 작업 내용

1. SVG를 React 아이콘 컴포넌트로 변환하는 스크립트를 추가했습니다. (`scripts/generate-icon-exports.ts`, `pnpm build:icons`)
   - `src/shared/assets/svg`의 SVG를 읽어 `src/shared/assets/icons/*.tsx`와 `src/shared/assets/index.ts`를 생성합니다.
   - 파일명에서 컴포넌트명을 만듭니다. `arrow-left.svg` → `ArrowLeftIcon` (`Icon` 접미사는 자동으로 붙이고, 이름이 겹치면 에러를 냅니다)
   - `fill`·`stroke` 색상을 `currentColor`로 바꿉니다. `none`, `url(#...)`은 그대로 둡니다.
   - svgo가 `viewBox`를 지우지 않도록 설정했고, 그래도 빠지면 원본 값을 다시 넣습니다.
   - 프로젝트 컨벤션에 맞게 named export로 생성하고 Prettier 설정도 그대로 적용합니다.

2. Barrel Export 생성 스크립트를 추가했습니다. (`scripts/generate-barrel-exports.ts`, `pnpm barrels`)
   - `src/shared/ui`, `src/shared/layout` 두 폴더만 대상으로 합니다.
   - 하위 폴더 중 `index.ts`가 있는 폴더만 루트 `index.ts`에 `export * from './폴더명'`으로 추가합니다.
   - 내용이 바뀌지 않았으면 파일을 다시 쓰지 않고, export할 대상이 없으면 루트 `index.ts`를 삭제합니다.

3. `prebuild`에 두 스크립트를 연결해 `pnpm build` 전에 자동으로 실행되게 했습니다.

   ```text
   pnpm build
    ├ prebuild: pnpm build:icons && pnpm barrels
    └ next build
   ```

4. 의존성 추가: `@svgr/core`, `@svgr/plugin-svgo`, `@svgr/plugin-jsx`, `tsx` (devDependencies)

5. 문서 갱신: `docs/architecture/fsd.md`(폴더 구조), `docs/conventions/tooling.md`(스크립트·사용법), `docs/conventions/dev-convention.md`(barrel 경로)

## 💬 공유 사항

### 왜 SVGR을 세팅했나요?

SVG를 `<img>`나 파일 import로 쓰면 화면에 보여주는 것밖에 할 수 없습니다. React 컴포넌트로 바꾸면 다른 컴포넌트처럼 다룰 수 있습니다.

```tsx
import { HomeIcon } from '@/shared/assets';

<HomeIcon className='text-primary' width={20} height={20} />;
```

- `className`, `width`·`height`를 props로 넘길 수 있습니다.
- `fill`·`stroke`가 `currentColor`라서 Tailwind `text-*`만으로 색을 바꿀 수 있습니다. 색상별로 SVG를 따로 두지 않아도 됩니다.
- hover·active 상태나 조건부 렌더링도 일반 컴포넌트처럼 처리할 수 있습니다.

**webpack loader가 아니라 스크립트로 미리 생성한 이유**

- 이 프로젝트는 Turbopack을 쓰기 때문에 SVGR loader를 쓰려면 번들러 설정이 따로 필요합니다. 스크립트 방식은 번들러에 상관없이 동작합니다.
- 빌드 전에 한 번만 변환하므로 런타임 처리가 없습니다.
- 생성 결과가 일반 TSX 파일이라 타입 추론, 코드 리뷰, 디버깅이 쉽습니다.
- 디자인 툴에서 받은 SVG를 손으로 고칠 필요가 없습니다. 색상과 `viewBox` 처리를 스크립트가 일관되게 해 줍니다.

### 왜 Barrel Export를 적용했나요?

공통 컴포넌트가 늘어날수록 import 문이 컴포넌트 수만큼 길어집니다.

```tsx
// Before
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

// After
import { Button, Input, Modal } from '@/shared/ui';
```

- import 경로가 하나로 모여 단순해집니다.
- 내부 폴더 구조가 바뀌어도 사용하는 쪽 코드는 그대로입니다.
- FSD에서 말하는 "`index.ts`를 public API로 사용한다"는 규칙과도 맞습니다.
- barrel 파일을 손으로 관리하면 export 누락이나 정렬 충돌이 생기기 쉬워서 스크립트로 자동 생성하게 했습니다.

**적용 범위를 `shared/ui`, `shared/layout`으로 제한한 이유**

Barrel을 모든 폴더에 적용하면 순환 참조, side effect가 있는 모듈까지 함께 로드되는 문제, 불필요한 의존성 증가가 생길 수 있습니다. 그래서 외부에서 가져다 쓰는 진입점 역할을 하고 순환 참조 위험이 낮은 재사용 UI 영역에만 적용했습니다.

### 폴더 배치

`shared/components/ui` 대신 FSD 규칙(`docs/architecture/fsd.md`)에 맞춰 `shared/ui`, `shared/layout`을 썼습니다. 스크립트는 소스 코드가 아니므로 루트의 `scripts/`에 두었습니다.

```text
scripts/
├── generate-icon-exports.ts
└── generate-barrel-exports.ts
src/shared/
├── assets/
│   ├── svg/        # 원본 SVG (직접 추가)
│   ├── icons/      # 아이콘 컴포넌트 (자동 생성)
│   └── index.ts    # 아이콘 barrel (자동 생성)
├── ui/             # barrel 자동 생성
└── layout/         # barrel 자동 생성
```

### 사용 방법

- **아이콘 추가**: `src/shared/assets/svg`에 SVG를 넣고 `pnpm build`(또는 `pnpm build:icons`)를 실행합니다.
- **공통 컴포넌트 추가**: `src/shared/ui/button/index.ts`처럼 컴포넌트 폴더에 `index.ts`를 직접 작성하고 `pnpm build`(또는 `pnpm barrels`)를 실행합니다.
- `pnpm dev`에서는 자동으로 실행되지 않으므로 개발 중에는 스크립트를 직접 실행해 주세요.
- 생성된 파일(`icons/`, `index.ts`)은 커밋합니다. 커밋하지 않으면 빌드 전까지 IDE에서 import 에러가 나고, CI의 lint 단계(build보다 먼저 실행)에서도 문제가 생길 수 있습니다.
- 자동 생성 파일은 직접 수정하지 마세요. 스크립트를 다시 실행하면 덮어써집니다.

## 📸 스크린샷

없음 (설정 작업)

## ETC

- `pnpm add` 시 esbuild 빌드 스크립트가 무시됐다는 경고가 뜰 수 있지만 `tsx`는 정상 동작합니다. 경고를 없애려면 `pnpm approve-builds`를 실행하면 됩니다.
