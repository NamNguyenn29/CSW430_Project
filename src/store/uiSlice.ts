import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';
type Language = 'vi' | 'en';

interface UIState {
  theme: Theme;
  language: Language;
}

const initialState: UIState = {
  theme: 'light',
  language: 'vi',
};

export const loadUISettings = createAsyncThunk('ui/loadSettings', async () => {
  try {
    const savedTheme = await AsyncStorage.getItem('theme');
    const savedLang = await AsyncStorage.getItem('language');
    return {
      theme: (savedTheme as Theme) || 'light',
      language: (savedLang as Language) || 'vi',
    };
  } catch (e) {
    return initialState;
  }
});

export const toggleTheme = createAsyncThunk('ui/toggleTheme', async (_, { getState }) => {
  const currentTheme = (getState() as any).ui.theme;
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  await AsyncStorage.setItem('theme', nextTheme);
  return nextTheme;
});

export const setLanguage = createAsyncThunk('ui/setLanguage', async (lang: Language) => {
  await AsyncStorage.setItem('language', lang);
  return lang;
});

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUISettings.fulfilled, (state, action) => {
        state.theme = action.payload.theme;
        state.language = action.payload.language;
      })
      .addCase(toggleTheme.fulfilled, (state, action: PayloadAction<Theme>) => {
        state.theme = action.payload;
      })
      .addCase(setLanguage.fulfilled, (state, action: PayloadAction<Language>) => {
        state.language = action.payload;
      });
  },
});

export default uiSlice.reducer;
