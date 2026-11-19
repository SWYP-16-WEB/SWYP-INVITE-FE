# 디자인 토큰

## 기준

- [Figma 디자인시스템](https://www.figma.com/design/GqdvchhdyVsKxrdaBzQPJZ/SWYP-16기-1팀?node-id=17-14)의 컬러·텍스트 스타일을 기준으로 합니다.
- 토큰 원본은 `src/styles/tokens.css`이며 `globals.css`에서 불러옵니다.
- Tailwind CSS 4의 `@theme`로 컬러를, `@theme inline`으로 폰트 패밀리를 연결합니다.
- 루트 `62.5%`는 유지합니다. 기본 브라우저 폰트가 16px일 때 `1rem = 10px`이며, 사용자가 기본 글자 크기를 바꾸면 함께 확대됩니다.
- 크기·간격·둥글기·글자 크기는 기존 컨벤션대로 rem 임의값을 사용합니다. 타이포그래피 CSS 변수도 rem 값이며 임의값 문법에서 참조합니다.

## 컬러

| Figma 스타일       | 토큰                         | 값        | 사용 예시                |
| ------------------ | ---------------------------- | --------- | ------------------------ |
| Brand/Primary      | `--color-brand-primary`      | `#A7C5FB` | `bg-brand-primary`       |
| Brand/Secondary    | `--color-brand-secondary`    | `#80ABF9` | `border-brand-secondary` |
| Brand/Lime         | `--color-brand-lime`         | `#DAF99D` | `bg-brand-lime`          |
| Brand/Light        | `--color-brand-light`        | `#F4F4F4` | `bg-brand-light`         |
| Text/White         | `--color-text-white`         | `#FFFFFF` | `text-text-white`        |
| Background/Primary | `--color-background-primary` | `#081412` | `bg-background-primary`  |

컬러는 `bg-*`, `text-*`, `border-*` 등 Tailwind 유틸리티에서 사용합니다. 각 화면에서 필요한 배경·텍스트 컬러를 지정합니다.

## 폰트

- Pretendard Variable v1.3.9를 `next/font/local`로 로드합니다.
- 폰트 파일과 SIL Open Font License는 `src/app/fonts/`에 함께 보관합니다.
- 루트 레이아웃에서 `--font-pretendard`를 등록하고 `--font-sans`로 연결해 본문에 적용합니다.
- 로컬 폰트는 앱에서 직접 제공하며, 런타임에 외부 폰트 CDN을 요청하지 않습니다.
- 웨이트 범위는 원본의 `45 920`, 표시 정책은 `swap`입니다.
- [폰트 원본](https://github.com/orioncactus/pretendard/blob/v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2)

## 타이포그래피

모든 스타일의 자간은 0이고 행간은 글자 크기의 150%입니다. 행간은 rem으로 환산해 정의합니다.

| Figma 스타일      | 크기 토큰 접미사 | 글자 크기 | 행간     | 굵기 유틸리티         |
| ----------------- | ---------------- | --------- | -------- | --------------------- |
| head - bold 28    | `head`           | `2.8rem`  | `4.2rem` | `font-bold` (700)     |
| title1 - bold 24  | `title-1`        | `2.4rem`  | `3.6rem` | `font-bold` (700)     |
| title2 - sb 20    | `title-2`        | `2rem`    | `3rem`   | `font-semibold` (600) |
| title2 - bold 20  | `title-2`        | `2rem`    | `3rem`   | `font-bold` (700)     |
| body1 - sb 16     | `body-1`         | `1.6rem`  | `2.4rem` | `font-semibold` (600) |
| body2 - med 14    | `body-2`         | `1.4rem`  | `2.1rem` | `font-medium` (500)   |
| caption1 - reg 12 | `caption-1`      | `1.2rem`  | `1.8rem` | `font-normal` (400)   |
| caption2 - sb 12  | `caption-2`      | `1.2rem`  | `1.8rem` | `font-semibold` (600) |
| caption3 - reg 10 | `caption-3`      | `1rem`    | `1.5rem` | `font-normal` (400)   |

크기는 `--font-size-<접미사>`, 행간은 `--line-height-<접미사>`로 참조합니다. Figma의 caption2 보조 설명에는 regular로 적혀 있지만 실제 연결된 스타일은 SemiBold 600이므로 실제 스타일 값을 따릅니다.

```tsx
<h1 className='text-[length:var(--font-size-head)] leading-[var(--line-height-head)] font-bold'>
  모임 준비하기
</h1>

<p className='text-[length:var(--font-size-body-2)] leading-[var(--line-height-body-2)] font-medium'>
  모임을 함께 준비해 보세요.
</p>
```

`text-[length:...]`는 글자 크기임을 명시해 텍스트 컬러 변수와 구분합니다. `text-sm`, `text-xl` 등 기본 크기 스케일은 사용하지 않습니다.

```tsx
<button
  type='button'
  className='rounded-[1rem] bg-brand-primary px-[3rem] py-[1.6rem] text-[length:var(--font-size-body-1)] leading-[var(--line-height-body-1)] font-semibold'
>
  초대장 만들기
</button>
```

조건부 클래스 또는 외부 `className` 병합은 기존 `@/shared/utils/cn`을 사용합니다. 폰트 크기·행간·굵기를 각각 조합하므로 `cn`의 기존 충돌 처리도 유지됩니다.
