import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Users, Search, Award, Mail, Phone, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { customers } = useStore();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const filteredCustomers = customers.filter((c) => {
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const match = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (tierFilter !== 'all' && c.tier !== tierFilter) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout
      activeSection="customers"
      title="VIP Collectors & Client Roster"
      subtitle="Overview of registered architects, private clients, lifetime spend, and patronage tiers."
    >
      <div className="space-y-6">
        
        {/* Search & Tier Filter */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search collectors by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Patronage Tiers</option>
              <option value="VIP">VIP Collectors</option>
              <option value="Gold">Gold Tier</option>
              <option value="Regular">Regular Patrons</option>
            </select>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-4 font-semibold">Collector</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Tier</th>
                  <th className="p-4 font-semibold">Orders</th>
                  <th className="p-4 font-semibold">Cumulative Spend</th>
                  <th className="p-4 font-semibold">Last Acquisition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-500">
                      No collectors found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-amber-300 font-mono">
                            {cust.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{cust.name}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">ID: {cust.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 space-y-0.5 text-zinc-300">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3 h-3 text-zinc-500" />
                          <span>{cust.email}</span>
                        </div>
                        {cust.phone && (
                          <div className="flex items-center space-x-1.5 text-zinc-500 text-[10px]">
                            <Phone className="w-3 h-3 text-zinc-600" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          cust.tier === 'VIP'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : cust.tier === 'Gold'
                            ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {cust.tier}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-zinc-200">
                        {cust.totalOrders} order(s)
                      </td>

                      <td className="p-4 font-mono font-bold text-amber-300 text-sm">
                        ${cust.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4 font-mono text-zinc-400">
                        {cust.lastOrderDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
