declare module 'vite' {
    interface UserConfigExport {
      serviceWorker?: {
        src?: string;
      };
    }
}
  