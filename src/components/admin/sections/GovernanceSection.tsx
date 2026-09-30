'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAdmin } from '@/context/AdminContext';
import { Crown, CheckCircle2, XCircle, Trash2, Shield, AlertTriangle, Loader2 } from 'lucide-react';

export default function GovernanceSection() {
  const { data: session } = useSession();
  const { adminsList, handleAdminAction } = useAdmin();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const onAdminAction = async (id: string, action: 'APPROVE' | 'REVOKE' | 'DELETE') => {
    setActionLoadingId(id);
    await handleAdminAction(id, action);
    setActionLoadingId(null);
  };

  const isSuperAdmin = (session?.user as any)?.role === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3 max-w-md mx-auto my-12 shadow-xl">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Super Admin Access Required</h3>
        <p className="text-xs text-slate-400">
          This control section is restricted to Super Administrators for administrative role governance and security approval.
        </p>
      </div>
    );
  }

  const pendingCount = adminsList.filter((a) => !a.isApproved).length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Staff Approvals & Governance</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Newly registered staff are blocked from accessing the CMS until approved here.
              </p>
            </div>
          </div>

          {pendingCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs self-start sm:self-auto">
              {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Approval State</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {adminsList.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>{adm.name || 'Unnamed Staff'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{adm.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        adm.role === 'SUPER_ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {adm.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {adm.isApproved ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Pending Access
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(adm.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {adm.role !== 'SUPER_ADMIN' && (
                      <div className="flex items-center justify-end gap-2">
                        {!adm.isApproved ? (
                          <button
                            disabled={actionLoadingId === adm.id}
                            onClick={() => onAdminAction(adm.id, 'APPROVE')}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition shadow flex items-center gap-1 disabled:opacity-50"
                          >
                            {actionLoadingId === adm.id && <Loader2 className="w-3 h-3 animate-spin text-slate-950" />}
                            <span>Approve Access</span>
                          </button>
                        ) : (
                          <button
                            disabled={actionLoadingId === adm.id}
                            onClick={() => onAdminAction(adm.id, 'REVOKE')}
                            className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-bold text-[11px] transition flex items-center gap-1 disabled:opacity-50"
                          >
                            {actionLoadingId === adm.id && <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
                            <span>Revoke</span>
                          </button>
                        )}
                        <button
                          disabled={actionLoadingId === adm.id}
                          onClick={() => onAdminAction(adm.id, 'DELETE')}
                          className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition disabled:opacity-50"
                          title="Delete staff account"
                        >
                          {actionLoadingId === adm.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
