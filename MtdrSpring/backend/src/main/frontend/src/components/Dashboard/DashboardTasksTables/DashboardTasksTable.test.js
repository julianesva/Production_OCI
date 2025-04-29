import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import DashboardTasksTable from "./DashboardTasksTable";
import { API_LIST } from "../../../API";

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
  rest.get(`${API_LIST}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTasks));
  }),
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

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Responsible")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Story Points")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description for Task 1")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description for Task 2")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

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

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

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

    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();

    expect(screen.getByText("Real Hours")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  test("toggles table visibility when hide/show button is clicked", async () => {
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

    expect(screen.getByText("Task 1")).toBeInTheDocument();

    const titleContainer = screen
      .getByText("To Do")
      .closest(".dashboard-table-title-container");
    const hideButton = titleContainer.querySelector("button");

    await userEvent.click(hideButton);

    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();

    await userEvent.click(hideButton);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });

  test('calls handle_set_Real_Hours when "Done" button is clicked', async () => {
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

    const doneButtons = screen.getAllByText("Done");
    await userEvent.click(doneButtons[0]);

    expect(mockHandleSetRealHours).toHaveBeenCalledTimes(1);
    expect(mockSetIsHiddenRealHours).toHaveBeenCalledWith(false);
  });

  test("calls deleteItem when trash button is clicked", async () => {
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

    const trashButtons = screen.getAllByRole("button", { name: "" });
    await userEvent.click(trashButtons[1]); // Second button is the trash for the first task

    expect(mockDeleteItem).toHaveBeenCalledWith(1);
  });

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

    expect(screen.getByText("All clear")).toBeInTheDocument();
  });
});
