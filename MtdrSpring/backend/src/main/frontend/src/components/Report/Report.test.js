import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Report from "./Report";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { API_HEADERS, API_TEAM_DATA, API_MODULES } from "../../API";

// Mock data for testing

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children, width, height }) => (
      <div data-testid="responsive-container" style={{ width, height }}>
        {children}
      </div>
    ),
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Bar: () => <div data-testid="bar" />,
  };
});
// Mock  ReportKPICombined component
jest.mock(
  "./ReportContent/ReportKPICombined/ReportKPICombined",
  () =>
    ({ KPICombinedData }) =>
      (
        <div data-testid="kpi-combined">
          <div>Tasks Completed: {KPICombinedData.tasks_completed}</div>
          <div>Worked Hours: {KPICombinedData.worked_hours}</div>
        </div>
      )
);

// Mock ReportKPITasks component
jest.mock(
  "./ReportContent/ReportKPITasks/ReportKPITasks",
  () =>
    ({ KPITasksData }) =>
      (
        <div data-testid="kpi-tasks">
          <div>Tasks To Do: {KPITasksData.tasks_to_do}</div>
          <div>Tasks Completed: {KPITasksData.tasks_completed}</div>
        </div>
      )
);

// Mock ReportKPIHours component
jest.mock(
  "./ReportContent/ReportKPIHours/ReportKPIHours",
  () =>
    ({ KPIHoursData }) =>
      (
        <div data-testid="kpi-hours">
          <div>Estimated Hours: {KPIHoursData.stimated_hours}</div>
          <div>Worked Hours: {KPIHoursData.worked_hours}</div>
        </div>
      )
);

const mockTeamData = [
  {
    teamId: "Team A",
    user: {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    },
    tasksCompleted: [
      {
        id: 1,
        title: "Task 1",
        description: "Description for Task 1",
        estimatedTime: 5,
        actualTime: 6,
        moduleId: 1,
        done: 1,
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description for Task 2",
        estimatedTime: 8,
        actualTime: 7,
        moduleId: 2,
        done: 1,
      },
    ],
    uncompletedTasks: [
      {
        id: 3,
        title: "Task 3",
        description: "Description for Task 3",
        estimatedTime: 3,
        actualTime: 0,
        moduleId: 1,
        done: 0,
      },
    ],
  },
  {
    teamId: "Team A",
    user: {
      id: 2,
      username: "user2",
      email: "user2@example.com",
    },
    tasksCompleted: [
      {
        id: 4,
        title: "Task 4",
        description: "Description for Task 4",
        estimatedTime: 4,
        actualTime: 5,
        moduleId: 1,
        done: 1,
      },
    ],
    uncompletedTasks: [
      {
        id: 5,
        title: "Task 5",
        description: "Description for Task 5",
        estimatedTime: 6,
        actualTime: 0,
        moduleId: 2,
        done: 0,
      },
    ],
  },
  {
    teamId: "Team B",
    user: {
      id: 3,
      username: "user3",
      email: "user3@example.com",
    },
    tasksCompleted: [
      {
        id: 6,
        title: "Task 6",
        description: "Description for Task 6",
        estimatedTime: 7,
        actualTime: 8,
        moduleId: 1,
        done: 1,
      },
    ],
    uncompletedTasks: [
      {
        id: 7,
        title: "Task 7",
        description: "Description for Task 7",
        estimatedTime: 9,
        actualTime: 0,
        moduleId: 1,
        done: 0,
      },
    ],
  },
];

