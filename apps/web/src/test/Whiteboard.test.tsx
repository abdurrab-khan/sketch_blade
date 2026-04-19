import { describe, it, expect, jest } from "@jest/globals";
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Whiteboard from "../pages/file/components/Whiteboard";

jest.mock("@tldraw/sync", () => ({
  useSync: jest.fn(() => ({ store: null })),
}));

jest.mock("tldraw", () => ({
  Tldraw: () =>
    require("react").createElement("div", { "data-testid": "tldraw-canvas" }, "Mock TLDraw"),
}));

jest.mock("socket.io-client", () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    connect: jest.fn(),
    connected: false,
  })),
}));

jest.mock("../utils/socket", () => ({
  socketIoToTldrawSocket: jest.fn(() => ({ connectionStatus: "offline" })),
  multiplayerAssets: {},
}));

jest.mock("../hooks/useTheme", () => jest.fn(() => false));

jest.mock("../pages/file/components/ui-zone/components", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock("../pages/file/components/whitboard/ActivityFeed", () => ({
  default: () => null,
}));

jest.mock("../pages/file/components/whitboard/StoreSnapshot", () => ({
  default: () => null,
}));

const mockFile = {
  role: "edit",
  name: "Test File",
  isLocked: false,
};

describe("Whiteboard Component", () => {
  it("should return empty fragment when store is not ready", () => {
    const { container } = render(
      <Provider store={store}>
        <Whiteboard id="file123" file={mockFile as any} token="tok123" />
      </Provider>,
    );

    // When useSync returns { store: null }, the component renders an empty fragment
    expect(container.firstChild).toBeNull();
  });
});
