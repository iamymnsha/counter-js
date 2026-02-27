/*
once DOMContentLoaded, call our counter JS fn,
User clicks button -> dispatch({type:"INCREMENT"})->reducer(state, action)->newState returned
->state = newState ->render()
*/

function counter() {
  //state
  let state = {
    counter: 0,
    step: 1,
    message: "",
    max: 100,
  };
  const historyStack = [];
  const logEntries = [];

  //ELEMENTS
  let counterEl = document.getElementById("counter");
  let incrementEl = document.getElementById("increment");
  let decrementEl = document.getElementById("decrement");
  let resetEl = document.getElementById("reset");
  let msgEl = document.getElementById("msg");
  let inputEl = document.getElementById("stepInput");
  let stepEl = document.getElementById("step");
  let undoEl = document.getElementById("undo");

  //update the DOM - “Everything UI-related based on state.”
  function render() {
    const { counter, step, message } = state;
    //just chaning text inside element, so textContent
    counterEl.textContent = counter;
    incrementEl.disabled = counter === state.max;
    decrementEl.disabled = counter === 0;
    msgEl.textContent = message;
    stepEl.textContent = step;
    undoEl.disabled = historyStack.length === 0;
  }

  function dispatch({ type, payload }) {
    //save prevState
    const prevState = state;
    const newState = reducer(state, { type, payload });

    //in history, for undo, we just save prev state i.e. counter and step
    if (type !== "UNDO") historyStack.push({ ...prevState });

    //in logs, we show prevValue, currentValue, type and step
    const logEntry = {
      prevValue: prevState.counter,
      value: newState.counter,
      type: type,
      step: prevState.step,
    };
    logEntries.push(logEntry);
    printLog(logEntry);
    state = newState;
    render();
  }

  //Reducer takes state and gives new state
  function reducer(state, action) {
    const { counter, step, max } = state;
    switch (action.type) {
      case "INCREMENT":
        if (counter + step > max)
          return { ...state, message: "cannot go beyond maximum value" };
        return {
          ...state,
          counter: counter + step,
          message: "",
        };
      case "DECREMENT":
        if (counter - step < 0)
          return { ...state, message: "cannot go below 0" };
        return {
          ...state,
          counter: counter - step,
          message: "",
        };
      case "RESET":
        return {
          ...state,
          counter: 0,
          step: 1,
          message: "",
        };
      case "UNDO":
        const lastState = historyStack.pop();
        return {
          ...state,
          counter: lastState.counter,
          step: lastState.step,
          message: "",
        };
      case "UPDATE_STEP":
        if (Number.isNaN(action.payload)) {
          return {
            ...state,
            message: "Step must be a number",
          };
        }
        if (action.payload <= 0) {
          return {
            ...state,
            message: "Step must be greater than 0",
          };
        }
        return {
          ...state,
          step: action.payload,
          message: "",
        };
      default:
        return {
          ...state,
          counter: 0,
          step: 1,
          message: "",
        };
    }
  }

  function printLog(log) {
    console.log(log);
  }

  //Handlers - updates the state and call to update DOM
  incrementEl.addEventListener("click", () => {
    dispatch({
      type: "INCREMENT",
    });
  });
  decrementEl.addEventListener("click", () => {
    dispatch({
      type: "DECREMENT",
    });
  });
  resetEl.addEventListener("click", () => {
    dispatch({
      type: "RESET",
    });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const stepValue = Number(e.target.querySelector("input").value);
    dispatch({
      type: "UPDATE_STEP",
      payload: stepValue,
    });

    //upon succesfull state update, we can remove input value
    if (!state.message) {
      inputEl.value = "";
    }
  });
  undoEl.addEventListener("click", (e) => {
    dispatch({
      type: "UNDO",
    });
  });

  /*
    keydown event fires,event object tells us which key,we map that key to an action,dispatch(action)
  */
  document.addEventListener("keydown", (e) => {
    const keyActionMap = {
      ArrowUp: "INCREMENT",
      ArrowDown: "DECREMENT",
      r: "RESET",
    };

    const action = keyActionMap[e.key];
    if (action) {
      dispatch({ type: action });
    }
  });

  render();
}

//on Document load, call the counter function
document.addEventListener("DOMContentLoaded", () => {
  counter();
});
