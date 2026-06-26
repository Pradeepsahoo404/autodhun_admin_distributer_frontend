import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModulePermission } from '@/types';

interface PermissionState {
  sidebarModules: ModulePermission[];
}

const initialState: PermissionState = {
  sidebarModules: [],
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setSidebarModules: (state, action: PayloadAction<ModulePermission[]>) => {
      state.sidebarModules = action.payload;
    },
  },
});

export const { setSidebarModules } = permissionSlice.actions;
export default permissionSlice.reducer;
