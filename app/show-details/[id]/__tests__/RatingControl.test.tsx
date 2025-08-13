import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RatingControl from "../RatingControl";

describe("RatingControl", () => {
  it("renders 10 stars and toggles off when clicking same value", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn(async () => {});
    const onClear = vi.fn(async () => {});
    render(<RatingControl initial={3} onSave={onSave} onClear={onClear} />);
    const stars = screen.getAllByRole("button");
    expect(stars).toHaveLength(10);
    await user.click(screen.getByLabelText("Rate 3"));
    await new Promise((r) => setTimeout(r, 0));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });
});
