type ToastType = "error" | "success";

export type Toast = {
  type: ToastType;
  message: string;
};
