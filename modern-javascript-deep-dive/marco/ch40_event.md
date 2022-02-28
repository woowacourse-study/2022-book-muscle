## 40장. 이벤트

- 이벤트 드리븐 프로그래밍
  - 브라우저는 처리해야 할 특정 사건이 발생하면 이를 감지하여 이벤트를 발생시킨다. 만약 애플리케이션이 특정 타입의 이벤트에 대해 반응하여 어떤 일을 하고 싶다면 해당하는 타입의 이벤트가 발생했을 때 호출될 함수를 브라우저에게 알려 호출을 위임한다. 이때 호출될 함수를 `이벤트 핸들러` 라 한다. 이벤트와 그에 대응하는 함수(이벤트 핸들러)를 통해 사용자와 애플리케이션은 상호작용을 할 수 있다. 이와 같이 프로그램의 흐름을 이벤트 중심으로 제어하는 프로그래밍 방식을 `이벤트 드리븐 프로그래밍` 이라 한다.
- 이벤트 타입
  - 이벤트 타입은 약 200여가지가 있으며, 상세 목록은 [MDN](https://developer.mozilla.org/ko/docs/Web/Events)에서 확인할 수 있다.
  - click, dblclick, mousedown, mouseup, mousemove, mouseenter, mouseover, mouseleave, mouseout
  - [키보드이벤트] keydown, keypress, keyup
  - [포커스이벤트] focus, blur, focusin, focusout
  - [폼 이벤트] submit, reset
  - [값 변경 이벤트] input, change, readystatechange
  - [DOM 뮤테이션 이벤트] DOMContentLoaded
  - [뷰 이벤트] resize, scroll
  - [리소스 이벤트] load, unload, abort, error
- 이벤트 핸들러 등록 : 이벤트 핸들러는 이벤트가 발생하면 브라우저에 의해 호출될 함수다.

  - 이벤트 핸들러 어트리뷰트 방식

    - HTML과 자바스크립트가 뒤섞이는 문제가 있을 수 있다.

    ```jsx
    <button onclick="sayHi('marco')"> Click me! </button>
      <script>
        function sayHi(name) {
          console.log(`Hi! ${name}`);
        }
      </script>

    ```

  - 이벤트 핸들러 프로퍼티 방식

    - HTML과 자바스크립트가 뒤섞이는 문제를 해결할 수 있으나, 이벤트 핸들러 프로퍼티에 하나의 이벤트 핸들러(function)만 바인딩할 수 있다는 단점이 있다.

    ```jsx
    <button> Click me! </button>
      <script>
        const $button = document.querySelector('button');
        //이벤트 핸들러 프로퍼티에 이벤트 핸들러를 바인딩00000000
        $button.onclick = function() {
          console.log('button click');
        };
      </script>

    ```

  - addEventListener 메서드 방식

    - 하나 이상의 이벤트 핸들러를 등록할 수 있고, 등록된 순서대로 호출된다.

    ```jsx
    <button> Click me! </button>
      <script>
        const $button = document.querySelector('button');

        $button.addEventListener('click', function() {
          console.log('button click');
        });
      </script>

    ```

- 이벤트 핸들러 제거

  - addEventListener 메서드로 등록한 이벤트 핸들러를 제거하려면 `removeEventListener` 메서드를 사용한다. 인수는 동일해야 한다. 무명 함수를 이벤트 핸들러로 등록한 경우 제거할 수 없다.

    ```html
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");
      const handleClick = () => console.log("button click");

      $button.addEventListener("click", handleClick);
      $button.removeEventListener("click", handleClick);
    </script>
    ```

  - `이벤트 핸들러 프로퍼티 방식`으로 등록한 이벤트 핸들러는 removeEventListener 메서드로 제거할 수 없다. 이런 경우 이벤트 핸들러를 제거하려면 이벤트 핸들러 프로퍼티에 `null`을 할당한다.

    ```html
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");
      const handleClick = () => console.log("button click");

      $button.onclick = handleClick;

      //이벤트 핸들러 제거
      $button.onclick = null;
    </script>
    ```

- 이벤트 객체
  - 이벤트가 발생하면 이벤트에 관련한 다양한 정보를 담고 있는 이벤트 객체가 동적으로 생성되며, 생성된 이벤트는 이벤트 핸들러의 첫 번째 인수로 전달된다.
- 이벤트 전파
  - DOM 트리 상에 존재하는 DOM 요소 노드에서 발생한 이벤트는 DOM 트리를 통해 전파된다. 생성된 이벤트 객체는 이벤트를 발생시킨 DOM 요소인 이벤트 타깃을 중심으로 DOM 트리를 통해 전파된다.
    1. 캡처링 단계 : 이벤트 객체가 상위 요소(window)에서 하위 요소(이벤트 타깃) 방향으로 전파
       - 캡처링 단계의 이벤트를 캐치하려면 addEventListener 메서드의 3번째 인수로 true를 전달해야 한다.
    2. 타깃 단계 : 이벤트 객체가 이벤트 타깃에 도달
    3. 버블링 단계 : 이벤트 객체가 하위 요소(이벤트 타깃)에서 상위 요소(window) 방향으로 전파
- 이벤트 핸들러 내부의 this

  - 이벤트 핸들러 어트리뷰트 방식

    - 일반 함수로 호출되므로 이벤트 핸들러 함수 내부의 this는 전역 객체 window를 가리킨다.

    ```
    <button onclick="sayHi('marco')"> Click me! </button>
      <script>
        function sayHi(name) {
          console.log(this); //window
        }
      </script>

    ```

  - 이벤트 핸들러 프로퍼티 방식과 addEventListenr 메서드 방식

    - 두 방식 모두 이벤트 핸들러 내부의 this는 이벤트를 바인딩한 DOM 요소를 가리킨다. 즉, 이벤트 핸들러 내부의 this는 이벤트 객체의 currentTarget 프로퍼티와 같다.

      ```
      <button> Click me! </button>
        <script>
          const $button = document.querySelector('button');
          $button.onclick = function(e) {
            console.log(this); //$button
            console.log(e.currentTarget); //$button
            console.log(this === e.currentTarget) //true
          };
        </script>

      ```

    - 화살표 함수로 정의한 이벤트 핸들러 내부의 this는 상위 스코프의 this를 가리킨다. 화살표 함수는 함수 자체의 this 바인딩을 갖지 않는다.

      ```
      <button> Click me! </button>
        <script>
          const $button = document.querySelector('button');
          $button.onclick = e => {
            console.log(this); //window
            console.log(e.currentTarget); //$button
            console.log(this === e.currentTarget) //false
          };
        </script>

      ```
