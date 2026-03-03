import { describe, it, expect } from '@jest/globals';
import authReducer, { addUser, getUser } from '../redux/slices/authSlice';

describe('Auth Slice', () => {
  const initialState = { _id: '', name: '', email: '', clerkId: '' };

  it('should return the initial state when called with undefined state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add user data when addUser is dispatched', () => {
    const userData = {
      _id: 'mongo_abc',
      name: 'Jane Doe',
      email: 'jane@test.com',
      clerkId: 'clerk_xyz',
    };

    const state = authReducer(initialState, addUser(userData));

    expect(state._id).toBe('mongo_abc');
    expect(state.name).toBe('Jane Doe');
    expect(state.email).toBe('jane@test.com');
    expect(state.clerkId).toBe('clerk_xyz');
  });

  it('should merge new fields without wiping old ones', () => {
    const existing = {
      _id: 'old_id',
      name: 'Old',
      email: 'old@test.com',
      clerkId: 'old_clerk',
    };
    const update = { name: 'New Name' };

    const state = authReducer(existing, addUser(update));

    expect(state.name).toBe('New Name');
    expect(state._id).toBe('old_id');
    expect(state.email).toBe('old@test.com');
    expect(state.clerkId).toBe('old_clerk');
  });

  it('should return current state when getUser is dispatched', () => {
    const current = { _id: 'abc', name: 'Test', email: 't@t.com', clerkId: 'c1' };
    expect(authReducer(current, getUser())).toEqual(current);
  });
});
