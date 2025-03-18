"use client";

import { useState } from "react";

interface StarProps {
  filled: boolean;
  hovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function Star({ filled, hovered, onClick, onMouseEnter }: StarProps) {
  return (
    <button
      className="focus:outline-none"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-8 h-8 transition-colors ${
          filled || hovered ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}

interface MangaRatingProps {
  mangaId: string;
  initialRating?: number;
}

export default function MangaRating({
  mangaId,
  initialRating = 0,
}: MangaRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = (value: number) => {
    setRating(value);
    setHasRated(true);
    // TODO: Envoyer la note au backend
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1" onMouseLeave={() => setHoveredRating(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              filled={value <= rating}
              hovered={value <= hoveredRating}
              onClick={() => handleRate(value)}
              onMouseEnter={() => setHoveredRating(value)}
            />
          ))}
        </div>
        {hasRated ? (
          <p className="text-sm text-green-600">Merci pour votre note !</p>
        ) : (
          <p className="text-sm text-gray-500">Cliquez pour noter</p>
        )}
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{rating.toFixed(1)}</div>
        <div className="text-sm text-gray-500">Votre note</div>
      </div>
    </div>
  );
}
