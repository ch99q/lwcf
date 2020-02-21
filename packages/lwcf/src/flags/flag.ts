export interface Flag {
  char?: string;
  type?: "string" | "boolean"
}

export interface Flags {
  [key: string]: Flag;
}
