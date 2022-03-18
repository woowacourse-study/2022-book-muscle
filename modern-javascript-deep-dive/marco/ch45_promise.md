# 프로미스

- 비동기 처리를 위한 하나의 패턴으로 콜백 함수가 있었다. 그러나 콜백 패턴은 앞서 살펴본 여러 한계가 있다.
- 따라서 ES6에서 비동기 처리를 위한 새 패턴으로 프로미스를 도입했다.
  - 프로미스는 `비동기 처리 시점`을 명확하게 표현할 수 있다는 장점이 있다.

## 비동기 처리를 위한 콜백 패턴의 단점

- 비동기 함수를 호출하면 함수 내부의 비동기로 도착하는 코드가 완료되지 않았다 해도 기다리지 않고 즉시 종료된다. 즉, 비동기 함수 내부의 비동기로 동작하는 코드는 `비동기 함수가 종료된 이후에 완료된다`. 따라서 비동기 함수 내부의 비동기로 동작하는 코드에서 `처리 결과를 외부로 반환하거나` `상위 스코프의 변수에 할당한다면` **기대한 대로 동작하지 않는다.**

```js
// GET 요청을 위한 비동기 함수
const get = url => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();
  // get 함수가 비동기 함수인 이유는 get 함수 내부의 onload 이벤트 핸들러가 비동기로 동작하기 때문이다.
  xhr.onload = () => {
    if (xhr.status === 200) {
      // ① 서버의 응답을 반환한다.
      return JSON.parse(xhr.response);
    }
    console.error(`${xhr.status} ${xhr.statusText}`);
  };
};

// ② id가 1인 post를 취득
const response = get("https://jsonplaceholder.typicode.com/posts/1");
console.log(response); // undefined

// get 함수를 호출하면 GET 요청을 전송하고 onload 이벤트 핸들러를 등록한 다음
// undefined를 반환하고 즉시 종료된다.
// 즉, 비동기 함수인 get 함수 내부의 onload 이벤트 핸들러는 get 함수가 종료된 이후에 실행된다.
```

```js
let todos;

// GET 요청을 위한 비동기 함수
const get = url => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // ① 서버의 응답을 상위 스코프의 변수에 할당한다.
      todos = JSON.parse(xhr.response);
    } else {
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };
};

// id가 1인 post를 취득
get("https://jsonplaceholder.typicode.com/posts/1");
console.log(todos); // ② undefined
```

- 위 코드에서 xhr.onload 이벤트 핸들러 프로퍼티에 바인딩한 이벤트 핸들러는 언제나 console.log(todos)가 종료한 이후에 호출된다.
  - 그 이유는 get 함수가 종료하면 get 함수의 실행 컨텍스트가 콜 스택에서 팝되고, 곧바로 ② console.log가 호출된다. 이때 console.log의 실행 컨텍스트가 생성되어 실행 컨텍스트 스택에 푸시된다. 만약 console.log가 호출되기 직전에 load 이벤트가 발생했더라도 xhr.onload 이벤트 핸들러 프로퍼티에 바인딩한 이벤트 핸들러는 결코 console.log보다 먼저 실행되지 않는다.
  - 서버로부터 응답이 도착하면 xhr 객체에서 load 이벤트가 발생하나, 이벤트 핸들러가 즉시 실행되진 않는다. 해당 이벤트 핸들러는 load 이벤트가 발생하면 일단 태스크 큐에 저장되어 대기하다가, '콜 스택이 비면' 이벤트 루프에 의해 콜 스택으로 푸시되어 실행된다.
  - 따라서 이벤트 핸드러가 실행되는 시점에는 콜 스택이 빈 상태여야 하므로 ② console.log는 이미 종료된 이후다(console.log가 100번 호출된다 해도 xhr.onload 이벤트 핸들러는 모든 console.log가 종료된 이후에 실행된다).

### 가독성 악화, 실수 유발

