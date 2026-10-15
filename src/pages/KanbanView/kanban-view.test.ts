import React from "react";
import "@testing-library/jest-dom/vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, expect, test, vi } from "vitest";
import KanbanView from "./KanbanView";

const renderKanbanView = (projectId = "p1") =>
  render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [`/projects/${projectId}`] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: "/projects/:projectId",
          element: React.createElement(KanbanView),
        }),
      ),
    ),
  );

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

test("renders the project name and the default Kanban columns", async () => {
  renderKanbanView();

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: "CI/CD Pipeline Demo" }),
    ).toBeInTheDocument();
  });

  expect(screen.getByRole("heading", { name: /To Do/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /In Progress/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Done/i })).toBeInTheDocument();
  expect(screen.getByText("Create initial data model")).toBeInTheDocument();
  expect(screen.getByText("Implement Kanban board")).toBeInTheDocument();
});

test("adds a new task to the selected column", async () => {
  renderKanbanView();

  fireEvent.change(screen.getByPlaceholderText("New task title"), {
    target: { value: "Write release notes" },
  });

  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "done" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Add" }));

  await waitFor(() => {
    expect(screen.getByText("Write release notes")).toBeInTheDocument();
  });

  const doneColumn = screen
    .getByRole("heading", { name: /Done/i })
    .closest(".kanban__column");
  expect(doneColumn).not.toBeNull();
  expect(
    within(doneColumn as HTMLElement).getByText("Write release notes"),
  ).toBeInTheDocument();
});

test("deletes a task from the board", async () => {
  renderKanbanView();

  const card = screen.getByText("Design UI mockups").closest(".kanban__card");
  expect(card).not.toBeNull();

  fireEvent.click(within(card as HTMLElement).getByTitle("Delete"));

  await waitFor(() => {
    expect(screen.queryByText("Design UI mockups")).not.toBeInTheDocument();
  });
});

test("edits a task title with the prompt dialog", async () => {
  const promptSpy = vi
    .spyOn(window, "prompt")
    .mockReturnValue("Create initial data model v2");

  renderKanbanView();

  const card = screen
    .getByText("Create initial data model")
    .closest(".kanban__card");
  expect(card).not.toBeNull();

  fireEvent.click(within(card as HTMLElement).getByTitle("Edit"));

  expect(promptSpy).toHaveBeenCalledWith("Edit task title");

  await waitFor(() => {
    expect(
      screen.getByText("Create initial data model v2"),
    ).toBeInTheDocument();
  });
});

test("ignores empty task submissions", async () => {
  renderKanbanView();

  fireEvent.click(screen.getByRole("button", { name: "Add" }));

  await waitFor(() => {
    expect(screen.queryByText("Untitled task")).not.toBeInTheDocument();
  });
});
