# NextjsMemorizeSite
퀴즈 사이트

# 프로젝트 정보
### 1. 제작기간
> 2025.6.13 ~ 2024.7.18
### 2. 배포 중인 URL
> [이동하기](https://quiz-web.p-e.kr/login)

# 사용 기술
- NextJs
- Node.js
- Javascript
- Oracle FreeTier 배포
- MariaDB
- Docker(MariaDB, Nginx)
> Nginx는 HTTP 배포, 리버스 프록시를 위해 사용

# ERD
<details>
  <summary>ERD</summary>
  <img width="687" height="720" alt="Image" src="https://github.com/user-attachments/assets/b05c8bb6-f888-474d-a5b7-194a1c20cd80" />
</details>

# 기능
로그인 & 회원가입
> nextauth 라이브러리 + CredentialsProvider 사용으로 소셜 로그인 구현

퀴즈
> 퀴즈 생성, 공개 설정, 파일 형식으로 업로드, 폴더, 공유 기능(토큰 사용)

다크모드
> next-themes 라이브러리 사용

# 스크린샷(기능 설명)
<details>
  <summary>로그인</summary>
    소셜 로그인<br>
    <img width="1015" height="820" alt="Image" src="https://github.com/user-attachments/assets/6a807614-74fe-4aad-acce-2d9148599865" /><br>
</details>
<details>
  <summary>퀴즈</summary>
    퀴즈 추가<br>
    <img width="1881" height="931" alt="Image" src="https://github.com/user-attachments/assets/9a91ea29-9a6d-447d-a589-cf18fffe4d57" /><br>
    퀴즈 txt로 업로드<br>
    <img width="1240" height="524" alt="Image" src="https://github.com/user-attachments/assets/a319663f-6a8e-487a-9052-b1d929088e5a" /><br>
    폴더 추가<br>
    <img width="1262" height="592" alt="Image" src="https://github.com/user-attachments/assets/53916e7d-32ac-4d84-9a4f-e8741c51da8c" /><br>
    폴더 들어감<br>
    <img width="1265" height="530" alt="Image" src="https://github.com/user-attachments/assets/67e5692d-3eb2-413c-a35e-cd9cd74e716d" /><br>
    폴더 공유<br>
    <img width="1351" height="608" alt="Image" src="https://github.com/user-attachments/assets/9c066dee-8412-45bc-bb76-0cdfd3429887" /><br>
</details>
<details>
  <summary>퀴즈 시작</summary>
    퀴즈 창<br>
    <img width="1862" height="904" alt="Image" src="https://github.com/user-attachments/assets/ee20edc2-5546-43f2-a0e9-9c2fe846a142" /><br>
    퀴즈 시작<br>
    <img width="1872" height="754" alt="Image" src="https://github.com/user-attachments/assets/2c7448a3-e390-40a1-8d4b-559e8644da89" /><br>
    퀴즈 종료<br>
    <img width="864" height="720" alt="Image" src="https://github.com/user-attachments/assets/d736d7b5-7d5d-4424-8212-47b20263d9e9" /><br>
    이어 하기<br>
    <img width="808" height="810" alt="Image" src="https://github.com/user-attachments/assets/0e7b0053-49d2-43c6-b62a-ab6d896d7f12" /><br>
</details>

# 느낀 점
- 대부분의 로딩을 SSR로 구현 CSR로 구현하는 것은 스크롤로 하거나, 스켈레톤 UI로 제작해도 되지만 SSR로 했을 때의 장점인 빠릿함이 확실히 좋았다
- HTTP 배포를 위해 certbot, nginx를 사용 했는데 배포 과정에서 문제가 너무 많았다
- 도커에 있는 DB를 덤프해서 가져오는 과정에서도 문제가 많았지만 덤프를 cmd에서 실행하고 인코딩을 바꾸니 해결 되서 많이 배웠다
- prisma 커넥터 풀도 재사용 해야 된다는 것을 알았다 혼자 사용하다보니 예전 프로젝트에서는 문제를 몰랐는데 커넥터 풀을 계속 만들고 있었어서 오래쓰면 문제가 생겼었는데 해결했다
- 도커를 사용했을 떄 확실히 배포하기 편했다
- 파일 구조 생각하는게 굉장히 어려웠다 퀴즈 공개 비공개에 따른 공유 여부, 폴더 안에 폴더가 가능하게 할지 등등.. ERD와 구조를 짜는데 많은 시간이 걸렸다
- 오라클 프리티어는 느리다..
