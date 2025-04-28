import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
    render(
      <DashboardInput
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
      />
    );

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("Sprint 1")).toBeInTheDocument();
    });

    // Check if input fields are displayed
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByText("Responsible")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Story Points")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Sprint")).toBeInTheDocument();

    // Check if add button is displayed
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  // Test form submission with valid data
  test("submits form with valid data", async () => {
    render(
      <DashboardInput
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
      />
    );

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("Sprint 1")).toBeInTheDocument();
    });

    // Fill in the form
    const titleInput = screen.getByPlaceholderText("Title");
    userEvent.type(titleInput, "New Task");

    const descriptionInput = screen.getByPlaceholderText("Description");
    userEvent.type(descriptionInput, "Description for New Task");

    const responsibleSelect = screen.getByText("Responsible");
    userEvent.selectOptions(responsibleSelect, "1");

    const storyPointsInput = screen.getByPlaceholderText("Story Points");
    userEvent.type(storyPointsInput, "5");

    const hoursInput = screen.getByPlaceholderText("Hours");
    userEvent.type(hoursInput, "10");

    const moduleSelect = screen.getByText("Sprint");
    userEvent.selectOptions(moduleSelect, "1");

    // Submit the form
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // Check if addItem was called with the correct parameters
    expect(mockAddItem).toHaveBeenCalledWith({
      title: "New Task",
      description: "Description for New Task",
      story_Points: "5",
      estimatedTime: "10",
      done: 0,
      moduleId: 1,
      responsible: "1",
    });

    // Check if form fields are cleared
    expect(titleInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
    expect(storyPointsInput.value).toBe("");
    expect(hoursInput.value).toBe("");
  });

  // Test form submission with invalid data
  test("does not submit form with invalid data", async () => {
    render(
      <DashboardInput
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
      />
    );

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("Sprint 1")).toBeInTheDocument();
    });

    // Fill in the form without selecting a responsible person
    const titleInput = screen.getByPlaceholderText("Title");
    userEvent.type(titleInput, "New Task");

    const descriptionInput = screen.getByPlaceholderText("Description");
    userEvent.type(descriptionInput, "Description for New Task");

    const storyPointsInput = screen.getByPlaceholderText("Story Points");
    userEvent.type(storyPointsInput, "5");

    const hoursInput = screen.getByPlaceholderText("Hours");
    userEvent.type(hoursInput, "10");

    const moduleSelect = screen.getByText("Sprint");
    userEvent.selectOptions(moduleSelect, "1");

    // Submit the form
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // Check if addItem was not called
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  // Test form submission when isInserting is true
  test("does not submit form when isInserting is true", async () => {
    render(
      <DashboardInput
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={true}
      />
    );

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("Sprint 1")).toBeInTheDocument();
    });

    // Fill in the form
    const titleInput = screen.getByPlaceholderText("Title");
    userEvent.type(titleInput, "New Task");

    const descriptionInput = screen.getByPlaceholderText("Description");
    userEvent.type(descriptionInput, "Description for New Task");

    const responsibleSelect = screen.getByText("Responsible");
    userEvent.selectOptions(responsibleSelect, "1");

    const storyPointsInput = screen.getByPlaceholderText("Story Points");
    userEvent.type(storyPointsInput, "5");

    const hoursInput = screen.getByPlaceholderText("Hours");
    userEvent.type(hoursInput, "10");

    const moduleSelect = screen.getByText("Sprint");
    userEvent.selectOptions(moduleSelect, "1");

    // Submit the form
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // Check if addItem was not called
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  // Test enter key functionality
  test("submits form when enter key is pressed", async () => {
    render(
      <DashboardInput
        employeesList={mockEmployees}
        addItem={mockAddItem}
        isInserting={false}
      />
    );

    // Wait for modules to be loaded
    await waitFor(() => {
      expect(screen.getByText("Sprint 1")).toBeInTheDocument();
    });

    // Fill in the form
    const titleInput = screen.getByPlaceholderText("Title");
    userEvent.type(titleInput, "New Task");

    const descriptionInput = screen.getByPlaceholderText("Description");
    userEvent.type(descriptionInput, "Description for New Task");

    const responsibleSelect = screen.getByText("Responsible");
    userEvent.selectOptions(responsibleSelect, "1");

    const storyPointsInput = screen.getByPlaceholderText("Story Points");
    userEvent.type(storyPointsInput, "5");

    const hoursInput = screen.getByPlaceholderText("Hours");
    userEvent.type(hoursInput, "10");

    const moduleSelect = screen.getByText("Sprint");
    userEvent.selectOptions(moduleSelect, "1");

    // Press enter in the hours input
    fireEvent.keyDown(hoursInput, { key: "Enter" });

    // Check if addItem was called with the correct parameters
    expect(mockAddItem).toHaveBeenCalledWith({
      title: "New Task",
      description: "Description for New Task",
      story_Points: "5",
      estimatedTime: "10",
      done: 0,
      moduleId: 1,
      responsible: "1",
    });
  });
});
