import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Select, SelectProps } from "./select";

describe("Select", () => {
  const defaultProps: SelectProps<string> = {
    name: "test-select",
    options: ["option1", "option2", "option3"],
    value: "option1",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with all options and display current value", () => {
    render(<Select {...defaultProps} />);

    const selectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveAttribute("name", "test-select");
    expect(selectElement.value).toBe("option1");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("option1");
    expect(options[1]).toHaveTextContent("option2");
    expect(options[2]).toHaveTextContent("option3");
  });

  it("should call onChange when a new option is selected", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const selectElement = screen.getByRole("combobox");
    await user.selectOptions(selectElement, "option2");

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith("option2");
  });

  it("should update when value prop changes", () => {
    const { rerender } = render(<Select {...defaultProps} value="option1" />);
    let selectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement.value).toBe("option1");

    rerender(<Select {...defaultProps} value="option2" />);
    selectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement.value).toBe("option2");
  });
});
