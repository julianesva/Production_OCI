import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DashboardRealHours from "./DashboardRealHours";

describe("DashboardRealHours Component", () => {
  // Mock functions
  const mockIsHidden = jest.fn();
  const mockConfirmRealHours = jest.fn();

  beforeEach(() => {
    // Reset mock functions
    mockIsHidden.mockReset();
    mockConfirmRealHours.mockReset();
  });

  // Test rendering of the component
  test("renders the component with correct elements", () => {
    render(
      <DashboardRealHours
        isHidden={mockIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Check if title and description are displayed
    expect(screen.getByText("Task Completion Time")).toBeInTheDocument();
    expect(
      screen.getByText("How many hours did it takes to complete this task?")
    ).toBeInTheDocument();

    // Check if input field is displayed
    expect(screen.getByPlaceholderText("Real Hours")).toBeInTheDocument();

    // Check if buttons are displayed
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  // Test input field functionality
  test("updates input value when user types", async () => {
    const user = userEvent.setup();
    
    render(
      <DashboardRealHours
        isHidden={mockIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Get the input field
    const input = screen.getByPlaceholderText("Real Hours");

    // Type a value
    await user.type(input, "5");

    // Check if the input value is updated
    expect(input.value).toBe("5");
  });

  // Test cancel button functionality
  test("calls isHidden when cancel button is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <DashboardRealHours
        isHidden={mockIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Get the cancel button
    const cancelButton = screen.getByText("Cancel");

    // Click the cancel button
    await user.click(cancelButton);

    // Check if isHidden was called with true
    expect(mockIsHidden).toHaveBeenCalledWith(true);
  });

  // Test save button functionality
  test("calls confirm_Real_Hours when save button is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <DashboardRealHours
        isHidden={mockIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Get the input field and save button
    const input = screen.getByPlaceholderText("Real Hours");
    const saveButton = screen.getByText("Save");

    // Type a value
    await user.type(input, "5");

    // Click the save button
    await user.click(saveButton);

    // Check if confirm_Real_Hours was called with the input value
    expect(mockConfirmRealHours).toHaveBeenCalledWith("5");
  });

  // Test enter key functionality
  test("calls confirm_Real_Hours when enter key is pressed", async () => {
    const user = userEvent.setup();
    
    render(
      <DashboardRealHours
        isHidden={mockIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Get the input field
    const input = screen.getByPlaceholderText("Real Hours");

    // Type a value and press enter
    await user.type(input, "5{enter}");

    // Check if confirm_Real_Hours was called with the input value
    expect(mockConfirmRealHours).toHaveBeenCalledWith("5");
  });

  // Test initial state
  test("initializes with default value of 0", () => {
    render(
      <DashboardRealHours
        isHidden={mockIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Get the input field
    const input = screen.getByPlaceholderText("Real Hours");

    // Check if the input value is initialized to 0
    expect(input.value).toBe("0");
  });
});
