## 모던 자바스크립트 Deep Dive - Ch15 let, const 키워드와 블록 레벨 스코프
❗️변수 호이스팅
- 변수 선언문이 코드의 선두로 올려진 것 처럼 동작하는 현상
    - 선언문이 런타임 이전(평가 단계)에 실행되기 때문에 이런 현상이 발생한다.

❗️변수 선언 단계
- 스코프(실행 컨텍스트의 렉시컬 환경)에 변수 식별자를 등록해 자바스크립트 엔진에 변수의 존재를 알리는 단계

❗️변수 초기화 단계
- 등록된 변수를 초기화하는 단계(보통 undefiend로 초기화되는 거 같다.)

### var 키워드로 선언한 변수의 문제점
- var 키워드로 선언한 변수는 중복 선언이 가능하다.
    - 변수가 선언된 사실을 잊게된다면 중복 선언을 통해 의도치 않게 변수의 값을 변경할 수 있다.
    
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>var 키워드의 문제점</title>
      </head>
      <body>
        <h1>var 키워드의 문제점</h1>
        <script>
          var x = 1;
          var x = 100; // 변수의 중복 선언 가능
    
          console.log(x); // 100
    
          var y = 1;
          var y; // 단, 중복 선언 시 변수를 초기화하지 않으면 아무 일도 발생하지 않음
    
          console.log(y); // 1
        </script>
      </body>
    </html>
    ```

- 함수 레벨 스코프
    - var로 선언된 변수는 함수의 코드 블록만 지역 스코프로 인정한다.
    - 즉, 제어문 또는 반복문의 코드 블록은 스코프로 인정하지 않는다.
    
    ```javascript
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>var 키워드의 문제점</title>
      </head>
      <body>
        <h1>var 키워드의 문제점</h1>
        <script>
          var x = 10;
    
          if (true) {
            // 제어문의 코드 블록은 스코프로 인정하지 않는다.
            // 따라서 아래 코드는 전역 변수를 중복 선언한 결과와 같다.
            var x = 1000;
          }
    
          console.log(x); // 1000
    
          let y = 10;
    
          if (true) {
            // let 키워드로 선언된 변수는 제어문의 코드 블록을 스코프로 인정한다.
            let y = 1000;
          }
    
          console.log(y); // 10
    
          var z = 100;
    
          function test() {
            // 함수의 코드 블록은 스코프로 인정한다.
            // 따라서 아래 코드는 함수 스코프에 변수를 등록한 것이다.
            var z = 200;
          }
    
          test();
    
          console.log(z); // 100
        </script>
      </body>
    </html>
    ```

- 변수 호이스팅
    - 변수 호이스팅에 의해 var 키워드로 선언한 변수는 변수 선언문 이전에 참조가 가능하다.
        - 참조 에러(ReferenceError)가 발생하지 않는다.
            - var로 선언한 변수는 **선언 단계**와 **초기화 단계**가 한번에 진행된다.
        - 이런 특성은 오류를 발생시킬 여지를 만든다.(일반적인 생각의 흐름과 다름)
    - 단, 할당문 이전에 참조를 하게되면 undefined를 반환한다.
    
    ```html
    <!DOCTYPE html>
    <html>
      <haed>
        <meta charset="UTF-8" />
        <title>var 키워드 호이스팅</title>
      </haed>
      <body>
        <script>
          console.log(x); // undefined
    
          x = 100;
    
          console.log(x); // 100
    
          var x;
        </script>
      </body>
    </html>
    ```

<br>

### let 키워드 - ES6에서 도입된 변수 선언 키워드
- let 키워드로는 변수의 중복 선언이 불가능하다.
    - 같은 이름의 변수를 중복 선언 하게되면 문법 에러(SyntaxError)가 발생한다.
    
    ```html
    <!DOCTYPE html>
    <html>
      <haed>
        <meta charset="UTF-8" />
        <title>let 키워드 중복 선언</title>
      </haed>
      <body>
        <script>
          let x = 100;
    
          let x = 200; // Uncaught SyntaxError: Identifier 'x' has already been declared
    
          console.log(x);
        </script>
      </body>
    </html>
    ```
    
- 블록 레벨 스코프
    - let 키워드로 선언한 변수는 모든 코드 블록을 스코프로 인정한다.
    
    ```html
    <!DOCTYPE html>
    <html>
      <haed>
        <meta charset="UTF-8" />
        <title>let 블록 레벨 스코프</title>
      </haed>
      <body>
        <script>
          let x = 100;
    
          if (true) {
            let x = 200;
            let y = 300;
          }
    
          console.log(x);
          console.log(y); // ReferecneError
        </script>
      </body>
    </html>
    ```
    
- 변수 호이스팅
    - let 키워드로 선언한 변수는 변수 호이스팅이 발생하지 않는 것처럼 보이지만, **실제로는 변수 호이스팅은 발생한다.**
    - 변수 호이스팅이 발생하지 않는 것처럼 느껴지는 원인은 변수를 선언하기 전에 참조를 하면 참조 에러(ReferenceError)가 발생하기 때문이다.
        - 위 상황에서 참조 에러가 발생하는 이유는 let 키워드로 선언한 변수는 **선언 단계와 초기화 단계가 분리되어 진행**되기 때문이다.
        - 선언 단계는 평가 단계에서 실행되고 초기화 단계는 변수 선언문에 도달했을 때 실행이 된다.
        - 즉 let 키워드로 선언한 변수는 스코프 시작 지점부터 초기화 지점까지 변수를 참조할 수 없고, 이 구간을 **일시적 사각지대(Temproral Dead Zone; TDZ)**라고 한다.
        
    
    ```html
    <!DOCTYPE html>
    <html>
      <haed>
        <meta charset="UTF-8" />
        <title>let 키워드 호이스팅</title>
      </haed>
      <body>
        <script>
          console.log(x); // ReferenceError
    
          let x;
          console.log(x); // undefined
    
          x = 1;
          console.log(x); // 1
        </script>
      </body>
    </html>
    ```
    
    - let 키워드로 선언한 변수에 변수 호이스팅이 발생한다는 근거
        - 모던 자바스크립트 딥 다이브에 의하면 자바스크립트는 모든 선언을 호이스팅한다.
    
    ```html
    <!DOCTYPE html>
    <html>
      <haed>
        <meta charset="UTF-8" />
        <title>let 키워드 호이스팅</title>
      </haed>
      <body>
        <script>
          if (true) {
            // Uncaught ReferenceError: Cannot access 'y' before initialization
            // 만약 let 키워드에 대해서 변수 호이스팅이 발생하지 않는다면
            // 아래 코드에서 1이 출력돼야 한다.
            console.log(y);
            let y = 20;
          }
        </script>
      </body>
    </html>
    ```

<br>

### 전역 객체와 let
- var로 선언한 전역 변수, 함수, 그리고 선언하지 않은 변수에 값을 할당한 암묵적 전역은 전역 객체 window의 프로퍼티가 된다.
- 반면, let 키워드로 선언한 전역 변수는 전역 객체의 프로퍼티가 아니다.
    - 전역 렉시컬 환경의 선언적 환경 레코드에 존재한다고 한다.

<br>

### Const 키워드 - 재할당이 금지된 변수 선언 키워드
- let 키워드와 비슷한 특징을 가진다.
    - 중복 선언 불가
    - 블록 레벨 스코프
    - 변수 호이스팅
- 선언과 동시에 초기화를 진행해야한다.
    - 그렇지 않으면 문법 에러 발생(SyntaxError)
- 재할당 금지
    - const 키워드로 선언한 변수는 재할당이 금지된다.
        - 재할당을 하게되면 타입 에러(TypeError) 발생
    
- 상수로 활용
    - 상수는 재할당 금지된 변수를 의미한다.
    - const 키워드 선언된 변수에 원시 값을 할당하면 변수의 값은 변경할 수 있다.
        - 원시 값은 변경 불가능한 값이다.
        - 원시 값의 종류에는 string, number, boolean 값 등이 있다.
- 객체와 함께 사용한 경우
    - const 키워드로 선언한 변수에 객체를 할당하면 값을 변경할 수 있다.
        - const 키워드는 **변수의 재할당을 막을 뿐이다!!**
        ```html
            <!DOCTYPE html>
            <html>
            <haed>
                <meta charset="UTF-8" />
                <title>const 키워드</title>
            </haed>
            <body>
                <script>
                const car = {
                    name: 'best',
                };

                car.name = 'good'; // 재할당 없이 값 변경 가능

                console.log(car.name); // good
                </script>
            </body>
            </html>
        ```

<br>

### var VS let VS const - 그래서 뭐 쓰지?
- ES6를 사용한다면 var는 사용하지 않는다.
- 재할당이 필요한 경우에는 let을 사용하고,  그렇지 않다면 const를 사용하라
- 변수 선언 시 재할당 여부를 모르겠으면 일단 const를 사용하는 것을 권장한다.