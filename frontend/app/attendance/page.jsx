'use client';
import {useEffect,useState} from 'react';
import Nav from '../components/Nav';
import {api} from '../../lib/api';
export default function Attendance(){
 const [rows,setRows]=useState([]); const [error,setError]=useState('');
 useEffect(()=>{api.get('/attendance/my').then(r=>setRows(r.data)).catch(e=>setError(e.response?.data?.message||'Please login'));},[]);
 return <main className="container"><Nav/><div className="card"><h1>Attendance History</h1>{error&&<p className="error">{error}</p>}<table className="table"><thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Source</th></tr></thead><tbody>{rows.map(x=><tr key={x._id}><td>{x.date}</td><td>{x.checkIn?new Date(x.checkIn).toLocaleString():'-'}</td><td>{x.checkOut?new Date(x.checkOut).toLocaleString():'-'}</td><td>{x.status}</td><td>{x.source}</td></tr>)}</tbody></table></div></main>;
}
