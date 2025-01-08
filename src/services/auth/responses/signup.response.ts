/* eslint-disable semi */
import Response from "@/types/response";

export default interface SignupResponse extends Response {
    user: {
        id: string;
        email: string;
        username: string;
    }
}