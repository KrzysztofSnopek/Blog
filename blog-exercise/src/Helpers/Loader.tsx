import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export function Loader() {
  return (
    <div className="bg-slate-400 min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center">
      <span className="font-bold text-2xl p-2">Loading...</span>
      <LoadingSpinner />
    </div>
  );
}