- 결론적으로 비동기 함수의 처리 결과(서버의 응답 등)에 대한 후속 처리는 `비동기 함수 내부`에서 수행해야 한다. 이때 비동기 함수를 범용적으로 사용하기 위해 비동기 함수에 비동기 처리 결과에 대한 후속 처리를 수행하는 `콜백 함수를 전달`하는 것이 일반적이다.
  - 하지만 이로 인해, 콜백 함수를 통해 비동기 처리 결과에 대한 후속 처리를 수행하는 비동기 함수가 다시 비동기 처리 결과를 가지고 또다시 비동기 함수를 호출해야 한다면 콜백 함수 호출이 중첩되어 복잡도가 높아지는 현상이 발생한다. 이를 `콜백 헬`이라 하며, 가독성이 악화되고 실수를 유발하는 요인이 된다.

```js
// 콜백 함수 호출 중첩 예시

// GET 요청을 위한 비동기 함수
const get = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // 서버의 응답을 콜백 함수에 전달하면서 호출하여 응답에 대한 후속 처리를 한다.
      callback(JSON.parse(xhr.response));
    } else {
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };
};

const url = "https://jsonplaceholder.typicode.com";

// id가 1인 post의 userId를 취득
get(`${url}/posts/1`, ({ userId }) => {
  console.log(userId); // 1
  // post의 userId를 사용하여 user 정보를 취득
  get(`${url}/users/${userId}`, userInfo => {
    console.log(userInfo); // {id: 1, name: "Leanne Graham", username: "Bret",...}
  });
});
```

### 에러 처리의 한계

- 이러한 콜백 패턴은 에러 처리가 곤란하다는 문제도 있다.
  - 에러는 호출자 방향으로 전파되는데, 비동기 함수(아래 코드에선 setTimeout)는 콜백 함수가 호출되는 것을 기다리지 않고 즉시 종료되어 콜 스택에서 제거되기 때문에, 이후 타이머가 만료되면 콜백 함수를 호출하는 주체는 비동기 함수가 아니다. 따라서 콜백 함수가 발생시킨 에러는 catch 블록에서 캐치되지 않는다.

```js
try {
  setTimeout(() => {
    throw new Error("Error!");
  }, 1000);
} catch (e) {
  // 에러를 캐치하지 못한다
  console.error("캐치한 에러", e);
}
```

## 프로미스의 생성

- 콜백 패턴은 콜백 헬이나 에러 처리가 곤란하다는 문제를 살펴봤다. 이를 극복하기 위해 ES6는 프로미스를 도입했다.
  - 프로미스는 호스트 객체가 아닌 ECMAScript 사양에 정의된 표준 빌트인 객체다.
- Promise 생성자 함수를 new 연산자와 함께 호출하면 프로미스 객체를 생성한다.

```js
// 프로미스 생성
// GET 요청을 위한 비동기 함수
const promiseGet = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 성공적으로 응답을 전달받으면 resolve 함수를 호출한다.
        resolve(JSON.parse(xhr.response));
      } else {
        // 에러 처리를 위해 reject 함수를 호출한다.
        reject(new Error(xhr.status));
      }
    };
  });
};

// promiseGet 함수는 프로미스를 반환한다.
promiseGet("https://jsonplaceholder.typicode.com/posts/1");
```

- 생성된 직후의 프로미스는 기본적으로 pending 상태다. 이후 비동기 처리가 수행되면 비동기 처리 결과에 따라 다음과 같이 프로미스의 상태가 변경된다. fulfilled 또는 rejected 상태를 settled 상태라고 한다. settled 상태가 되면 더는 다른 상태로 변화할 수 없다.
  - 비동기 처리 성공: resolve 함수를 호출해 프로미스를 fulfilled 상태로 변경한다.
  - 비동기 처리 실패: reject 함수를 호출해 프로미스를 rejected 상태로 변경한다.
- 프로미스는 비동기 처리 상태(PromiseStatus)와 처리 결과(PromiseValue)를 관리하는 객체다.

### 프로미스의 후속 처리 메서드

