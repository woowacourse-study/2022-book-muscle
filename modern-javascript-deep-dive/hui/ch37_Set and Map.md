## Set

Set 객체는 중복되지 않는 유일한 값들의 집합이다. Set과 배열의 차이는 다음과 같다.

| 구분               | 배열 | Set |
| ------------------ | ---- | --- |
| 중복 값 가능       | O    | X   |
| 순서               | O    | X   |
| 인덱스로 접근 가능 | O    | X   |

Set은 수학적 집합을 구현하기 위한 자료구조이다. Set을 통해 교집합, 합집합, 차집합, 여집합 등을 구현할 수 있다.

### Set 객체의 생성

Set은 Set 생성자 함수로 생성한다.

```jsx
const set = new Set();
console.log(set); // Set(0) {}
```

Set의 인수는 `이터러블` 이다. 그리고 중복된 값은 Set 객체에 요소로 저장되지 않는다.

```jsx
const set1 = new Set([1, 2, 3, 3]);
console.log(set1); // Set(3) {1,2,3}

const set2 = new Set('hello');
console.log(set2); // Set(5) {'h','e','l','o'}
```

### Set 요소 개수 확인

Set.prototype.size 프로퍼티를 사용해 요소의 개수를 확인한다.

```jsx
const set = new Set([1, 2, 3]);
console.log(set); //3

const { size } = new Set([1, 2, 3]);
console.log(size); //3
```

### Set 요소 추가 제거

```jsx
//추가
const set = new Set();
set.add(1); // Set(1) {1}, add 메서드의 반환값은 해당 Set 객체 인스턴스다
console.log(set); // Set(1) {1}

//add 메서드는 메서드 체이닝 가능
set.add(2).add(3).add(4) //Set(4) {1, 2, 3, 4}

//Set은 Javascript의 모든 '값'을 저장할 수 있다.
set.add(1)
	 .add('abc')
	 .add(true)
	 .add(undefined)
	 .add(null)
	 .add({})
	 .add([])
	 .add(()=>{});

//Set은 동등/일치 비교 연산이 직관적이다.
//NaN === NaN은 false이지만 Set은 같다고 봐서 중복처리한다.
//+0 -0 도 마찬가지
set.add(NaN).add(NaN).add(+0).add(-0); // 하나씩만 저장

------------------------------------------------------------------------

//제거
set.delete(1) // true, 반환값은 제거 성공 여부이다. 있다면 true, 없으면 false

//제거는 method 체이닝이 안된다

//삭제하려는 요소가 없어도 에러는 나지 않는다. 대신 delete의 반환값이 false이다.
set.delete(1) // false

//일괄 삭제
set.clear(); //반환값 없음
console.log(set); // Set(0) {size: 0}
set.clear(); //요소가 없는데 clear해도 에러가 나지 않는다.
```

### Set 객체 요소 존재 여부 확인

```jsx
const set = new Set([1, 2, 3]);
set.has(1); // true
set.has(0); // false
```

### Set 객체 요소 순회

Set.prototype.forEach 메서드가 있다. 사용법은 Array의 forEach와 유사하다. 그러나 Array의 forEach와 interface를 통일하기 위해 조금 다른 부분이 있다.

첫번째 인수로 요소 값,

두번째 인수도 요소 값, (Array에서는 index지만 Set에는 순서가 없다. 따라서 첫번째 인수와 같이 요소 값이다)

세번째 인수는 Set 객체 자체이다.

```jsx
const set = new Set([1, 2, 3]);
set.forEach((v, v2, s) => console.log(v, v2, s));
//1 1 Set(3) {1, 2, 3}
//2 2 Set(3) {1, 2, 3}
//3 3 Set(3) {1, 2, 3}
```

**Set 객체는 이터러블이다**. 따라서 for ... of 문으로도 순회가 가능하다. 또한 스프레드 문법과 배열 디스트럭쳐링의 대상이 될 수도 있다.

```jsx
const set = new Set([1, 2, 3]);

// iterable이다.
console.log(Symbol.iterator in set); //true

// iterable이라 for of 순회가 된다.
for (const value of set) {
  console.log(value); //1,2,3
}

//스프레드 쌉가능
console.log(...set); //1 2 3
console.log([...set]); //[1,2,3]

//디스트럭쳐링도 됨
const [a, ...rest] = set;
console.log(a, rest); //1, [2, 3]
```

### 집합 연산

Set 객체는 수학적 집합을 구현하기 위한 자료구조다. 따라서 교집합, 합집합, 차집합 등을 구현할 수 있다.

### 교집합

아니 뭐 메서드가 있다는 소린 줄 알았는데 구현해야 되는거네?

```jsx
Set.prototype.intersection = function (set) {
  return new Set([...this].filter((v) => set.has(v)));
};
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

console.log(setA.intersection(setB)); // Set(2) {2,4}
console.log(setB.intersection(setA)); // Set(2) {2,4}
```

