import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Module } from '@/types';

interface ModuleState {
  selectedModule: Module | null;
}

const initialState: ModuleState = {
  selectedModule: null,
};

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    setSelectedModule: (state, action: PayloadAction<Module | null>) => {
      state.selectedModule = action.payload;
    },
  },
});

export const { setSelectedModule } = moduleSlice.actions;
export default moduleSlice.reducer;
