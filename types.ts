
export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  MENU = 'MENU',
  CHAT = 'CHAT',
  ADMIN = 'ADMIN',
  PLACEHOLDER = 'PLACEHOLDER'
}

export type Language = 'ms' | 'en'; // Defaulting to MS as per design

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: any; // Lucide icon component
  color: string; // For the icon or accent
  action?: () => void;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface StoryData {
  title: string;
  content: string;
  moral: string;
  visualPrompt: string;
}
