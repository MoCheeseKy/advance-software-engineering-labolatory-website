'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiCheck, FiLoader } from 'react-icons/fi';

interface AdminAccount {
  id_admin: number;
  username: string;
  email: string;
  role: string;
}

interface ModalState {
  type: 'edit' | 'delete' | 'add' | null;
  account: AdminAccount | null;
}

export default function AdminAccountPage() {
  const [accounts, setAccounts]   = useState<AdminAccount[]>([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [modal, setModal]         = useState<ModalState>({ type: null, account: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/account', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Failed to fetch accounts');
      setAccounts(data.data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Unable to reach the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const filteredAccounts = accounts.filter(account =>
    account.username.toLowerCase().includes(search.toLowerCase()) ||
    account.email.toLowerCase().includes(search.toLowerCase()) ||
    account.role.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Delete
  async function handleDelete() {
    if (!modal.account) return;
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/account/${modal.account.id_admin}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? 'Delete failed');
      setAccounts(prev => prev.filter(a => a.id_admin !== modal.account!.id_admin));
      setModal({ type: null, account: null });

    } catch (err: any) {
      setActionError(err.message ?? 'Delete failed.');

    } finally {
      setActionLoading(false);
    }
  }

  // Handle Edit
  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal.account) return;
    setActionLoading(true);
    setActionError(null);

    const form = e.currentTarget;
    const fd   = new FormData(form);
    const body: Record<string, string> = {};
    ['username', 'email', 'role', 'password'].forEach(key => {
      const val = (fd.get(key) as string)?.trim();
      if (val) body[key] = val;
    });

    try {
      const res = await fetch(`/api/admin/account/${modal.account.id_admin}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? 'Update failed');
      
      setAccounts(prev => prev.map(a =>
        a.id_admin === data.data.id_admin ? data.data : a
      ));
      setModal({ type: null, account: null });

    } catch (err: any) {
      setActionError(err.message ?? 'Update failed.');

    } finally {
      setActionLoading(false);
    }
  }

  // Handle Post
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);

    const form = e.currentTarget;
    const fd   = new FormData(form);
    const body: Record<string, string> = {};
    ['username', 'email', 'role', 'password'].forEach(key => {
      const val = (fd.get(key) as string)?.trim();
      if (val) body[key] = val;
    });

    try {
      const res = await fetch('/api/admin/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? 'Create failed');
      setAccounts(prev => [...prev, data.data]);
      setModal({ type: null, account: null });

    } catch (err: any) {
      setActionError(err.message ?? 'Create failed.');

    } finally {
      setActionLoading(false);
    }
  }

  function closeModal() {
    if (actionLoading) return;
    setModal({ type: null, account: null });
    setActionError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Account Management</h2>
          <p className="text-gray-500 mt-1">Manage admin user accounts and roles.</p>
        </div>
        <button
          onClick={() => { setActionError(null); setModal({ type: 'add', account: null }); }}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-sm"
        >
          <FiPlus className="text-xl" />
          <span>Add New Account</span>
        </button>
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
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Loading accounts…</div>
          ) : error ? (
            <div className="p-10 text-center text-red-500 text-sm">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Email</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Role</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.id_admin} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                      <td className="p-4 text-gray-800 font-semibold">{account.username}</td>
                      <td className="p-4 text-gray-600">{account.email}</td>
                      <td className="p-4 text-gray-600 font-medium">{account.role}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setActionError(null); setModal({ type: 'edit', account }); }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => { setActionError(null); setModal({ type: 'delete', account }); }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">
                      {search ? `No accounts found matching "${search}"` : 'No accounts found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* DELETE Modal */}
      {modal.type === 'delete' && modal.account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Account</h3>
            <p className="text-gray-500 text-sm mb-4">
              Are you sure you want to delete <span className="font-semibold text-gray-700">{modal.account.username}</span>? This action cannot be undone.
            </p>
            {actionError && <p className="text-red-500 text-xs mb-3">{actionError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                {actionLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT Modal */}
      {modal.type === 'edit' && modal.account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Account</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3">
              <FormField label="Username" name="username" defaultValue={modal.account.username} />
              <FormField label="Email" name="email" type="email" defaultValue={modal.account.email} />
              <FormField label="Role" name="role" defaultValue={modal.account.role} />
              <FormField label="New Password" name="password" type="password" placeholder="Leave blank to keep current" />
              {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={closeModal} disabled={actionLoading}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50">
                  {actionLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                  {actionLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD Modal ── */}
      {modal.type === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Add New Account</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <FormField label="Username" name="username" required />
              <FormField label="Email" name="email" type="email" required />
              <FormField label="Role" name="role" required />
              <FormField label="Password" name="password" type="password" required />
              {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={closeModal} disabled={actionLoading}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50">
                  {actionLoading ? <FiLoader className="animate-spin" /> : <FiPlus />}
                  {actionLoading ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reusable form field ────────────────────────────────────────────────────
function FormField({
  label, name, type = 'text', defaultValue, placeholder, required,
}: {
  label: string; name: string; type?: string;
  defaultValue?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
    </div>
  );
}