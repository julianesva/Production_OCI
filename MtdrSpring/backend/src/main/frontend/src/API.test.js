import {
  API_LIST,
  API_EMPLOYEES,
  API_MODULES,
  API_TEAM_DATA,
  API_HEADERS,
} from "./API";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";

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

const mockTeamData = [
  {
    id: 1,
    user: {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    },
    employees: [
      {
        id: 2,
        user: {
          id: 2,
          username: "user2",
          email: "user2@example.com",
        },
      },
    ],
  },
];

// Setup MSW server for mocking HTTP requests
const server = setupServer(
  // Mock GET request for tasks
  rest.get(`${API_LIST}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTasks));
  }),

  // Mock GET request for a specific task
  rest.get(`${API_LIST}/1`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTasks[0]));
  }),

  // Mock POST request for creating a task
  rest.post(`${API_LIST}`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.set("location", `${API_LIST}/3`),
      ctx.json({})
    );
  }),

  // Mock PUT request for updating a task
  rest.put(`${API_LIST}/1`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        title: "Updated Task 1",
        description: "Updated Description for Task 1",
        estimatedTime: 6,
        done: 1,
        story_Points: 3,
        moduleId: 1,
        actualTime: 7,
      })
    );
  }),

  // Mock DELETE request for deleting a task
  rest.delete(`${API_LIST}/1`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Mock GET request for employees
  rest.get(API_EMPLOYEES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockEmployees));
  }),

  // Mock GET request for modules
  rest.get(API_MODULES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockModules));
  }),

  // Mock GET request for team data
  rest.get(API_TEAM_DATA, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTeamData));
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("API Module", () => {
  // Test API constants
  test("API constants are defined correctly", () => {
    expect(API_LIST).toBe("/todolist");
    expect(API_EMPLOYEES).toBe("/employees");
    expect(API_MODULES).toBe("/modules");
    expect(API_TEAM_DATA).toBe("/employees/1/employees");
    expect(API_HEADERS).toEqual({
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    });
  });

  // Test GET request for tasks
  test("fetches tasks successfully", async () => {
    const response = await fetch(API_LIST, {
      headers: API_HEADERS,
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data).toEqual(mockTasks);
  });

  // Test GET request for a specific task
  test("fetches a specific task successfully", async () => {
    const response = await fetch(`${API_LIST}/1`, {
      headers: API_HEADERS,
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data).toEqual(mockTasks[0]);
  });

  // Test POST request for creating a task
  test("creates a task successfully", async () => {
    const newTask = {
      title: "New Task",
      description: "Description for New Task",
      estimatedTime: 10,
      done: 0,
      story_Points: 5,
      moduleId: 1,
      responsible: 1,
    };

    const response = await fetch(API_LIST, {
      method: "POST",
      headers: API_HEADERS,
      body: JSON.stringify(newTask),
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(201);

    const location = response.headers.get("location");
    expect(location).toBe(`${API_LIST}/3`);
  });

  // Test PUT request for updating a task
  test("updates a task successfully", async () => {
    const updatedTask = {
      title: "Updated Task 1",
      description: "Updated Description for Task 1",
      estimatedTime: 6,
      done: 1,
      story_Points: 3,
      moduleId: 1,
      actualTime: 7,
    };

    const response = await fetch(`${API_LIST}/1`, {
      method: "PUT",
      headers: API_HEADERS,
      body: JSON.stringify(updatedTask),
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.title).toBe("Updated Task 1");
    expect(data.description).toBe("Updated Description for Task 1");
    expect(data.estimatedTime).toBe(6);
    expect(data.done).toBe(1);
    expect(data.actualTime).toBe(7);
  });

  // Test DELETE request for deleting a task
  test("deletes a task successfully", async () => {
    const response = await fetch(`${API_LIST}/1`, {
      method: "DELETE",
      headers: API_HEADERS,
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(204);
  });

  // Test GET request for employees
  test("fetches employees successfully", async () => {
    const response = await fetch(API_EMPLOYEES, {
      headers: API_HEADERS,
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data).toEqual(mockEmployees);
  });

  // Test GET request for modules
  test("fetches modules successfully", async () => {
    const response = await fetch(API_MODULES, {
      headers: API_HEADERS,
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data).toEqual(mockModules);
  });

  // Test GET request for team data
  test("fetches team data successfully", async () => {
    const response = await fetch(API_TEAM_DATA, {
      headers: API_HEADERS,
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data).toEqual(mockTeamData);
  });

  // Test error handling
  test("handles API errors correctly", async () => {
    // Override the handler for this test to simulate an error
    server.use(
      rest.get(`${API_LIST}`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );

    const response = await fetch(API_LIST, {
      headers: API_HEADERS,
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.message).toBe("Server error");
  });
});
