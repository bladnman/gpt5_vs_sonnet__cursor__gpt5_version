import {render, screen} from "@testing-library/react";
import ProviderBadge from "../../providers/ProviderBadge";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("ProviderBadge", () => {
  it("renders name and logo placeholder", () => {
    render(<ProviderBadge name="Netflix" logoPath={null} />);
    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });
});
