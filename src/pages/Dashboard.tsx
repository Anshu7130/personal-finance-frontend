import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type Transaction = {
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
};

type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
};

function Dashboard() {
  const [totals, setTotals] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  const [chartData, setChartData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get<Transaction[]>('http://localhost:5000/api/transactions', {
      headers: {
        Authorization: token || '',
      },
    })
      .then((res) => {
        calculateTotals(res.data);
        setChartData(getMonthlyData(res.data));
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const calculateTotals = (data: Transaction[]) => {
    let income = 0;
    let expenses = 0;

    data.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expenses += tx.amount;
      }
    });

    const balance = income - expenses;

    setTotals({
      income,
      expenses: Math.abs(expenses),
      balance,
    });
  };

  const getMonthlyData = (data: Transaction[]): MonthlyData[] => {
    const monthlyTotals: { [key: string]: { income: number; expenses: number } } = {};

    data.forEach((tx: Transaction) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short' });

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { income: 0, expenses: 0 };
      }

      if (tx.type === 'income') {
        monthlyTotals[month].income += tx.amount;
      } else {
        monthlyTotals[month].expenses += Math.abs(tx.amount);
      }
    });

    return Object.entries(monthlyTotals).map(([month, values]) => ({
      month,
      ...values,
    }));
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#fbe3cc', minHeight: '100vh' }}>
      <h2 className="mb-4 mt-3">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h5>Total Income</h5>
            <p className="fs-4 text-success">${totals.income.toLocaleString()}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h5>Total Expenses</h5>
            <p className="fs-4 text-danger">${totals.expenses.toLocaleString()}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h5>Balance</h5>
            <p className="fs-4 text-dark">${totals.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm mt-4">
        <h5 className="mb-3">Monthly Income vs Expenses</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#00b894" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#d63031" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
