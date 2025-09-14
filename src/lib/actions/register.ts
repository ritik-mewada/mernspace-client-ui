"use server";
import cookie from "cookie";
import { cookies } from "next/headers";

export default async function register(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/auth/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.log("error", error);
      return {
        type: "error",
        message: error.errors[0].msg,
      };
    }

    const c = response.headers.getSetCookie();
    const accessToken = c.find((cookie) => cookie.includes("accessToken"));
    const refreshToken = c.find((cookie) => cookie.includes("refreshToken"));

    if (!accessToken || !refreshToken) {
      return {
        type: "error",
        message: "No cookies were found!",
      };
    }

    const parsedAccessToken = cookie.parse(accessToken);
    const parsedRefreshToken = cookie.parse(refreshToken);

    (await cookies()).set({
      name: "accessToken",
      value: parsedAccessToken.accessToken!,
      expires: new Date(parsedAccessToken.expires!),
      httpOnly: (parsedAccessToken.httpOnly as unknown as boolean) || true,
      path: parsedAccessToken.Path,
      domain: parsedAccessToken.Domain,
      sameSite: parsedAccessToken.SameSite as "strict",
    });

    (await cookies()).set({
      name: "refreshToken",
      value: parsedRefreshToken.refreshToken!,
      expires: new Date(parsedRefreshToken.expires!),
      httpOnly: (parsedRefreshToken.httpOnly as unknown as boolean) || true,
      path: parsedRefreshToken.Path,
      domain: parsedRefreshToken.Domain,
      sameSite: parsedRefreshToken.SameSite as "strict",
    });

    return {
      type: "success",
      message: "Register successful!",
    };
  } catch (err: any) {
    return {
      type: "error",
      message: err.message,
    };
  }
}
