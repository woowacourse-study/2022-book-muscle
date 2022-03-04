## 01 콜백 함수

> 콜백 함수(Callback Function)는 다른 코드의 인자로 넘겨주는 함수이다.

콜백 함수를 매개변수로 받는 함수(메서드)들이 있는데, 예로 몇가지 들어보면 콜백 함수에 대한 이해가 쉬워질 수 있다.

```js
function callBackFunc() {
  console.log("I'm Call Back!");
}

element.addEventListener('click', callBackFunc);
setTimeout(callBackFunc, 1000);
[1, 2, 3].forEach(callBackFunc);
...
```

## 02 제어권

콜백함수를 매개변수로 가지는 함수 A가 어떤 함수 B를 인자로 넘겨받게 되면, 함수 A는 함수 B의 제어권을 가진다.
제어권을 가진다는 것은 함수 A가 함수 B의 호출 시점을 실행 주체가 되어 정할 수 있다는 것이다.

```js
function callBackFunc() {
  console.log("I'm Call Back!");
}

setTimeout(callBackFunc, 1000);
```

콜백함수를 매개변수로 가지는 setTImeout 함수는 callBackFunc 이라는 함수를 인자로 넘겨받았고 이를 콜백 함수라고 할 것이다.
setTimeout 함수는 해당 콜백 함수의 제어권을 가지고 있으며, 1초 뒤 setTimeout 함수가 실행 주체가 되어 callBackFunc 함수를 호출하였다.

## 03 this

콜백 함수도 함수이기 때문에 기본적으로는 this 가 전역객체를 참조하지만, 제어권을 넘겨받을 코드에서 콜백 함수에 별도로 this가 될 대상을 지정한 경우에는 그 대상을 참조하게 된다.

이해를 높이기 위해 map 메서드의 동작 방법과 비슷하게 임의적으로 구현해보겠다.

```js
Array.prototype.map = function (callback, thisArg) {
  var mappedArr = [];
  for (var i = 0; i < this.length; i++) {
    var mappedValue = callback.call(thisArg || window, this[i], i, this);
    mappedArr[i] = mappedValue;
  }
  return mappedArr;
};
```

메서드 구현의 핵심은 call/apply 메서드에 있다.
인자로 thisArg 가 넘어오게 된다면, map 메서드 내부에서 해당 인자를 바탕으로 this 를 바인딩하게 될 것이다.

이처럼 호출되는 콜백함수는 내부로직에 따라 this가 바인딩하는 대상이 달라질 수 있다.

## 04 콜백 함수는 함수다

당연한 말인 것 같지만, 콜백 함수는 함수다.

콜백 함수로 어떤 객체의 메서드를 전달하더라도 그 메서드는 메서드가 아니라 함수로서 호출된다.

```js
var obj = {
  func: function () {
    console.log(this);
  },
};

obj.func(); // 출력: obj { func: f}
[1, 2].forEach(obj.func); // 출력: Window { ... } Window { ... }
```

obj.func 가 가리키는 this가 obj를 가리킬 것 같다고 생각이 들 수 있지만, 위의 경우는 메서드로서의 호출이 아니라 콜백 함수(함수)로서의 호출이 일어난다는 것을 생각해야한다.

함수의 this 는 기본적으로 전역객체를 가리키고, 더불어 콜백함수의 실행주체가 되는 함수는 콜백 함수의 this 제어권을 가지고 있다는 것도 생각해 this 를 판단해야한다.

## 05 콜백 함수 내부의 this에 다른 값 바인딩하기

## 06 콜백 지옥과 비동기 제어

## 07 정리
