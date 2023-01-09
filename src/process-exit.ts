import system from "system";

export const exit = (code = 0) => {
  system.exit(code);
};
