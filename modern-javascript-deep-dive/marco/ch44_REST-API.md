# REST API

- REST(REpresentational State Transfer)는 웹에서 HTTP의 장점을 최대한 활용한 아키텍처로서 소개됐고, 이는 HTTP 프로토콜을 의도에 맞게 디자인하도록 유도하고 있다.
  - REST의 기본 원칙을 성실히 지킨 서비스 디자인을 "RESTful"이라고 표현한다.
  - 즉, REST는 HTTP를 기반으로 클라이언트가 서버의 리소스에 접근하는 방식을 규정한 `아키텍처`고, REST API는 REST를 기반으로 서비스 API를 구현한 것을 의미한다.

## REST API의 구조

- 자원(resource), 행위(verb), 표현(representations)의 3가지 요소로 구성된다.
  - 자원 : 자원, URI(엔드포인트)
  - 행위 : 자원에 대한 행위, HTTP 요청 메서드
  - 표현 : 자원에 대한 행위의 구체적 내용, 페이로드

## REST API 설계 원칙

- `URI`는 리소스를 표현하는 데 집중해야 한다.
  - URI의 이름으로 동사보다는 명사를 사용한다.
- 행위에 대한 정의는 `HTTP 요청 메서드`를 통해 해야 한다.
  - 리소스에 대한 행위는 URI에 표현하지 않고, HTTP 요청 메서드를 통해 표현한다.
