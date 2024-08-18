import { render, screen } from "@testing-library/react";
import Todo from "./Todo";
import { test, expect, vi } from "vitest";

test("renders content", () => {
  const todo = {
    _id: "1",
    text: "Learn about testing in the build process",
    done: false,
  };

  render(<Todo todo={todo} deleteTodo={vi.fn()} completeTodo={vi.fn()} />);

  const element = screen.getByText("Learn about testing in the build process");
  expect(element).toBeDefined();
});
