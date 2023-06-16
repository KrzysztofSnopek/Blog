import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  test("renders a specific element in the DOM", () => {
    render(<Navbar />);
    // screen.debug();
    const specificElement = screen.getByText("Main");

    expect(specificElement).toBeInTheDocument();
  });
});
