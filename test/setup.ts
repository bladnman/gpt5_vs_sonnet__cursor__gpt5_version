import "@testing-library/jest-dom";
import {cleanup} from "@testing-library/react";
import React from "react";
import {afterEach, vi} from "vitest";

// Next.js specific: mock next/image to behave like a normal img in tests
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({priority: _priority, ...rest}: any) =>
    React.createElement("img", rest),
}));

// JSDOM does not implement scrollTo
// @ts-expect-error add stub
window.scrollTo = () => {};

afterEach(() => {
  cleanup();
});
