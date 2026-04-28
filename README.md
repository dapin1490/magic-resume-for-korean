<div align="center">

# ✨ Magic Resume for Korean ✨

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![TanStack Start](https://img.shields.io/badge/TanStack_Start-latest-black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.0-purple)

<a href="https://trendshift.io/repositories/13077" target="_blank"><img src="https://trendshift.io/api/badge/repositories/13077" alt="Magic Resume | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

한국어 | [English](./README.en.md) | [简体中文](./README.zh-CN.md)

</div>

Magic Resume for Korean은 전문적인 이력서를 쉽고 빠르게 작성할 수 있도록 돕는 온라인 이력서 편집기입니다. TanStack Start와 Framer Motion 기반으로 만들어졌으며, 실시간 미리보기, 사용자 지정 테마, PDF 내보내기, 자동 저장을 지원합니다.

이 저장소는 [원본 Magic Resume](https://github.com/JOYCEQL/magic-resume)에서 fork된 저장소이며, 공식 한국어 버전이 아닙니다. 한국어 사용성을 개선하기 위한 별도 버전입니다.

처음부터 로컬 환경을 구성하는 한국어 가이드는 [LOCAL_SETUP_KO.md](./LOCAL_SETUP_KO.md)를 참고하세요.

## 📸 스크린샷

<img width="1920" height="1440" alt="336_1x_shots_so" src="https://github.com/user-attachments/assets/18969a17-06f8-4a4b-94eb-284ba8442620" />

## ✨ 주요 기능

- 🚀 TanStack Start 기반 웹 애플리케이션
- 💫 Framer Motion 기반 부드러운 애니메이션
- 🎨 사용자 지정 테마와 테마 색상 적용
- 📱 반응형 디자인
- 🌙 다크 모드
- 📤 PDF 내보내기
- 🔄 실시간 미리보기
- 💾 자동 저장
- 🔒 로컬 저장소 기반 데이터 관리
- 🇰🇷 한국어 UI 지원

## 🇰🇷 한국어 버전 변경 요약

이 저장소에는 한국어 사용성과 이력서 작성 흐름을 개선하기 위한 변경 사항이 포함되어 있습니다.

- 한국어 UI를 추가하고, 메인 홈 화면 외의 화면에서도 언어를 변경할 수 있도록 개선했습니다.
- 신규 이력서 생성, JSON/PDF 가져오기, 템플릿 미리보기에서 중국어 샘플이나 내부 라벨이 노출되지 않도록 기본 로케일과 내부 기본값을 정리했습니다.
- 나눔고딕, 맑은 고딕, Noto Sans KR 등 한국어 폰트 선택지를 추가하고, 사용자가 로컬 폰트 파일이나 설치된 로컬 폰트를 사용할 수 있도록 개선했습니다.
- 한국어 폰트 사용 시 PDF 내보내기 제약을 고려해 브라우저 인쇄 안내를 표시하도록 조정했습니다.
- 현재 이력서를 복제해 새 이력서를 만들 수 있는 복제 기능을 추가했습니다.
- `YYYY/MM/DD` 형식의 날짜 입력을 지원합니다. day 입력은 생략할 수 있습니다.
- 기본 제공 섹션을 여러 개 만들 수 있도록 확장하고, 경력 작성형, 텍스트 작성형, 이미지 나열형 템플릿을 선택할 수 있도록 개선했습니다.
- 리치 텍스트에서 `$...$`, `$$...$$` 기반 LaTeX 수식 렌더링을 지원합니다.

## 🛠️ 기술 스택

- TanStack Start
- TypeScript
- Motion
- Tiptap
- Tailwind CSS
- Zustand
- Shadcn/ui
- Lucide Icons

## 🚀 빠른 시작

1. 저장소를 복제합니다.

```bash
git clone https://github.com/dapin1490/magic-resume-for-korean.git
cd magic-resume-for-korean
```

2. 의존성을 설치합니다.

```bash
pnpm install
```

3. 개발 서버를 실행합니다.

```bash
pnpm dev
```

4. 브라우저에서 `http://localhost:3000`에 접속합니다.

## 📦 빌드

```bash
pnpm build
```

## 🐳 Docker 배포

### Docker Compose

1. Docker와 Docker Compose가 설치되어 있는지 확인합니다.

2. 프로젝트 루트 디렉터리에서 다음 명령어를 실행합니다.

```bash
docker compose up -d
```

이 명령은 다음 작업을 수행합니다.

- 애플리케이션 이미지를 자동으로 빌드합니다.
- 컨테이너를 백그라운드에서 실행합니다.

### Docker Compose 개발 모드

개발 중 파일 변경을 실시간으로 반영하려면 개발용 override 파일을 함께 사용합니다.

```bash
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml up --build
```

백그라운드에서 실행하려면 다음 명령어를 사용합니다.

```bash
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

개발용 컨테이너를 중지하려면 다음 명령어를 사용합니다.

```bash
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml down -v
```

같은 머신에서 운영용 compose도 함께 실행하는 경우, 리소스 충돌을 피하기 위해 다른 프로젝트 이름을 사용하세요.

```bash
docker compose -p mr-prod up -d --build
docker compose -p mr-prod down
```

## 📝 라이선스와 상업적 이용

이 프로젝트의 소스 코드는 **Apache 2.0** 라이선스로 공개되어 있지만, **엄격한 상업적 이용 제한**이 포함되어 있습니다.

- **개인 용도 무료 사용**: 개인 학습, 개인 이력서 작성 등 순수한 개인 비상업적 목적에는 무료로 사용할 수 있습니다.
- **상업용 라이선스 필요**: SaaS/PaaS 등 수익 목적의 공개 서비스 제공, 기업의 상업적 운영, 2차 상업 개발에는 소스 코드 수정 여부와 관계없이 상업용 라이선스가 필요합니다.

자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 🗺️ 로드맵

- [x] AI 작성 보조
- [x] 다국어 지원
- [ ] 더 많은 이력서 템플릿 지원
- [ ] 더 많은 내보내기 형식 지원
- [ ] PDF, Markdown 등 가져오기
- [x] 사용자 지정 모델
- [x] 자동 한 페이지 맞춤
- [ ] 온라인 이력서 호스팅

## 📈 Star History

<a href="https://star-history.com/#JOYCEQL/magic-resume&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=JOYCEQL/magic-resume&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=JOYCEQL/magic-resume&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=JOYCEQL/magic-resume&type=Date" />
 </picture>
</a>

## 📞 원본 프로젝트

- 원본 저장소: https://github.com/JOYCEQL/magic-resume
- 이 저장소: https://github.com/dapin1490/magic-resume-for-korean

## 🌟 Support

이 프로젝트가 도움이 되었다면 저장소에 star를 남겨 주세요.
