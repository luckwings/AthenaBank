import { ErrCodeMsgs } from "./error-helper";

export function snackbarMsg(msg: string, severity = "info") {
  return JSON.stringify({ text: msg, severity });
}
export function snackbarSuccessMsg(msg: string) {
  return snackbarMsg(`${msg} Successful`, "success");
}
export function snackbarErrorMsg(err, msg: string) {
  const prebuildMsg = ErrCodeMsgs[err.code];
  if (prebuildMsg) {
    return snackbarMsg(prebuildMsg, "error");
  } else {
    return snackbarMsg(`Error while ${msg}. Please try again.`, "error");
  }
}
