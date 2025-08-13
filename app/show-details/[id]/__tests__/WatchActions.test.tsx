import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WatchActions from "../WatchActions";

describe("WatchActions", () => {
  it("toggles add/remove based on inWatchlist and triggers callbacks", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(async () => {});
    const onRemove = vi.fn(async () => {});
    const onWatched = vi.fn(async () => {});
    const onClearWatched = vi.fn(async () => {});
    const onInterest = vi.fn(async () => {});
    const onToggleWaiting = vi.fn(async () => {});

    const {rerender} = render(
      <WatchActions
        inWatchlist={false}
        onAdd={onAdd}
        onRemove={onRemove}
        onWatched={onWatched}
        onClearWatched={onClearWatched}
        onInterest={onInterest}
        onToggleWaiting={onToggleWaiting}
      />
    );
    await user.click(screen.getByRole("button", {name: "+ Watchlist"}));
    expect(onAdd).toHaveBeenCalled();

    rerender(
      <WatchActions
        inWatchlist={true}
        onAdd={onAdd}
        onRemove={onRemove}
        onWatched={onWatched}
        onClearWatched={onClearWatched}
        onInterest={onInterest}
        onToggleWaiting={onToggleWaiting}
      />
    );
    await user.click(
      screen.getByRole("button", {name: "Remove from Watchlist"})
    );
    expect(onRemove).toHaveBeenCalled();

    await user.click(screen.getByRole("button", {name: "Mark Watched"}));
    expect(onWatched).toHaveBeenCalled();
    await user.click(screen.getByRole("button", {name: "Unmark Watched"}));
    expect(onClearWatched).toHaveBeenCalled();
    await user.click(screen.getByRole("button", {name: "Low"}));
    expect(onInterest).toHaveBeenCalledWith("LOW");
    await user.click(screen.getByRole("button", {name: "Clear"}));
    expect(onInterest).toHaveBeenCalledWith(null);
    await user.click(screen.getByRole("button", {name: "Toggle Waiting"}));
    expect(onToggleWaiting).toHaveBeenCalled();
  });
});
