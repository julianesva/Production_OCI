import React from "react";
import { render, screen, waitFor } from "@/test";
import userEvent from "@testing-library/user-event";
import DashboardRealHours from "../DashboardRealHours";

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
    expect(screen.getByText("Set Real Hours")).toBeInTheDocument();
    expect(screen.getByLabelText("Real Hours:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("calls confirm_Real_Hours with input value when Confirm button is clicked", () => {
    render(
      <DashboardRealHours
        isHidden={mockSetIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Enter real hours
    const realHoursInput = screen.getByLabelText("Real Hours:");
    userEvent.type(realHoursInput, "10");

    // Click Confirm button
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    userEvent.click(confirmButton);

    // Check if confirm_Real_Hours was called with the correct value
    expect(mockConfirmRealHours).toHaveBeenCalledWith("10");
    expect(mockSetIsHidden).toHaveBeenCalledWith(true);
  });

  test("calls setIsHidden with true when Cancel button is clicked", () => {
    render(
      <DashboardRealHours
        isHidden={mockSetIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Click Cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    userEvent.click(cancelButton);

    // Check if setIsHidden was called with true
    expect(mockSetIsHidden).toHaveBeenCalledWith(true);
    expect(mockConfirmRealHours).not.toHaveBeenCalled();
  });

  test("validates input to ensure it is a positive number", () => {
    render(
      <DashboardRealHours
        isHidden={mockSetIsHidden}
        confirm_Real_Hours={mockConfirmRealHours}
      />
    );

    // Enter invalid real hours (negative number)
    const realHoursInput = screen.getByLabelText("Real Hours:");
    userEvent.type(realHoursInput, "-5");

    // Click Confirm button
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    userEvent.click(confirmButton);

    // Check if confirm_Real_Hours was not called
    expect(mockConfirmRealHours).not.toHaveBeenCalled();

    // Enter valid real hours
    userEvent.clear(realHoursInput);
    userEvent.type(realHoursInput, "5");

    // Click Confirm button
    userEvent.click(confirmButton);

    // Check if confirm_Real_Hours was called with the correct value
    expect(mockConfirmRealHours).toHaveBeenCalledWith("5");
  });
});
