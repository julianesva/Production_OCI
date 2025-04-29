import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DashboardContent from "./DashboardContent";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { API_LIST, API_MODULES } from "../../../API";
import { faker } from "@faker-js/faker";

/**
 * Generates dynamic mock employee data
 */
function generateMockEmployees(count = 10, options = {}) {
  // Set up seed for deterministic results if needed
  if (options.deterministic) {
    faker.seed(options.seed || 123);
  }

  return Array(count)
    .fill()
    .map((_, index) => {
      const id = index + 1;
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet
        .userName({ firstName, lastName })
        .toLowerCase();

      return {
        id,
        user: {
          id,
          username,
          email: faker.internet.email({ firstName, lastName }),
          firstName,
          lastName,
          role: faker.helpers.arrayElement([
            "admin",
            "user",
            "editor",
            "viewer",
          ]),
          department: faker.helpers.arrayElement([
            "IT",
            "HR",
            "Marketing",
            "Sales",
            "Engineering",
          ]),
          avatar: faker.image.avatar(),
          createdAt: faker.date.past().toISOString(),
        },
        position: faker.person.jobTitle(),
        hireDate: faker.date.past({ years: 5 }).toISOString(),
        salary: faker.number.int({ min: 30000, max: 150000 }),
        isActive: faker.datatype.boolean({ probability: 0.9 }),
      };
    });
}

/**
 * Generates dynamic mock task data
 */
function generateMockTasks(count = 10, options = {}) {
  // Set up seed for deterministic results if needed
  if (options.deterministic) {
    faker.seed(options.seed || 456);
  }

  const doneRatio = options.doneRatio || 0.3;
  const modules = options.modules || [1, 2];
  const responsibles = options.responsibles || [1, 2, 3, 4, 5];

  return Array(count)
    .fill()
    .map((_, index) => {
      const id = index + 1;
      const isDone = faker.datatype.boolean({ probability: doneRatio }) ? 1 : 0;

      return {
        id,
        title: faker.word.words({ count: { min: 2, max: 5 } }),
        description: faker.lorem.sentence(),
        estimatedTime: faker.number.int({ min: 1, max: 12 }),
        done: isDone,
        story_Points: faker.number.int({ min: 1, max: 8 }),
        moduleId: faker.helpers.arrayElement(modules),
        responsible: faker.helpers.arrayElement(responsibles),
        actualTime: isDone ? faker.number.int({ min: 1, max: 15 }) : 0,
      };
    });
}

/**
 * Generates dynamic mock module data
 */
function generateMockModules(count = 3, options = {}) {
  // Set up seed for deterministic results if needed
  if (options.deterministic) {
    faker.seed(options.seed || 789);
  }

  return Array(count)
    .fill()
    .map((_, index) => {
      const id = index + 1;
      return {
        id,
        title: `Sprint ${id}`,
      };
    });
}

// Create static test tasks that we can reliably reference in tests
const staticTestTasks = [
  {
    id: 999,
    title: "Static Test Task 1",
    description: "This task has predictable values for testing",
    estimatedTime: 5,
    done: 0,
    story_Points: 3,
    moduleId: 1,
    responsible: 1,
    actualTime: 0,
  },
  {
    id: 1000,
    title: "Static Test Task 2",
    description: "This is another predictable task for testing",
    estimatedTime: 8,
    done: 0,
    story_Points: 5,
    moduleId: 2,
    responsible: 2,
    actualTime: 0,
  },
];

// Generate mock data with deterministic seeds for reproducible tests
const mockEmployees = generateMockEmployees(5, {
  deterministic: true,
  seed: 123,
});
const mockModules = generateMockModules(4, { deterministic: true, seed: 789 });

// Get the IDs from the generated employees to use as responsibles
const employeeIds = mockEmployees.map((employee) => employee.id);

// Generate mock tasks with the employees and modules
const dynamicMockTasks = generateMockTasks(15, {
  deterministic: true,
  seed: 456,
  doneRatio: 0.3,
  modules: mockModules.map((module) => module.id),
  responsibles: employeeIds,
});

// Combine dynamic tasks with static test tasks
const mockTasks = [...dynamicMockTasks, ...staticTestTasks];

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

  // Mock PUT request for updating a task - dynamic version
  rest.put(`${API_LIST}/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const taskIndex = mockTasks.findIndex((task) => task.id.toString() === id);

    if (taskIndex === -1) {
      return res(ctx.status(404));
    }

    const task = { ...mockTasks[taskIndex], ...req.body };
    return res(ctx.status(200), ctx.json(task));
  }),

  // Mock GET request for fetching a specific task - dynamic version
  rest.get(`${API_LIST}/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const task = mockTasks.find((task) => task.id.toString() === id);

    if (!task) {
      return res(ctx.status(404));
    }

    return res(ctx.status(200), ctx.json(task));
  })
);

