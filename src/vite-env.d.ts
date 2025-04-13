
/// <reference types="vite/client" />

interface Window {
  Capacitor?: {
    isNative?: boolean;
    getPlatform?(): string;
    convertFileSrc?(path: string): string;
    isPluginAvailable?(pluginName: string): boolean;
    registerPlugin?(pluginName: string, jsImplementation?: any): any;
  };
}
