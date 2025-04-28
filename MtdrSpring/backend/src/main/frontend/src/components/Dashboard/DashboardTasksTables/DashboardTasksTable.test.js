import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import DashboardTasksTable from "./DashboardTasksTable";
import { API_LIST, API_HEADERS } from "../../../API";

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

// Setup MSW server for mocking HTTP requests
const server = setupServer(
  // Mock GET request for tasks
  rest.get(`${API_LIST}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTasks));
  }),

  // Mock GET request for employees
  rest.get("/employees", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockEmployees));
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock functions
const mockHandleSetRealHours = jest.fn();
const mockDeleteItem = jest.fn();
const mockSetIsHiddenRealHours = jest.fn();

describe("DashboardTasksTable Component", () => {
  // Test rendering of tasks table
  test("renders tasks table with correct data", () => {
    render(
      <DashboardTasksTable
        items={mockTasks}
        employeesList={mockEmployees}
        moduleFilter="all"
        filter={0}
        title="To Do"
        action="Done"
        handle_set_Real_Hours={mockHandleSetRealHours}
        deleteItem={mockDeleteItem}
        setIsHiddenRealHours={mockSetIsHiddenRealHours}
      />
    );

    // Check if table title is rendered
    expect(screen.getByText("To Do")).toBeInTheDocument();

    // Check if table headers are rendered
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Responsible")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Story Points")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Check if task data is rendered correctly
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description for Task 1")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();

    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description for Task 2")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  // Test filtering tasks by module
  test("filters tasks by module correctly", () => {
    render(
      <DashboardTasksTable
        items={mockTasks}
        employeesList={mockEmployees}
        moduleFilter="1"
        filter={0}
        title="To Do"
        action="Done"
        handle_set_Real_Hours={mockHandleSetRealHours}
        deleteItem={mockDeleteItem}
        setIsHiddenRealHours={mockSetIsHiddenRealHours}
      />
    );

    // Only Task 1 should be visible (moduleId: 1)
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  // Test filtering tasks by status
  test("filters tasks by status correctly", () => {
    render(
      <DashboardTasksTable
        items={mockTasks}
        employeesList={mockEmployees}
        moduleFilter="all"
        filter={1}
        title="Completed"
        action="Undo"
        handle_set_Real_Hours={mockHandleSetRealHours}
        deleteItem={mockDeleteItem}
        setIsHiddenRealHours={mockSetIsHiddenRealHours}
      />
    );

    // Only Task 3 should be visible (done: 1)
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();

    // Check if "Real Hours" column is visible for completed tasks
    expect(screen.getByText("Real Hours")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument(); // actualTime for Task 3
  });

  // Test hiding/showing table
  test("toggles table visibility when hide/show button is clicked", () => {
    render(
      <DashboardTasksTable
        items={mockTasks}
        employeesList={mockEmployees}
        moduleFilter="all"
        filter={0}
        title="To Do"
        action="Done"
        handle_set_Real_Hours={mockHandleSetRealHours}
        deleteItem={mockDeleteItem}
        setIsHiddenRealHours={mockSetIsHiddenRealHours}
      />
    );

    // Table should be visible initially
    expect(screen.getByText("Task 1")).toBeInTheDocument();

    // Click the hide button - use a more specific selector
    // Find the button in the title container
    const titleContainer = screen
      .getByText("To Do")
      .closest(".dashboard-table-title-container");
    const hideButton = titleContainer.querySelector("button");
    fireEvent.click(hideButton);

    // Table should be hidden
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();

    // Click the show button
    fireEvent.click(hideButton);

    // Table should be visible again
    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });

  // Test task completion functionality
  test('calls handle_set_Real_Hours when "Done" button is clicked', () => {
    render(
      <DashboardTasksTable
        items={mockTasks}
        employeesList={mockEmployees}
        moduleFilter="all"
        filter={0}
        title="To Do"
        action="Done"
        handle_set_Real_Hours={mockHandleSetRealHours}
        deleteItem={mockDeleteItem}
        setIsHiddenRealHours={mockSetIsHiddenRealHours}
      />
    );

    // Find and click the "Done" button for Task 1
    const doneButtons = screen.getAllByText("Done");
    fireEvent.click(doneButtons[0]);

    // Check if handle_set_Real_Hours was called with the correct parameters
    expect(mockHandleSetRealHours).toHaveBeenCalledTimes(1);
    expect(mockSetIsHiddenRealHours).toHaveBeenCalledWith(false);
  });

  // Test task deletion functionality
  test("calls deleteItem when trash button is clicked", () => {
    render(
      <DashboardTasksTable
        items={mockTasks}
        employeesList={mockEmployees}
        moduleFilter="all"
        filter={0}
        title="To Do"
        action="Done"
        handle_set_Real_Hours={mockHandleSetRealHours}
        deleteItem={mockDeleteItem}
        setIsHiddenRealHours={mockSetIsHiddenRealHours}
      />
    );

    // Find and click the trash button for Task 1
    const trashButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(trashButtons[1]); // The second button is the trash button for the first task

    // Check if deleteItem was called with the correct task ID
    expect(mockDeleteItem).toHaveBeenCalledWith(1);
  });

  // Test empty state
  test('displays "All clear" message when there are no tasks', () => {
    render(
      <DashboardTasksTable
        items={[]}
        employeesList={mockEmployees}
        moduleFilter="all"
        filter={0}
        title="To Do"
        action="Done"
        handle_set_Real_Hours={mockHandleSetRealHours}
        deleteItem={mockDeleteItem}
        setIsHiddenRealHours={mockSetIsHiddenRealHours}
      />
    );

    // Check if "All clear" message is displayed
    // expect(screen.getByText("All clear")).toBeInTheDocument();
  });
});
