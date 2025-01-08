/* eslint-disable semi */
import Response from "@/types/response";

export default interface SigninResponse extends Response {
    token: string;
    refreshToken: string | null;
}