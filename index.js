/*
once DOMContentLoaded, call our counter JS fn, have state locally, write handlers, have updater fn, updater fn calls render fn
*/

function counter() {
  //state
  let state = {
    counter: 0,
    step: 1,
  };
  let MAX = 100;
  let message = "";
  let history = [];

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
    const { counter, step } = state;
    //just chaning text inside element, so textContent
    counterEl.textContent = counter;
    incrementEl.disabled = counter === MAX;
    decrementEl.disabled = counter === 0;
    msgEl.textContent = message;
    stepEl.textContent = step;
    undoEl.disabled = history.length === 0;
  }

  //User action -> updateCounter() -> State mutation -> render()
  function updateCounter(action) {
    const { counter, step } = state;
    switch (action) {
      case "INCREMENT":
        if (counter + step <= MAX) {
          state = {
            ...state,
            counter: counter + step,
          };
          logHistory("INCREMENT", counter);
          message = "";
        } else {
          message = "cannot go beyond MAX";
        }
        break;
      case "DECREMENT":
        if (counter - step < 0) {
          message = "cannot go below 0";
        } else {
          state = {
            ...state,
            counter: counter - step,
          };
          logHistory("DECREMENT", counter);
        }
        break;
      case "RESET":
        state = {
          ...state,
          counter: 0,
          step: 1,
        };
        logHistory("RESET", counter);
        message = "";
        inputEl.value = "";
        break;
    }
    render();
  }

  function logHistory(action, preValue) {
    const { counter, step } = state;
    //log the history and push to history stack
    console.log({
      prevValue: preValue,
      nextValue: counter,
      step: step,
      action: action,
    });
    history.push({
      prevValue: preValue,
      nextValue: counter,
      step: step,
      action: action,
    });
  }

  function handleUndo() {
    if (!history.length) return;
    //pop the last history and setState
    const lastState = history.pop();
    console.log(lastState, "lastState");
    state = {
      ...state,
      counter: lastState.prevValue,
      step: lastState.step,
    };
    render();
  }

  function updateStep(value) {
    const stepValue = Number(value.trim());

    if (Number.isNaN(stepValue)) {
      message = "Step must be a number";
      render();
      return;
    }

    if (stepValue <= 0) {
      message = "Step must be greater than 0";
      render();
      return;
    }

    state = {
      ...state,
      step: stepValue,
    };

    message = "";
    inputEl.value = "";

    render();
  }

  //Handlers - updates the state and call to update DOM
  incrementEl.addEventListener("click", () => {
    updateCounter("INCREMENT");
  });
  decrementEl.addEventListener("click", () => {
    updateCounter("DECREMENT");
  });
  resetEl.addEventListener("click", () => {
    updateCounter("RESET");
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const stepValue = e.target.querySelector("input").value;
    updateStep(stepValue);
  });
  undoEl.addEventListener("click", (e) => {
    handleUndo();
  });

  render();
}

//on Document load, call the counter function
document.addEventListener("DOMContentLoaded", () => {
  counter();
});
