# Magic Resume 로컬 실행 가이드 (Windows 기준)

이 문서는 로컬 PC에 개발 도구가 없는 상태를 기준으로, `magic-resume-for-korean` 프로젝트를 실행하는 전체 과정을 설명합니다.

## 1) 먼저 설치할 것

아래 3가지는 필수입니다.

1. `Git`
2. `Node.js` (권장: 20 LTS 이상)
3. `pnpm` (이 프로젝트는 `pnpm@10.3.0` 사용)

브라우저(Chrome/Edge)는 실행 결과 확인용으로 필요합니다.

## 2) Git 설치

1. [Git 공식 다운로드 페이지](https://git-scm.com/download/win)에서 설치 파일을 받습니다.
2. 기본 옵션으로 설치합니다.
3. PowerShell을 새로 열고 아래 명령으로 확인합니다.

```powershell
git --version
```

버전이 출력되면 정상입니다.

## 3) Node.js 설치

1. [Node.js 공식 다운로드 페이지](https://nodejs.org/en/download)에서 `LTS` 버전을 설치합니다.
2. 설치 후 PowerShell을 새로 열고 버전을 확인합니다.

```powershell
node -v
npm -v
```

버전이 출력되면 정상입니다.

## 4) pnpm 설치

이 프로젝트의 `package.json`에는 `packageManager: pnpm@10.3.0`이 지정되어 있습니다.

### 방법 A: Corepack 사용 (권장)

```powershell
corepack enable
corepack prepare pnpm@10.3.0 --activate
pnpm -v
```

### 방법 B: npm으로 설치

```powershell
npm install -g pnpm
pnpm -v
```

둘 중 한 방법만 사용하면 됩니다.

## 5) 프로젝트 내려받기

원하는 폴더에서 아래를 실행합니다.

```powershell
git clone https://github.com/dapin1490/magic-resume-for-korean.git
cd magic-resume-for-korean
```

## 6) 의존성 설치

프로젝트 루트(`package.json` 있는 위치)에서 실행합니다.

```powershell
pnpm install
```

## 7) 개발 서버 실행

```powershell
pnpm dev
```

정상 실행되면 로컬 주소가 출력됩니다. 기본적으로 아래 주소를 사용합니다.

- `http://localhost:3000`

브라우저에서 열어서 화면이 보이면 성공입니다.

## 8) 프로덕션 빌드/실행

개발 모드가 아닌, 실제 배포와 유사한 방식으로 확인하려면 아래 순서로 실행합니다.

```powershell
pnpm build
pnpm start
```

기본 포트는 `3000`입니다.

## 9) 선택: Docker로 실행

Docker Desktop이 설치되어 있으면 아래로 실행할 수 있습니다.

```powershell
docker compose up -d
```

## 10) 자주 발생하는 문제

### `pnpm` 명령을 찾을 수 없음

- PowerShell을 완전히 닫고 다시 열어 확인합니다.
- `pnpm -v`로 다시 검사합니다.
- 필요하면 `corepack prepare pnpm@10.3.0 --activate`를 다시 실행합니다.

### 포트 3000이 이미 사용 중

- 현재 3000 포트를 사용 중인 프로세스를 종료하거나,
- 다른 포트로 실행합니다.

```powershell
$env:PORT=3001
pnpm dev
```

### 설치 중 네트워크 오류

- 사내망/프록시 환경이면 npm 레지스트리 접근 정책을 확인합니다.
- 네트워크 정상 상태에서 `pnpm install`을 다시 실행합니다.

## 11) 환경변수 관련 참고

프로젝트 기본 실행 자체에는 필수 환경변수가 없습니다.

다만 AI 관련 기능을 쓰는 경우, 앱 내부 설정 화면에서 API 키를 넣거나 별도 설정이 필요할 수 있습니다.

## 12) Docker 운영 가이드 (prod/dev 분리)

아래 규칙만 지키면 배포용과 개발용을 번갈아 실행할 때 충돌을 크게 줄일 수 있습니다.

### 핵심 규칙

1. prod와 dev는 반드시 서로 다른 프로젝트명(`-p`)으로 실행합니다.
2. 모드 전환 시 `stop` 대신 `down`을 사용합니다.
3. 모드 전환 시 `--build`를 포함합니다.
4. dev 종료 시에는 `down -v`로 볼륨까지 정리합니다.

### 배포용(prod) 실행/종료

```powershell
# 실행
docker compose -p mr-prod up -d --build

# 로그 확인
docker compose -p mr-prod logs -f web

# 종료
docker compose -p mr-prod down
```

### 개발용(dev) 실행/종료

```powershell
# 실행 전 정리(이전 dev 흔적 제거)
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml down -v

# 실행
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml up --build

# 로그 확인
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml logs -f web

# 종료(반드시 -v 포함)
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml down -v
```

### 모드 전환 순서

#### prod -> dev

```powershell
docker compose -p mr-prod down
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml down -v
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml up --build
```

#### dev -> prod

```powershell
docker compose -p mr-dev -f docker-compose.yml -f docker-compose.dev.yml down -v
docker compose -p mr-prod up -d --build
```

### 피해야 하는 실행 패턴

- `docker compose up -d`와 `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`를 같은 프로젝트명으로 번갈아 실행
- 모드 전환 시 `stop`만 사용
- dev 종료 시 `down -v` 생략
