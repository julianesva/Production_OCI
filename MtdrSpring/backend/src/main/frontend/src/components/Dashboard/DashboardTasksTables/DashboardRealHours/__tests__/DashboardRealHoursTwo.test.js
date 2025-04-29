import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'; // This line is crucial
import DashboardRealHours from "../DashboardRealHours";

//CHECK WHY WE HAVE TWO EQUAL FILES

describe("DashboardRealHours Component", () => {
  const mockConfirmRealHours = jest.fn();
  const mockSetIsHidden = jest.fn();

  beforeEach(() => {
    mockConfirmRealHours.mockReset();
    mockSetIsHidden.mockReset();
  });

  test("renders real hours input form", () => {
    render(
      <DashboardRealHours
        isHidden={mockSetIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Check if form elements are rendered
    expect(screen.getByText("Task Completion Time")).toBeInTheDocument();
    expect(screen.getByText("Actual Time (hours)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("calls confirm_Real_Hours with input value when Save button is clicked", async () => {
    // Setup user event
    const user = userEvent.setup();

    render(
      <DashboardRealHours
        isHidden={mockSetIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Enter real hours
    const realHoursInput = screen.getByPlaceholderText("Real Hours");
    await user.type(realHoursInput, "10");

    // Click Save button
    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    // Check if confirm_Real_Hours was called with the correct value
    expect(mockConfirmRealHours).toHaveBeenCalledWith("10");
    expect(mockSetIsHidden).toHaveBeenCalledWith(false);
  });

  test("calls setIsHidden with true when Cancel button is clicked", async () => {
    // Setup user event
    const user = userEvent.setup();
    
    render(
      <DashboardRealHours
        isHidden={mockSetIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Click Cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    // Check if setIsHidden was called with true
    expect(mockSetIsHidden).toHaveBeenCalledWith(true);
    expect(mockConfirmRealHours).not.toHaveBeenCalled();
  });
});