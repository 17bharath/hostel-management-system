"use client";

import { useState } from "react";

export default function FeedbackPage() {
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState(0);
    const [msg, setMsg] = useState("");

    const categories = [
        { label: "Food", icon: "🍽️" },
        { label: "Accommodation", icon: "🏠" },
        { label: "Laundry", icon: "👕" },
        { label: "Other", icon: "🫧" },
    ];

    async function handleSubmit(e) {
        e.preventDefault();

        if (!category || !rating) {
            alert("Please select category and rating");
            return;
        }

        const form = e.target;

        const payload = {
            name: form.name.value,
            room_number: form.room_number.value,
            category,
            rating,
            description: form.description.value,
        };

        const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        setMsg(data.message || "Feedback submitted ✅");

        form.reset();
        setCategory("");
        setRating(0);
    }

    return (
        <div className="min-h-screen bg-black text-white flex justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white text-black rounded-xl flex items-center justify-center text-3xl">
                        🏠
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">
                            Sri Kamashitayai Boys Hostel
                        </h1>
                        <h2 className="text-2xl text-gray-400 font-bold">
                            Facilities Feedback
                        </h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm">Name *</label>
                        <input
                            name="name"
                            required
                            placeholder="Enter your full name"
                            className="w-full mt-1 bg-neutral-800 rounded-xl px-4 py-3 outline-none"
                        />
                    </div>

                    {/* Room */}
                    <div>
                        <label className="text-sm">Room Number *</label>
                        <input
                            name="room_number"
                            required
                            placeholder="Room number"
                            className="w-full mt-1 bg-neutral-800 rounded-xl px-4 py-3 outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm">Select a category *</label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {categories.map((c) => (
                                <button
                                    type="button"
                                    key={c.label}
                                    onClick={() => setCategory(c.label)}
                                    className={`flex items-center justify-center gap-2 rounded-xl py-4 bg-neutral-800 border-2 
                    ${category === c.label
                                            ? "border-blue-400 bg-neutral-900"
                                            : "border-transparent"
                                        }`}
                                >
                                    <span>{c.icon}</span>
                                    <span>{c.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="text-sm">Rating *</label>
                        <div className="flex gap-2 text-3xl mt-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setRating(i)}
                                    className={`${rating >= i ? "text-yellow-400" : "text-gray-600"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm">Additional Comments (Optional)</label>
                        <textarea
                            name="description"
                            placeholder="Share your feedback..."
                            rows="3"
                            className="w-full mt-1 bg-neutral-800 rounded-xl px-4 py-3 outline-none resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!category || !rating}
                        className={`w-full py-4 rounded-2xl text-lg font-semibold transition
              ${category && rating
                                ? "bg-green-500 text-black"
                                : "bg-gray-400 text-black opacity-70"
                            }`}
                    >
                        Submit Feedback
                    </button>

                    {msg && <p className="text-green-400 text-center">{msg}</p>}
                </form>
            </div>
        </div>
    );
}
