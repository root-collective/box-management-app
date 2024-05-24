export const environment = {
    production: false,
    apiUrl: (window as any)["env"]["apiUrl"] || "default",
    debug: (window as any)["env"]["debug"] || false
};