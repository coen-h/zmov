"use client";
import { supabase } from "@/utils/supabase";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error with Google login:", error.message);
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center bg-[radial-gradient(circle_at_top,_#382222_0%,_transparent_70%)]">
      <div className="flex">
        <p className="text-4xl font-semibold pr-2 mr-2 border-r-2">Login</p>
        <p className="text-4xl font-semibold">Signup</p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 bg-neutral-600 text-white rounded cursor-pointer hover:bg-neutral-700"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
