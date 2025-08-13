import {render, screen} from "@testing-library/react";
import HeroImage from "../../features/HeroImage";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img data-testid="hero-img" {...props} />;
  },
}));

describe("HeroImage", () => {
  it("returns null when no path", () => {
    const {container} = render(<HeroImage backdropPath={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders image when path present", () => {
    render(<HeroImage backdropPath="/back.jpg" />);
    expect(screen.getByTestId("hero-img")).toBeInTheDocument();
  });
});
