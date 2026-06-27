'use client';
import React, { useState } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiSearch, FiX } from 'react-icons/fi';

type Registration = {
  id: number;
  nim: string;
  name: string;
  division: string;
  status: string;
  date: string;
};

export default function AdminInternRegistrationPage() {
  const [search, setSearch] = useState('');
  
  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'view' | 'accept' | 'reject' | null;
    data: Registration | null;
  }>({
    isOpen: false,
    type: null,
    data: null
  });

  const [dummyRegistrations, setDummyRegistrations] = useState<Registration[]>([
    { id: 1, nim: '1301201234', name: 'Budi Santoso', division: 'Frontend Developer', status: 'Pending', date: 'Dec 05, 2025' },
    { id: 2, nim: '1301205678', name: 'Siti Aminah', division: 'Backend Developer', status: 'Accepted', date: 'Dec 04, 2025' },
    { id: 3, nim: '1301209012', name: 'Andi Wijaya', division: 'UI/UX Designer', status: 'Rejected', date: 'Dec 03, 2025' },
  ]);

  const filteredRegistrations = dummyRegistrations.filter(reg => 
    reg.name.toLowerCase().includes(search.toLowerCase()) || 
    reg.nim.toLowerCase().includes(search.toLowerCase()) ||
    reg.division.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => setModalConfig({ isOpen: false, type: null, data: null });

  const confirmAction = () => {
    if (!modalConfig.data) return;
    
    if (modalConfig.type === 'accept') {
      setDummyRegistrations(prev => 
        prev.map(reg => reg.id === modalConfig.data!.id ? { ...reg, status: 'Accepted' } : reg)
      );
    } else if (modalConfig.type === 'reject') {
      setDummyRegistrations(prev => 
        prev.map(reg => reg.id === modalConfig.data!.id ? { ...reg, status: 'Rejected' } : reg)
      );
    }
    closeModal();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Intern Registrations</h2>
          <p className="text-gray-500 mt-1">Review and manage intern applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, NIM, or division..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">NIM</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Division</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date Applied</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 text-gray-800 font-bold">{reg.nim}</td>
                    <td className="p-4 text-gray-800 font-semibold">{reg.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{reg.division}</td>
                    <td className="p-4 text-gray-500">{reg.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        reg.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                        reg.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setModalConfig({ isOpen: true, type: 'view', data: reg })} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="View Details">
                          <FiEye />
                        </button>
                        <button onClick={() => setModalConfig({ isOpen: true, type: 'accept', data: reg })} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Accept">
                          <FiCheckCircle />
                        </button>
                        <button onClick={() => setModalConfig({ isOpen: true, type: 'reject', data: reg })} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Reject">
                          <FiXCircle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No registrations found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Modal Overlay */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                {modalConfig.type === 'view' ? 'Intern Details' : 
                 modalConfig.type === 'accept' ? 'Confirm Acceptance' : 
                 'Confirm Rejection'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalConfig.type === 'view' && modalConfig.data && (
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Full Name</span>
                    <span className="font-semibold text-gray-800">{modalConfig.data.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">NIM</span>
                    <span className="font-semibold text-gray-800">{modalConfig.data.nim}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Target Division</span>
                    <span className="font-semibold text-gray-800">{modalConfig.data.division}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Application Date</span>
                    <span className="font-semibold text-gray-800">{modalConfig.data.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Current Status</span>
                    <span className="font-semibold mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        modalConfig.data.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                        modalConfig.data.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {modalConfig.data.status}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {(modalConfig.type === 'accept' || modalConfig.type === 'reject') && modalConfig.data && (
                <div className="text-gray-600 leading-relaxed">
                  Are you sure you want to <span className={`font-bold ${modalConfig.type === 'accept' ? 'text-green-600' : 'text-red-600'}`}>
                    {modalConfig.type === 'accept' ? 'ACCEPT' : 'REJECT'}
                  </span> <strong>{modalConfig.data.name}</strong> for the {modalConfig.data.division} position?
                  {modalConfig.type === 'reject' && (
                    <p className="mt-2 text-sm text-red-500">This action cannot be undone and an automated email will be sent.</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal} 
                className="px-5 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
              >
                {modalConfig.type === 'view' ? 'Close' : 'Cancel'}
              </button>
              
              {modalConfig.type === 'accept' && (
                <button 
                  onClick={confirmAction}
                  className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-sm"
                >
                  Yes, Accept
                </button>
              )}

              {modalConfig.type === 'reject' && (
                <button 
                  onClick={confirmAction}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Yes, Reject
                </button>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
