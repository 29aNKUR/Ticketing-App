"use client";
import { useState, useEffect, ChangeEvent } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  delay?: number;
}

export default function SearchBar({ onSearch, delay = 300 }: SearchBarProps) {
  const [q, setQ] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => onSearch(q), delay);
    return () => clearTimeout(handler);
  }, [q, delay, onSearch]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQ(e.target.value);
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
      <input
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
        placeholder="Search tickets by title or description..."
        value={q}
        onChange={handleChange}
      />
      <span className="text-xs text-gray-400">Debounce: {delay}ms</span>
    </div>
  );
}
