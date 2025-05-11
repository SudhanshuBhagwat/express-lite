import App from "./server/index";
import { STATUS_CODE } from "./utils/status";

export default App;
export { STATUS_CODE };
export { staticPlugin } from "./plugins/static";
export { loggerPlugin } from "./plugins/logger";
