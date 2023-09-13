import { useState } from "react";

const apiLocal = "https://localhost:7017/api/";
export const apiDev = "http://sistemas.t2mlab.com:9090/";
export const apiServer = "http://sistemas.t2mlab.com:8080/";

export default { baseURL: `${apiServer}` }