### 합집합

```jsx
Set.prototype.union = function (set) {
  return new Set([...this, ...set]);
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

console.log(setA.union(setB)); // Set(4) {1,2,3,4}
console.log(setB.union(setA)); // Set(4) {2,4,1,3}
```

### 차집합

차집합 A-B는 집합 A에는 존재하지만 집합 B에는 존재하지 않는 요소로 구성된다.

```jsx
Set.prototype.difference = function (set) {
  return new Set([...this].filter((v) => !set.has(v)));
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

console.log(setA.difference(setB)); // Set(2) {1,3}
console.log(setB.difference(setA)); // Set(0) {size:0}
```

### 부분 집합과 상위 집합

집합 A가 집합 B에 포함되는 경우 집합 A는 집합 B의 부분 집합(subset), 집합 B는 집합 A의 상위 집합 (superset)이다.

```jsx
Set.prototype.isSuperset = function (subset) {
  const supersetArr = [...this];
  return [...subset].every((v) => supersetArr.includes(v));
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

console.log(setA.isSuperset(setB)); // true
console.log(setB.isSuperset(setA)); // false
```

---

## Map

Map 객체는 키와 값의 쌍으로 이루어진 컬렉션이다. Map 객체는 `객체` 와 유사하지만, 다음과 같은 차이가 있다.

| 구분           | 객체                    | Map 객체 |
| -------------- | ----------------------- | -------- |
| 이터러블       | X                       | O        |
| 요소 개수 확인 | Object.keys(obj).length | map.size |

### Map 객체의 생성

Map 객체는 Map 생성자 함수로 생성한다.

```jsx
const map = new Map();
console.log(map); // Map(0) {}
```

Map 생성자 함수는 `이터러블`을 인수로 전달받아 Map 객체를 생성한다. 이때 인수로 전달되는 `이터러블은 키와 값의 쌍으로 이루어진 요소`로 구성되어야 한다.

```jsx
const map1 = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
]);
console.log(map1); // Map(2) {'key1' => 'value1', 'key2' => 'value2'}

//이터러블의 요소가 key value가 아니면 typeError
const map2 = new Map([1, 2]); // TypeError

//key value라 그래서 객체를 넘겨줘 봤는데 안된다.
const map3 = new Map([{ a: 1 }, { b: 2 }, { c: 3 }]); //Map(1) {undefined => undefined}
```

### 중복된 key를 갖는 요소 불가

key가 중복되면 제일 나중에 추가된 요소로 덮어써진다.

```jsx
const map = new Map([
  ['key1', 'value1'],
  ['key1', 'value2'],
]);

//key가 중복되면 2번째 요소로 덮어써짐.
console.log(map); // Map(1) {"key1" => "value2"}
```

### Map 객체 요소 개수 확인

Set과 마찬가지로 size 프로퍼티를 사용하여 개수를 확인한다.

```jsx
const map = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
]);
console.log(map.size); // 2

const { size } = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
]);
console.log(size); //2
```

### Map 객체 요소 추가

Map 객체에 요소를 추가할 때는 Map.prototype.set 메서드를 사용한다.

```jsx
const map = new Map();
console.log(map); // Map(0) {}

map.set('key1', 'value1'); //Map(1) {'key1' => 'value1'}
console.log(map); //Map(1) {"key1" => "value1"]

map.set('key2', 'value2').set('key3', 'value3');

console.log(map); // Map(3) {'key1' => 'value1', 'key2' => 'value2', 'key3' => 'value3'}
```

set 메서드는 요소가 추가된 Set 객체를 반환한다.

### Map 객체는 동등/일치 연산이 Set과 같이 직관적이다.

일반적으로 NaN === NaN은 false이지만, Map 객체는 Set과 마찬가지로 중복으로 판단한다. +0과 -0도 마찬가지로 중복으로 판단한다.

```jsx
const map = new Map();

map.set(NaN, 'value1').set(NaN, 'value2');
console.log(map); // Map(1) {NaN => 'value2'}

map.set(0, 'value1').set(-0, 'value2');
console.log(map); // Map(2) {NaN => 'value2', 0 => 'value2'}
```

일반적인 객체 key는 `문자열` 또는 `심벌` 만 가능하다. 그러나 Map 객체의 키 타입에 제한이 없다. 따라서 `객체를 포함한 모든 값을 키로 사용`할 수 있다. 이는 Map 객체와 일반 객체의 가장 두드러지는 차이점이다.

```jsx
const map = new Map();

const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

map.set(lee, 'development').set(kim, 'designer');
// Map(2) { {name: "Lee"} => "developer", {name: "Kim"} => "designer"}
```

### Map 객체의 요소 get

Map 객체에서 특정 요소를 취득하려면 Map.prototype.get 메서드를 사용한다. get 메서드의 인수로 키를 전달하면, 해당 키에 맞는 `값` 을 반환한다. Map 객체에 해당 키가 존재하지 않는다면 `undefined` 를 반환하다.

