# Ajax

- Ajax(Asynchronous JavaScript and XML)란 자바스크립트를 사용하여 브라우저가 서버에게 비동기 방식으로 데이터를 요청하고, 서버가 응답한 데이터를 수신하여 웹페이지를 동적으로 갱신하는 프로그래밍 방식을 말한다.
  - Ajax는 브라우저에서 제공하는 Web API인 XMLHttpRequest 객체를 기반으로 동작한다. XMLHttpRequest는 HTTP 비동기 통신을 위한 메서드와 프로퍼티를 제공한다.
  - 구글 맵스가 웹브라우저에서 자바스크립트와 Ajax를 기반으로 동작한다.
- Ajx는 서버로부터 웹페이지의 `변경에 필요한 데이터만` `비동기 방식으로 전송받아` 웹페이지를 변경할 필요가 없는 부분은 다시 렌더링하지 않고, `변경할 필요가 있는 부분만 한정적으로 렌더링`할 수 있게 됐다.
  - 이를 통해, 불필요한 데이터 통신이 발생하지 않고, 화면이 순간적으로 깜박이는 현상도 없으며, 서버에게 요청을 보낸 후 블로킹이 발생하지도 않는다.

## JSON

- JSON(JavaScript Object Notation)은 클라이언트와 서버 간의 HTTP 통신을 위한 텍스트 데이터 포맷이다.
  - 자바스크립트에 종속되지 않는 언어 독립형 포맷으로, 대부분의 프로그래밍 언어에서 사용할 수 있다.
- JSON은 객체 리터럴과 유사하게 `키`와 `값`으로 구성된 순수한 텍스트다.
  - JSON의 `키`는 반드시 큰따옴표(작은따옴표 사용 불가)로 묶어야 한다
- `JSON.stringify` 메서드는 객체(또는 배열)를 JSON 포맷의 `문자열`로 변화한다.
  - 클라이언트가 서버로 객체를 전송하려면 객체를 문자열화해야 하는데 이를 `직렬화`라 한다.

```jsx
const obj = {
  name: "Lee",
  age: 20,
  alive: true,
  hobby: ["traveling", "tennis"],
};

// 객체를 JSON 포맷의 문자열로 변환한다.
const json = JSON.stringify(obj);
console.log(typeof json, json);
// string {"name":"Lee","age":20,"alive":true,"hobby":["traveling","tennis"]}

// 객체를 JSON 포맷의 문자열로 변환하면서 들여쓰기 한다.
const prettyJson = JSON.stringify(obj, null, 2);
console.log(typeof prettyJson, prettyJson);
/*
string {
  "name": "Lee",
  "age": 20,
  "alive": true,
  "hobby": [
    "traveling",
    "tennis"
  ]
}
*/

// replacer 함수. 값의 타입이 Number이면 필터링되어 반환되지 않는다.
function filter(key, value) {
  // undefined: 반환하지 않음
  return typeof value === "number" ? undefined : value;
}

// JSON.stringify 메서드에 두 번째 인수로 replacer 함수를 전달한다.
const strFilteredObject = JSON.stringify(obj, filter, 2);
console.log(typeof strFilteredObject, strFilteredObject);
/*
string {
  "name": "Lee",
  "alive": true,
  "hobby": [
    "traveling",
    "tennis"
  ]
}
*/
```

- `JSON.parse` 메서드는 JSON 포맷의 문자열s을 `객체로 변환`한다.
  - 이를 `역직렬화`라 한다. 서버가 클라이언트에게 보내는 JSON 데이터는 문자열이므로, 문자열을 객체로 사용하려면 역직렬화를 거쳐야 한다.

## XMLHttpRequest

- 자바스크립트를 사용하여 HTTP 요청을 전송하려면 Web API인 XMLHttpRequest 객체를 사용한다.

  - 이 객체는 HTTP 요청 전송과 HTTP 응답 수신을 위한 다양한 메서드와 프로퍼티를 제공한다.

- XMLHttpRequest 객체 생성

```js
const xhr = new XMLHttpRequest();
```

- XMLHttpRequest 객체의 프로퍼티
  - readyState : HTTP 요청의 현재 상태를 나타내는 정수
    - UNSENT(0), OPENED(1), HEADERS_RECEIVED(2), LOADING(3), DONE(4)
  - status : HTTP 요청에 대한 응답 상태(HTTP 상태 코드)를 나타내는 정수
    - ex) 200
  - statusText : HTTP 요청에 대한 응답 메시지를 나타내는 문자열
    - ex) "OK"
  - responseType : HTTP 응답 타입
    - ex) document, json, text, blob, arraybuffer
  - response : HTTP 요청에 대한 응답 몸체(body)
