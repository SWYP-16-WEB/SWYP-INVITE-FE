# Agent Harness 스킬 구성

## 현재 적용 범위

- `AGENTS.md`: 프로젝트 규칙과 문서 안내, 작업별 라우팅 진입점
- `.agents/skills/`: 사용 가능한 스킬과 향후 추가할 스킬 폴더 (`.gitkeep`은 미작성 폴더에만 유지)
- 이 문서: 스킬 목록과 도입 상태

현재 [figma 스킬](../../.agents/skills/figma/SKILL.md)을 사용할 수 있습니다. Figma 구현·토큰 반영 작업은 해당 스킬을 먼저 읽고, 나머지 작업은 `AGENTS.md`의 Docs Map과 Skill Routing에 지정된 문서를 직접 확인합니다.

## 스킬 목록

| 스킬                | 트리거·역할                                | 상태      |
| ------------------- | ------------------------------------------ | --------- |
| `project-rule`      | 새 작업 시작 시 브랜치·구조·컨벤션 파악    | 작성 예정 |
| `app-page`          | App Router 페이지·route·화면 구현          | 작성 예정 |
| `shared-components` | 도메인과 무관한 공용 UI 구현·재사용 판단   | 작성 예정 |
| `figma`             | Figma 디자인을 코드와 디자인 토큰으로 반영 | 사용 가능 |
| `code-quality`      | 구현 마무리·리팩터링 시 코드 품질 점검     | 작성 예정 |
| `git-commit`        | 변경사항 분리·커밋 메시지 작성             | 작성 예정 |
| `git-pr`            | PR 제목·본문 작성                          | 작성 예정 |

## 기본 구조

```text
AGENTS.md
.agents/skills/
├── project-rule/.gitkeep
├── app-page/.gitkeep
├── shared-components/.gitkeep
├── figma/SKILL.md
├── code-quality/.gitkeep
├── git-commit/.gitkeep
└── git-pr/.gitkeep
docs/agents/skills-index.md
```

## 작업 흐름

현재는 `사용자 요청 → AGENTS.md → 해당 스킬(있는 경우) → 관련 문서·코드 확인 → 작업 → 검증` 순서로 진행합니다.

공통 작업·검증 절차는 [AGENTS.md](../../AGENTS.md#작업-절차)를 따릅니다.

향후 `project-rule`, `code-quality`까지 작성하면 `project-rule → 작업별 스킬 → code-quality` 흐름으로 확장할 수 있습니다. 현재는 두 스킬이 없으므로 필수 단계로 요구하지 않습니다. 커밋·PR 작업은 사용자 요청이 있을 때 진행합니다.

## 스킬 추가 기준

- 스킬 원본은 `.agents/skills/`에만 작성합니다. `.claude/skills`는 해당 폴더를 가리키는 심볼릭 링크입니다.
- 스킬은 `.agents/skills/<스킬명>/SKILL.md` 한 단계 구조로 작성합니다.
- 두 도구 호환을 위해 `SKILL.md` frontmatter에는 `name`, `description`만 사용합니다.
- 각 폴더에 `SKILL.md`를 작성하고 `.gitkeep`을 제거합니다.
- 스킬에는 설명, 참조 문서, 트리거, 수행 절차, 점검 항목을 정리합니다.
- 기존 컨벤션은 복사하지 않고 원문 문서를 참조합니다.
- 실제 문서 경로와 실행 절차를 확인한 뒤 `AGENTS.md`의 라우팅과 이 문서의 상태를 함께 갱신합니다.
