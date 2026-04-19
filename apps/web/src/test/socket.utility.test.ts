import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("tldraw", () => ({
  uniqueId: jest.fn(() => "mock-id"),
}));

jest.mock("@tldraw/sync", () => ({}));

jest.mock("socket.io-client", () => ({}));

import { socketIoToTldrawSocket } from "../utils/socket";

// Helper to create a mock Socket.IO instance with an event emitter
function createMockSocketIO() {
  const listeners: Record<string, Function[]> = {};
  return {
    connected: true,
    emit: jest.fn(),
    on: jest.fn((event: string, handler: Function) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    }),
    off: jest.fn(),
    disconnect: jest.fn(),
    connect: jest.fn(),
    /** Helper to trigger registered socket events in tests */
    trigger: (event: string, ...args: any[]) => {
      (listeners[event] || []).forEach((fn) => fn(...args));
    },
  };
}

describe("socketIoToTldrawSocket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start with offline connection status", () => {
    const mockSocket = createMockSocketIO();
    const tldrawSocket = socketIoToTldrawSocket(mockSocket as any);

    expect(tldrawSocket.connectionStatus).toBe("offline");
  });

  it("should emit tldraw-message when sendMessage is called", () => {
    const mockSocket = createMockSocketIO();
    const tldrawSocket = socketIoToTldrawSocket(mockSocket as any);

    const msg = { type: "push", data: {} };
    tldrawSocket.sendMessage(msg as any);

    expect(mockSocket.emit).toHaveBeenCalledWith("tldraw-message", JSON.stringify(msg));
  });

  it("should update connectionStatus to online when socket connects", () => {
    const mockSocket = createMockSocketIO();
    const tldrawSocket = socketIoToTldrawSocket(mockSocket as any);

    const statusListener = jest.fn();
    tldrawSocket.onStatusChange(statusListener);

    mockSocket.trigger("connect");

    expect(tldrawSocket.connectionStatus).toBe("online");
    expect(statusListener).toHaveBeenCalledWith({ status: "online" });
  });

  it("should update connectionStatus to offline on disconnect", () => {
    const mockSocket = createMockSocketIO();
    const tldrawSocket = socketIoToTldrawSocket(mockSocket as any);

    // First connect, then disconnect
    mockSocket.trigger("connect");
    expect(tldrawSocket.connectionStatus).toBe("online");

    mockSocket.trigger("disconnect");
    expect(tldrawSocket.connectionStatus).toBe("offline");
  });
});
