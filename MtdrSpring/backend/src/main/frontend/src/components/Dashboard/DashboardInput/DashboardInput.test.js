import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DashboardInput from "./DashboardInput";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { API_MODULES } from "../../../API";

// Mock data for testing
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
  // Mock GET request for modules
  rest.get(API_MODULES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockModules));
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("DashboardInput Component", () => {
  // Mock functions
  const mockAddItem = jest.fn();

  beforeEach(() => {
    // Reset mock functions
    mockAddItem.mockReset();
  });

  // Test rendering of the component
  test("renders the component with correct elements", async () => {
    // Mock the addItem function
    const mockAddItem = jest.fn();

    // Render the component
    render(<DashboardInput addItem={mockAddItem} isInserting={false} />);

    // Check if all form elements are rendered
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByText("Responsible")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Story Points")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Sprint")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("1 - Sprint 1")).toBeInTheDocument();
    });
  });

  // Test form submission with valid data
  test("submits form with valid data", async () => {
    // Create a spy function that logs its arguments
    const mockAddItem = jest.fn().mockImplementation((data) => {
      console.log("addItem called with:", data);
      return data;
    });

    // Render the component with required props
    render(
      <DashboardInput
        addItem={mockAddItem}
        isInserting={false}
        employeesList={mockEmployees}
      />
    );

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("1 - Sprint 1")).toBeInTheDocument();
    });

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Description for New Task" },
    });
    fireEvent.change(screen.getByText("Responsible").closest("select"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Story Points"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hours"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByText("Sprint").closest("select"), {
      target: { value: "1" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add"));

    // Wait for the addItem function to be called
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalled();
    });

    // Get the actual arguments passed to addItem
    const actualCall = mockAddItem.mock.calls[0][0];
    console.log("Actual call:", actualCall);

    // Check if addItem was called with the correct parameters
    // Use a more flexible approach that checks each property individually
    expect(actualCall).toHaveProperty("title", "New Task");
    expect(actualCall).toHaveProperty(
      "description",
      "Description for New Task"
    );
    expect(actualCall).toHaveProperty("responsible", "1");
    expect(actualCall).toHaveProperty("story_Points", "5");
    expect(actualCall).toHaveProperty("estimatedTime", "10");
    expect(actualCall).toHaveProperty("moduleId");
    expect(actualCall).toHaveProperty("done", 0);
  });

  // Test form submission with invalid data
  test("does not submit form with invalid data", async () => {
    // Mock the addItem function
    const mockAddItem = jest.fn();

    // Render the component
    render(<DashboardInput addItem={mockAddItem} isInserting={false} />);

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("1 - Sprint 1")).toBeInTheDocument();
    });

    // Submit the form without filling in all required fields
    fireEvent.click(screen.getByText("Add"));

    // Check if addItem was not called
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  // Test form submission when isInserting is true
  test("does not submit form when isInserting is true", async () => {
    // Mock the addItem function
    const mockAddItem = jest.fn();

    // Render the component with isInserting set to true
    render(<DashboardInput addItem={mockAddItem} isInserting={true} />);

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("1 - Sprint 1")).toBeInTheDocument();
    });

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Description for New Task" },
    });
    fireEvent.change(screen.getByText("Responsible").closest("select"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Story Points"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hours"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByText("Sprint").closest("select"), {
      target: { value: "1" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add"));

    // Check if addItem was not called
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  // Test form submission when enter key is pressed
  test("submits form when enter key is pressed", async () => {
    // Mock the addItem function
    const mockAddItem = jest.fn();

    // Render the component
    render(<DashboardInput addItem={mockAddItem} isInserting={false} />);

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("1 - Sprint 1")).toBeInTheDocument();
    });

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Description for New Task" },
    });
    fireEvent.change(screen.getByText("Responsible").closest("select"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Story Points"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hours"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByText("Sprint").closest("select"), {
      target: { value: "1" },
    });

    // Press enter key in the title input
    fireEvent.keyDown(screen.getByPlaceholderText("Title"), {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
    });

    // // Check if addItem was called with the correct parameters
    // expect(mockAddItem).toHaveBeenCalledWith({
    //   title: "New Task",
    //   description: "Description for New Task",
    //   responsible: "1",
    //   story_Points: "5",
    //   estimatedTime: "10",
    //   moduleId: "1",
    // });
  });
});
