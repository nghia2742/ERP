'use client';
import { StockChart } from '@/components/Emojis';
import TableData from '@/components/TableData';
import Footer from '@/components/partials/Footer';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
    const [data, setData] = useState([]);
    const [predictedData, setPredictedData] = useState([]);
    const [chart, setChart] = useState('');
    const [forecastingDays, setForecastingDays] = useState(0);
    const [currency, setCurrency] = useState('defaulted');
    const [model, setModel] = useState('defaulted');
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [pending, setPending] = useState(false);
    const [pendingPrediction, setPendingPrediction] = useState(false);
    const currency_rates = [
        'USDVND',
        'EURVND',
        'GBPVND',
        'USDAUD',
        'USDKRW',
        'USDCNY',
    ];

    const models = [
        'Linear Regression',
        'Decision Tree Regression',
        'Random Forest Regression',
        'XGBoost',
        'LSTM',
        'GRU',
    ];

    useEffect(() => {
        let timerInterval;

        if (isRunning) {
            timerInterval = setInterval(() => {
                setTotalSeconds((prevSeconds) => prevSeconds + 0.1);
            }, 100);
        }

        return () => clearInterval(timerInterval);
    }, [isRunning]);

    const formattedTime = () => {
        const seconds = Math.floor(totalSeconds);
        const milliseconds = Math.round((totalSeconds % 1) * 1000);
        return `${seconds}s ${milliseconds}ms`;
    };

    async function fetchData(currency) {
        const response = await fetch(
            `http://127.0.0.1:8000/data?currency=${currency}`
        );
        const parseData = await response.json();

        const dataArray = [];

        for (const key in parseData) {
            if (parseData.hasOwnProperty(key)) {
                dataArray.push(parseData[key]);
            }
        }

        setPending(false);
        setData(dataArray);
        setPredictedData([]);

        const res = await fetch('http://127.0.0.1:8000/chart');
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setChart(imageUrl);
    }

    async function fetchPredict(model, days) {
        const response = await fetch(
            `http://127.0.0.1:8000/predict?model=${model}&days=${days}`
        );
        const parseData = await response.json();
        const dataArray = [];

        for (const key in parseData) {
            if (parseData.hasOwnProperty(key)) {
                dataArray.push(parseData[key]);
            }
        }

        setPendingPrediction(false);
        setPredictedData(dataArray);
        setIsRunning(false);
    }

    const handleChange = (event) => {
        setCurrency(event.target.value);
    };

    const handleChangeModel = (event) => {
        setModel(event.target.value);
    };

    const handleChangeDays = (event) => {
        setForecastingDays(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (currency !== 'defaulted') {
            setPending(true);
            fetchData(currency);
            return;
        }
        alert('Please choose a pair of currency');
    };

    const handleSubmitModel = (event) => {
        event.preventDefault();
        if (model === 'defaulted') return alert('Please choose a model');
        if (forecastingDays == 0)
            return alert('Please enter a number to predict');
        setPendingPrediction(true);
        fetchPredict(model, forecastingDays);
        setTotalSeconds(0);
        setIsRunning(true);
        console.log(model, forecastingDays);
    };

    const groupedData = predictedData.reduce((acc, obj) => {
        Object.entries(obj).forEach(([key, value]) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(value);
        });
        return acc;
    }, {});

    const rows = Object.entries(groupedData).map(([key, values]) => ({
        key,
        values,
    }));

    return (
        <div className="min-h-screen">
            <main className="flex">
                {/* <aside className="bg-sky-100 h-screen w-1/3 sticky top-0 left-0"></aside> */}
                <section className="min-h-screen w-full p-16">
                    {/* INTRODUCTION SECTION */}
                    <div className="mb-20 flex gap-5 items-center justify-center">
                        <StockChart />
                        <h1 className="inline-block text-transparent text-xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text">
                            EXCHANGE RATE PREDICTION
                        </h1>
                    </div>

                    {/* DISCLAIMER SECTION */}

                    <div className="mb-20">
                        <div role="alert" className="alert alert-warning px-10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <span>
                                <b>Disclaimer: Exchange Rate Predictions </b>{' '}
                                <br />
                                This website is for reference and educational
                                purposes only, not indicative of the actual
                                future values of these exchange rates, and does
                                not provide any investment advice.
                            </span>
                        </div>
                    </div>

                    {/* DATA SECTION */}
                    <div className="mb-20">
                        <h1 className="text-3xl font-bold mb-5">Data</h1>
                        <div className="flex gap-2 mb-5">
                            <div className="flex items-center gap-2">
                                <label htmlFor="currency">Currency:</label>
                                <select
                                    name="currency"
                                    className="select select-bordered w-full max-w-fit"
                                    value={currency}
                                    onChange={handleChange}
                                >
                                    <option disabled value="defaulted">
                                        Choose a pair of currency
                                    </option>
                                    {currency_rates.map((currency, index) => (
                                        <option key={index} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div
                                className="btn btn-primary"
                                onClick={handleSubmit}
                            >
                                {pending && (
                                    <span className="loading loading-dots"></span>
                                )}
                                Submit
                            </div>
                        </div>
                        <TableData data={data} />
                    </div>
                    {chart !== '' && (
                        <>
                            <div className="mb-20">
                                <h1 className="text-3xl font-bold">Chart</h1>
                                <div className="flex justify-center">
                                    <Image
                                        src={chart}
                                        height={500}
                                        width={1000}
                                        alt="chart"
                                    />
                                </div>
                            </div>

                            {/* PREDICTION IN THE FUTURE */}
                            <div>
                                <h1 className="text-3xl font-bold mb-5">
                                    Forecasting
                                </h1>
                                <div className="flex gap-5 mb-5">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="models">Models:</label>
                                        <select
                                            name="models"
                                            className="select select-bordered w-full max-w-fit"
                                            value={model}
                                            onChange={handleChangeModel}
                                        >
                                            <option disabled value="defaulted">
                                                Choose a model
                                            </option>
                                            {models.map((model, index) => (
                                                <option
                                                    key={index}
                                                    value={model}
                                                >
                                                    {model}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="forecastingDays">
                                            Forecasting days:
                                        </label>
                                        <input
                                            type="number"
                                            name="forecastingDays"
                                            placeholder="Days"
                                            onChange={handleChangeDays}
                                            className="input input-bordered input-primary w-24"
                                            min={0}
                                        />
                                    </div>
                                    <div
                                        className="btn btn-primary"
                                        onClick={handleSubmitModel}
                                    >
                                        See the future
                                    </div>
                                </div>
                                <div className="max-h-96 max-w-96 overflow-y-auto">
                                    <h2 className="mb-2">
                                        Runtime: {formattedTime()}
                                    </h2>
                                    <table className="table border rounded-md overflow-x-auto">
                                        <thead className="sticky -top-1 left-0 glass bg-sky-500">
                                            <tr>
                                                <th>#</th>
                                                <th>Date</th>
                                                <th>Predicted</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {predictedData.length === 0 &&
                                                !pendingPrediction && (
                                                    <tr>
                                                        <td
                                                            className="text-center"
                                                            colSpan={3}
                                                        >
                                                            No data
                                                        </td>
                                                    </tr>
                                                )}

                                            {pendingPrediction ? (
                                                <tr>
                                                    <td
                                                        className="text-center"
                                                        colSpan={3}
                                                    >
                                                        <span className="loading loading-spinner"></span>
                                                        <p>
                                                            Waiting a minute...
                                                            🌹
                                                        </p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                rows.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td>
                                                            {Number(row.key) +
                                                                1}
                                                        </td>
                                                        {row.values.map(
                                                            (
                                                                value,
                                                                colIndex
                                                            ) => (
                                                                <td
                                                                    key={
                                                                        colIndex
                                                                    }
                                                                >
                                                                    {value}
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
