import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Dashboard from "./Dashboard";
import { API_LIST, API_EMPLOYEES, API_MODULES, API_HEADERS } from "../../API";

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
  // Mock GET request for tasks
  rest.get(`${API_LIST}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTasks));
  }),

  // Mock GET request for employees
  rest.get(API_EMPLOYEES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockEmployees));
  }),

  // Mock GET request for modules
  rest.get(API_MODULES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockModules));
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Dashboard Component", () => {
  // Test loading state
  test("shows loading state while fetching data", () => {
    render(<Dashboard />);

    // Check if loading indicator is displayed
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  // Test error handling
  test("shows error message when API request fails", async () => {
    // Override the handler for this test to simulate an error
    server.use(
      rest.get(`${API_LIST}`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Dashboard />);

    // Wait for error message to appear
    await waitFor(() => {
      const errorElement = screen.getByText(
        /Error: Something went wrong loading Tasks\.\.\./i
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  // Test successful data loading
  test("loads and displays tasks, employees, and modules data", async () => {
    render(<Dashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

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

  // Test real-time task visualization
  test("displays tasks assigned to users in real-time", async () => {
    render(<Dashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if tasks are displayed in the "To Do" table
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    // Check if tasks are displayed in the "Completed" table
    expect(screen.getByText("Task 3")).toBeInTheDocument();

    // Check if task details are displayed correctly
    expect(screen.getByText("Description for Task 1")).toBeInTheDocument();

    // Find Task 1's row and verify its contents
    const task1Title = screen.getAllByText("Task 1")[0];
    const task1Row = task1Title.closest("tr");
    expect(task1Row).toBeTruthy();

    // Check user assignment
    const responsibleCell = task1Row.querySelector(
      ".dashboard-table-responsible-column"
    );
    expect(responsibleCell.textContent).toBe("user1");

    // Check estimated time and story points
    const estimatedTimeCell = task1Row.querySelector(
      ".dashboard-table-num-column"
    );
    const storyPointsCell = Array.from(
      task1Row.querySelectorAll(".dashboard-table-num-column")
    ).pop();

    expect(estimatedTimeCell.textContent).toBe("5");
    expect(storyPointsCell.textContent).toBe("3");
  });

  // Test task filtering by module
  test("filters tasks by module when a module is selected", async () => {
    const { container } = render(<Dashboard />);

    // Wait for loading to complete and modules to be loaded
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("1 - Sprint 1")).toBeInTheDocument();
    });

    // Find the filter select element within the filter container
    const filterContainer = container.querySelector(".filter-module-container");
    const moduleSelect = filterContainer.querySelector("select");
    expect(moduleSelect).toBeInTheDocument();

    // Select module 1
    fireEvent.change(moduleSelect, { target: { value: "1" } });

    // Wait for the UI to update
    await waitFor(() => {
      // Only tasks from module 1 should be visible
      const task1 = screen.queryByText("Task 1");
      const task2 = screen.queryByText("Task 2");
      const task3 = screen.queryByText("Task 3");

      expect(task1).toBeInTheDocument();
      expect(task2).not.toBeInTheDocument();
      expect(task3).toBeInTheDocument();
    });
  });

  // Test task completion functionality
  test("updates task status when marked as completed", async () => {
    // Mock the PUT request for updating a task
    server.use(
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

      // Mock the GET request for fetching the updated task
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

    render(<Dashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click the "Done" button for Task 1
    const doneButtons = screen.getAllByText("Done");
    doneButtons[0].click();

    // Wait for the UI to update
    await waitFor(() => {
      // Task 1 should now be in the "Completed" table
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });
  });
});
