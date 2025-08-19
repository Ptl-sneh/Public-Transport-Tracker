import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Api from "../api/Api"; // ✅ use your central axios instance with refresh logic

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Submit Feedback
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Help us improve Ahmedabad's public transport system
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Feedback Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Share Your Experience
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Rate Your Experience
                                </label>
                                <div className="flex items-center space-x-1 mb-2">
                                    {renderStars(feedbackForm.rating, true)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {getRatingText(hoveredRating || feedbackForm.rating)}
                                    </p>
                                    {(feedbackForm.rating > 0 || hoveredRating > 0) && (
                                        <span className="text-sm font-medium text-red-500">
                                            {hoveredRating || feedbackForm.rating}/5 stars
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    <span>Poor</span><span>Fair</span><span>Good</span>
                                    <span>Very Good</span><span>Excellent</span>
                                </div>
                            </div>
                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Comments
                                </label>
                                <textarea
                                    value={feedbackForm.comment}
                                    onChange={handleCommentChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Share your experience, suggestions, or report issues..."
                                    required
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {feedbackForm.comment.length}/500 characters
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={feedbackForm.rating === 0 || loading}
                                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:transform-none"
                            >
                                {loading
                                    ? "Submitting..."
                                    : feedbackForm.rating === 0
                                        ? "Please select a rating"
                                        : "Submit Feedback"}
                            </button>
                        </form>
                    </div>

                    {/* Recent Feedback */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Feedback</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {pastFeedback.map((f) => (
                                <div
                                    key={f.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gray-50 dark:bg-gray-700"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                {renderStars(f.rating)}
                                                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {f.rating}/5
                                                </span>
                                            </div>
                                            {f.sentiment && (
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentColor(f.sentiment)}`}
                                                >
                                                    {f.sentiment}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(f.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{f.comment}</p>
                                    {f.username && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">- {f.username}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {pastFeedback.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">💬</div>
                                <p className="text-gray-500 dark:text-gray-400">No feedback available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center transition-colors duration-300">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            {getStatValue("positive_percentage")}%
                        </div>
                        <p className="text-green-700 dark:text-green-300 font-medium">Positive Feedback</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center transition-colors duration-300">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            {getStatValue("total_feedback")}
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Total Reviews</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl text-center transition-colors duration-300">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                            {getStatValue("average_rating")}
                        </div>
                        <p className="text-orange-700 dark:text-orange-300 font-medium">Average Rating</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
