'use client';
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { api } from '../../lib/api';

export default function Leave() {
  const [f, setF] = useState({ type: 'casual', fromDate: '', toDate: '', reason: '' });
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/leave/list');
      setRows(data);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Please login');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leave/apply', f);
      setMsg('Leave request submitted');
      setF({ ...f, fromDate: '', toDate: '', reason: '' });
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed');
    }
  };

  const approve = async (id) => {
    try {
      await api.put(`/leave/${id}/approve`);
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to approve leave');
    }
  };

  return (
    <main className="container">
      <Nav />
      <div className="card">
        <h1>Leave</h1>
        <form onSubmit={submit} className="grid">
          <select className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
          </select>
          <input className="input" type="date" value={f.fromDate} onChange={(e) => setF({ ...f, fromDate: e.target.value })} required />
          <input className="input" type="date" value={f.toDate} onChange={(e) => setF({ ...f, toDate: e.target.value })} required />
          <textarea className="input" placeholder="Reason" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} required />
          <button className="btn" type="submit">Apply Leave</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
      <div className="card">
        <h2>Requests</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x._id}>
                <td>{x.userId?.name || '-'}</td>
                <td>{x.type}</td>
                <td>{String(x.fromDate).slice(0, 10)} to {String(x.toDate).slice(0, 10)}</td>
                <td>{x.status}</td>
                <td>{x.status === 'pending' ? <button className="btn success" onClick={() => approve(x._id)}>Approve</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