const mockModuleData = [
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
  // Mock GET request for fetching team data
  rest.get(API_TEAM_DATA, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTeamData));
  }),

  // Mock GET request for fetching module data
  rest.get(API_MODULES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockModuleData));
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Report Component", () => {
  // Test rendering of report component
  test("renders report component with loading state initially", () => {
    render(<Report />);

    // Check if loading indicator is displayed
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  // Test rendering of report component with data
  test("renders report component with data after loading", async () => {
    render(<Report />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if report title is displayed
    expect(screen.getByText("Report")).toBeInTheDocument();

    // Check if KPI title is displayed
    expect(screen.getByText("Key Performance Indicators")).toBeInTheDocument();

    // Check if generate report button is displayed
    expect(screen.getByText("Generate Report")).toBeInTheDocument();
  });

  test("generates KPI report for team by sprint", async () => {
    render(<Report />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Select team
    const teamSelect = screen
      .getByText("Team:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(teamSelect, "Team A");

    // Select sprint
    const sprintSelect = screen
      .getByText("Sprint:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(sprintSelect, "1");

    // Click generate report button
    const generateButton = screen.getByText("Generate Report");
    fireEvent.click(generateButton);

    // Wait for KPI data to be displayed
    await waitFor(() => {
      // Check if tasks KPI is displayed
      expect(screen.getByText("Tasks")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-tasks")).toBeInTheDocument();

      // Check if hours KPI is displayed
      expect(screen.getByText("Hours")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-hours")).toBeInTheDocument();

      // Check if combined KPI is displayed
      expect(screen.getByText("Tasks per Hour")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-combined")).toBeInTheDocument();
    });

    // Verify the KPI data for Team A in Sprint 1
    // Team A has 2 completed tasks in Sprint 1 (Task 1 and Task 4)
    // Total estimated hours: 5 + 4 = 9
    // Total worked hours: 6 + 5 = 11

    // Check tasks KPI
    expect(screen.getByText("Tasks To Do: 1")).toBeInTheDocument(); // Tasks to do
    expect(screen.getByText("Tasks Completed: 2")).toBeInTheDocument(); // Tasks completed

    // Check hours KPI
    expect(screen.getByText("Estimated Hours: 9")).toBeInTheDocument(); // Estimated hours
    expect(screen.getByText("Worked Hours: 11")).toBeInTheDocument(); // Worked hours
  });

  test("generates KPI report for person by sprint", async () => {
    render(<Report />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Select team
    const teamSelect = screen
      .getByText("Team:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(teamSelect, "Team A");

    // Select member
    const memberSelect = screen
      .getByText("Member:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(memberSelect, "user1");

    // Select sprint
    const sprintSelect = screen
      .getByText("Sprint:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(sprintSelect, "1");

    // Click generate report button
    const generateButton = screen.getByText("Generate Report");
    fireEvent.click(generateButton);

    // Wait for KPI data to be displayed
    await waitFor(() => {
      // Check if tasks KPI is displayed
      expect(screen.getByText("Tasks")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-tasks")).toBeInTheDocument();

      // Check if hours KPI is displayed
      expect(screen.getByText("Hours")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-hours")).toBeInTheDocument();

      // Check if combined KPI is displayed
      expect(screen.getByText("Tasks per Hour")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-combined")).toBeInTheDocument();
    });

    // Verify the KPI data for user1 in Sprint 1
    // user1 has 1 completed task in Sprint 1 (Task 1)
    // Total estimated hours: 5
    // Total worked hours: 6

    // Check tasks KPI
    expect(screen.getByText("Tasks To Do: 1")).toBeInTheDocument(); // Tasks to do
    expect(screen.getByText("Tasks Completed: 1")).toBeInTheDocument(); // Tasks completed

    // Check hours KPI
    expect(screen.getByText("Estimated Hours: 5")).toBeInTheDocument(); // Estimated hours
    expect(screen.getByText("Worked Hours: 6")).toBeInTheDocument(); // Worked hours
  });

  // Test error handling
  test("handles API error correctly", async () => {
    // Override the server handler for this test
    server.use(
      rest.get(API_TEAM_DATA, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Report />);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  // Test task data state changes
  test("displays task data with correct information", async () => {
    // Mock task data with specific fields
    const mockTaskData = [
      {
        teamId: "Team A",
        user: {
          username: "user1",
        },
        tasksCompleted: [
          {
            id: 1,
            name: "Task 1",
            moduleId: 1,
            estimatedTime: 5,
            actualTime: 6,
            storyPoints: 3,
          },
        ],
        uncompletedTasks: [
          {
            id: 2,
            name: "Task 2",
            moduleId: 1,
            estimatedTime: 4,
            storyPoints: 2,
          },
        ],
      },
    ];

    // Override the server handler for this test
    server.use(
      rest.get(API_TEAM_DATA, (req, res, ctx) => {
        return res(ctx.json(mockTaskData));
      })
    );

    render(<Report />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Select team
    const teamSelect = screen
      .getByText("Team:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(teamSelect, "Team A");

    // Select member
    const memberSelect = screen
      .getByText("Member:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(memberSelect, "user1");

    // Select sprint
    const sprintSelect = screen
      .getByText("Sprint:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(sprintSelect, "1");

    // Click generate report button
    const generateButton = screen.getByText("Generate Report");
    fireEvent.click(generateButton);

    // Wait for task data to be displayed
    await waitFor(() => {
      // Check if task name is displayed
      expect(screen.getByText("Task 1")).toBeInTheDocument();

      // Check if developer name is displayed
      expect(screen.getByText("user1")).toBeInTheDocument();

      // Check if story points are displayed
      expect(screen.getByText("3")).toBeInTheDocument();

      // Check if estimated hours are displayed
      expect(screen.getByText("5")).toBeInTheDocument();

      // Check if actual hours are displayed
      expect(screen.getByText("6")).toBeInTheDocument();
    });
  });

  // Test listing completed tasks by sprint
  test("lists completed tasks by sprint with minimum information", async () => {
    // Mock task data with multiple completed tasks in different sprints
    const mockTaskData = [
      {
        teamId: "Team A",
        user: {
          username: "user1",
        },
        tasksCompleted: [
          {
            id: 1,
            name: "Task 1",
            moduleId: 1,
            estimatedTime: 5,
            actualTime: 6,
          },
          {
            id: 2,
            name: "Task 2",
            moduleId: 2,
            estimatedTime: 4,
            actualTime: 5,
          },
        ],
        uncompletedTasks: [],
      },
    ];

    // Override the server handler for this test
    server.use(
      rest.get(API_TEAM_DATA, (req, res, ctx) => {
        return res(ctx.json(mockTaskData));
      })
    );

    render(<Report />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Select team
    const teamSelect = screen
      .getByText("Team:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(teamSelect, "Team A");

    // Select member
    const memberSelect = screen
      .getByText("Member:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(memberSelect, "user1");

    // Select sprint 1
    const sprintSelect = screen
      .getByText("Sprint:")
      .closest("div")
      .querySelector("select");
    userEvent.selectOptions(sprintSelect, "1");

    // Click generate report button
    const generateButton = screen.getByText("Generate Report");
    fireEvent.click(generateButton);

    // Wait for sprint 1 task data to be displayed
    await waitFor(() => {
      // Check if task name is displayed
      expect(screen.getByText("Task 1")).toBeInTheDocument();

      // Check if developer name is displayed
      expect(screen.getByText("user1")).toBeInTheDocument();

      // Check if estimated hours are displayed
      expect(screen.getByText("5")).toBeInTheDocument();

      // Check if actual hours are displayed
      expect(screen.getByText("6")).toBeInTheDocument();
    });

    // Select sprint 2
    userEvent.selectOptions(sprintSelect, "2");

    // Click generate report button again
    fireEvent.click(generateButton);

    // Wait for sprint 2 task data to be displayed
    await waitFor(() => {
      // Check if task name is displayed
      expect(screen.getByText("Task 2")).toBeInTheDocument();

      // Check if developer name is displayed
      expect(screen.getByText("user1")).toBeInTheDocument();

      // Check if estimated hours are displayed
      expect(screen.getByText("4")).toBeInTheDocument();

      // Check if actual hours are displayed
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });
});
