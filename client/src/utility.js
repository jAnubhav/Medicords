// import { doSomething } from "./utility";

const isAuth = () => localStorage.getItem("auth-token");

const formatId = aadharId => (
    aadharId.substring(0, 4) +
    aadharId.substring(5, 9) +
    aadharId.substring(10, 14)
);

export { isAuth, formatId };