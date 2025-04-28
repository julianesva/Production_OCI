import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardContent from "./DashboardContent";
import { rest } from "msw";
import { setupServer } from "msw/node";
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

    // Select module 1 from the dropdown
    const moduleSelect = screen.getByRole("combobox");
    moduleSelect.value = "1";
    const changeEvent = new Event("change", { bubbles: true });
    moduleSelect.dispatchEvent(changeEvent);

    // Wait for the UI to update
    await waitFor(() => {
      // Only tasks from module 1 should be visible in the "To Do" table
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.queryByText("Task 2")).not.toBeInTheDocument();

      // Task 3 should still be visible in the "Completed" table (it's from module 1)
      expect(screen.getByText("Task 3")).toBeInTheDocument();
    });
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
    expect(screen.getByText("Set Real Hours")).toBeInTheDocument();

    // Enter real hours and confirm
    const realHoursInput = screen.getByPlaceholderText("Enter real hours");
    userEvent.type(realHoursInput, "6");

    const confirmButton = screen.getByText("Confirm");
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
  test("handles adding a new task correctly", () => {
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

    const hoursInput = screen.getByPlaceholderText("Hours");
    userEvent.type(hoursInput, "10");

    const storyPointsInput = screen.getByPlaceholderText("Story Points");
    userEvent.type(storyPointsInput, "5");

    const responsibleSelect = screen.getByLabelText("Responsible");
    userEvent.selectOptions(responsibleSelect, "1");

    const moduleSelect = screen.getByLabelText("Module");
    userEvent.selectOptions(moduleSelect, "1");

    // Submit the form
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // Check if addItem was called with the correct parameters
    expect(mockAddItem).toHaveBeenCalledWith({
      title: "New Task",
      description: "Description for New Task",
      estimatedTime: 10,
      done: 0,
      story_Points: 5,
      moduleId: 1,
      responsible: 1,
    });
  });
});
