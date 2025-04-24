import { useEffect, useState } from 'react';
import axios from 'axios';

type Transaction = {
  _id?: string;
  userId: string;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
};


function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<Transaction>({
    userId:'',
    date: '',
    category: '',
    amount: 0,
    type: 'income',
    note: '',
  });
  const [monthFilter, setMonthFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState<string | null>(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/transactions', {
      headers: { Authorization: token || '' }
    })
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleChange = (e:  React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if(isEditing && editId){
      const res = await axios.put(`http://localhost:5000/api/transactions/${editId}`, formData, {
        headers: { Authorization: token || '' }
      });
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === editId ? res.data: tx))
    );
  }else{
    const res = await axios.post('http://localhost:5000/api/transactions', formData, {
      headers: { Authorization: token || '' }
    });
    setTransactions((prev) => [res.data, ...prev]);
  }
      setFormData({
        userId: '',
        date: '',
        category: '',
        amount: 0,
        type: 'income',
        note: ''
      });
      setIsEditing(false);
      setEditId(null);
      const closeBtn = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeBtn) closeBtn.click();
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('Failed to save transaction');
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: token || '' }
      });
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };
  const handleEdit = (tx: Transaction) => {
    setIsEditing(true);
    setEditId(tx._id || null);
    setFormData({
      userId: tx.userId,
      date: tx.date,
      category: tx.category,
      amount: tx.amount,
      type: tx.type,
      note: tx.note || '',
    });
  };
  

  const getFilteredTransactions = () => {
    return transactions.filter((tx) => {
      const txMonth = new Date(tx.date).toLocaleString('default', { month: 'short' });
      const matchMonth = monthFilter ? txMonth === monthFilter : true;
      const matchCategory = categoryFilter ? tx.category === categoryFilter : true;
      return matchMonth && matchCategory;
    });
  };

  const uniqueCategories = [...new Set(transactions.map((tx) => tx.category))];
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="container-fluid" style={{ backgroundColor: '#e3f2f1', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mt-4">Transactions</h2>
        <button className="btn btn-success mt-4" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
          Add Transaction
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <select className="form-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="">Filter by Month</option>
            {allMonths.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Filter by Category</option>
            {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100" onClick={() => { setMonthFilter(''); setCategoryFilter(''); }}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="card shadow-sm p-3">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTransactions().map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.category}</td>
                <td style={{ color: tx.type === 'expense' ? 'red' : 'green' }}>
                  {tx.type === 'expense' ? `- $${tx.amount.toLocaleString()}` : `$${tx.amount.toLocaleString()}`}
                </td>
                <td>
                  {tx._id && (
                    <>
                     <button
                     className="btn btn-sm btn-outline-primary me-2"
                     data-bs-toggle="modal"
                     data-bs-target="#addTransactionModal"
                     onClick={() => handleEdit(tx)}
                   >
                     🖉
                   </button>
                  <button
                   className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(tx._id!)}
                    >
                      🗑
                  </button>
                  </>
                  )}
                  
                </td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className="modal fade" id="addTransactionModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Add Transaction</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input type="number" className="form-control" name="amount" value={formData.amount} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Note (optional)</label>
                  <input type="text" className="form-control" name="note" value={formData.note} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