- 프로미스의 비동기 처리 상태가 변화하면 후속 처리 메서드에 인수로 전달한 콜백 함수가 선택적으로 호출된다. 이때 후속 처리 메서드의 콜백 함수에 프로미스의 처리 결과가 인수로 전달된다.

  - 모든 후속 처리 메서드(then, catch, finally)는 프로미스를 반환하며, 비동기로 동작한다.

- then
  - then 메서드는 두 개의 콜백 함수를 인수로 전달받는다.
    - 첫 번째 콜백함수는 비동기 처리가 성공했을 때 호출된다.
    - 두 번째 콜백함수는 비동기 처리가 실패했을 때 호출된다.

```js
// fulfilled
new Promise(resolve => resolve("fulfilled")).then(
  v => console.log(v),
  e => console.error(e)
); // fulfilled

// rejected
new Promise((_, reject) => reject(new Error("rejected"))).then(
  v => console.log(v),
  e => console.error(e)
); // Error: rejected
```

- catch
  - catch 메서드는 한 개의 콜백 함수를 인수로 전달받으며, 해당 콜백함수는 프로미스가 rejected인 경우에만 호출된다.(즉, then의 두 번째 콜백함수의 기능과 같다).
- finally
  - finally 메서드는 한 개의 콜백 함수를 인수로 전달받는다. 프로미스의 성공 또는 실패와 상관업이 무조건 한 번 호출된다.
  - 즉, 프로미스의 상태와 상관없이 공통적으로 수행해야 할 처리 내용이 있을 때 유용하다. 또한, 언제나 프로미스를 반환한다.

## 프로미스의 에러 처리

- 프로미스의 에러는 프로미스가 제공하는 후속 처리 메서드인 then, catch, finally를 사용하여 잘 처리할 수 있다.
- catch 메서드를 모든 then 메서드를 호출한 이후에 호출하면 비동기 처리에서 발생한 에러뿐만 아니라 then 메서드 내부에서 발생한 에러까지 모두 캐치할 수 있다.

```js
promiseGet("https://jsonplaceholder.typicode.com/todos/1")
  .then(res => console.xxx(res))
  .catch(err => console.error(err)); // TypeError: console.xxx is not a functio
```

## 프로미스 체이닝

- 프로미스는 then, catch, finally 후속 처리 메서드를 통해 콜백 헬을 해결한다.
- 프로미스는 프로미스 체이닝을 통해 비동기 처리 결과를 전달받아 후속 처리를 하므로 비동기 처리를 위한 콜백 패턴에서 발생하던 콜백헬이 발생하지 않는다.
  - 다만 프로미스도 콜백 패턴을 사용한다.
- 콜백 패턴은 가독성이 좋지 않으므로, 이를 해결하기 위해 async/await를 사용할 수 있다.

```js
// 프로미스 체이닝 방식
const url = "https://jsonplaceholder.typicode.com";

// id가 1인 post의 userId를 취득
promiseGet(`${url}/posts/1`)
  // 취득한 post의 userId로 user 정보를 취득
  .then(({ userId }) => promiseGet(`${url}/users/${userId}`))
  .then(userInfo => console.log(userInfo))
  .catch(err => console.error(err));
```

- async/await도 프로미스 기반 동작이다.

```js
// async/await 방식
const url = "https://jsonplaceholder.typicode.com";

(async () => {
  // id가 1인 post의 userId를 취득
  const { userId } = await promiseGet(`${url}/posts/1`);

  // 취득한 post의 userId로 user 정보를 취득
  const userInfo = await promiseGet(`${url}/users/${userId}`);

  console.log(userInfo);
})();
```

## 프로미스의 정적 메서드

### Promise.resolve / Promise.reject

- Promise의 resolve와 reject 메서드는 이미 존재하는 값을 래핑하여 프로미스를 생성하기 위해 사용한다.

- resolve 메서드

```js
// 원래 프로미스 생성 방식
const resolvedPromise = new Promise(resolve => resolve([1, 2, 3]));
```

