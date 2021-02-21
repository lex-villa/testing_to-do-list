//import { render, screen } from '@testing-library/react';
import { shallow, configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import App, { Todo, TodoForm, useTodos } from './App';


configure({ adapter: new Adapter() });

describe("App", () => {
  describe("Todo", () => {
    it("Se ejecuta 'completeTodo' cuando se hace click en 'Complete'", () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: true,
        text: 'lala',
      };

      const wrapper = shallow(
        <Todo
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );

      wrapper
        .find('button')
        .at(0)
        .simulate('click');

      expect(completeTodo.mock.calls).toEqual([[5]]);
      expect(removeTodo.mock.calls).toEqual([]); // Comprueba que NO se ejecuta
    });

    it("Se ejecuta 'removeTodo' cuando se hace click en 'X'", () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: true,
        text: 'lala',
      };

      const wrapper = shallow(
        <Todo
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );

      wrapper
        .find('button')
        .at(1)
        .simulate('click');

      expect(removeTodo.mock.calls).toEqual([[5]]);
      expect(completeTodo.mock.calls).toEqual([]);
    });
  });

  describe("TodoForm", () => {
    it("Llamar a 'addTodo' cuando el formulario tiene un valor", () => {
      const addTodo = jest.fn();
      const preventDefault = jest.fn();
      const wrapper = shallow(
        <TodoForm
          addTodo={addTodo}
        />
      );

      wrapper
        .find('input')
        .simulate('change', { target: { value: 'mi nuevo todo!' } });

      wrapper
        .find("form")
        .simulate("submit", { preventDefault: preventDefault });

      expect(addTodo.mock.calls).toEqual([["mi nuevo todo!"]]);
      expect(preventDefault.mock.calls).toEqual([[]]);

    });
  });

  describe("custom hook: useTodos", () => {
    it("addTodo", () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook} />
      };

      const wrapper = shallow(
        <Test
          hook={useTodos}
        />
      );

      let props = wrapper.find('div').props();
      props.addTodo("texto de prueba");
      props = wrapper.find('div').props();

      expect(props.todos[0]).toEqual({ text: "texto de prueba" });
    });

    it("completeTodo", () => {
      const index = 0;
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook} />
      };

      const wrapper = shallow(
        <Test hook={useTodos} />
      );

      let props = wrapper.find("div").props();
      props.completeTodo(index);
      props = wrapper.find("div").props();

      expect(props.todos[0]).toEqual({
        text: "Todo 1",
        isCompleted: true,
      });
    });

    it("removeTodo", () => {
      const index = 0;
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook} />
      };

      const wrapper = shallow(<Test hook={useTodos} />);

      let props = wrapper.find("div").props();
      props.removeTodo(index);
      props = wrapper.find("div").props();

      expect(props.todos).toEqual([
        {
          text: "Todo 2",
          isCompleted: false
        },
        {
          text: "Todo 3",
          isCompleted: false
        }
      ]);
    });
  });

  describe("Integracion en App", () => {
    it("App", () => {
      const wrapper = mount(<App />);
      const prevent = jest.fn();

      wrapper
        .find('input')
        .simulate('change', { target: { value: 'mi todo!' } });

      wrapper
        .find('form')
        .simulate('submit', { preventDefault: prevent });

      const respuesta = wrapper
        .find('.todo')
        .at(0)
        .text()
        .includes('mi todo!');

      expect(respuesta).toEqual(true);
      expect(prevent.mock.calls).toEqual([[]]);
    });
  });
});
