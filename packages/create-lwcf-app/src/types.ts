export interface App {
  root: string;
  name: string;

  example?: string;
  
  settings: {
    manager: "npm" | "yarn";
  };
}
