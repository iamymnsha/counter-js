# Counter App - State-Driven Architecture in Vanilla JavaScript

This project is a counter application built in vanilla JavaScript to explore and understand state-driven UI architecture from first principles.

Instead of directly manipulating the DOM inside event handlers, the application follows a predictable state flow inspired by patterns used in libraries like Redux and Flux.

User Action → dispatch(action) → reducer(state, action) → newState → render()

The goal of the project was not just to build a counter, but to learn core architectural patterns used in modern frontend applications.

# Features

1. Increment and decrement the counter with Click and Arrows
2. Reset the counter to its initial state
3. Prevent the counter from going below 0
4. Prevent the counter from exceeding a configurable MAX value
5. Step Control and Users can configure the increment/decrement step value
6. Undo Functionality
7. Event Logging Functionality

# Architecture

The application follows a state-driven design with three main layers.

1. State:

   The entire UI derives from a single state object which acts as the single source of truth

     ```
       state = {
        counter,
        step,
        message
       }
     ```
   
2. Reducer:

    The reducer is a pure function responsible for computing the next state.

      ```
      reducer(state, action) → newState
      ```
  
    It contains all state transition logic but does not interact with the DOM.
  
      ```
      case "INCREMENT":
        return {
          ...state,
          counter: state.counter + state.step
        }
      ```
      
3. Dispatch:

    It acts as the controller for state changes.

    It saves the previous state for undo, run the reducer, log the state transition, update current state and trigger rendering

5. Render:

   The render function updates the UI based entirely on the current state.
  
     ```
     counterEl.textContent = state.counter
     ```

   No event handler directly updates the DOM.


This architecture is conceptually similar to patterns used in: Redux, Flux, Elm Architecture, Event-driven systems

The goal was to rebuild these ideas from scratch in plain JavaScript to better understand how state management works internally.


## Key Learnings

1. State as the Source of Truth
2. UI should always be derived from application state instead of being directly manipulated.
3. Reducers define how state changes in response to actions.
4. Dispatch as the State Gateway
5. All state updates pass through a single dispatcher.
6. Centralizing updates simplifies debugging and logging.
7. Reducers return new state objects instead of mutating existing ones.
   
    ```
    return {
      ...state,
      counter: counter + step
    }
    ```
    
9. Undo Using a Stack, It is implemented using a Last-In-First-Out (LIFO) stack.

    ```
    historyStack.push(prevState)
    state = historyStack.pop()
    ```

10. Event Logs Improve Observability and help understand how the system reached its current state.
11. All functions (dispatch, reducer, render) live inside the counter() function and share access to the same variables via closures.

## Future Improvements
1. Displaying action history in the UI
2. Time-travel debugging
3. Redo functionality
4. Dynamic keyboard shortcut mapping
5. Abstracting the reducer/dispatch pattern into a reusable store

