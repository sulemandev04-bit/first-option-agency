"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  Timestamp,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { Pencil, Trash2, X } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  company: string;
  contact: string;
  createdAt: Timestamp; // Aapka column name yahan updated hai
}

export default function InquiryDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('All'); 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Inquiry | null>(null);

  // --- LOGIC: Fetch & Filter (Using createdAt) ---
  useEffect(() => {
    setLoading(true);
    let q;
    const inquiriesRef = collection(db, "inquiries");
    const now = new Date();
    let filterDate: Date | null = null;

    // Preset Filters Logic
    if (activeTab === 'Day') {
      filterDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (activeTab === 'Week') {
      filterDate = new Date(now.setDate(now.getDate() - 7));
    } else if (activeTab === 'Month') {
      filterDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Query Building
    if (activeTab === 'All') {
      // Default: Show everything ordered by createdAt
      q = query(inquiriesRef, orderBy("createdAt", "desc"));
    } else if (startDate && endDate) {
      // Custom Date Range
      const s = new Date(startDate);
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      q = query(
        inquiriesRef,
        where("createdAt", ">=", Timestamp.fromDate(s)),
        where("createdAt", "<=", Timestamp.fromDate(e)),
        orderBy("createdAt", "desc")
      );
    } else if (filterDate) {
      // Day/Week/Month Tabs
      q = query(
        inquiriesRef, 
        where("createdAt", ">=", Timestamp.fromDate(filterDate)),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(inquiriesRef, orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      setInquiries(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab, startDate, endDate]);

  // --- ACTIONS ---
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
      } catch (error) { alert("Delete failed"); }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;
    try {
      await updateDoc(doc(db, "inquiries", currentEdit.id), {
        name: currentEdit.name,
        company: currentEdit.company,
        contact: currentEdit.contact
      });
      setIsEditModalOpen(false);
    } catch (error) { alert("Update failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5">
              <img src="/logo.webp" alt="Logo" className="h-8 sm:h-10 w-auto object-contain" />
            </div>
            <h1 className="hidden xs:block text-xl font-extrabold tracking-tight text-blue-700">
              First Option <span className="text-blue-500">Agency</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 p-1.5 px-3 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Authorized</p>
              <p className="text-sm font-bold text-gray-800 leading-none">Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white relative">
              A
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Filters */}
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex bg-white border rounded-lg overflow-hidden shrink-0">
              <button onClick={() => {setActiveTab('All'); setStartDate(''); setEndDate('');}} className={`px-4 py-2 text-sm font-medium border-r hover:bg-gray-50 ${activeTab === 'All' ? 'bg-blue-600 text-white' : ''}`}>All</button>
              <button onClick={() => {setActiveTab('Day'); setStartDate(''); setEndDate('');}} className={`px-4 py-2 text-sm font-medium border-r hover:bg-gray-50 ${activeTab === 'Day' ? 'bg-blue-50 text-blue-600' : ''}`}>Day</button>
              <button onClick={() => {setActiveTab('Week'); setStartDate(''); setEndDate('');}} className={`px-4 py-2 text-sm font-medium border-r hover:bg-gray-50 ${activeTab === 'Week' ? 'bg-blue-50 text-blue-600' : ''}`}>Week</button>
              <button onClick={() => {setActiveTab('Month'); setStartDate(''); setEndDate('');}} className={`px-4 py-2 text-sm font-medium ${activeTab === 'Month' ? 'bg-blue-50 text-blue-600' : ''}`}>Month</button>
            </div>

            <div className="flex flex-col gap-1 flex-1 w-full">
              <label className="text-xs font-bold text-gray-400 uppercase">Start Date</label>
              <input type="date" value={startDate} className="border rounded-lg p-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500/20" onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1 flex-1 w-full">
              <label className="text-xs font-bold text-gray-400 uppercase">End Date</label>
              <input type="date" value={endDate} className="border rounded-lg p-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500/20" onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <button onClick={() => setActiveTab('Custom')} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition w-full md:w-auto shadow-sm">
              Apply Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5 border-b">Name</th>
                  <th className="px-6 py-5 border-b">Company</th>
                  <th className="px-6 py-5 border-b">Contact</th>
                  <th className="px-6 py-5 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-20 text-gray-400">Loading...</td></tr>
                ) : inquiries.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-20 text-gray-400">No records found.</td></tr>
                ) : inquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition border-b border-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded border border-gray-200">{item.company}</span></td>
                    <td className="px-6 py-4 text-blue-600 italic font-semibold">{item.contact}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => { setCurrentEdit(item); setIsEditModalOpen(true); }}><Pencil size={18} /></button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-full" onClick={() => handleDelete(item.id, item.name)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && currentEdit && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-black text-gray-800 uppercase tracking-tight text-lg">Edit Inquiry</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-800"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Name</label>
                <input type="text" value={currentEdit.name} onChange={(e) => setCurrentEdit({...currentEdit, name: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Company</label>
                <input type="text" value={currentEdit.company} onChange={(e) => setCurrentEdit({...currentEdit, company: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Contact</label>
                <input type="text" value={currentEdit.contact} onChange={(e) => setCurrentEdit({...currentEdit, contact: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 shadow-lg shadow-blue-700/20">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}