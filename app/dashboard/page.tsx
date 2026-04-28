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
import './style.css';

// --- Interface ---
interface Inquiry {
  id: string;
  name: string;
  company: string;
  contact: string;
  createdAt: Timestamp;
}

export default function InquiryDashboard() {
  // State with explicit types to avoid 'never' error
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('All'); 

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentEdit, setCurrentEdit] = useState<Inquiry | null>(null);

  // --- LOGIC: Fetch & Filter ---
  useEffect(() => {
    setLoading(true);
    let q;
    const inquiriesRef = collection(db, "inquiries");
    const now = new Date();
    let filterDate: Date | null = null;

    if (activeTab === 'Day') {
      filterDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (activeTab === 'Week') {
      filterDate = new Date(now.setDate(now.getDate() - 7));
    } else if (activeTab === 'Month') {
      filterDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    if (activeTab === 'All') {
      q = query(inquiriesRef, orderBy("createdAt", "desc"));
    } else if (startDate && endDate) {
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
    <div className="dashboard-wrapper bg-dot-grid">
      {/* --- HEADER --- */}
      <header className="header-main">
        <div className="container-header">
          <div className="header-brand">
            <img src="/logo.webp" alt="Logo" className="logo-img" />
          </div>
          <div className="admin-profile">
            <div className="admin-info">
              <span className="admin-status">Authorized</span>
              <span className="admin-name">Admin</span>
            </div>
            <div className="avatar">
              A
              <span className="status-indicator"></span>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="container-main">
        <div className="data-card card-glass">
          
          {/* Filters */}
          <div className="filters-row-container card-glass">
            
            {/* 1. Preset Tabs */}
            <div className="filter-group">
              <div className="tab-group-minimal">
                {['All', 'Day', 'Week', 'Month'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => {setActiveTab(tab); setStartDate(''); setEndDate('');}}
                    className={`tab-btn-mini ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Divider Line */}
            <div className="filter-divider"></div>

            {/* 3. Start Date */}
            <div className="filter-group">
              <div className="input-minimal">
                <label>From</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>

            {/* 4. End Date */}
            <div className="filter-group">
              <div className="input-minimal">
                <label>To</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            {/* 5. Apply Button */}
            <div className="filter-group">
              <button onClick={() => setActiveTab('Custom')} className="glow-btn-primary apply-btn-mini">
                Apply Filter
              </button>
            </div>

          </div>
          {/* Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="empty-state">Loading records...</td></tr>
                ) : inquiries.length === 0 ? (
                  <tr><td colSpan={4} className="empty-state">No inquiries found.</td></tr>
                ) : inquiries.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="cell-name">{item.name}</td>
                    <td className="cell-company"><span className="badge-company">{item.company}</span></td>
                    <td className="cell-contact">{item.contact}</td>
                    <td className="cell-actions">
                      <div className="action-btns">
                        <button className="btn-icon edit" onClick={() => { setCurrentEdit(item); setIsEditModalOpen(true); }}><Pencil size={18} /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(item.id, item.name)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && currentEdit && (
        <div className="modal-backdrop">
          <div className="modal-content card-glass">
            <div className="modal-header">
              <h3>Edit Inquiry</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-field">
                <label>Name</label>
                <input type="text" value={currentEdit.name} onChange={(e) => setCurrentEdit({...currentEdit, name: e.target.value})} required />
              </div>
              <div className="form-field">
                <label>Company</label>
                <input type="text" value={currentEdit.company} onChange={(e) => setCurrentEdit({...currentEdit, company: e.target.value})} required />
              </div>
              <div className="form-field">
                <label>Contact</label>
                <input type="text" value={currentEdit.contact} onChange={(e) => setCurrentEdit({...currentEdit, contact: e.target.value})} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="glow-btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}