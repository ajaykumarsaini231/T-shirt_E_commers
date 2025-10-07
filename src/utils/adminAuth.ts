import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("Authorization")?.value; // ✅ match backend cookie name

    if (!token) {
      console.warn("❌ No token found in cookies");
      redirect("/login");
    }

    const res = await fetch("http://localhost:3001/api/auth/verify", {
      method: "GET",
      headers: {
        Authorization: token, // ✅ backend already includes "Bearer"
      },
      credentials: "include", // ✅ send cookies
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("❌ Token verification failed:", res.status);
      redirect("/login");
    }

    const data = await res.json();

    if (!data?.user || !data.user.email) {
      console.warn("❌ Invalid user data from verify");
      redirect("/login");
    }

    if (data.user.role !== "admin" && data.user.role !== "superadmin") {
      console.warn("❌ Not authorized:", data.user.role);
      redirect("/");
    }

    console.log("✅ Admin verified:", data.user.email);
    return data.user;
  } catch (error) {
    console.error("❌ Admin auth error:", error);
    redirect("/login");
  }
}