- XMLHttpRequest 객체의 이벤트 핸들러 프로퍼티
  - onreadystatechange : readyState 프로퍼티 값이 변경된 경우
  - onerror : HTTP 요청에 에러가 발생한 경우
  - onload : HTTP 요청이 성공적으로 완료한 경우
- XMLHttpRequest 객체의 메서드
  - open : HTTP 요청 초기화
  - send : HTTP 요청 전송
  - abort : 이미 전송된 HTTP 요청 중단
  - setRequestHeader 특정 HTTP 요청 헤더의 값을 설정
- XMLHttpRequest 객체의 정적 프로퍼티

  - UNSENT(=0) : open 메서드 호출 이전
  - OPENED(=1) : open 메서드 호출 이후
  - HEADERS_RECEIVED(=2) : send 메서드 호출 이후
  - LOADING(=3) : 서버 응답 중(응답 데이터 미완성 상태)
  - DONE(=4) : 서버 응답 완료

- HTTP 요청 전송 순서

  - 1. XMLHttpRequest.prototype.open 메서드로 `HTTP 요청을 초기화`한다.
    - xhr.open(method, url[, async]);
      - method는 "GET", "POST"(생성), "PUT"(전체 교체), "DELETE", "PATCH"(일부 수정)
        - "GET"과 "DELETE"는 페이로드가 없고, 나머지는 다 페이로드가 탑재된다.
      - async는 비동기 요청 여부 옵션으로 기본값은 true이고 비동기 방식으로 동작한다.
    ```jsx
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/users");
    ```
  - 2. 필요에 따라 XMLHttpRequest.prototype.setRequestHeader 메서드로 특정 HTTP 요청의 `헤더 값을 설정`한다.

    - 반드시 open 메서드를 호출한 이후에 호출해야 한다.
    - 자주 사용하는 HTTP 요청 헤더는 `content-type`과 `accept`가 있다.
      - `content-type`은 `요청` 몸체에 담아 전송할 데이터의 MIME 타입의 정보를 표현하고, 자주 사용되는 MIME 타입은 `text/plain`, `text/html`, `text/javascript`, `application/json`, `multipart/formed-data`등이 있다.
      - `accept`는 HTTP 클라이언트가 서버에 요청할 때 `서버가 응답`할 데이터의 MIME 타입이다.
      -

    ```jsx
    // 클라이언트가 서버로 전송할 데이터의 MIME 타입 지정: json
    xhr.setRequestHeader("content-type", "application/json");

    // 또는 서버가 응답할 데이터의 MIME 타입 지정: json
    xhr.setRequestHeader("accept", "application/json");
    ```

  - 3. XMLHttpRequest.prototype.send 메서드로 `HTTP 요청을 전송`한다.

    - send 메서드에는 요청 몸체에 전송할 데이터를 인수로 전달할 수 있다.

    ```jsx
    xhr.send();

    // 또는 POST 요청 메서드였다면 페이로드(전송할 데이터를 직렬화하여)를 인수로 전달한다.
    xhr.send(JSON.Stringify({ id: 1, content: "HTML", completed: false }));
    ```

- HTTP 응답 처리
  - 서버가 전송한 응답을 처리하려면, `readystatechange` 이벤트를 캐치하여 다음과 같이 HTTP 응답을 처리한다.

```jsx
// XMLHttpRequest 객체 생성
const xhr = new XMLHttpRequest();

// HTTP 요청 초기화
// https://jsonplaceholder.typicode.com은 Fake REST API를 제공하는 서비스다.
xhr.open("GET", "https://jsonplaceholder.typicode.com/todos/1");

// HTTP 요청 전송
xhr.send();

// readystatechange 이벤트는 HTTP 요청의 현재 상태를 나타내는 readyState 프로퍼티가
// 변경될 때마다 발생한다.
xhr.onreadystatechange = () => {
  // readyState 프로퍼티는 HTTP 요청의 현재 상태를 나타낸다.
  // readyState 프로퍼티 값이 4(XMLHttpRequest.DONE)가 아니면 서버 응답이 완료되지 상태다.
  // 만약 서버 응답이 아직 완료되지 않았다면 아무런 처리를 하지 않는다.
  if (xhr.readyState !== XMLHttpRequest.DONE) return;

  // status 프로퍼티는 응답 상태 코드를 나타낸다.
  // status 프로퍼티 값이 200이면 정상적으로 응답된 상태이고
  // status 프로퍼티 값이 200이 아니면 에러가 발생한 상태다.
  // 정상적으로 응답된 상태라면 response 프로퍼티에 서버의 응답 결과가 담겨 있다.
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.response));
    // {userId: 1, id: 1, title: "delectus aut autem", completed: false}
  } else {
    console.error("Error", xhr.status, xhr.statusText);
  }
};
```
