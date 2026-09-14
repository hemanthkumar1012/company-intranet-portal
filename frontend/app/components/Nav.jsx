'use client';
import Link from 'next/link';
import { logout } from '../../lib/api';
export default function Nav(){return <nav className="nav"><Link href="/admin">Admin</Link><Link href="/employee">Employee</Link><Link href="/attendance">Attendance</Link><Link href="/leave">Leave</Link><Link href="/biometric">Biometric</Link><Link href="/payslip/send">Payslips</Link><Link href="/ai-assistant">Policy Assistant</Link><button className="btn secondary" onClick={logout}>Logout</button></nav>}
