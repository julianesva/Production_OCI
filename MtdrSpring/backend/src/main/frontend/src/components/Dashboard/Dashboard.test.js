import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Dashboard from "./Dashboard";
import { API_LIST, API_EMPLOYEES, API_MODULES } from "../../API";

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

   // Snapshot test for Dashboard component
   test("Dashboard component matches snapshot", async () => {
    const { container } = render(<Dashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Take a snapshot of the rendered component
    expect(container).toMatchSnapshot();
  });

  // Snapshot test for Dashboard component
  test("Dashboard component matches snapshot", async () => {
    const { container } = render(<Dashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Take a snapshot of the rendered component
    expect(container).toMatchSnapshot();
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
        "Error: Something went wrong loading Tasks..."
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

  // Test real-time task visualization Objective number 1
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
    const user = userEvent.setup();
    const { container } = render(<Dashboard />);
  
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
    
    // Find the filter select element
    const moduleSelect = container.querySelector(".filter-module-container select");
    expect(moduleSelect).toBeInTheDocument();

    // Select module 1
    await user.selectOptions(moduleSelect, "1");
  
    // Wait for the UI to update
    await waitFor(() => {
      // Only tasks from module 1 should be visible
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
      expect(screen.getByText("Task 3")).toBeInTheDocument();
    });
  });
  

  // Test task completion functionality Objective number 3
  test("updates task status when marked as completed", async () => {
    const user = userEvent.setup();
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
    await user.click(doneButtons[0]);

    // Wait for the UI to update
    await waitFor(() => {
      // Task 1 should now be in the "Completed" table
      const completedTasks = screen.getAllByText("Task 1");
      expect(completedTasks.length).toBeGreaterThan(0);
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

  // Test task details display Objective number 4
  test("displays task details correctly", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check task details
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description for Task 1")).toBeInTheDocument();
  });

  // Test module filter reset
  test("resets module filter when 'All' is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find the filter select element
    const filterContainer = container.querySelector(".filter-module-container");
    const moduleSelect = filterContainer.querySelector("select");

    // Select module 1
    await user.selectOptions(moduleSelect, "1");

    // Select "All"
    await user.selectOptions(moduleSelect, "all");

    // Wait for the UI to update
    await waitFor(() => {
      // All tasks should be visible
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
      expect(screen.getByText("Task 3")).toBeInTheDocument();
    });
  });

  // Test task data state changes Objective
  test("displays task data with correct information", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if task details are displayed correctly in the "To Do" table
    const todoTask = screen.getByText("Task 1").closest("tr");
    expect(todoTask).toHaveTextContent("user1"); // Developer name
    expect(todoTask).toHaveTextContent("3"); // Story points
    expect(todoTask).toHaveTextContent("5"); // Estimated hours

    // Check if task details are displayed correctly in the "Completed" table
    const completedTask = screen.getByText("Task 3").closest("tr");
    expect(completedTask).toHaveTextContent("user1"); // Developer name
    expect(completedTask).toHaveTextContent("2"); // Story points
    expect(completedTask).toHaveTextContent("3"); // Estimated hours
    expect(completedTask).toHaveTextContent("4"); // Actual hours
  });

  // Test changing task data (name, developer, story points, estimated hours) Objective Number 2
  test("updates task data when modified", async () => {
    // Create a modified version of the mock tasks
    const modifiedTasks = [
      {
        id: 1,
        title: "Updated Task 1", // Changed task name
        description: "Description for Task 1",
        estimatedTime: 8, // Changed estimated hours
        done: 0, // Status remains the same
        story_Points: 5, // Changed story points
        moduleId: 1,
        responsible: 2, // Changed developer
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

    // Mock the GET request for tasks with the modified data
    server.use(
      rest.get(`${API_LIST}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(modifiedTasks));
      })
    );

    // Mock the PUT request for updating a task
    server.use(
      rest.put(`${API_LIST}/1`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: 1,
            title: "Updated Task 1",
            description: "Description for Task 1",
            estimatedTime: 8,
            done: 0, // Status remains the same
            story_Points: 5,
            moduleId: 1,
            responsible: 2,
            actualTime: 0,
          })
        );
      })
    );

    render(<Dashboard />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find the task by its ID in the table
    const taskRows = screen.getAllByRole("row");
    const taskRow = taskRows.find((row) =>
      row.textContent.includes("Updated Task 1")
    );

    // Verify the task data has been updated
    expect(taskRow).toBeInTheDocument();
    expect(taskRow).toHaveTextContent("user2"); // Updated developer
    expect(taskRow).toHaveTextContent("5"); // Updated story points
    expect(taskRow).toHaveTextContent("8"); // Updated estimated hours
  });

  // Test listing completed tasks by sprint
  test("lists completed tasks by sprint with minimum information", async () => {
    render(<Dashboard />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find the filter select element
    const filterContainer = screen
      .getByText("Filter by Sprint:")
      .closest("div");
    const moduleSelect = filterContainer.querySelector("select");

    // Select Sprint 1
    await user.selectOptions(moduleSelect, "1");

    // Wait for the UI to update
    await waitFor(() => {
      // Check completed task in Sprint 1
      const completedTask = screen.getByText("Task 3").closest("tr");
      expect(completedTask).toHaveTextContent("user1"); // Developer name
      expect(completedTask).toHaveTextContent("3"); // Estimated hours
      expect(completedTask).toHaveTextContent("4"); // Actual hours
    });

    // Select Sprint 2
    await user.selectOptions(moduleSelect, "2");

    // Wait for the UI to update
    await waitFor(() => {
      // No completed tasks in Sprint 2
      expect(screen.queryByText("Task 3")).not.toBeInTheDocument();
    });
  });
});