```js
// 위 코드는 다음 라인 코드와 동일하게 동작, 배열을 resolve하는 프로미스를 생성
const resolvedPromise = Promise.resolve([1, 2, 3]);

resolvedPromise.then(console.log); // [1, 2, 3]
```

- reject 메서드

```js
// 원래 프로미스 생성 방식
const rejectedPromise = new Promise((_, reject) => reject(new Error("Error!")));

// 에러 객체를 reject하는 프로미스를 생성
const rejectedPromise = Promise.reject(new Error("Error!"));
rejectedPromise.catch(console.log); // Error: Error!
```

### Promise.all

- 이 메서드는 여러 개의 비동기 처리를 모두 `병렬 처리`할 때 사용한다.
  - 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 저장받는다.
  - 인수로 전달받은 배열의 프로미스가 모두 fulfilled 상태가 되면 종료한다.

```js
const requestData1 = () =>
  new Promise(resolve => setTimeout(() => resolve(1), 3000));
const requestData2 = () =>
  new Promise(resolve => setTimeout(() => resolve(2), 2000));
const requestData3 = () =>
  new Promise(resolve => setTimeout(() => resolve(3), 1000));

// 세 개의 비동기 처리를 순차적으로 처리
const res = [];
requestData1()
  .then(data => {
    res.push(data);
    return requestData2();
  })
  .then(data => {
    res.push(data);
    return requestData3();
  })
  .then(data => {
    res.push(data);
    console.log(res); // [1, 2, 3] ⇒ 약 6초 소요
  })
  .catch(console.error);
```

- Promise.all로 github에서 이름 가져오는 예시

```js
// GET 요청을 위한 비동기 함수
const promiseGet = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 성공적으로 응답을 전달받으면 resolve 함수를 호출한다.
        resolve(JSON.parse(xhr.response));
      } else {
        // 에러 처리를 위해 reject 함수를 호출한다.
        reject(new Error(xhr.status));
      }
    };
  });
};

const githubIds = ["jeresig", "ahejlsberg", "ungmo2"];

Promise.all(
  githubIds.map(id => promiseGet(`https://api.github.com/users/${id}`))
)
  // [Promise, Promise, Promise] => Promise [userInfo, userInfo, userInfo]
  .then(users => users.map(user => user.name))
  // [userInfo, userInfo, userInfo] => Promise ['John Resig', 'Anders Hejlsberg', 'Ungmo Lee']
  .then(console.log)
  .catch(console.error);
```

### Promise.race

- race 메서드는 all 메서드와 동일하게 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.
- 하지만 이 메서드는 가장 먼저 fulfilled 상태가 된 프로미스의 처리 결과를 resolve하는 새 프로미스를 반환한다.
  - 즉, 자동차 레이스에 비유를 하면, race를 했는데 제일 먼저 결승선에 들어왔으나 처리된 상태가 실격(rejected)인 경우 에러를 reject하는 새 프로미스를 즉시 반환한다. 또는 제일 먼저 결승선에 들어와서 처리된 상태가 충족(fulfilled)인 경우, 프로미스의 처리 결과를 resolve하는 새 프로미스를 즉시 반환한다.

```js
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)),
  new Promise(resolve => setTimeout(() => resolve(2), 4000)),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Error 3")), 1000)
  ),
])
  .then(console.log)
  .catch(console.log); // Error 3
```

```js
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)),
  new Promise(resolve => setTimeout(() => resolve(2), 4000)),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Error 3")), 5000)
  ),
])
  .then(console.log) // 1
  .catch(console.log);
```

### Promise.allSettled

- 이 메서드는 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.
- 전달받은 프로미스가 모두 settled(비동기 처리가 수행된 상태, 즉 fulfilled 또는 rejected 상태) 상태가 되면 처리 결과를 배열로 반환한다.

```js
Promise.allSettled([
  new Promise(resolve => setTimeout(() => resolve(1), 2000)),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Error!")), 1000)
  ),
]).then(console.log);
/*
[
  {status: "fulfilled", value: 1},
  {status: "rejected", reason: Error: Error! at <anonymous>:3:54}
]
*/
```

## 마이크로태스크 큐

```js
setTimeout(() => console.log(1), 0);

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3));

