### 몰랐던 점 or 제대로 알고 있지는 못했던 점.

1. 제어문은 코드의 흐름을 이해하기 어렵게 만들어 가독성을 해치는 단점이 있다. 이는 고차 함수를 사용한 함수형 프로그래밍 기법에서 제어문 사용을 억제하여 복잡성을 어느 정도 해결할 수 있다.
2. switch에서의 fall through를 이용하여 여러 개의 case문을 하나의 조건으로 사용할 수도 있다.

```jsx
var year = 2000;
var month = 2;
var days = 0;

switch (month) {
  case 1:
  case 3:
  case 5:
  case 7:
  case 8:
  case 10:
  case 12:
    days = 31;
    break;
  case 4:
  case 6:
  case 9:
  case 11:
    days = 30;
    break;
  case 2:
    days = (year % 4 === 0 && year && 100 !== 0) || year % 400 === 0 ? 29 : 28;
    break;
  default:
    console.log('Invalid month');
}
console.log(days);
```

이런 식으로 사용하는 방법이다. 처음 보는 거라 기록은 해 놓지만 실용성이 있을 지 모르겠다. 조건이 달이 아니라 다른 거였으면, 추가될 때마다 case에 넣어줘야 해서 열려 있지 않은 것 같다.

1. 레이블 문을 사용하면 중첩 for 문의 내부 for문에서 조건만 만족하면 바로 외부 for문까지 종류할 수 있다. 레이블 문은 식별자가 붙은 문이다.

```jsx
outer: for (let i = 0; i < 3; i += 1) {
  for (let j = 0; j < 3; j += 1) {
    if (i + j === 3) break outer;
    console.log(`inner ${i}, ${j}`);
  }
}
```

알고리즘 할 때 이런 식의 중첩 for문 내부에서 조건 만족 시 아예 for문 자체를 break하려고 flag를 세우는 등 여러 방법을 썼는데, 이렇게 쉽게 for문을 break할 수 있는 방법이 있다. 알고리즘 말고는 쓰일 일이 없을 것 같다.
