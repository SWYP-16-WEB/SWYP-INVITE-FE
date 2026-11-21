# Tooling

포맷팅·Lint·Git hook 등 개발 도구 설정을 정리한 문서입니다.

## 역할 분담

| 도구                        | 담당                                                   | 설정 파일                                     |
| --------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| Prettier                    | 줄바꿈·들여쓰기·따옴표 등 코드 모양                    | `.prettierrc`                                 |
| prettier-plugin-tailwindcss | Tailwind 클래스 순서 자동 정렬 (`cn()`, `clsx()` 포함) | `.prettierrc`                                 |
| ESLint                      | 코드 품질, 컨벤션 강제, import 정렬                    | `eslint.config.mjs`                           |
| Husky + lint-staged         | 커밋 직전 staged 파일 자동 검사·수정                   | `.husky/pre-commit`, `lint-staged.config.mjs` |

`eslint-config-prettier`를 ESLint 설정 마지막에 두어 포맷 관련 규칙은 모두 Prettier에 맡깁니다.

## ESLint 규칙

[`dev-convention.md`](./dev-convention.md)의 규칙 중 정적 분석이 가능한 것을 강제합니다.

| 규칙                               | 근거                                                               |
| ---------------------------------- | ------------------------------------------------------------------ |
| `no-var`, `prefer-const`           | `var` 금지, `const` 기본 사용                                      |
| `prefer-template`                  | 문자열 조합은 템플릿 리터럴만 사용                                 |
| `react/jsx-pascal-case`            | 컴포넌트는 파스칼 케이스                                           |
| `react/button-has-type`            | `button` 태그에 `type` 명시                                        |
| `react/no-array-index-key` (warn)  | `map`의 `key`는 index 대신 고유한 값                               |
| `import/no-default-export`         | named export 사용 (Next.js 특수 파일·설정 파일 예외)               |
| `no-restricted-imports`            | `../../` 이상 상대 경로 금지 → `@/` 사용                           |
| `no-restricted-imports` (레이어별) | 의존 방향 `app → views → features → entities → shared` 역참조 금지 |

그 외 추가 규칙:

- `simple-import-sort`: side-effect → 외부 패키지 → `@/` 절대 경로 → 상대 경로 순으로 자동 정렬
- `@typescript-eslint/consistent-type-imports` (warn): 타입 전용 import는 `import type` 사용 (`isolatedModules` 대응)
- `@typescript-eslint/no-explicit-any` (warn)
- `unused-imports`: 사용하지 않는 import 자동 삭제, `_`로 시작하는 변수·인자는 예외

## Git hook (Husky + lint-staged)

- `pnpm install` 시 `prepare` 스크립트가 Husky를 설치해 `.husky/pre-commit`이 동작합니다.
- `git commit` 시 staged 파일에 한해 아래를 실행합니다. 자동 수정할 수 없는 ESLint 오류가 남으면 커밋이 중단됩니다.
  - `*.{js,jsx,mjs,cjs,ts,tsx}`: `eslint --fix` → `prettier --write`
  - `*.{json,css,md,yml,yaml}`: `prettier --write`
- ESLint 자동 수정(import 정렬 등) 결과를 Prettier가 다시 정리하도록 ESLint를 먼저 실행합니다.
- 훅은 `corepack pnpm`으로 실행해 `package.json`의 `packageManager`에 지정된 pnpm 버전을 사용합니다.
- typecheck·build는 커밋마다 돌리기엔 무거워 CI에서 검증합니다. CI에서는 `HUSKY=0`으로 훅 설치를 건너뜁니다.

## CI

PR(`develop`, `main` 대상)마다 `pnpm format:check` → `pnpm lint` → `pnpm build`를 실행하고 결과를 PR 코멘트로 남깁니다.

## 스크립트

| 스크립트            | 설명                         |
| ------------------- | ---------------------------- |
| `pnpm lint`         | ESLint 검사                  |
| `pnpm lint:fix`     | ESLint 자동 수정             |
| `pnpm format`       | Prettier로 전체 파일 포맷    |
| `pnpm format:check` | 포맷 위반 여부만 검사 (CI용) |