// Setup and teardown
beforeAll(() => {
  server.listen();
  console.log("Starting DashboardContent tests");
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock functions
const mockAddItem = jest.fn();
const mockToggleDone = jest.fn();
const mockDeleteItem = jest.fn();

describe("DashboardContent Component", () => {
  // Test filtering tasks by module
  test("filters tasks by module when a module is selected", async () => {
    // Create filtered subsets of tasks for verification
    const module1Tasks = mockTasks.filter((task) => task.moduleId === 1);
    const module2Tasks = mockTasks.filter((task) => task.moduleId === 2);

    // Ensure we have tasks for both modules
    expect(module1Tasks.length).toBeGreaterThan(0);
    expect(module2Tasks.length).toBeGreaterThan(0);

    // Set up userEvent
    const user = userEvent.setup();

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

    // Wait for tasks to load - use our static task that we know exists
    await screen.findByText("Static Test Task 1");

    // Initially we should see tasks from both modules
    expect(screen.getByText("Static Test Task 1")).toBeInTheDocument(); // Module 1
    expect(screen.getByText("Static Test Task 2")).toBeInTheDocument(); // Module 2

    // Select module 1
    const moduleSelect = screen.getByTestId("filter-module-select");
    await user.selectOptions(moduleSelect, "1");

    // After filtering, we should only see module 1 tasks
    expect(screen.getByText("Static Test Task 1")).toBeInTheDocument(); // Module 1
    expect(screen.queryByText("Static Test Task 2")).not.toBeInTheDocument(); // Module 2 (should be hidden)
  });

  // Test task completion functionality
  test("handles task completion correctly", async () => {
    // Set up userEvent
    const user = userEvent.setup();

    // Use our static test task for consistency
    const testTask = staticTestTasks[0]; // Static Test Task 1

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

    // Wait for our static task to load
    const taskElement = await screen.findByText(testTask.title);

    // Find the row containing our task
    const taskRow =
      taskElement.closest("tr") || taskElement.closest(".task-row"); // Adjust based on your component structure

    // Find the Done button within that row
    const doneButton = within(taskRow).getByText("Done");
    await user.click(doneButton);

    // Check if the real hours popup is displayed
    expect(screen.getByText("Task Completion Time")).toBeInTheDocument();

    // Enter real hours and confirm
    const realHoursInput = screen.getByPlaceholderText("Real Hours");
    await user.type(realHoursInput, "6");

    const confirmButton = screen.getByText("Save");
    await user.click(confirmButton);

    // Check if toggleDone was called with the correct parameters using objectContaining for flexibility
    expect(mockToggleDone).toHaveBeenCalledWith(
      expect.objectContaining({
        id: testTask.id,
        title: testTask.title,
        done: 1,
        actualTime: 6,
      })
    );
  });

  // Test task deletion functionality
  test("handles task deletion correctly", async () => {
    // Set up userEvent
    const user = userEvent.setup();

    // Use our static test task for consistency
    const testTask = staticTestTasks[0]; // Static Test Task 1

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

    // Wait for our static task to load
    const taskElement = await screen.findByText(testTask.title);

    // Find the row containing our task
    const taskRow =
      taskElement.closest("tr") || taskElement.closest(".task-row"); // Adjust based on your component structure

    // Find the delete button within that row
    // This depends on your component structure, but typically it would be an icon button
    // Using a more robust approach to find the delete button
    const buttons = within(taskRow).getAllByRole("button");
    // Find delete button either by aria-label, title, or class containing 'delete'/'trash'
    const deleteButton = buttons.find(
      (button) =>
        button.getAttribute("aria-label") === "Delete" ||
        button.getAttribute("title") === "Delete" ||
        button.className.includes("delete") ||
        button.className.includes("trash")
    );

    // If we can't find it with attributes, just use the second button (common pattern)
    const buttonToClick = deleteButton || buttons[1];
    await user.click(buttonToClick);

    // Check if deleteItem was called with the correct task ID
    expect(mockDeleteItem).toHaveBeenCalledWith(testTask.id);
  });

  // Test adding a new task
  test("handles adding a new task correctly", async () => {
    // Set up userEvent
    const user = userEvent.setup();

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

    // Wait for the component to fully load
    await screen.findByText("Static Test Task 1");

    // Fill in the task form
    const titleInput = screen.getByPlaceholderText("Title");
    await user.type(titleInput, "New Task");

    const descriptionInput = screen.getByPlaceholderText("Description");
    await user.type(descriptionInput, "Description for New Task");

    // Select responsible
    const responsibleSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(responsibleSelect, "1");

    const hoursInput = screen.getByPlaceholderText("Hours");
    await user.type(hoursInput, "10");

    const storyPointsInput = screen.getByPlaceholderText("Story Points");
    await user.type(storyPointsInput, "5");

    // Wait for modules to be loaded
    await waitFor(() => {
      const moduleSelect = screen.getByTestId("module-select");
      expect(moduleSelect.querySelectorAll("option").length).toBeGreaterThan(1);
    });

    const moduleSelect = screen.getByTestId("module-select");
    await user.selectOptions(moduleSelect, "1");

    // Submit the form
    const addButton = screen.getByText("Add");
    await user.click(addButton);

    // Check if addItem was called with the correct parameters
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Task",
        description: "Description for New Task",
        estimatedTime: "10",
        done: 0,
        story_Points: "5",
        moduleId: 1,
        responsible: "1",
      })
    );
  });
})