// 2
// 3
// 1
```

- setTimeout이나 프로미스의 후속 처리 메서드 모두 비동기로 동작하지만, 실행순서가 다르다. 그 이유는 다음과 같다.
  - 1. `마이크로태스크 큐`는 `태스크 큐`보다 우선순위가 높다.
  - 2. 프로미스의 후속 처리 메서드의 콜백 함수는 `마이크로태스크 큐`에 일시 저장된다(마이크로태스크 큐는 태스크 큐와는 별도의 큐다).
  - 3. setTimeout의 콜백 함수는 `태스크 큐`에 저장된다. 이와 같이 프로미스 외의 비동기 함수의 콜백 함수나 이벤트 핸들러는 `태스크 큐`에 일시 저장된다.
  - 4. 즉, 이벤트 루프는 콜 스택이 비면 먼저 마이크로태스크 큐에서 대기하고 있는 함수를 가져와서 실행하고, 이후 마이크로태스크 큐가 비었을 때 태스트 큐에서 대기하고 있는 함수를 가져와 살행한다.

## fetch

- fetch 함수는 HTTP 요청 전송 기능을 제공하는 클라이언트 사이드 Web API이다.
- fetch 함수는 `XMLHttpRequest` 객체보다 사용법이 간단하고 프로미스를 지원하기 때문에 비동기 처리를 위한 콜백 패턴의 단점에서 자유롭다.
- fetch 함수는 HTTP 응답을 나타내는 Response 객체를 래핑한 Promise 객체를 반환한다.
- fetch 함수에서 HTTP 에러(404, 500 등) 감지하려면, 반환된 Response 객체에서 불리언 타입의 ok 상태를 체크해야 한다. 그렇지 않으면, HTTP 에러임에도 불구하고 fulfilled 상태로 resolve된다.
  - 프로미스 reject는 오프라인 등의 네트워크 장애나 CORS 에러에 의해 요청이 완료되지 못한 경우에만 발생한다.
  - (참고로 `axios`는 `fetch`와 달리 모든 HTTP 에러를 reject하는 프로미스를 반환한다. 따라서 모든 에러를 catch에서 처리할 수 있어 편리하다.)

```js
const wrongUrl = "https://jsonplaceholder.typicode.com/XXX/1";

// 부적절한 URL이 지정되었기 때문에 404 Not Found 에러가 발생한다.
fetch(wrongUrl)
  // response는 HTTP 응답을 나타내는 Response 객체다.
  .then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  })
  .then(todo => console.log(todo))
  .catch(err => console.error(err));
```

- fetch 함수로 HTTP 요청 예제
  - fetch 함수에 첫 번째 인수로 HTTP 요청을 전송할 URL
  - 두 번째 인수로 HTTP 요청 메서드, HTTP 요청 헤더, 페이로드 등을 설정한 객체를 전달한다.

```js
const request = {
  get(url) {
    return fetch(url);
  },
  post(url, payload) {
    return fetch(url, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  patch(url, payload) {
    return fetch(url, {
      method: "PATCH",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  delete(url) {
    return fetch(url, { method: "DELETE" });
  },
};

request
  .get("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err));
// {userId: 1, id: 1, title: "delectus aut autem", completed: false}

request
  .post("https://jsonplaceholder.typicode.com/todos", {
    userId: 1,
    title: "JavaScript",
    completed: false,
  })
  .then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err));
// {userId: 1, title: "JavaScript", completed: false, id: 201}

request
  .patch("https://jsonplaceholder.typicode.com/todos/1", {
    completed: true,
  })
  .then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err));
// {userId: 1, id: 1, title: "delectus aut autem", completed: true}

request
  .delete("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err));
// {}
```
