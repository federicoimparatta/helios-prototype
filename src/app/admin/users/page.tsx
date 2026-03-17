"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  X,
  Upload,
  ChevronLeft,
  Check,
  ChevronDown,
} from "lucide-react";
import { users as mockUsers, dataCenters } from "@/lib/mock-data";

type Role = "super_admin" | "org_admin" | "dc_admin" | "operator" | "viewer";

const roleColors: Record<Role, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  org_admin: "bg-blue-100 text-blue-700",
  dc_admin: "bg-teal/10 text-teal-dark",
  operator: "bg-emerald-100 text-emerald-700",
  viewer: "bg-slate-100 text-slate-600",
};

const roleOptions: { value: Role; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "org_admin", label: "Org Admin" },
  { value: "dc_admin", label: "DC Admin" },
  { value: "operator", label: "Operator" },
  { value: "viewer", label: "Viewer" },
];

function siteName(id: string) {
  return dataCenters.find((dc) => dc.id === id)?.name.replace(/DC Site \d+ \(/, "").replace(")", "") || id;
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);

  // Invite form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("viewer");
  const [inviteSites, setInviteSites] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  function toggleSite(siteId: string) {
    setInviteSites((prev) =>
      prev.includes(siteId) ? prev.filter((s) => s !== siteId) : [...prev, siteId]
    );
  }

  function resetInviteForm() {
    setInviteName("");
    setInviteEmail("");
    setInviteRole("viewer");
    setInviteSites([]);
    setShowInviteModal(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <div className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin" className="text-slate-400 hover:text-navy transition-colors">
              Admin
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">Users</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                <p className="text-sm text-slate-500">{mockUsers.length} registered users</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBulkImport(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
              >
                <Upload className="w-4 h-4" />
                Bulk Import
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Invite User
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left font-medium text-slate-500 px-5 py-3">Name</th>
                <th className="text-left font-medium text-slate-500 px-4 py-3">Email</th>
                <th className="text-left font-medium text-slate-500 px-4 py-3">Role</th>
                <th className="text-left font-medium text-slate-500 px-4 py-3">Assigned Sites</th>
                <th className="text-right font-medium text-slate-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold text-xs">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${roleColors[user.role]}`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {user.sites.map((siteId) => (
                        <span
                          key={siteId}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium"
                        >
                          {siteName(siteId)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    No users match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={resetInviteForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Invite User</h2>
              <button
                onClick={resetInviteForm}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="john.doe@us.q-cells.com"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all appearance-none cursor-pointer"
                  >
                    {roleOptions.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Sites */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign Sites</label>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {dataCenters.map((dc) => (
                    <label
                      key={dc.id}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          inviteSites.includes(dc.id)
                            ? "bg-navy border-navy"
                            : "border-slate-300 bg-white"
                        }`}
                        onClick={() => toggleSite(dc.id)}
                      >
                        {inviteSites.includes(dc.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-slate-700">{dc.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={resetInviteForm}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resetInviteForm}
                className="px-5 py-2.5 text-sm font-medium bg-navy text-white rounded-lg hover:bg-navy-light transition-colors shadow-sm"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setShowBulkImport(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Bulk Import Users</h2>
              <button
                onClick={() => setShowBulkImport(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-navy/30 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Drop your Excel file here, or click to browse
                </p>
                <p className="text-xs text-slate-400">
                  Supports .xlsx, .csv files up to 5MB
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                Template columns: Name, Email, Role, Sites (comma-separated)
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowBulkImport(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowBulkImport(false)}
                className="px-5 py-2.5 text-sm font-medium bg-navy text-white rounded-lg hover:bg-navy-light transition-colors shadow-sm"
              >
                Upload & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
