import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Api from "../api/Api"; // ✅ use your central axios instance with refresh logic
import BackToTop from "../components/BackToTop";

export default function Feedback() {
    const [feedbackForm, setFeedbackForm] = useState({ rating: 0, comment: "" });
    const [hoveredRating, setHoveredRating] = useState(0);
    const [pastFeedback, setPastFeedback] = useState([]);
    const [stats, setStats] = useState({
        totalFeedback: 0,
        averageRating: 0,
        positivePercentage: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRecentFeedback();
        fetchFeedbackStats();
    }, []);

    const fetchRecentFeedback = async () => {
        try {
            const res = await Api.get("feedback/recent/");
            console.log(res.data)
            setPastFeedback(res.data);
        } catch (err) {
            console.error("Error fetching feedback:", err);
        }
    };

    const fetchFeedbackStats = async () => {
        try {
            const res = await Api.get("feedback/stats/");
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const handleRatingClick = (rating) =>
        setFeedbackForm({ ...feedbackForm, rating });

    const handleCommentChange = (e) =>
        setFeedbackForm({ ...feedbackForm, comment: e.target.value });

    const getStatValue = (key) => {
        const value =
            stats?.[key] || stats?.[key.toLowerCase()] || 0;
        return typeof value === "number"
            ? (key.includes("percentage") || key.includes("rating"))
                ? value.toFixed(1)
                : Math.round(value)
            : value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await Api.post("feedback/", {
                rating: feedbackForm.rating,
                comment: feedbackForm.comment,
            });
            await fetchRecentFeedback();
            await fetchFeedbackStats();
            setFeedbackForm({ rating: 0, comment: "" });
            alert("Thank you for your feedback!");
        } catch (err) {
            console.error("Error submitting feedback:", err);
            alert(
                err.response
                    ? `Error: ${JSON.stringify(err.response.data)}`
                    : "Failed to submit feedback. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ⭐ Star rating renderer
    const renderStars = (rating, interactive = false) => {
        const displayRating = interactive ? hoveredRating || rating : rating;
        return [...Array(5)].map((_, i) => {
            const star = i + 1;
            const filled = star <= displayRating;
            return (
                <button
                    key={i}
                    type={interactive ? "button" : undefined}
                    onClick={interactive ? () => handleRatingClick(star) : undefined}
                    onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
                    onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                    className={`text-3xl transition-all duration-200 ${filled ? "text-yellow-400 drop-shadow-sm" : "text-gray-300 dark:text-gray-600"
                        } ${interactive ? "hover:text-yellow-400 hover:scale-110 cursor-pointer transform" : ""}`}
                    disabled={!interactive}
                    aria-label={interactive ? `Rate ${star} star${star > 1 ? "s" : ""}` : undefined}
                >
                    {filled ? "★" : "☆"}
                </button>
            );
        });
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case "Positive":
                return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300";
            case "Negative":
                return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300";
            default:
                return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
        }
    };

    const getRatingText = (rating) => ({
        0: "Click to rate",
        1: "Poor - Very unsatisfied",
        2: "Fair - Somewhat unsatisfied",
        3: "Good - Neutral experience",
        4: "Very Good - Satisfied",
        5: "Excellent - Very satisfied",
    }[rating] || "");

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-700">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-10 space-y-14">

                {/* Header */}
                <section className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
                        Submit Feedback
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Help us improve Ahmedabad&apos;s public transport system
                    </p>
                </section>

                {/* Form & Recent Feedback Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Feedback Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl px-10 py-8 transition-colors duration-300">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Share Your Experience
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Rating */}
                            <div>
                                <label className="block mb-3 text-gray-700 dark:text-gray-300 font-semibold text-lg">
                                    Rate Your Experience
                                </label>
                                <div className="flex items-center space-x-3 mb-3">
                                    {renderStars(feedbackForm.rating, true)}
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[24px]">
                                        {getRatingText(hoveredRating || feedbackForm.rating)}
                                    </p>
                                    {(feedbackForm.rating || hoveredRating) > 0 && (
                                        <span className="text-sm font-semibold text-red-500">
                                            {hoveredRating || feedbackForm.rating}/5 stars
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 select-none">
                                    <span>Poor</span>
                                    <span>Fair</span>
                                    <span>Good</span>
                                    <span>Very Good</span>
                                    <span>Excellent</span>
                                </div>
                            </div>

                            {/* Comment Textarea */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                                    Your Comments
                                </label>
                                <textarea
                                    value={feedbackForm.comment}
                                    onChange={handleCommentChange}
                                    rows={5}
                                    maxLength={500}
                                    placeholder="Share your experience, suggestions, or report issues..."
                                    required
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-4 focus:ring-red-400 focus:border-transparent resize-none transition"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                                    {feedbackForm.comment.length}/500 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={feedbackForm.rating === 0 || loading}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:cursor-not-allowed"
                            >
                                {loading ? "Submitting..." : feedbackForm.rating === 0 ? "Please select a rating" : "Submit Feedback"}
                            </button>
                        </form>
                    </div>

                    {/* Past Feedback */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl px-10 py-8 transition-colors duration-300 max-h-[650px] overflow-y-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            Recent Feedback
                        </h2>
                        {pastFeedback.length === 0 && (
                            <div className="text-center text-gray-500 dark:text-gray-400 space-y-2">
                                <div className="text-5xl select-none">💬</div>
                                <p>No feedback available yet</p>
                            </div>
                        )}
                        <div className="space-y-6">
                            {pastFeedback.map((fb) => (
                                <div
                                    key={fb.id}
                                    className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg bg-gray-50 dark:bg-gray-700 transition"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1 text-yellow-400">
                                                {renderStars(fb.rating)}
                                                <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">{fb.rating}/5</span>
                                            </div>
                                            {fb.sentiment && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(fb.sentiment)}`}>
                                                    {fb.sentiment}
                                                </span>
                                            )}
                                        </div>
                                        <time className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(fb.created_at).toLocaleDateString()}
                                        </time>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{fb.comment}</p>
                                    {fb.username && (
                                        <p className="mt-3 text-gray-500 dark:text-gray-400 italic text-sm">— {fb.username}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
                    {[
                        { label: "Positive Feedback", value: getStatValue("positive_percentage"), color: "green" },
                        { label: "Total Reviews", value: getStatValue("total_feedback"), color: "blue" },
                        { label: "Average Rating", value: getStatValue("average_rating"), color: "orange" },
                    ].map(({ label, value, color }) => (
                        <div
                            key={label}
                            className={`p-8 rounded-3xl bg-${color}-50 dark:bg-${color}-900/20 shadow-lg shadow-${color}-300/30 dark:shadow-${color}-900/60 transition-colors duration-300`}
                        >
                            <p className={`text-4xl font-extrabold text-${color}-600 dark:text-${color}-400 mb-2`}>{value}{label === "Positive Feedback" ? "%" : ""}</p>
                            <p className={`text-${color}-700 dark:text-${color}-300 font-semibold text-lg`}>{label}</p>
                        </div>
                    ))}
                </section>
            </main>

            <BackToTop />
            <Footer />
        </div>
    );
}