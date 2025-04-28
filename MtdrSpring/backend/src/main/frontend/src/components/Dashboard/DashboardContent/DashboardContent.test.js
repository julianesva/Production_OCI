import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DashboardContent from "./DashboardContent";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { API_LIST, API_MODULES } from "../../../API";

// Mock data for testing
const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description for Task 1",
    estimatedTime: 5,
    done: 0,
    story_Points: 3,
    moduleId: 1,
    responsible: 1,
    actualTime: 0,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description for Task 2",
    estimatedTime: 8,
    done: 0,
    story_Points: 5,
    moduleId: 2,
    responsible: 2,
    actualTime: 0,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description for Task 3",
    estimatedTime: 3,
    done: 1,
    story_Points: 2,
    moduleId: 1,
    responsible: 1,
    actualTime: 4,
  },
];

const mockEmployees = [
  {
    id: 1,
    user: {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    },
  },
  {
    id: 2,
    user: {
      id: 2,
      username: "user2",
      email: "user2@example.com",
    },
  },
];

const mockModules = [
  {
    id: 1,
    title: "Sprint 1",
  },
  {
    id: 2,
    title: "Sprint 2",
  },
];

// Setup MSW server for mocking HTTP requests
const server = setupServer(
  // Mock GET request for fetching tasks
  rest.get(API_LIST, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTasks));
  }),

  // Mock GET request for fetching modules
  rest.get(API_MODULES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockModules));
  }),

  // Mock PUT request for updating a task
  rest.put(`${API_LIST}/1`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        title: "Task 1",
        description: "Description for Task 1",
        estimatedTime: 5,
        done: 1,
        story_Points: 3,
        moduleId: 1,
        actualTime: 0,
      })
    );
  }),

  // Mock GET request for fetching the updated task
  rest.get(`${API_LIST}/1`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        title: "Task 1",
        description: "Description for Task 1",
        estimatedTime: 5,
        done: 1,
        story_Points: 3,
        moduleId: 1,
        actualTime: 0,
      })
    );
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock functions
const mockAddItem = jest.fn();
const mockToggleDone = jest.fn();
const mockDeleteItem = jest.fn();

describe("DashboardContent Component", () => {
  // Test rendering of dashboard content
  test("renders dashboard content with correct data", () => {
    render(
      <DashboardContent
        items={mockTasks}
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
        toggleDone={mockToggleDone}
        deleteItem={mockDeleteItem}
        modules={mockModules}
      />
    );

    // Check if dashboard title is displayed
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Check if module filter is displayed
    expect(screen.getByText("Filter by Sprint:")).toBeInTheDocument();

    // Check if module options are displayed
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("1 - Sprint 1")).toBeInTheDocument();
    expect(screen.getByText("2 - Sprint 2")).toBeInTheDocument();

    // Check if task tables are displayed
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  // Test filtering tasks by module
  test("filters tasks by module when a module is selected", async () => {
    render(
      <DashboardContent
        items={mockTasks}
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
        toggleDone={mockToggleDone}
        deleteItem={mockDeleteItem}
        modules={mockModules}
      />
    );

    // Wait for tasks to load
    await screen.findByText("Task 1");

    // Select module 1
    const moduleSelect = screen.getByTestId("filter-module-select");
    await userEvent.selectOptions(moduleSelect, "1");

    // Check that only tasks from module 1 are visible
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  // Test task completion functionality
  test("handles task completion correctly", async () => {
    render(
      <DashboardContent
        items={mockTasks}
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
        toggleDone={mockToggleDone}
        deleteItem={mockDeleteItem}
        modules={mockModules}
      />
    );

    // Find and click the "Done" button for Task 1
    const doneButtons = screen.getAllByText("Done");
    fireEvent.click(doneButtons[0]);

    // Check if the real hours popup is displayed
    expect(screen.getByText("Task Completion Time")).toBeInTheDocument();

    // Enter real hours and confirm
    const realHoursInput = screen.getByPlaceholderText("Real Hours");
    userEvent.type(realHoursInput, "6");

    const confirmButton = screen.getByText("Save");
    fireEvent.click(confirmButton);

    // Check if toggleDone was called with the correct parameters
    expect(mockToggleDone).toHaveBeenCalledWith({
      id: 1,
      title: "Task 1",
      description: "Description for Task 1",
      done: 1,
      estimatedTime: 5,
      story_Points: 3,
      moduleId: 1,
      actualTime: 6,
    });
  });

  // Test task deletion functionality
  test("handles task deletion correctly", () => {
    render(
      <DashboardContent
        items={mockTasks}
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
        toggleDone={mockToggleDone}
        deleteItem={mockDeleteItem}
        modules={mockModules}
      />
    );

    // Find and click the trash button for Task 1
    const trashButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(trashButtons[1]); // The second button is the trash button for the first task

    // Check if deleteItem was called with the correct task ID
    expect(mockDeleteItem).toHaveBeenCalledWith(1);
  });

  // Test adding a new task
  test("handles adding a new task correctly", async () => {
    render(
      <DashboardContent
        items={mockTasks}
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
        toggleDone={mockToggleDone}
        deleteItem={mockDeleteItem}
        modules={mockModules}
      />
    );

    // Fill in the task form
    const titleInput = screen.getByPlaceholderText("Title");
    userEvent.type(titleInput, "New Task");

    const descriptionInput = screen.getByPlaceholderText("Description");
    userEvent.type(descriptionInput, "Description for New Task");

    // Select responsible
    const responsibleSelect = screen.getAllByRole("combobox")[0];
    userEvent.selectOptions(responsibleSelect, "1");

    const hoursInput = screen.getByPlaceholderText("Hours");
    userEvent.type(hoursInput, "10");

    const storyPointsInput = screen.getByPlaceholderText("Story Points");
    userEvent.type(storyPointsInput, "5");

    // Wait for modules to be loaded
    await waitFor(() => {
      const moduleSelect = screen.getByTestId("module-select");
      expect(moduleSelect.querySelectorAll("option").length).toBeGreaterThan(1);
    });

    const moduleSelect = screen.getByTestId("module-select");
    userEvent.selectOptions(moduleSelect, "1");

    // Submit the form
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // Check if addItem was called with the correct parameters
    expect(mockAddItem).toHaveBeenCalledWith({
      title: "New Task",
      description: "Description for New Task",
      estimatedTime: "10",
      done: 0,
      story_Points: "5",
      moduleId: 1,
      responsible: "1",
    });
  });
});
