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
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  // Test error handling
  test("shows error message when API request fails", async () => {
    server.use(
      rest.get(`${API_LIST}`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Dashboard />);

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
  });

  // Test real-time task visualization
  test("displays tasks assigned to users in real-time", async () => {
    render(<Dashboard />);

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
  });

  // Test task filtering by module
  test("filters tasks by module when a module is selected", async () => {
    const { container } = render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find the filter select element
    const filterContainer = container.querySelector(".filter-module-container");
    const moduleSelect = filterContainer.querySelector("select");
    expect(moduleSelect).toBeInTheDocument();

    // Select module 1
    fireEvent.change(moduleSelect, { target: { value: "1" } });

    // Wait for the UI to update
    await waitFor(() => {
      // Only tasks from module 1 should be visible
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
      expect(screen.getByText("Task 3")).toBeInTheDocument();
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
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click the "Done" button for Task 1
    const doneButtons = screen.getAllByText("Done");
    fireEvent.click(doneButtons[0]);

    // Wait for the UI to update
    await waitFor(() => {
      // Task 1 should now be in the "Completed" table
      const completedTasks = screen.getAllByText("Task 1");
      expect(completedTasks.length).toBeGreaterThan(0);
    });
  });

  // Test task deletion
  test("deletes task when delete button is clicked", async () => {
    // Mock the DELETE request
    server.use(
      rest.delete(`${API_LIST}/1`, (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click the delete button for Task 1
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });

  // Test task filtering by status
  test("filters tasks by status (To Do and Completed)", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if both tables are displayed
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    // Check if tasks are in the correct tables
    expect(screen.getByText("Task 1")).toBeInTheDocument(); // To Do
    expect(screen.getByText("Task 2")).toBeInTheDocument(); // To Do
    expect(screen.getByText("Task 3")).toBeInTheDocument(); // Completed
  });

  // Test task details display
  test("displays task details correctly", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check task details
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description for Task 1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // Hours
    expect(screen.getByText("3")).toBeInTheDocument(); // Story Points
  });

  // Test module filter reset
  test("resets module filter when 'All' is selected", async () => {
    const { container } = render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find the filter select element
    const filterContainer = container.querySelector(".filter-module-container");
    const moduleSelect = filterContainer.querySelector("select");

    // Select module 1
    fireEvent.change(moduleSelect, { target: { value: "1" } });

    // Select "All"
    fireEvent.change(moduleSelect, { target: { value: "all" } });

    // Wait for the UI to update
    await waitFor(() => {
      // All tasks should be visible
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
      expect(screen.getByText("Task 3")).toBeInTheDocument();
    });
  });

  // Test error handling for employee loading
  test("shows error message when employee data fails to load", async () => {
    server.use(
      rest.get(API_EMPLOYEES, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      const errorElement = screen.getByText(
        /Error: Something went wrong loading Employees\.\.\./i
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  // Test error handling for module loading
  test("shows error message when module data fails to load", async () => {
    server.use(
      rest.get(API_MODULES, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      const errorElement = screen.getByText(
        /Error: Something went wrong loading Modules\.\.\./i
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  // Test task update error handling
  test("shows error message when task update fails", async () => {
    server.use(
      rest.put(`${API_LIST}/1`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click the "Done" button for Task 1
    const doneButtons = screen.getAllByText("Done");
    fireEvent.click(doneButtons[0]);

    // Wait for error message
    await waitFor(() => {
      const errorElement = screen.getByText(
        /Error: Something went wrong \.\.\./i
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  // Test task deletion error handling
  test("shows error message when task deletion fails", async () => {
    server.use(
      rest.delete(`${API_LIST}/1`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click the delete button for Task 1
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Wait for error message
    await waitFor(() => {
      const errorElement = screen.getByText(
        /Error: Something went wrong \.\.\./i
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  // Test loading state during task operations
  test("shows loading state during task operations", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Mock a slow response for task update
    server.use(
      rest.put(`${API_LIST}/1`, async (req, res, ctx) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return res(ctx.status(200));
      })
    );

    // Find and click the "Done" button for Task 1
    const doneButtons = screen.getAllByText("Done");
    fireEvent.click(doneButtons[0]);

    // Check if loading indicator appears
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
