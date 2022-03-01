### Chapter 09. 타입 변환과 단축 평가

---

#### 1. 타입 변환

개발자가 의도적으로 값의 타입을 변환하는 것 : `명시적 타입 변환` 또는 타입 캐스팅
개발자가 의도와 상관없이 타입을 변환하는 것 : `암묵적 타입 변환` 또는 타입 강제 변환

<br>

Falsy한 값(거짓으로 평가되는 값) : false, undefined, null, 0, -0, NaN, ''(빈 문자열)

```javascript
function isFalsy(v) {
  return !v;
}

// 모두 true를 반환한다.
isFalsy(false);
isFalsy(undefined);
isFalsy(null);
isFalsy(0);
isFalsy(NaN);
isFalsy("");
```

<br>

- 문자열 타입으로 변환

```javascript
//모두 문자열 1을 반환
String(1);

(1).toString();

1 + "";
```

<br>

- 숫자 타입으로 변환

```javascript
//모두 숫자 0을 반환
Number("0");

parseInt("0", 10);

+"0";

"0" * 1;
```

<br>

- 불리언 타입으로 변환

```javascript
//모두 true을 반환
Boolean("x");

!!"x";
```

<br>

#### 2. 단축 평가

단축 평가란?
표현식을 평가하는 도중에 평가 결과가 확정된 경우 나머지 평가 과정을 생략하는 것을 말한다.

<br>

- 단축 평가를 활용한 예시

```javascript
var elem = null;

// elem이 null이나 undefined와 같은 Falsy 값이면 elem으로 평가되고
// elem이 Truthy 값이면 elem.value로 평가된다.
var value = elem && elem.value; // -> null
```

<br>

- **옵셔널 체이닝 연산자(?.)**
  좌항의 피 연산자가 null 또는 undefined인 경우 undefined를 반환하고, 그렇지 않으면 우항의 프로퍼티 참조를 실행한다.

```javascript
var str = "";

var length = str && str.length;

console.log(length); // ''

// 문자열의 길이(length)를 참조한다. 이때 좌항 피연산자가 false로 평가되는 Falsy 값이라도
// null 또는 undefined가 아니면 우항의 프로퍼티 참조를 이어간다.
var length = str?.length;
console.log(length); // 0
```

<br>

- **null 병합 연산자(??)**
  좌항의 피 연산자가 null 또는 undefined인 경우 우항의 피 연산자를 반환하고, 그렇지 않으면 좌항의 피 연산자를 반환한다.
  null 병합 연산자는 `변수에 기본값을 설정할 때 유용`하다!!

```javascript
var foo = "" || "default string";
console.log(foo); // "default string"

// 좌항의 피연산자가 Falsy 값이라도 null 또는 undefined이 아니면 좌항의 피연산자를 반환한다.
var foo = "" ?? "default string";
console.log(foo); // ""
```