```jsx
const map = new Map();

const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

map.set(lee, 'development').set(kim, 'designer');

console.log(map.get(lee)); // developer
console.log(map.get('key')); // undefined
```

### Map 객체의 요소 존재 여부 확인

Map 객체의 특정 요소가 존재하는지 확인할 때는 Set과 마찬가지로 has를 사용하면 된다.

```jsx
const map = new Map();

const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

map.set(lee, 'development').set(kim, 'designer');

console.log(map.has(lee)); // true
console.log(map.has('key')); // false
```

### Map 객체의 요소 삭제

Map 객체의 요소를 삭제하려면 delete 메서드를 사용한다. 삭제에 성공하면 성공 여부 boolean을 반환한다.

```jsx
const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

const map = new Map([
  [lee, 'development'],
  [kim, 'designer'],
]);

map.delete(kim); // true
console.log(map); // Map(1) { {name:'lee'}=>'development}

map.delete('choi'); //false
```

delete는 메서드 체이닝이 안된다.

### Map 객체의 요소 일괄 삭제

```jsx
const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

const map = new Map([
  [lee, 'development'],
  [kim, 'designer'],
]);

map.clear();
console.log(map); // Map(0) {}
```

### Map 객체의 요소 순회

Set과 마찬가지로 forEach를 사용하고, 인수를 3개 받는다.

첫 번째 인수: 현재 순회 중인 요소 값

두 번째 인수: 현재 순회 중인 요소 키

세 번째 인수: 현재 순회 중인 Map 객체 자체

```jsx
const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

const map = new Map([
  [lee, 'development'],
  [kim, 'designer'],
]);

map.forEach((v, k, map) => console.log(v, k, map));
/*
developer {name: "Lee"} Map(2){
	{name: "Lee"} => "developer";
	{name: "Kim"} => "designer";
}
designer {name: "Kim"} Map(2){
	{name: "Lee"} => "developer";
	{name: "Kim"} => "designer";
}
*/
```

Map 객체는 `이터러블`이다. 따라서 for ... of 문으로 순회할 수 있으며, 스프레드 문법과 배열 디스트럭처링 할당의 대상이 될 수도 있다.

```jsx
const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

const map = new Map([
  [lee, 'development'],
  [kim, 'designer'],
]);

// Map 객체는 Map.prototype의 Symbol.iterator 메서드를 상속하는 이터러블이다.
console.log(Symbol.iterator in map); // true

// 이터러블인 Map 객체는 for ... of 문으로 순회할 수 있다.
for (const entry of map) {
  console.log(entry); // [{name:'Lee'},'development'] [{name:'Kim'},'designer']
}

// 이터러블인 Map 객체는 스프레드 문법의 대상이 될 수 있다.
console.log([...map]);
//[[{name:'Lee'},'development'],[{name:'Kim'},'designer']]

//디스트럭쳐링도 됨
const [a, b] = map;
console.log(a, b); // [{name:'Lee'},'development'] [{name:'Kim'},'designer']
```

### 객체와 비슷하게 keys,values,entries 메서드가 있다.

```jsx
const lee = { name: 'Lee' };
const kim = { name: 'Kim' };

const map = new Map([
  [lee, 'development'],
  [kim, 'designer'],
]);

for (const key of map.keys()) {
  console.log(key); // {name:'Lee'} {name:'Kim'}
}

for (const value of map.values()) {
  console.log(value); // developer designer
}

for (const entry of map.entried()) {
  console.log(entry); // [{name:'Lee'},'development'] [{name:'Kim'},'designer']
}
```

Map 객체는 순서에 의미가 있지는 않다. 그러나 추가된 순서가 지켜진다. 이는 다른 이터러블의 순회와 호환성을 유지하기 위함이다.

### Map을 사용 하는 것이 나은 경우

책에 나와있지는 않지만 각각을 언제 사용하면 좋을지 생각해봤다.

1. 키 값이 다양할 경우 Map을 사용하면 좋다.

   일반 객체는 key값이 스트링과 심벌밖에 안되는 반면 Map은 모든 값이 가능하다.

2. 입력된 순서가 보장돼야 하는 경우.

   딕셔너리 같은 기능을 위해 객체를 사용하지만, 순서가 보장되지 않아 난감할 때가 있다. 그럴 때 Map은 좋은 선택지가 될 것 같다.

3. 적은 데이터 갱신과 많은 데이터 출력일 때

   이거는 찾아본건데 Map이 적은 데이터 갱신과 많은 데이터 출력에는 퍼포먼스가 더 좋고, 잦은 데이터 갱신과 적은 데이터 출력에는 Object가 더 좋다고 한다.

4. 런타임시까지 key 값이 정해지지 않은 경우

   Map은 키 값으로 아무거나 다 들어 올 수 있기 때문에 걱정이 없다.
