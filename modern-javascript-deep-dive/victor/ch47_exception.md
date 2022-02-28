## 모던 자바스크립트 Deep Dive - Ch47 에러 처리
### Javascript 에러는 어떤 것들이 있나?
- [MDN - Erorr](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error#오류_유형)
- 대표적으로 Erorr 생성자가 있고 그 이외 주요 오류는 SyntaxError, ReferecneError, TypeError, RangeError, URIError, EvalError 등이 있다.

<br>

### 에러 처리를 하지 않으면?
→ 프로그램이 강제 종료된다.

- 에러 처리 여부에 따른 결과 비교
    - 에러를 처리한 경우
    ```javascript
        try {
        const arr = null;
        arr[0];
        } catch (err) {
        console.log('에러: ', err); // TypeError 발생
        }

        console.log('여기까지 실행이 되나?'); // 실행됨
    ```

    - 에러를 처리하지 않는 경우
    ```javascript
        const arr = null;
        arr[0]; // 여기서 코드 실행 종료

        console.log('여기까지 실행이 되나?');
    ```

<br>

### try ... catch ... finally 구문 - 에러를 처리하는 대표적인 방법
- [MDN - try ... catch](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/try...catch)
- 해당 [질문 글](https://stackoverflow.com/questions/6536022/javascript-catch-not-hit-on-uncaught-syntaxerror-chrome)에 의하면 try ... catch 구문은 런타임에 발생한 에러만 처리할 수 있다.

```html
<!DOCTYPE html>
<html>
  <haed>
    <meta charset="UTF-8" />
    <title>let 키워드 중복 선언</title>
  </haed>
  <body>
    <script>
      try {
        let x = 100;

        let x = 200; // Uncaught SyntaxError: Identifier 'x' has already been declared

        console.log(x);
      } catch (err) {
        console.log(err.message);
      }

      console.log('여기까지 도착'); // 여기 실행 안됨
    </script>
  </body>
</html>
```

<br>

### 예시
```javascript
    try {
    // 실행할 코드 영역
    const arr = null;
    arr[0]; // 에러 발생 코드, 여기서 바로 catch 구문으로 Jump!

    console.log('여기는 실행이 안됨');
    } catch (err) {
    // 에러 발생시 처리 영역
    console.log('에러: ', err);
    } finally {
    console.log('여기는 에러 발생 여부와 관계없이 반드시 실행되는 부분');
    }
```

<br>

### 옵셔널 체이닝 - 참조 값이 null 또는 undefined 인경우 에러 처리 방법
- [MDN - Optional chaining](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- `?.` 연산자로 좌항에 있는 값이 null 또는 undefined인 경우 undefined를 반환, 그렇지 않으면 우항의 프로퍼티를 참조
- 예시
```jsx
    <!DOCTYPE html>
    <html>
    <head lang="ko">
        <meta charset="UTF-8" />
        <title>옵셔널 체이닝 연습</title>
    </head>
    <body>
        <h1>옵셔널 체이닝 연습</h1>
        <script>
        // button 태그가 없기 때문에
        // $button에는 null 값이 저장
        const $button = document.querySelector('button');

        // 옵셔널 체이닝을 사용하여 에러 처리
        // 옵셔널 체이닝을 사용하지 않으면 TypeError 발생
        $button?.addEventListener('click', () => {
            console.log('hello');
        });
        </script>
    </body>
    </html>
```

<br>

### Error 객체
- [MDN - Error() 생성자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error/Error)
- Erorr 생성자를 통해 에러를 생성할 수 있다.
- 예시
    ```jsx
        const testError = new Error('이건 테스트 에러');

        // 에러 종류: 에러 메시지 /n 에러 발생 위치 정보
        // 출력 예시
        // Error 이건 테스트 에러
        // ~~ 에러 위치 정보 ~~~
        console.log(testError);

        // 에러 메시지만 출력
        // 출력 예시: 이건 테스트 에러
        console.log(testError.message);
    ```
- Error를 제외한 다른 에러들도 생성자가 존재한다.(ex. SyntaxError, ReferecneError)
    - 예외에 맞는 에러를 생성할 수 있다.
    ```jsx
        const syntaxError = new SyntaxError('syntax 에러');
        console.log(syntaxError);

        const referenceError = new ReferenceError('reference 에러');
        console.log(referenceError);

        const typeError = new TypeError('type 에러');
        console.log(typeError);

        const rangeError = new RangeError('range 에러');
        console.log(rangeError);

        const uriError = new URIError('URI 에러');
        console.log(uriError);

        const evalError = new EvalError('Eval 에러');
        console.log(evalError);
    ```

<br>

### throw 문
- 에러를 **생성**하는 것과 **발생**시키는 것은 다르다.
- throw 문을 이용해야 에러를 **발생**시킬 수 있다. 즉, **try ... catch** 구문의 catch 블록이 실행된다.
- 예시
    ```jsx
        try {
        console.log('여기는 실행됨');

        throw new Error('testErorr'); // 에러를 발생시키고 catch 블록으로 이동

        console.log('여기는 실행이 안됨');
        } catch (err) {
        console.log(err.message);
        }
    ```

<br>

### 에러 전
- 에러는 콜스택 아래 방향으로 전파