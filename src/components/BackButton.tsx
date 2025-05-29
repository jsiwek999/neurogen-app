"use client";
import { useRouter } from "next/navigation";
import "./BackButton.css";

export default function BackButton() {
  const router = useRouter();

  return (
    <button className="back-button" onClick={() => router.push("/portal-room")}>
      ⬅ Return to Portal Room
    </button>
  );
}
