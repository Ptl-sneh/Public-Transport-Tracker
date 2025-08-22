import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Api from '../api/Api';

Modal.setAppElement('#root');

const FareCalculator = ({ isOpen, onClose, route, onFareCalculated }) => {
    const [fareData, setFareData] = useState(null);
    const [passesData, setPassesData] = useState(null);
    const [fareLoading, setFareLoading] = useState(false);
    const [userType, setUserType] = useState('default');
    const [transfers, setTransfers] = useState(0);

    useEffect(() => {
        if (route) {
            setTransfers(route.has_transfer ? 1 : 0);
        }
    }, [route]);

    const calculateFare = async () => {
        if (!route) return;

        setFareLoading(true);
        try {
            const fareResponse = await Api.get('/fares/estimate/', {
                params: { route_id: route.id, transfers, user_type: userType }
            });
            setFareData(fareResponse.data);

            const passesResponse = await Api.get('/passes/options/');
            setPassesData(passesResponse.data);

            const quoteResponse = await Api.post('/passes/quote/', {
                trips_per_day: 2,
                user_type: userType,
                per_trip_cost: parseFloat(fareResponse.data.total),
            });
            setPassesData(prev => ({ ...prev, recommendation: quoteResponse.data.recommendation }));

            if (onFareCalculated) onFareCalculated(fareResponse.data);
        } catch (err) {
            console.error('Error fetching fare data:', err);
        } finally {
            setFareLoading(false);
        }
    };

    const handleClose = () => {
        setFareData(null);
        setPassesData(null);
        document.body.style.overflow = "auto"; // ✅ unlock scroll
        onClose();
    };

    return (
        <>
            {isOpen && ( // ✅ modal fully unmounts when closed
                <Modal
                    isOpen={isOpen}
                    onRequestClose={handleClose}
                    closeTimeoutMS={300}
                    contentLabel="Fare Calculator & Passes"
                    overlayClassName="fixed inset-0 backdrop-blur bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50 transition-opacity duration-300"
                    className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] outline-none flex flex-col transition-opacity duration-300"
                    ariaHideApp={false} // ✅ prevent #root from being hidden
                    style={{ overlay: { overflowY: "auto" } }} // ✅ allow overlay scroll
                >
                    {/* Header */}
                    <header className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex-shrink-0">
                            💰 Fare Calculator & Passes
                        </h2>
                        <button
                            onClick={handleClose}
                            aria-label="Close modal"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            &times;
                        </button>
                    </header>

                    {route && (
                        <p className="px-6 mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Route: <span className="font-semibold">{route.route}</span>
                        </p>
                    )}

                    {/* Content */}
                    <main className="p-6 overflow-y-auto flex-grow">
                        {/* User Type & Transfers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label htmlFor="user-type" className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                                    User Type
                                </label>
                                <select
                                    id="user-type"
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                >
                                    <option value="default">Regular</option>
                                    <option value="student">Student</option>
                                    <option value="senior">Senior Citizen</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="transfers" className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                                    Transfers
                                </label>
                                <input
                                    id="transfers"
                                    type="number"
                                    min="0"
                                    max="3"
                                    value={transfers}
                                    onChange={(e) => setTransfers(parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>

                        {/* Recalculate Button */}
                        <div className="text-center mb-6">
                            <button
                                onClick={calculateFare}
                                disabled={fareLoading}
                                className="bg-red-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {fareLoading ? "Calculating..." : "🔄 Recalculate"}
                            </button>
                        </div>

                        {/* Fare Breakdown */}
                        {fareData && (
                            <section className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💳 Fare Breakdown</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Base Fare:</span>
                                        <span className="font-medium">₹{fareData.breakdown.base_fare}</span>
                                    </div>
                                    {parseFloat(fareData.breakdown.transfer_fare) > 0 && (
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Transfer Fee:</span>
                                            <span className="font-medium">₹{fareData.breakdown.transfer_fare}</span>
                                        </div>
                                    )}
                                    {parseFloat(fareData.breakdown.discount_amount) > 0 && (
                                        <div className="flex justify-between text-green-600 dark:text-green-400">
                                            <span>Discount ({parseFloat(fareData.breakdown.discount_pct) * 100}%):</span>
                                            <span className="font-medium">-₹{fareData.breakdown.discount_amount}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                                        <span>Total:</span>
                                        <span>₹{fareData.total}</span>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Pass Options */}
                        {passesData && passesData.length > 0 && (
                            <section className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎫 Available Passes</h3>
                                <div className="grid gap-4">
                                    {passesData.filter(p => typeof p === 'object' && p.id).map((pass) => (
                                        <div
                                            key={pass.id}
                                            className="flex justify-between items-center bg-white dark:bg-gray-600 rounded-lg p-4 shadow-sm"
                                        >
                                            <div className="text-gray-900 dark:text-white font-medium">
                                                {pass.name} <span className="text-gray-500 dark:text-gray-400 text-sm">({pass.period})</span>
                                            </div>
                                            <div className="text-green-600 dark:text-green-400 font-bold">₹{pass.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Pass Recommendation */}
                        {passesData && passesData.recommendation && (
                            <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">💡 Recommended Pass</h3>
                                <p className="text-green-700 dark:text-green-400 font-medium text-lg">
                                    {passesData.recommendation.plan} ({passesData.recommendation.period})
                                </p>
                                <p className="text-green-700 dark:text-green-400 mt-1">
                                    Break-even: {passesData.recommendation.break_even_trips_per_day} trips per day
                                </p>
                                <p className="text-green-700 dark:text-green-400 mt-1">
                                    Price: ₹{passesData.recommendation.price}
                                </p>
                            </section>
                        )}

                        {!fareData && !fareLoading && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                Click &quot;Calculate&quot; to see fare breakdown and pass options
                            </div>
                        )}
                        <div className='flex justify-end'>

                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-blue-500 text-gray-100 dark:text-gray-200 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-4 focus:ring-blue-400 font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </main>
                </Modal>
            )}
        </>
    );
};

export default FareCalculator;
