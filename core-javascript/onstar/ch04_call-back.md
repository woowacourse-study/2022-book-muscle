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

객체의 메서드를 콜백 함수로 전달하면 해당 객체를 this로 바라볼 수 없다. 전역객체를 바라보거나 콜백 함수를 인자로 받은 함수(메서드)에서 지정해주기 때문이다.

self 변수, 새로운 변수에 메서드 할당 등 고전적인 방법들이 있었지만 bind 메서드를 이용하는 방법이 가장 효율적이다.

```js
var obj = {
  name: 'obj1'.
  func : function () {
    console.log(this.name);
  }
};
setTimeout(obj1.func.bind(obj1), 1000);
// 이런식으로 obj를 가리키는 새로운 함수로 콜백함수를 넘길 수 있다.
```

## 06 콜백 지옥과 비동기 제어

콜백 지옥이란 콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이 감당하기 힘들 정도로 깊어지는 현상이다.
자바스크립트에서 흔히 발생하며, 가독성이 떨어질뿐더러 코드를 수정하기도 어려워진다.

비동기는 현재 실행 중인 코드의 완료 여부와 무관하게 즉시 다음 코드로 넘어가는데, setTimeout, addEventListener, 웹통신 등 어떤 함수를 실행하는 시점이 코드의 실행 순서와 다른 함수, 메서드 등이 비동기적인 동작을 한다고 할 수 있다.

```js
function func() {
  setTimeout(() => {
    console.log('One');
    setTimeout(() => {
      console.log('Two');
      setTimeout(() => {
        console.log('Three');
        setTimeout(() => {
          console.log('Four');
        }, 500);
      }, 500);
    }, 500);
  }, 500);
}
```

지금은 콜백의 꼬리물기가 3번 밖에 진행되지 않았지만 이러한 과정이 더 진행될 수 있다고 생각하면 가독성이 심히 떨어질 것이다.

이를 해결하는 과정에 대해서 알아볼 것인데, 가장 최근에 나온 방법만 보고싶다면, Promise 및 async/await 부분을 보면 된다.

1 ) 기명함수 이용

```js
const callOne = function () {
  console.log('One');
  setTimeout(callTwo, 500);
};
const callTwo = function () {
  console.log('Two');
  setTimeout(callThree, 500);
};
const callThree = function () {
  console.log('Three');
  setTimeout(callFour, 500);
};
const callFour = function () {
  console.log('Four');
};

setTimeout(callOne, 500);
```

실행에 따라 위에서 아래로 실행되는 모습을 볼 수 있지만 일회성 함수를 전부 변수에 할당해야 하는 것이 효율적이지 않다.

2 ) Promise

```js
new Promise(function (resolve, reject) {
  setTimeout(function () {
    console.log('One');
    resolve();
  }, 500);
})
  .then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('Two');
        resolve();
      }, 500);
    });
  })
  .then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('Three');
        resolve();
      }, 500);
    });
  })
  .then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('Four');
        resolve();
      }, 500);
    });
  });
```

```js
// 반복적인 내용 함수화
const callNumber = function (number) {
  return function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log(number);
        resolve();
      }, 500);
    });
  };
};

callNumber('One')()
  .then(callNumber('Two'))
  .then(callNumber('Three'))
  .then(callNumber('Four'));
```

ES6 에서 도입된 Promise 를 이용한 방법이다. new 연산자와 함께 호출한 Promise의 인자로 넘겨주는 콜백 함수는 바로 실행되지만 그 내부에 resolve 또는 reject 함수를 호출하는 구문이 있을 경우 둘 중 하난가 실행되기 전까지는 다음(then) 또는 오류 구문(catch)으로 넘어가지 않는다.

3 ) Promise + Async/await

```js
const callNumber = function (number) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(number);
      resolve();
    }, 500);
  });
};

const numberCaller = async function () {
  await callNumber('One');
  await callNumber('Two');
  await callNumber('Three');
  await callNumber('Four');
};

numberCaller();
```

ES2017 에서 가독성이 뛰어나면서 작성법도 간단한 async/await 기능이 추가 되었는데, 비동기 작업을 수행하고자 하는 함수 앞에 async 를 표기하고, 함수 내부에서 실질적인 비동기 작업이 필요한 위치마다 await 를 표기하는 것만으로 뒤의 내용을 자동으로 Promise 로 전환하고, resolve 된 이후에야 다음으로 진행한다.
즉, Promise의 then과 흡사한 효과를 얻을 수 있다.
