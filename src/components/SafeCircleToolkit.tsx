import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  ClipboardList,
  PhoneCall,
  Clock,
  MapPin,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Search,
  ShieldCheck,
  Play,
  RotateCcw
} from 'lucide-react';
import { TrustedContact, SafetyPlan, SupportResource } from '../../shared/types';
import { VERIFIED_SUPPORT_RESOURCES } from '../../shared/missionsData';
import { storage } from '../utils/storage';
import { soundCtrl } from '../utils/sound';

interface SafeCircleProps {
  onBack: () => void;
}

type TabType = 'contacts' | 'plan' | 'directory' | 'checkin' | 'nearby' | 'cyber';

export const SafeCircleToolkit: React.FC<SafeCircleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('contacts');
  const heroName = storage.getSettings().heroName || 'Hero';

  // Module A: Contacts State
  const [contacts, setContacts] = useState<TrustedContact[]>(storage.getContacts());
  const [contactName, setContactName] = useState('');
  const [contactRelationship, setContactRelationship] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactError, setContactError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Module B: Safety Plan State
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>(storage.getSafetyPlan());
  const [planSavedMsg, setPlanSavedMsg] = useState(false);

  // Module C & E: Directory & Search
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Module D: Check-In Companion State
  const [checkInDuration, setCheckInDuration] = useState<number>(15); // minutes
  const [checkInRemaining, setCheckInRemaining] = useState<number | null>(null);
  const [checkInActive, setCheckInActive] = useState<boolean>(false);
  const [checkInAlarm, setCheckInAlarm] = useState<boolean>(false);

  // Check-In countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checkInActive && checkInRemaining !== null && checkInRemaining > 0) {
      timer = setInterval(() => {
        setCheckInRemaining(prev => {
          if (prev === null || prev <= 1) {
            setCheckInAlarm(true);
            soundCtrl.playIncorrect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [checkInActive, checkInRemaining]);

  // CONTACTS HANDLERS
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');

    if (!contactName.trim() || !contactRelationship.trim() || !contactPhone.trim()) {
      setContactError('Please fill in all contact fields.');
      return;
    }

    // Phone validation regex
    const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\d{10})$/;
    const cleanPhone = contactPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 8) {
      setContactError('Please enter a valid phone number (minimum 8 digits).');
      return;
    }

    let updatedContacts: TrustedContact[];
    if (editingId) {
      updatedContacts = contacts.map(c =>
        c.id === editingId
          ? { ...c, name: contactName, relationship: contactRelationship, phoneNumber: contactPhone }
          : c
      );
      setEditingId(null);
    } else {
      const newContact: TrustedContact = {
        id: 'c_' + Date.now(),
        name: contactName,
        relationship: contactRelationship,
        phoneNumber: contactPhone
      };
      updatedContacts = [...contacts, newContact];
    }

    setContacts(updatedContacts);
    storage.saveContacts(updatedContacts);
    setContactName('');
    setContactRelationship('');
    setContactPhone('');
    soundCtrl.playSelect();
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    storage.saveContacts(updated);
    soundCtrl.playSelect();
  };

  const handleEditContact = (c: TrustedContact) => {
    setEditingId(c.id);
    setContactName(c.name);
    setContactRelationship(c.relationship);
    setContactPhone(c.phoneNumber);
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard?.writeText(phone);
    soundCtrl.playSelect();
  };

  // CHECK-IN HANDLERS
  const handleStartCheckIn = () => {
    setCheckInRemaining(checkInDuration * 60);
    setCheckInActive(true);
    setCheckInAlarm(false);
    soundCtrl.playSelect();
  };

  const handleConfirmArrival = () => {
    setCheckInActive(false);
    setCheckInRemaining(null);
    setCheckInAlarm(false);
    soundCtrl.playVictory();
  };

  const handleCancelCheckIn = () => {
    setCheckInActive(false);
    setCheckInRemaining(null);
    setCheckInAlarm(false);
    soundCtrl.playSelect();
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter Directory
  const filteredResources = VERIFIED_SUPPORT_RESOURCES.filter(r => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const q = directoryQuery.toLowerCase();
    const matchesQ =
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.coverage.toLowerCase().includes(q) ||
      r.tags.some((t: string) => t.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 bg-midnight/85 backdrop-blur-md select-none overflow-y-auto">
      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-white/10">
        <button
          onClick={() => { soundCtrl.playSelect(); onBack(); }}
          onMouseEnter={() => soundCtrl.playHover()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigoDeep/80 hover:bg-darkViolet border border-white/10 text-xs text-mutedLavender hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-2xl font-black font-orbitron text-white tracking-wider flex items-center gap-2 justify-center">
            <ShieldCheck className="w-5 h-5 text-successMint" />
            <span>SAFECIRCLE TOOLKIT</span>
          </h2>
          <p className="text-[11px] text-mutedLavender">
            Client-Side Verified Safety Modules & Preparedness for <span className="text-softCyan font-bold">{heroName}</span>
          </p>
        </div>

        <div className="text-[11px] font-mono text-softCyan px-3 py-1 rounded-full bg-darkViolet/80 border border-neonLavender/30 hidden sm:block">
          LOCAL PRIVACY ACTIVE
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="relative z-10 w-full max-w-6xl mx-auto my-4 flex flex-wrap gap-2 justify-center">
        {[
          { id: 'contacts', label: 'Trusted Contacts', icon: Users },
          { id: 'plan', label: 'Safety Plan', icon: ClipboardList },
          { id: 'directory', label: 'Emergency 112 Directory', icon: PhoneCall },
          { id: 'checkin', label: 'Check-In Companion', icon: Clock },
          { id: 'nearby', label: 'Find Help Nearby', icon: MapPin },
          { id: 'cyber', label: 'Digital Safety Center', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { soundCtrl.playSelect(); setActiveTab(tab.id as TabType); }}
              onMouseEnter={() => soundCtrl.playHover()}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-electricBlue text-midnight shadow-glow-blue font-orbitron font-bold'
                  : 'bg-indigoDeep/70 hover:bg-darkViolet text-mutedLavender hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto py-2">
        {/* MODULE A: TRUSTED CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10">
              <h3 className="text-base font-bold font-orbitron text-white mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-softCyan" />
                <span>Manage Trusted Contacts</span>
              </h3>
              <p className="text-xs text-mutedLavender mb-4">
                Contacts are stored locally in your browser storage and never transmitted to remote servers.
              </p>

              {/* Add / Edit Form */}
              <form onSubmit={handleSaveContact} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Maya Lin)"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-midnight/80 border border-white/15 text-xs text-white placeholder-mutedLavender/60 focus:outline-none focus:border-softCyan"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Roommate / Ally)"
                  value={contactRelationship}
                  onChange={e => setContactRelationship(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-midnight/80 border border-white/15 text-xs text-white placeholder-mutedLavender/60 focus:outline-none focus:border-softCyan"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. +91 98765 43210)"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-midnight/80 border border-white/15 text-xs text-white placeholder-mutedLavender/60 focus:outline-none focus:border-softCyan"
                />
                <div className="sm:col-span-3 flex justify-between items-center pt-1">
                  {contactError && (
                    <span className="text-xs text-dangerRed flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {contactError}
                    </span>
                  )}
                  <div className="ml-auto flex gap-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setContactName('');
                          setContactRelationship('');
                          setContactPhone('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-mutedLavender hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-successMint hover:bg-successMint/90 text-midnight text-xs font-bold font-orbitron flex items-center gap-1.5 shadow-glow-mint"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{editingId ? 'Update Contact' : 'Add Contact'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Contact Cards List */}
              <div className="space-y-2 mt-4">
                {contacts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-mutedLavender bg-midnight/40 rounded-xl">
                    No trusted contacts added yet. Add close allies or guardians above.
                  </div>
                ) : (
                  contacts.map(c => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-midnight/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{c.name}</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-darkViolet text-neonLavender">
                            {c.relationship}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-softCyan mt-0.5">
                          {c.phoneNumber}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${c.phoneNumber}`}
                          className="px-3 py-1 rounded-lg bg-electricBlue/20 text-softCyan hover:bg-electricBlue hover:text-midnight text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <button
                          onClick={() => handleCopyPhone(c.phoneNumber)}
                          title="Copy phone"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-mutedLavender hover:text-white text-xs transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditContact(c)}
                          title="Edit contact"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-softCyan text-xs transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          title="Delete contact"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-dangerRed/20 text-dangerRed text-xs transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODULE B: PERSONAL SAFETY PLAN */}
        {activeTab === 'plan' && (
          <div className="p-6 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-5">
            <div>
              <h3 className="text-base font-bold font-orbitron text-white mb-1 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-softCyan" />
                <span>Personal Safety Plan</span>
              </h3>
              <p className="text-xs text-mutedLavender">
                Customize your pre-planned safe havens, transit checkpoints, and emergency notes.
              </p>
            </div>

            {/* Check-In Preferences */}
            <div>
              <label className="text-xs font-bold text-softCyan block mb-1.5">
                Check-in Protocol / Trusted Group Message:
              </label>
              <textarea
                value={safetyPlan.checkInPreferences}
                onChange={e => setSafetyPlan({ ...safetyPlan, checkInPreferences: e.target.value })}
                rows={2}
                className="w-full p-3 rounded-xl bg-midnight/80 border border-white/15 text-xs text-white focus:outline-none focus:border-softCyan"
              />
            </div>

            {/* Transit Checklist */}
            <div>
              <label className="text-xs font-bold text-softCyan block mb-1.5">
                Rideshare & Commute Verification Checklist:
              </label>
              <div className="space-y-1.5">
                {safetyPlan.transitChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-mutedLavender">
                    <CheckCircle className="w-3.5 h-3.5 text-successMint" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Notes */}
            <div>
              <label className="text-xs font-bold text-softCyan block mb-1.5">
                Confidential Emergency Medical / Guardian Notes:
              </label>
              <textarea
                value={safetyPlan.emergencyNotes}
                onChange={e => setSafetyPlan({ ...safetyPlan, emergencyNotes: e.target.value })}
                rows={2}
                className="w-full p-3 rounded-xl bg-midnight/80 border border-white/15 text-xs text-white focus:outline-none focus:border-softCyan"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-mutedLavender">
                Last updated: {new Date(safetyPlan.updatedAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => {
                  storage.saveSafetyPlan(safetyPlan);
                  setPlanSavedMsg(true);
                  soundCtrl.playSelect();
                  setTimeout(() => setPlanSavedMsg(false), 2500);
                }}
                className="px-5 py-2 rounded-xl bg-electricBlue hover:bg-electricBlue/90 text-midnight text-xs font-bold font-orbitron shadow-glow-blue transition cursor-pointer"
              >
                {planSavedMsg ? 'Plan Saved Locally!' : 'Save Safety Plan'}
              </button>
            </div>
          </div>
        )}

        {/* MODULE C: EMERGENCY & SUPPORT DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="p-6 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-orbitron text-white flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-successMint" />
                  <span>Verified Support Directory (India & Emergency)</span>
                </h3>
                <p className="text-xs text-mutedLavender">
                  Authoritative government helplines, police services, and statutory bodies.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-mutedLavender absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search 112, women helpline..."
                  value={directoryQuery}
                  onChange={e => setDirectoryQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl bg-midnight/80 border border-white/15 text-xs text-white focus:outline-none focus:border-softCyan"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['All', 'Emergency', 'Helpline', 'Cyber Safety', 'Campus Support'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-softCyan text-midnight'
                      : 'bg-white/5 text-mutedLavender hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Support Resources Directory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {filteredResources.map(res => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl bg-midnight/70 border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-bold text-white font-orbitron">
                        {res.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-darkViolet text-softCyan font-mono">
                        {res.category}
                      </span>
                    </div>

                    <p className="text-xs text-mutedLavender leading-relaxed mb-3">
                      {res.description}
                    </p>

                    <div className="text-[11px] text-mutedLavender/80 space-y-0.5">
                      <div>Official Source: <span className="text-white">{res.officialSource}</span></div>
                      <div>Coverage: <span className="text-softCyan">{res.coverage}</span></div>
                      <div>Verified Date: <span className="text-successMint">{res.lastVerified}</span></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={`tel:${res.contact}`}
                      className="px-3 py-1.5 rounded-lg bg-dangerRed hover:bg-dangerRed/90 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-glow-danger"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Dial {res.contact}</span>
                    </a>

                    <a
                      href={res.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-softCyan hover:underline flex items-center gap-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE D: CHECK-IN COMPANION */}
        {activeTab === 'checkin' && (
          <div className="p-6 rounded-2xl bg-indigoDeep/80 border border-white/10 text-center space-y-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold font-orbitron text-white mb-1 flex items-center gap-2 justify-center">
                <Clock className="w-5 h-5 text-softCyan" />
                <span>Check-In Companion</span>
              </h3>
              <p className="text-xs text-mutedLavender">
                Set a travel timer for walks or transit. If time runs out without arrival confirmation, an in-app safety alarm alerts you.
              </p>
            </div>

            {/* Timer Display */}
            <div className="py-6">
              <div
                className={`w-44 h-44 rounded-full mx-auto flex flex-col items-center justify-center border-4 transition-all duration-300 ${
                  checkInAlarm
                    ? 'border-dangerRed bg-dangerRed/20 shadow-glow-danger animate-bounce'
                    : checkInActive
                    ? 'border-electricBlue bg-darkViolet/40 shadow-glow-blue'
                    : 'border-white/10 bg-midnight/40'
                }`}
              >
                <span className="text-3xl font-black font-mono text-white tracking-widest">
                  {checkInRemaining !== null ? formatTime(checkInRemaining) : `${checkInDuration}:00`}
                </span>
                <span className="text-[11px] font-orbitron text-softCyan mt-1">
                  {checkInAlarm ? 'CHECK-IN EXPIRED' : checkInActive ? 'RUNNING' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Duration Selector (when idle) */}
            {!checkInActive && (
              <div className="flex justify-center gap-2">
                {[10, 15, 20, 30, 45].map(mins => (
                  <button
                    key={mins}
                    onClick={() => { soundCtrl.playSelect(); setCheckInDuration(mins); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
                      checkInDuration === mins
                        ? 'bg-softCyan text-midnight font-bold'
                        : 'bg-white/5 text-mutedLavender hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            )}

            {/* Check-In Controls */}
            <div className="flex justify-center gap-3">
              {!checkInActive ? (
                <button
                  onClick={handleStartCheckIn}
                  className="px-6 py-2.5 rounded-xl bg-electricBlue hover:bg-electricBlue/90 text-midnight text-xs font-bold font-orbitron flex items-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-midnight" />
                  <span>START CHECK-IN</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleConfirmArrival}
                    className="px-6 py-2.5 rounded-xl bg-successMint hover:bg-successMint/90 text-midnight text-xs font-bold font-orbitron flex items-center gap-2 shadow-glow-mint cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>ARRIVED SAFELY</span>
                  </button>
                  <button
                    onClick={handleCancelCheckIn}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            <div className="max-w-md mx-auto p-3 rounded-xl bg-midnight/60 border border-white/5 text-[11px] text-mutedLavender">
              Notice: Web browsers operate in sandbox mode and cannot guarantee background notifications if device sleep mode occurs. Always inform designated trusted contacts directly.
            </div>
          </div>
        )}

        {/* MODULE E: FIND HELP NEARBY */}
        {activeTab === 'nearby' && (
          <div className="p-6 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-4">
            <div>
              <h3 className="text-base font-bold font-orbitron text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-softCyan" />
                <span>Find Help Nearby (Area & City Hubs)</span>
              </h3>
              <p className="text-xs text-mutedLavender">
                Locate emergency assistance centers without requiring non-consensual geolocation tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  area: 'Pan-India Police Hub',
                  type: 'Police / Emergency Desk',
                  landmark: 'Dial 112 from any mobile or landline',
                  action: 'tel:112'
                },
                {
                  area: 'Transit Assistance Point',
                  type: 'Metro & Railway Police (GRP)',
                  landmark: 'Located at Station Master Office / Platform 1',
                  action: 'tel:1512'
                },
                {
                  area: 'One Stop Centre (Sakhi)',
                  type: 'Integrated Support for Women',
                  landmark: 'District Hospital / District Magistrate complex',
                  action: 'tel:181'
                }
              ].map((loc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-midnight/60 border border-white/10">
                  <div className="text-xs font-bold font-orbitron text-white mb-1">{loc.area}</div>
                  <div className="text-[11px] text-softCyan mb-2">{loc.type}</div>
                  <p className="text-xs text-mutedLavender mb-3">{loc.landmark}</p>
                  <a
                    href={loc.action}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-electricBlue/20 text-softCyan hover:bg-electricBlue hover:text-midnight text-xs font-semibold transition"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Contact Unit</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE F: DIGITAL SAFETY CENTER */}
        {activeTab === 'cyber' && (
          <div className="p-6 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-4">
            <div>
              <h3 className="text-base font-bold font-orbitron text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-neonLavender" />
                <span>Digital Safety Center & Cyber Hygiene</span>
              </h3>
              <p className="text-xs text-mutedLavender">
                Evidence-based defense protocols for cyber harassment, privacy leakage, and extortion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: 'Multi-Factor Authentication (MFA)',
                  desc: 'Activate app-based authenticator (Aegis, Google Authenticator) rather than SMS where possible to prevent SIM-swap fraud.'
                },
                {
                  title: 'Evidence Preservation Rule',
                  desc: 'Never delete threatening messages immediately. Screenshot timestamp, profile handle, URL, and full thread before blocking.'
                },
                {
                  title: 'Zero Extortion Payment Principle',
                  desc: 'Paying extortionists or blackmailers always triggers exponentially higher demands. Report immediately to 1930 / cybercrime.gov.in.'
                },
                {
                  title: 'Location Privacy Hardening',
                  desc: 'Set mobile location permissions to "Only while using app". Audit third-party apps with background location access regularly.'
                }
              ].map((tip, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-midnight/60 border border-white/10">
                  <div className="text-xs font-bold font-orbitron text-softCyan mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-successMint" />
                    <span>{tip.title}</span>
                  </div>
                  <p className="text-xs text-mutedLavender leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 w-full max-w-5xl mx-auto pt-4 text-center text-[11px] text-mutedLavender/50 border-t border-white/5">
        Client-Encrypted Storage // SafeCircle Personal Protection System
      </footer>
    </div>
  );
};
