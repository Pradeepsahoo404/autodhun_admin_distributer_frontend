import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '@/types';

interface RoleState {
  selectedRole: Role | null;
}

const initialState: RoleState = {
  selectedRole: null,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
  },
});

export const { setSelectedRole } = roleSlice.actions;
export default roleSlice.reducer;
