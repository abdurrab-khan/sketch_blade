import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import ActivityFeed from '../pages/file/components/whitboard/ActivityFeed';
import * as tldraw from 'tldraw';

jest.mock('tldraw', () => ({
  useToasts: jest.fn(() => ({ addToast: jest.fn() })),
}));

describe('ActivityFeed Component', () => {
  it('should render nothing to the DOM', () => {
    const mockStore = {
      listen: jest.fn(),
    };

    const { container } = render(<ActivityFeed store={mockStore as any} />);

    expect(container.firstChild).toBeNull();
  });

  it('should call store.listen with presence scope and remote source', () => {
    const mockStore = { listen: jest.fn() };

    render(<ActivityFeed store={mockStore as any} />);

    expect(mockStore.listen).toHaveBeenCalledWith(expect.any(Function), {
      scope: 'presence',
      source: 'remote',
    });
  });

  it('should show join toast when a user is added', () => {
    const addToast = jest.fn();
    (tldraw.useToasts as jest.Mock).mockReturnValue({ addToast });

    let capturedListener: Function = () => {};
    const mockStore = {
      listen: jest.fn((fn: Function) => {
        capturedListener = fn;
      }),
    };

    render(<ActivityFeed store={mockStore as any} />);

    capturedListener({
      changes: {
        added: { 'presence:abc': { userName: 'Alice' } },
        removed: {},
      },
    });

    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Alice joined the room.',
      }),
    );
  });
});
