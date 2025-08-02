import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Feedback() {
    const [feedbackForm, setFeedbackForm] = useState({
        rating: 0,
        comment: "",
    })
    const [hoveredRating, setHoveredRating] = useState(0)

    const [pastFeedback] = useState([
        {
            id: 1,
            comment: "Great service on Route 101! Very punctual and clean buses.",
            date: "2024-01-15",
            sentiment: "Positive",
            rating: 5,
        },
        {
            id: 2,
            comment: "Metro Blue Line was delayed by 15 minutes today.",
            date: "2024-01-12",
            sentiment: "Negative",
            rating: 2,
        },
        {
            id: 3,
            comment: "Good connectivity between different routes.",
            date: "2024-01-10",
            sentiment: "Positive",
            rating: 4,
        },
    ])

    const handleRatingClick = (rating) => {
        setFeedbackForm({
            ...feedbackForm,
            rating,
        })
    }

    const handleCommentChange = (e) => {
        setFeedbackForm({
            ...feedbackForm,
            comment: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Feedback submitted:", feedbackForm)
        // Reset form
        setFeedbackForm({ rating: 0, comment: "" })
        alert("Thank you for your feedback!")
    }

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case "Positive":
                return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
            case "Negative":
                return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
            default:
                return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        }
    }

    const renderStars = (rating, interactive = false, onHover = null, onLeave = null) => {
        const displayRating = interactive ? hoveredRating || rating : rating

        return [...Array(5)].map((_, index) => {
            const starNumber = index + 1
            const isFilled = starNumber <= displayRating

            return (
                <button
                    key={index}
                    type={interactive ? "button" : undefined}
                    onClick={interactive ? () => handleRatingClick(starNumber) : undefined}
                    onMouseEnter={interactive ? () => setHoveredRating(starNumber) : undefined}
                    onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                    className={`text-3xl transition-all duration-200 ${isFilled ? "text-yellow-400 drop-shadow-sm" : "text-gray-300 dark:text-gray-600"
                        } ${interactive ? "hover:text-yellow-400 hover:scale-110 cursor-pointer transform" : ""}`}
                    disabled={!interactive}
                    aria-label={interactive ? `Rate ${starNumber} star${starNumber > 1 ? "s" : ""}` : undefined}
                >
                    {isFilled ? "★" : "☆"}
                </button>
            )
        })
    }

    const getRatingText = (rating) => {
        const texts = {
            0: "Click to rate",
            1: "Poor - Very unsatisfied",
            2: "Fair - Somewhat unsatisfied",
            3: "Good - Neutral experience",
            4: "Very Good - Satisfied",
            5: "Excellent - Very satisfied",
        }
        return texts[rating] || ""
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Navigation */}
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Submit Feedback</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Help us improve Ahmedabad's public transport system
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Feedback Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Share Your Experience</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Rate Your Experience
                                </label>
                                <div className="flex items-center space-x-1 mb-2">{renderStars(feedbackForm.rating, true)}</div>
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

                                {/* Rating Scale Labels */}
                                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    <span>Poor</span>
                                    <span>Fair</span>
                                    <span>Good</span>
                                    <span>Very Good</span>
                                    <span>Excellent</span>
                                </div>
                            </div>

                            {/* Comment Textarea */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Comments</label>
                                <textarea
                                    value={feedbackForm.comment}
                                    onChange={handleCommentChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Share your experience, suggestions, or report issues..."
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {feedbackForm.comment.length}/500 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={feedbackForm.rating === 0}
                                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:transform-none"
                            >
                                {feedbackForm.rating === 0 ? "Please select a rating" : "Submit Feedback"}
                            </button>
                        </form>
                    </div>

                    {/* Past Feedback */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Past Feedback</h2>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {pastFeedback.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gray-50 dark:bg-gray-700"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                {renderStars(feedback.rating)}
                                                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {feedback.rating}/5
                                                </span>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentColor(feedback.sentiment)}`}
                                            >
                                                {feedback.sentiment}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{feedback.date}</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{feedback.comment}</p>
                                </div>
                            ))}
                        </div>

                        {pastFeedback.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">💬</div>
                                <p className="text-gray-500 dark:text-gray-400">No feedback submitted yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback Stats */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center transition-colors duration-300">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
                        <p className="text-green-700 dark:text-green-300 font-medium">Positive Feedback</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center transition-colors duration-300">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1,247</div>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Total Reviews</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl text-center transition-colors duration-300">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">4.2</div>
                        <p className="text-orange-700 dark:text-orange-300 font-medium">Average Rating</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
