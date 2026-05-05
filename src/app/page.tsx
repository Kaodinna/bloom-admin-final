"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, saveToken, getToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState("/dashboard");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
      return;
    }
    // Read redirect param from URL e.g. /?redirect=%2Fusers
    const params = new URLSearchParams(window.location.search);
    const dest = params.get("redirect");
    if (dest) setRedirect(decodeURIComponent(dest));
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminLogin(email, pass);
      if (data.response?.token) {
        saveToken(data.response.token);
        router.push(redirect);
      } else {
        setError("Invalid credentials or insufficient permissions.");
      }
    } catch {
      setError("Connection failed. Check NEXT_PUBLIC_BUBBLE_BASE_URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center w-full">
      <div className="bg-ivory rounded-[16px] border border-cream-dark p-10 w-[400px] shadow-md">
        <div className="font-serif text-[1.8rem] text-ink mb-1">
          Bloom Admin
        </div>
        <p className="text-[.78rem] text-ink-soft mb-8">
          Sign in with your admin account
        </p>

        {error && (
          <div className="bg-[#FDF0EE] border border-[#E8C8C0] rounded-[9px] px-4 py-3 text-[.76rem] text-rust mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-[.68rem] font-bold uppercase tracking-[.8px] text-ink-soft block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-cream border border-cream-dark rounded-[9px] px-4 py-3 text-[.82rem] text-ink outline-none focus:border-gold font-sans transition-colors"
              placeholder="admin@bloomapp.com"
            />
          </div>
          <div>
            <label className="text-[.68rem] font-bold uppercase tracking-[.8px] text-ink-soft block mb-1.5">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="w-full bg-cream border border-cream-dark rounded-[9px] px-4 py-3 pr-10 text-[.82rem] text-ink outline-none focus:border-gold font-sans transition-colors"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
              >
                {showPassword ? (
                  // Eye Off
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.67-1.23 1.62-2.4 2.8-3.41M9.9 4.24A10.94 10.94 0 0 1 12 5c5 0 9.27 3.89 11 7-1 1.76-2.5 3.38-4.3 4.59M1 1l22 22" />
                  </svg>
                ) : (
                  // Eye
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gold text-white font-semibold text-[.85rem] rounded-[9px] py-3 mt-2 border-none cursor-pointer hover:opacity-85 transition-opacity font-sans disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="text-[.68rem] text-ink-xs mt-6 text-center">
          Requires admin role on Bubble User record
        </p>
      </div>
    </div>
  );
}
