import getTodos from "./getTodos.js";
import view from "./view.js";

const state = {
  todos: getTodos(),
  currentFilter: "All",
};

const main = document.querySelector(".todoapp");

window.requestAnimationFrame(() => {
  // 이 함수가 호출되는 시점은.. 다음 렌더링 이전 ! 아래 두 라인이 실행되고 난 다음 렌더링이 수핼된다. 그러니깐 그 전에 작업 다 해두면 된다.

  // 새로운 메인 뷰를 만든다.
  const newMain = view(main, state);

  // 새로운 메인 뷰를 대체한다.
  main.replaceWith(newMain);
});
