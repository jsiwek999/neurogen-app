"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr"; // adjust if you're using @supabase/auth-helpers-nextjs

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export default function ReflectionsPage() {
  const [input, setInput] = useState("");
  const [reflections, setReflections] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Auth error:", error.message);
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // Load reflections
  useEffect(() => {
    const fetchReflections = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("Reflection")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error.message);
        setError("Could not load reflections.");
      } else {
        setReflections(data);
        console.log("Fetched reflections:", data);
      }
    };

    fetchReflections();
  }, [user]);

  const handleSubmit = async () => {
    if (!input.trim() || !user) return;

    const reflection = {
      user_id: user.id,
      email: user.email,
      content: input,
    };

    console.log("Submitting reflection:", reflection);

    const { data, error } = await supabase
      .from("Reflection")
      .insert([reflection])
      .select();

    if (error) {
      console.error("Insert error:", error.message);
      setError("Failed to save reflection.");
    } else {
      setReflections((prev) => [...data, ...prev]);
      setInput("");
    }
  };

  const removeOne = async (id: string) => {
    const { error } = await supabase
      .from("Reflection")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      setError("Failed to delete reflection.");
    } else {
      setReflections((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const clearAll = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("Reflection")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Clear error:", error.message);
      setError("Failed to clear reflections.");
    } else {
      setReflections([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Reflection Journal</h1>

      {error && <div className="bg-red-500 p-2 rounded mb-4">{error}</div>}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 mb-4 text-black rounded"
      />

      <div className="flex gap-3 mb-6">
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Submit
        </button>
        <button onClick={clearAll} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          Clear All Reflections
        </button>
      </div>

      <h2 className="text-xl mb-3">📝 Past Reflections</h2>
      <ul className="space-y-3">
        {reflections.map((r) => (
          <li key={r.id} className="bg-gray-800 p-3 rounded flex justify-between">
            <div>
              <p>{r.content}</p>
              <span className="text-xs text-gray-400">
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => removeOne(r.id)}
              className="text-sm text-red-400 hover:underline ml-4"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
