import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Report from "./Report";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { API_TEAM_DATA, API_MODULES } from "../../API";

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
  "./ReportContent/ReportKPI/ReportKPICombined/ReportKPICombined",
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
  "./ReportContent/ReportKPI/ReportKPITasks/ReportKPITasks",
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
  "./ReportContent/ReportKPI/ReportKPIHours/ReportKPIHours",
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
    name: "Sprint 1",
  },
  {
    id: 2,
    name: "Sprint 2",
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
    const user = userEvent.setup();
  
    // Wait for loading to complete AND for the team options to be present
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Team A" })).toBeInTheDocument();
    });
  
    // Select team
    const teamSelect = screen
      .getByText("Team:")
      .closest("div")
      .querySelector("select");
    await user.selectOptions(teamSelect, "Team A");
  
    // Wait for the sprint options to be present
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "1 - Sprint 1" })).toBeInTheDocument(); // Assuming your module data renders "Sprint 1" as text
    });
  
    // Select sprint
    const sprintSelect = screen
      .getByText("Sprint:")
      .closest("div")
      .querySelector("select");
    await user.selectOptions(sprintSelect, "1"); // Assuming the value is "1"
  
    // Click generate report button
    const generateButton = screen.getByText("Generate Report");
    await user.click(generateButton);
  
    // Wait for KPI data to be displayed
    await waitFor(() => {
      expect(screen.getByText("Tasks")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-tasks")).toBeInTheDocument();
      expect(screen.getByText("Hours")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-hours")).toBeInTheDocument();
      expect(screen.getByText("Tasks per Hour")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-combined")).toBeInTheDocument();
    });
  
    // Verify the KPI data for Team A in Sprint 1
    const tasksKPIContainer = screen.getByTestId("kpi-tasks");
    expect(within(tasksKPIContainer).getByText("Tasks To Do: 1")).toBeInTheDocument();
    expect(within(tasksKPIContainer).getByText("Tasks Completed: 2")).toBeInTheDocument();
  
    const hoursKPIContainer = screen.getByTestId("kpi-hours");
    expect(within(hoursKPIContainer).getByText("Estimated Hours: 9")).toBeInTheDocument();
    expect(within(hoursKPIContainer).getByText("Worked Hours: 11")).toBeInTheDocument();
  
    const combinedKPIContainer = screen.getByTestId("kpi-combined");
    expect(within(combinedKPIContainer).getByText("Tasks Completed: 2")).toBeInTheDocument();
    expect(within(combinedKPIContainer).getByText("Worked Hours: 11")).toBeInTheDocument();
  });


  test("generates KPI report for person by sprint", async () => {
    render(<Report />);

    const user = userEvent.setup();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Select team
    const teamSelect = screen
      .getByText("Team:")
      .closest("div")
      .querySelector("select");
      await user.selectOptions(teamSelect, "Team A");

    // Select member
    const memberSelect = screen
      .getByText("Member:")
      .closest("div")
      .querySelector("select");
      await user.selectOptions(memberSelect, "user1");

    // Select sprint
    const sprintSelect = screen
      .getByText("Sprint:")
      .closest("div")
      .querySelector("select");
      await user.selectOptions(sprintSelect, "1");

    // Click generate report button
    const generateButton = screen.getByText("Generate Report");
    await user.click(generateButton);

    // Wait for KPI data to be displayed
    // Verify the KPI data for user1 in Sprint 1

    // Check tasks KPI
    const tasksKPIContainer = screen.getByTestId("kpi-tasks");
    expect(within(tasksKPIContainer).getByText("Tasks To Do: 1")).toBeInTheDocument();
    expect(within(tasksKPIContainer).getByText("Tasks Completed: 1")).toBeInTheDocument();

    // Check hours KPI
    const hoursKPIContainer = screen.getByTestId("kpi-hours");
    expect(within(hoursKPIContainer).getByText("Estimated Hours: 5")).toBeInTheDocument();
    expect(within(hoursKPIContainer).getByText("Worked Hours: 6")).toBeInTheDocument();

    // Check combined KPI
    const combinedKPIContainer = screen.getByTestId("kpi-combined");
    expect(within(combinedKPIContainer).getByText("Tasks Completed: 1")).toBeInTheDocument();
    expect(within(combinedKPIContainer).getByText("Worked Hours: 6")).toBeInTheDocument();
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

});
