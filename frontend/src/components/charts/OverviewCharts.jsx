import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

export const TrendChart = ({ labels = [], data = [] }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'ATS Score',
        data,
        tension: 0.4,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#10B981'
      }
    ]
  };

  return <Line data={chartData} />;
};

export const BreakdownChart = ({ labels = [], data = [] }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ['#10B981', '#34D399', '#A7F3D0', '#D1FAE5'],
        borderWidth: 0
      }
    ]
  };

  return <Doughnut data={chartData} />;
};
