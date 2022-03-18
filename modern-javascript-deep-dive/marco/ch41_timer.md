# 타이머

## 호출 스케줄링

- 함수를 명시적으로 호출하지 않고 일정 시간이 경과된 이후에 호출되도록 함수 호출을 예약하려면 `타이머 함수`를 사용하며, 이를 `호출 스케줄링`이라 한다.
  - 호스트 객체로서 타이머를 생성하는 `setTimeout`, `setInterval`과 타이머 제거하는 `clearTimeout`, `clearInterval`이 존재한다. 이들은 브라우저 환경과 Node.js 환경에서 모두 전역 객체의 메서드이다.
- 자바스크립트 엔진은 `싱글 스레드`(하나의 실행 컨텍스트 스택, 두 가지 이상 태스크 동시 실행 불가)로 동작하므로, 타이머 함수들을 `비동기 처리 방식`으로 동작한다.

## 타이머 함수

### setTimeout / clearTimeout

- `호출 스케줄링된 콜백 함수(첫 번째 인수)에 전달해야 할 인수가 존재하는 경우`, setTimeout 함수의 세 번째 인수로 전달할 수 있다.

```js
setTimeout(name => console.log(`Hi! ${name}`), 1000, "Marco");
// 1초 후 콘솔에 'Hi! Marco' 가 찍힌다.
```

- setTimeout 함수는 생성된 타이머를 식별할 수 있는 고유한 타이머 id를 반환하며, clearTimeout 함수는 해당 타이머 id를 인수로 받아서 타이머(호출 스케줄링)를 취소할 수 있다.

```js
const timeId = setTimeout(name => console.log(`Hi! ${name}`), 1000, "Marco");
clearTimeout(timerId);
```

### setInterval / clearInterval

- setInterval 함수는 두 번째 인수로 전달받은 시간(ms, 1/1000초)으로 반복 동작하는 타이머를 생성하며, 타이머가 만료될 때마다 첫 번째 인수로 전달받은 콜백 함수가 반복 호출된다. 이외에는 setTimeout과 비슷하다.

## 디바운스와 스로틀

- scroll, resize, input, mousemove 같은 이벤트는 짧은 시간 간격으로 연속해서 발생하는데, 이로 인해 과도하게 호출된 이벤트 핸들러로 인해 성능에 문제가 생길 수 있다.
- 이를 해결하기 위해, 디바운스와 스로틀이라는 기법을 사용한다.
  - 디바운스와 스로틀은 짧은 시간 간격으로 연속해서 발생하는 이벤트를 `그룹화`해서 `과도한 이벤트 핸들러의 호출을 방지`하는 기법이다.

- 디바운싱: 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것
  - 만약 이벤트가 이전 이벤트가 끝나고 정해진 시간보다 빠르게 발생한 경우, 이전 이벤트에 기록된 디바운서를 지우고 다시 디바운서를 킵니다. 결과적으로 마지막으로 발생한 이벤트에 대해서만 정해진시간이 지난 후 이벤트 콜백 함수가 호출되게 됩니다!
- 스로틀링: 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
  - 쓰로틀러를 정해진 시간동안 작동시키고, 만약 쓰로틀러가 이벤트를 조이고 있는 경우, 해당 이벤트는 무시됩니다. 결과적으로 정해진 시간 동안 최대 1번의 이벤트만이 발생이 가능하게 됩니다!

### 디바운스

- 디바운스(debounce)는 짧은 시간 간격으로 이벤트가 연속으로 발생하면 이벤트 핸들러를 호출하지 않다가 일정 시간이 경과한 이후에 이벤트 핸들러가 한 번만 호출되도록 한다. 즉, 디바운스는 `짧은 시간 간격으로 발생하는 이벤트`를 `그룹화`하여 마지막에 한 번만 이벤트 핸들러가 호출되도록 한다.
  - 디바운스 함수가 반환한 함수는 디바운스 함수에 두 번째 인수로 전달한 시간보다 짧은 간격으로 이벤트가 발생하면 이전 타이머를 취소하고 새로운 타이머를 재설정한다. 따라서 delay 시간보다 짧은 간격으로 이벤트가 연속해서 발생하면 디바운스 함수의 첫 번째 인수로 전달된 콜백함수는 호출되지 않다가 delay 동안 input 이벤트가 더 이상 발생하지 않으면 한 번만 호출된다.
