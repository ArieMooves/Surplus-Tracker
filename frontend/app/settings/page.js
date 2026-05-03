"use client";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { Settings, User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const settingSections = [
    { name: 'Profile Settings', icon: <User size={20}/>, desc: 'Update your profile, name, and contact info.' },
    { name: 'Notifications', icon: <Bell size={20}/>, desc: 'Choose how and when you get surplus updates.' },
    { name: 'Security', icon: <Shield size={20}/>, desc: 'Change your password and manage security keys.' },
  ];

  return (
    <Layout>
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
          <Settings size={32} className="text-brand-gold" />
          System Settings
        </h1>
        <p className="text-slate-500 font-medium">
          Configure your MSU Surplus Tracker preferences and security protocols
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        {settingSections.map((section) => (
          <div 
            key={section.name}
            className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-gold transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-maroon/5 rounded-xl text-brand-maroon group-hover:bg-brand-gold/20 transition-colors">
                {section.icon}
              </div>
              <div>
                <h3 className="font-black text-brand-maroon uppercase text-sm tracking-tight">
                  {section.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium">{section.desc}</p>
              </div>
            </div>
            <div className="text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity font-black">
              →
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
