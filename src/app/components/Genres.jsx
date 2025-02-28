import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, ChartDataLabels);

export default function Genres({ user }) {
    const shortTermGenres = user.top_genres.short_term || {};

    // Sort genres by count and get the top 5
    const sortedGenres = Object.entries(shortTermGenres)
        .sort((a, b) => b[1] - a[1]) // Sort descending by count
        .slice(0, 5); // Take top 5

    const labels = sortedGenres.map(([genre]) => genre);
    const values = sortedGenres.map(([, count]) => count);

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: [
                    'rgb(52 211 153)', 'rgb(248 113 113)', 'rgb(192, 132, 252)', 'rgb(234, 179, 8)', 'rgb(30, 58, 138)'
                ],
                borderWidth: 1
            }
        ]
    };

    const options = {
        plugins: {
            datalabels: {
                color: '#fff', // Label text color
                font: {
                    weight: 'bold',
                    size: 12
                },
                formatter: (value, context) => {
                    return context.chart.data.labels[context.dataIndex]; // Show genre name
                }
            }
        }
    };

    return (
        <div className='p-6 rounded-md border-4 border-emerald-400 w-1/2'>
            <div className='flex align-center justify-around'>
                <div className='flex flex-col justify-center'>
                    <h2 className='text-lg font-bold mb-4'>Top Recently Played Genres</h2>
                    <ul className='list-decimal pl-5 font-mono'>
                        {labels.map((genre, index) => (
                            <li key={index}>{genre}</li>
                        ))}
                    </ul>
                </div>
                <div className='w-[400px]'>
                    {labels.length > 0 ? <Pie data={data} options={options}/> : <p>No recent genre data</p>}
                </div>
            </div>
            
        </div>
    );
}