- [나만의 유튜브 강의실] 미션에서 검색 버튼을 빠르게 연타해서 누르거나 스크롤을 과도하게 빨리 내리게 되면, API 호출이 짧은 시간 내에 너무 많아져서 금방 API가 막히게 되는데, 이러한 오작동 케이스를 방지하기 위해 디바운스를 활용할 수 있겠다.
- 이 외에도, resize 이벤트 처리, input 요소에 입력된 값으로 ajax 요청하는 입력 필드 자동완성 UI구현, 버튼 중복 클릭 방지 처리 등에 유용하게 사용된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input type="text" />
    <div class="msg"></div>
    <script>
      const $input = document.querySelector("input");
      const $msg = document.querySelector(".msg");

      const debounce = (callback, delay) => {
        let timerId;
        // debounce 함수는 timerId를 기억하는 클로저를 반환한다.
        return event => {
          // delay가 경과하기 이전에 이벤트가 발생하면 이전 타이머를 취소하고
          // 새로운 타이머를 재설정한다.
          // 따라서 delay보다 짧은 간격으로 이벤트가 발생하면 callback은 호출되지 않는다.
          if (timerId) clearTimeout(timerId);
          timerId = setTimeout(callback, delay, event);
        };
      };

      // debounce 함수가 반환하는 클로저가 이벤트 핸들러로 등록된다.
      // 300ms보다 짧은 간격으로 input 이벤트가 발생하면 debounce 함수의 콜백 함수는
      // 호출되지 않다가 300ms 동안 input 이벤트가 더 이상 발생하면 한 번만 호출된다.
      $input.oninput = debounce(e => {
        $msg.textContent = e.target.value;
      }, 300);
    </script>
  </body>
</html>
```

- 실무에서는 Lodash 등의 유명한 패키지의 debounce 함수를 사용하는 것이 권장된다.
  - [Lodash - debounce 함수 코드](https://github.com/lodash/lodash/blob/master/debounce.js)

### 스로틀

- 스로틀(throttle)은 짧은 시간 간격으로 이벤트가 연속해서 발생하더라도 일정 시간 간격으로 이벤트 핸들러가 최대 한 번만 호출되도록 한다. 즉, 스로틀은 짧은 시간 간격으로 연속해서 발생하는 이벤트를 그룹화해서 일정 시간 단위로 이벤트 핸들러가 호출되도록 호출 주기를 만든다.
- 스로틀은 scroll 이벤트 처리나 무한 스크롤 UI 구현 등에 유용하게 사용된다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        width: 300px;
        height: 300px;
        background-color: rebeccapurple;
        overflow: scroll;
      }

      .content {
        width: 300px;
        height: 1000vh;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content"></div>
    </div>
    <div>
      일반 이벤트 핸들러가 scroll 이벤트를 처리한 횟수:
      <span class="normal-count">0</span>
    </div>
    <div>
      스로틀 이벤트 핸들러가 scroll 이벤트를 처리한 횟수:
      <span class="throttle-count">0</span>
    </div>

    <script>
      const $container = document.querySelector(".container");
      const $normalCount = document.querySelector(".normal-count");
      const $throttleCount = document.querySelector(".throttle-count");

      const throttle = (callback, delay) => {
        let timerId;
        // throttle 함수는 timerId를 기억하는 클로저를 반환한다.
        return event => {
          // delay가 경과하기 이전에 이벤트가 발생하면 아무것도 하지 않다가
          // delay가 경과했을 때 이벤트가 발생하면 새로운 타이머를 재설정한다.
          // 따라서 delay 간격으로 callback이 호출된다.
          if (timerId) return;
          timerId = setTimeout(
            () => {
              callback(event);
              timerId = null;
            },
            delay,
            event
          );
        };
      };

      let normalCount = 0;
      $container.addEventListener("scroll", () => {
        $normalCount.textContent = ++normalCount;
      });

      let throttleCount = 0;
      // throttle 함수가 반환하는 클로저가 이벤트 핸들러로 등록된다.
      $container.addEventListener(
        "scroll",
        throttle(() => {
          $throttleCount.textContent = ++throttleCount;
        }, 100)
      );
    </script>
  </body>
</html>
```

- [Lodash - throttle 함수 코드](https://github.com/lodash/lodash/blob/master/throttle.js)

- 더 살펴보면 좋은 자료 [CSS Tricks 디바운스 스로틀링 설명 예제](https://css-tricks.com/debouncing-throttling-explained-examples/)
