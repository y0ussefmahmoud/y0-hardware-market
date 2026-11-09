// ===== Admin Operations Command Center =====
// High-tech silicon logistics, bench burn-in controller, and InstaPay radar
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import React, { useState, useEffect } from 'react';

interface AdminCommandCenterProps {
  locale?: string;
}

export default function AdminCommandCenter({ locale = 'en' }: AdminCommandCenterProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'instapay' | 'assembly' | 'burnin' | 'dispatch'>('all');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [instapayStatus, setInstapayStatus] = useState<'pending' | 'authorized' | 'flagged'>('pending');
  const [benchStatuses, setBenchStatuses] = useState({
    b1: { signed: false, temp: 68, gpuTemp: 62 },
    b2: { signed: false, temp: 71, gpuTemp: 66 },
    b3: { overridden: false, temp: 89, gpuTemp: 58 },
    b4: { signed: false, temp: 64, gpuTemp: 59 },
  });
  const [currentTime, setCurrentTime] = useState('');
  const [syncStatus, setSyncStatus] = useState('SYNC BUFFER');
  const [isSyncing, setIsSyncing] = useState(false);
  const [serialInput, setSerialInput] = useState('');
  const [serialLogs, setSerialLogs] = useState<string[]>([
    'SN: RTX4090-OC-2026-CAI-08421 -> Assigned to Warranty Hub',
    'SN: i9-14900K-DIE-991204 -> Bin Tested Nominal',
  ]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC+2');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStatus('SYNCING...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('BUFFER SYNCED (0ms)');
      setTimeout(() => setSyncStatus('SYNC BUFFER'), 2500);
    }, 800);
  };

  const handleAuthorizeInstapay = () => {
    setInstapayStatus('authorized');
    setShowReceiptModal(false);
  };

  const handleFlagInstapay = () => {
    setInstapayStatus('flagged');
    setShowReceiptModal(false);
  };

  const handleAddSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    setSerialLogs(prev => [`SN: ${serialInput.trim().toUpperCase()} -> Verified & Locked`, ...prev.slice(0, 4)]);
    setSerialInput('');
  };

  return (
    <div className="w-full bg-surface text-on-surface antialiased rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 font-body-md select-none">
      {/* COMMAND OPS TOP BANNER */}
      <section className="w-full bg-surface-container-lowest px-4 sm:px-6 py-4 shadow-md border-b border-surface-container-high">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Left: Node Status Indicator & Tech Allocation */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-lg border border-primary-container/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base text-primary tracking-tight font-bold">NODE: CAIRO COMMAND</span>
                  <span className="font-mono text-xs bg-surface-container-highest text-tertiary-fixed px-1.5 py-0.5 rounded font-bold">ONLINE</span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant">LATENCY: 12ms // HUB SECURE SSL-V3</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-on-surface-variant text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary-container">engineering</span>
                <span>TECH ON DUTY: <strong className="text-on-surface">6/8 ACTIVE</strong></span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-tertiary-fixed">thermostat</span>
                <span>CLEANROOM: <strong className="text-on-surface">19.4°C / 42% RH</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Real-time Telemetry & Global Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="flex flex-col text-right">
              <span className="font-mono text-xs sm:text-sm text-on-surface font-bold tracking-wider">{currentTime || '2026-11-08 21:40:00 UTC+2'}</span>
              <span className="font-mono text-[10px] text-outline tracking-widest uppercase">EGYPT STANDARD TIME (CAIRO)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface font-mono text-xs px-3 py-2 rounded-lg transition-all shadow-sm border border-outline-variant/40"
              >
                <span className={`material-symbols-outlined text-sm text-primary-container ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
                <span>{syncStatus}</span>
              </button>
              <button
                onClick={() => alert('Cairo Telemetry Dispatch initiated. Couriers and cleanroom technicians notified.')}
                className="flex items-center gap-1.5 bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-mono text-xs px-3 py-2 rounded-lg transition-all shadow-[0_0_16px_rgba(0,242,254,0.35)] font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">emergency</span>
                <span>OPS DISPATCH</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK KPI METRICS TELEMETRY BAR */}
      <section className="w-full px-4 sm:px-6 py-4 bg-surface-container-lowest/70 border-b border-surface-container-high">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: GMV */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant mb-1">
              <span className="font-mono text-xs uppercase tracking-wider">Today GMV / Cleared</span>
              <span className="material-symbols-outlined text-lg text-primary-container">trending_up</span>
            </div>
            <div>
              <div className="font-mono text-xl text-on-surface font-extrabold tracking-tight">
                1,842,500 <span className="text-xs text-primary-container font-semibold">EGP</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs font-mono">
                <span className="text-tertiary-fixed font-bold">+18.4%</span>
                <span className="text-outline">vs Cairo Day Target</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Active Pipeline */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant mb-1">
              <span className="font-mono text-xs uppercase tracking-wider">Orders in Pipeline</span>
              <span className="material-symbols-outlined text-lg text-secondary">memory</span>
            </div>
            <div>
              <div className="font-mono text-xl text-on-surface font-extrabold tracking-tight">
                34 <span className="text-xs text-secondary font-semibold">Active Rigs</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>
                <span className="text-on-surface-variant text-[11px]">9 Assembly / 12 Burn-In / 6 Transit</span>
              </div>
            </div>
          </div>

          {/* Metric 3: InstaPay Receipts */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all border border-error/20">
            <div className="flex items-center justify-between text-on-surface-variant mb-1">
              <span className="font-mono text-xs uppercase tracking-wider">InstaPay Clearance</span>
              <span className="material-symbols-outlined text-lg text-error">pending_actions</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xl text-error font-extrabold tracking-tight">
                  {instapayStatus === 'authorized' ? '6 Pending' : '7 Pending'}
                </span>
                <span className="font-mono text-xs text-outline">482.9k EGP</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs font-mono">
                <span className="text-error font-semibold">High Priority</span>
                <span className="text-outline">• Cairo manual token match</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Bench Rigs In-Flight */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all border border-tertiary-container/20">
            <div className="flex items-center justify-between text-on-surface-variant mb-1">
              <span className="font-mono text-xs uppercase tracking-wider">Bench Stress Tests</span>
              <span className="material-symbols-outlined text-lg text-tertiary-fixed">mode_fan</span>
            </div>
            <div>
              <div className="font-mono text-xl text-tertiary font-extrabold tracking-tight">12 Rigs Live</div>
              <div className="flex items-center gap-1 mt-1 text-xs font-mono">
                <span className="text-tertiary-fixed font-bold">100% NOMINAL</span>
                <span className="text-outline">Thermal delta &lt; 76°C</span>
              </div>
            </div>
          </div>

          {/* Metric 5: Warehouse Stock Index */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all border border-primary-container/20">
            <div className="flex items-center justify-between text-on-surface-variant mb-1">
              <span className="font-mono text-xs uppercase tracking-wider">Warehouse Silicon Fill</span>
              <span className="material-symbols-outlined text-lg text-primary-container">warehouse</span>
            </div>
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-1 font-semibold">
                <span className="text-on-surface">Nasr City: 94%</span>
                <span className="text-secondary-fixed">New Cairo: 89%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN OPERATIONAL GRID (65% / 35%) */}
      <section className="w-full px-4 sm:px-6 py-6 flex-1">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* ========================================== */}
          {/* LEFT COLUMN: ORDERS & CLEARANCE (8 of 12 cols) */}
          {/* ========================================== */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            {/* ORDERS MATRIX CARD */}
            <div className="bg-surface-container-low rounded-xl p-5 shadow-md flex flex-col gap-4 border border-outline-variant/30">
              {/* Matrix Header & Tab Switches */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-primary-container rounded-sm shadow-[0_0_8px_#00f2fe]"></span>
                  <div>
                    <h2 className="font-mono text-base sm:text-lg text-on-surface font-extrabold tracking-tight">LIVE ORDERS &amp; SILICON ALLOCATION MATRIX</h2>
                    <p className="font-mono text-xs text-on-surface-variant">Real-time Greater Cairo workstation pipeline telemetry &amp; logistics handoff</p>
                  </div>
                </div>

                {/* Parametric Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-surface-container-high">
                  {(['all', 'instapay', 'assembly', 'burnin', 'dispatch'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterTab(tab)}
                      className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                        filterTab === tab
                          ? 'bg-surface-container-high text-primary-container font-bold shadow-sm border border-primary-container/30'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {tab === 'all' && 'All (34)'}
                      {tab === 'instapay' && 'Pending InstaPay (7)'}
                      {tab === 'assembly' && 'Cleanroom Assembly (9)'}
                      {tab === 'burnin' && 'Burn-In (12)'}
                      {tab === 'dispatch' && 'Dispatch (6)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* High-Density Operations Table */}
              <div className="overflow-x-auto rounded-lg bg-surface-container-lowest shadow-inner border border-surface-container-high">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-surface-container-high/80 text-on-surface-variant uppercase tracking-wider text-[11px] border-b border-surface-container-highest">
                      <th className="py-2.5 px-3">Order # / Timestamp</th>
                      <th className="py-2.5 px-3">Customer &amp; Zone</th>
                      <th className="py-2.5 px-3">Allocated Silicon Rig</th>
                      <th className="py-2.5 px-3 text-right">Value (EGP)</th>
                      <th className="py-2.5 px-3">Payment Clearance</th>
                      <th className="py-2.5 px-3">QA Pipeline</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/40">
                    {/* ROW 1: Pending InstaPay Receipt */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest/60">
                      <td className="py-3 px-3 font-semibold text-primary">
                        <div>#Y0-CAI-948201</div>
                        <span className="text-outline font-normal text-[10px]">14:32:10 Today</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-on-surface">Kareem M.</div>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-tertiary-fixed">location_on</span>
                          <span>New Cairo (Bay 5)</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-on-surface font-semibold truncate max-w-[210px]" title="RTX 4090 24GB + i9-14900K + Z790 Hero">
                          RTX 4090 + 14900K + Z790
                        </div>
                        <div className="text-[10px] text-secondary">64GB DDR5-6600 • 2TB Gen5</div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-on-surface">
                        158,249 <span className="text-[10px] text-outline">EGP</span>
                      </td>
                      <td className="py-3 px-3">
                        {instapayStatus === 'authorized' ? (
                          <span className="inline-flex items-center gap-1 bg-tertiary-container/30 text-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            CLEARANCE OK
                          </span>
                        ) : instapayStatus === 'flagged' ? (
                          <span className="inline-flex items-center gap-1 bg-error-container/40 text-error px-2 py-0.5 rounded text-[10px] font-bold">
                            FLAGGED // RE-CHECK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-error-container/40 text-error px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            InstaPay: PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 w-28">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-tertiary font-bold">03/05 Burn-In</span>
                            <span className="text-outline">82%</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                            <div className="bg-tertiary-fixed-dim h-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setShowReceiptModal(true)}
                          className="bg-primary-container hover:bg-surface-tint text-on-primary-fixed px-2.5 py-1 rounded font-bold text-[11px] shadow-sm transition-all flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">receipt_long</span>
                          <span>Inspect Receipt</span>
                        </button>
                      </td>
                    </tr>

                    {/* ROW 2: Zamalek Outpost */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
                      <td className="py-3 px-3 font-semibold text-primary">
                        <div>#Y0-CAI-948195</div>
                        <span className="text-outline font-normal text-[10px]">13:15:42 Today</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-on-surface">Tarek H.</div>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-tertiary-fixed">location_on</span>
                          <span>Zamalek Island</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-on-surface font-semibold truncate max-w-[210px]">RX 7900 XTX + 7800X3D</div>
                        <div className="text-[10px] text-secondary">32GB EXPO • Liquid AIO 360</div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-on-surface">
                        118,400 <span className="text-[10px] text-outline">EGP</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 bg-surface-container-high text-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          InstaPay #TX-99214
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 w-28">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-primary font-bold">04/05 N2 Sealed</span>
                            <span className="text-outline">100%</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                            <div className="bg-primary-container h-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => alert('Waybill #Y0-CAI-948195 generated and dispatched to Zebra printer.')}
                          className="bg-surface-container-high hover:bg-surface-bright text-on-surface px-2.5 py-1 rounded text-[11px] font-bold shadow-sm transition-all flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-primary-container">print</span>
                          <span>Waybill</span>
                        </button>
                      </td>
                    </tr>

                    {/* ROW 3: Nasr City Transit */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest/60">
                      <td className="py-3 px-3 font-semibold text-primary">
                        <div>#Y0-CAI-948180</div>
                        <span className="text-outline font-normal text-[10px]">11:08:19 Today</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-on-surface">Omar S.</div>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-tertiary-fixed">location_on</span>
                          <span>Nasr City Hub</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-on-surface font-semibold truncate max-w-[210px]">RTX 4080 Super + 14700K</div>
                        <div className="text-[10px] text-secondary">Corsair RM1000x Shift PSU</div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-on-surface">
                        89,300 <span className="text-[10px] text-outline">EGP</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 bg-surface-container-high text-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]">phone_android</span>
                          Vodafone Cash: OK
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 w-28">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-tertiary-fixed font-bold">05/05 Dispatch</span>
                            <span className="text-tertiary-fixed font-mono text-[9px]">Capt. Ahmed</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                            <div className="bg-tertiary-fixed h-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => alert('Radar Tracking: Courier is 1.4km from Nasr City Outpost.')}
                          className="bg-surface-container-high hover:bg-surface-bright text-on-surface px-2.5 py-1 rounded text-[11px] font-bold shadow-sm transition-all flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-tertiary-fixed">fmd_good</span>
                          <span>Track Radar</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Operations Status Strip */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-on-surface-variant font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-tertiary-fixed"></span>
                  <span>Cairo Cleanroom Buffer: 14 Slots Free (Turnaround Avg: 3.8 hrs)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Showing 3 of 34 Rigs</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface hover:bg-surface-bright">Prev</button>
                    <button className="px-2 py-0.5 rounded bg-primary-container text-on-primary-fixed font-bold">1</button>
                    <button className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface hover:bg-surface-bright">2</button>
                    <button className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface hover:bg-surface-bright">Next</button>
                  </div>
                </div>
              </div>
            </div>

            {/* INSTAPAY & CLEARANCE RADAR PREVIEW (INSPECT DRAWER CARD) */}
            <div className="bg-surface-container-low rounded-xl p-5 shadow-md flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-error rounded-sm shadow-[0_0_8px_#ffb4ab]"></span>
                  <div>
                    <h3 className="font-mono text-base text-on-surface font-extrabold tracking-tight">INSTAPAY VERIFICATION RADAR</h3>
                    <p className="font-mono text-xs text-on-surface-variant">Instant receipt token verification for active order #Y0-CAI-948201</p>
                  </div>
                </div>
                <span className="font-mono text-xs bg-error-container/30 text-error px-3 py-1 rounded font-bold uppercase tracking-wider animate-pulse">
                  {instapayStatus === 'authorized' ? '0 Unresolved Flags' : '1 Unresolved Flag'}
                </span>
              </div>

              {/* Clearance Preview Box */}
              <div className="bg-surface-container-lowest p-4 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-4 items-center border border-surface-container-high">
                {/* Scanned Receipt Details */}
                <div className="md:col-span-4 flex flex-col gap-2 font-mono text-xs">
                  <div className="text-outline uppercase text-[10px]">Receipt Telemetry Feed</div>
                  <div className="bg-surface-container-high p-3 rounded space-y-1.5 border border-surface-container-highest">
                    <div className="flex justify-between"><span className="text-outline">Ref Code:</span> <strong className="text-primary-container">#9812408129</strong></div>
                    <div className="flex justify-between"><span className="text-outline">Sender IPA:</span> <span className="text-on-surface">kareem.m@cib</span></div>
                    <div className="flex justify-between"><span className="text-outline">Target Wallet:</span> <span className="text-on-surface">y0.market@instapay</span></div>
                    <div className="flex justify-between"><span className="text-outline">Amount:</span> <strong className="text-tertiary-fixed">158,249.00 EGP</strong></div>
                    <div className="flex justify-between"><span className="text-outline">Bank Time:</span> <span className="text-on-surface">14:31:44 CAI</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-tertiary-fixed text-[11px] mt-1">
                    <span className="material-symbols-outlined text-sm">task_alt</span>
                    <span>Bank amount exact 100% hash match</span>
                  </div>
                </div>

                {/* Receipt Snapshot Visual Placeholder */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-surface-container-high rounded-lg relative overflow-hidden group border border-surface-container-highest">
                  <div className="w-full h-32 bg-surface-container-lowest rounded flex flex-col items-center justify-center relative p-3">
                    <span className="material-symbols-outlined text-4xl text-primary-container mb-1">receipt</span>
                    <span className="font-mono text-xs text-on-surface font-bold">INSTAPAY E-RECEIPT</span>
                    <span className="font-mono text-[10px] text-outline">TXID: CIB-EG-8829410</span>
                    <span className="font-mono text-xs text-tertiary-fixed mt-1 font-bold">158,249 EGP</span>
                  </div>
                  <span className="text-[10px] text-outline mt-1 font-mono">Captured via Mobile Webhook (1.2MB PNG)</span>
                </div>

                {/* Action Triggers */}
                <div className="md:col-span-4 flex flex-col justify-center gap-3">
                  <div className="text-xs text-on-surface-variant font-mono">
                    Verify serial locks and release the <strong className="text-on-surface">RTX 4090 + Core i9-14900K</strong> silicon batch to cleanroom assembly workbench #03.
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleAuthorizeInstapay}
                      className="w-full bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-mono text-xs py-2 px-3 rounded font-bold shadow-[0_0_16px_rgba(0,242,254,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">verified</span>
                      <span>AUTHORIZE &amp; ALLOCATE SILICON</span>
                    </button>
                    <button
                      onClick={handleFlagInstapay}
                      className="w-full bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-error font-mono text-xs py-2 px-3 rounded font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-error/20"
                    >
                      <span className="material-symbols-outlined text-base">flag</span>
                      <span>FLAG / REQUEST RESUBMISSION</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: BENCH CONTROL & WAREHOUSE (4 of 12 cols) */}
          {/* ========================================== */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            {/* BENCH RIG & THERMAL BURN-IN TEST CONTROL */}
            <div className="bg-surface-container-low rounded-xl p-5 shadow-md flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-tertiary-fixed rounded-sm shadow-[0_0_8px_#6ffbbe]"></span>
                  <div>
                    <h3 className="font-mono text-base text-on-surface font-extrabold tracking-tight">BENCH BURN-IN CONTROLLER</h3>
                    <p className="font-mono text-xs text-on-surface-variant">Real-time Cinebench R24 &amp; FurMark stress chambers</p>
                  </div>
                </div>
                <span className="font-mono text-xs bg-tertiary-container/30 text-tertiary-fixed px-2.5 py-0.5 rounded font-bold">
                  4 BENCHES ACTIVE
                </span>
              </div>

              {/* 4 Bench Station HUD Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {/* Bench 01 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2 shadow-sm border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-container text-[11px]">BENCH #01 (RTX 4090)</span>
                    <span className="text-[10px] bg-tertiary-fixed/20 text-tertiary-fixed px-1 rounded font-bold">
                      {benchStatuses.b1.signed ? 'SIGNED OFF' : 'PASSING'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant">
                    <div>CPU: <strong className="text-on-surface">{benchStatuses.b1.temp}°C</strong></div>
                    <div>GPU: <strong className="text-on-surface">{benchStatuses.b1.gpuTemp}°C</strong></div>
                    <div>Fans: <strong className="text-tertiary">1,850 RPM</strong></div>
                    <div>Cycle: <strong className="text-primary">168/200</strong></div>
                  </div>
                  <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full" style={{ width: '84%' }}></div>
                  </div>
                  <button
                    onClick={() => setBenchStatuses(prev => ({ ...prev, b1: { ...prev.b1, signed: true } }))}
                    className="mt-1 w-full bg-surface-container-high hover:bg-surface-bright text-on-surface py-1 rounded text-[10px] font-bold cursor-pointer"
                  >
                    {benchStatuses.b1.signed ? '✓ CERTIFIED' : 'SIGN-OFF TEST'}
                  </button>
                </div>

                {/* Bench 02 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2 shadow-sm border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-container text-[11px]">BENCH #02 (7900 XTX)</span>
                    <span className="text-[10px] bg-tertiary-fixed/20 text-tertiary-fixed px-1 rounded font-bold">
                      {benchStatuses.b2.signed ? 'SIGNED OFF' : 'PASSING'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant">
                    <div>CPU: <strong className="text-on-surface">{benchStatuses.b2.temp}°C</strong></div>
                    <div>GPU: <strong className="text-on-surface">{benchStatuses.b2.gpuTemp}°C</strong></div>
                    <div>Fans: <strong className="text-tertiary">1,920 RPM</strong></div>
                    <div>Cycle: <strong className="text-primary">192/200</strong></div>
                  </div>
                  <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full" style={{ width: '96%' }}></div>
                  </div>
                  <button
                    onClick={() => setBenchStatuses(prev => ({ ...prev, b2: { ...prev.b2, signed: true } }))}
                    className="mt-1 w-full bg-surface-container-high hover:bg-surface-bright text-on-surface py-1 rounded text-[10px] font-bold cursor-pointer"
                  >
                    {benchStatuses.b2.signed ? '✓ CERTIFIED' : 'SIGN-OFF TEST'}
                  </button>
                </div>

                {/* Bench 03 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2 shadow-sm border border-error/30">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-secondary-fixed text-[11px]">BENCH #03 (14900KS)</span>
                    <span className={`text-[10px] px-1 rounded font-bold ${benchStatuses.b3.overridden ? 'bg-tertiary-fixed/20 text-tertiary-fixed' : 'bg-error-container/40 text-error animate-pulse'}`}>
                      {benchStatuses.b3.overridden ? 'STABILIZED' : 'HEAT WARN'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant">
                    <div>CPU: <strong className={benchStatuses.b3.overridden ? 'text-on-surface' : 'text-error'}>{benchStatuses.b3.temp}°C</strong></div>
                    <div>GPU: <strong className="text-on-surface">{benchStatuses.b3.gpuTemp}°C</strong></div>
                    <div>Fans: <strong className="text-error">{benchStatuses.b3.overridden ? '2,100' : '2,400'} RPM</strong></div>
                    <div>Cycle: <strong className="text-secondary">42/200</strong></div>
                  </div>
                  <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                    <div className="bg-error h-full" style={{ width: benchStatuses.b3.overridden ? '60%' : '21%' }}></div>
                  </div>
                  <button
                    onClick={() => setBenchStatuses(prev => ({ ...prev, b3: { overridden: true, temp: 76, gpuTemp: 55 } }))}
                    className="mt-1 w-full bg-error-container text-on-error-container py-1 rounded text-[10px] font-bold cursor-pointer hover:brightness-110"
                  >
                    {benchStatuses.b3.overridden ? '✓ THROTTLED' : 'THROTTLE OVERRIDE'}
                  </button>
                </div>

                {/* Bench 04 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2 shadow-sm border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-container text-[11px]">BENCH #04 (4080 SUP)</span>
                    <span className="text-[10px] bg-tertiary-fixed/20 text-tertiary-fixed px-1 rounded font-bold">
                      {benchStatuses.b4.signed ? 'SIGNED OFF' : 'PASSING'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant">
                    <div>CPU: <strong className="text-on-surface">{benchStatuses.b4.temp}°C</strong></div>
                    <div>GPU: <strong className="text-on-surface">{benchStatuses.b4.gpuTemp}°C</strong></div>
                    <div>Fans: <strong className="text-tertiary">1,600 RPM</strong></div>
                    <div>Cycle: <strong className="text-primary">110/200</strong></div>
                  </div>
                  <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full" style={{ width: '55%' }}></div>
                  </div>
                  <button
                    onClick={() => setBenchStatuses(prev => ({ ...prev, b4: { ...prev.b4, signed: true } }))}
                    className="mt-1 w-full bg-surface-container-high hover:bg-surface-bright text-on-surface py-1 rounded text-[10px] font-bold cursor-pointer"
                  >
                    {benchStatuses.b4.signed ? '✓ CERTIFIED' : 'SIGN-OFF TEST'}
                  </button>
                </div>
              </div>
            </div>

            {/* WAREHOUSE STOCK & DIE ALLOCATION */}
            <div className="bg-surface-container-low rounded-xl p-5 shadow-md flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-6 bg-secondary rounded-sm shadow-[0_0_8px_#d2bbff]"></span>
                  <div>
                    <h3 className="font-mono text-base text-on-surface font-extrabold tracking-tight">CRITICAL SILICON RADAR</h3>
                    <p className="font-mono text-xs text-on-surface-variant">Greater Cairo dual-depot hardware parity</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Depot inventory parity verified: 100% matched across Cairo & Giza.')}
                  className="bg-surface-container-high hover:bg-surface-bright text-on-surface p-1 rounded cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">sync_alt</span>
                </button>
              </div>

              {/* Silicon Stock Feed */}
              <div className="space-y-2 font-mono text-xs">
                {/* RTX 4090 OC */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex items-center justify-between border border-surface-container-high">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-bold">NVIDIA GeForce RTX 4090 OC</span>
                    <span className="text-[10px] text-on-surface-variant">Nasr City: <strong className="text-primary-container">4 Units</strong> | New Cairo: <strong className="text-primary-container">2 Units</strong></span>
                  </div>
                  <button
                    onClick={() => alert('Transfer ticket dispatched for RTX 4090 OC.')}
                    className="bg-surface-container-high hover:bg-primary-container hover:text-on-primary-fixed text-on-surface text-[10px] font-bold px-3 py-1 rounded transition-all cursor-pointer"
                  >
                    TRANSFER
                  </button>
                </div>

                {/* Core i9-14900K */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex items-center justify-between border border-surface-container-high">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-bold">Intel Core i9-14900K Die</span>
                    <span className="text-[10px] text-on-surface-variant">Nasr City: <strong className="text-primary-container">7 Units</strong> | New Cairo: <strong className="text-primary-container">5 Units</strong></span>
                  </div>
                  <button
                    onClick={() => alert('Transfer ticket dispatched for Core i9-14900K.')}
                    className="bg-surface-container-high hover:bg-primary-container hover:text-on-primary-fixed text-on-surface text-[10px] font-bold px-3 py-1 rounded transition-all cursor-pointer"
                  >
                    TRANSFER
                  </button>
                </div>

                {/* DDR5-6600 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex items-center justify-between border border-surface-container-high">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-bold">DDR5-6600 64GB Dominator</span>
                    <span className="text-[10px] text-tertiary-fixed font-bold">11 Kits Ready In Cairo Depot</span>
                  </div>
                  <span className="text-[10px] text-tertiary-fixed font-bold bg-surface-container-high px-2 py-0.5 rounded">HEALTHY</span>
                </div>

                {/* Seasonic 1300W Warning */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex items-center justify-between border-l-2 border-l-error border border-surface-container-high">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-on-surface font-bold">Seasonic 1300W Titanium</span>
                      <span className="material-symbols-outlined text-sm text-error">warning</span>
                    </div>
                    <span className="text-[10px] text-error font-bold">3 Units Left (High Depletion Rate)</span>
                  </div>
                  <button
                    onClick={() => alert('Immediate supplier restock order PO #PO-9921 triggered.')}
                    className="bg-error-container text-on-error-container hover:brightness-110 text-[10px] font-bold px-3 py-1 rounded transition-all cursor-pointer"
                  >
                    RESTOCK
                  </button>
                </div>
              </div>
            </div>

            {/* SERIAL REGISTRY ENTRY TOOL */}
            <div className="bg-surface-container-low rounded-xl p-5 shadow-md flex flex-col gap-3 border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="w-2 h-6 bg-primary-container rounded-sm shadow-[0_0_8px_#00f2fe]"></span>
                <div>
                  <h4 className="font-mono text-xs text-on-surface uppercase font-bold tracking-wider">HARDWARE SERIAL REGISTRY TOOL</h4>
                  <p className="font-mono text-[11px] text-on-surface-variant">Cryptographic SN assignment to 3-Year Egypt Commercial Warranty</p>
                </div>
              </div>

              <form onSubmit={handleAddSerial} className="flex gap-2">
                <input
                  type="text"
                  value={serialInput}
                  onChange={(e) => setSerialInput(e.target.value)}
                  placeholder="Scan or input barcode SN (e.g. SN-4090-CAI...)"
                  className="flex-1 bg-surface-container-lowest border border-surface-container-high rounded px-3 py-1.5 font-mono text-xs text-on-surface focus:outline-none focus:border-primary-container"
                />
                <button
                  type="submit"
                  className="bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-mono text-xs font-bold px-3 py-1.5 rounded transition-all cursor-pointer shrink-0"
                >
                  LOCK SN
                </button>
              </form>

              <div className="bg-surface-container-lowest p-2.5 rounded font-mono text-[10px] space-y-1 text-on-surface-variant border border-surface-container-high max-h-24 overflow-y-auto">
                {serialLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-outline">
                    <span className="material-symbols-outlined text-[12px] text-primary-container">qr_code_scanner</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAPAY RECEIPT INSPECT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low border border-primary-container/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative font-mono">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface text-xl cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-2xl text-primary-container">receipt_long</span>
              <h3 className="text-lg font-bold text-on-surface">InstaPay Receipt Radar Match</h3>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl space-y-2 text-xs border border-surface-container-high mb-4">
              <div className="flex justify-between border-b border-surface-container-high/60 pb-1">
                <span className="text-outline">Order Reference:</span>
                <strong className="text-primary-container">#Y0-CAI-948201</strong>
              </div>
              <div className="flex justify-between border-b border-surface-container-high/60 pb-1">
                <span className="text-outline">Client Account:</span>
                <span className="text-on-surface font-semibold">kareem.m@cib</span>
              </div>
              <div className="flex justify-between border-b border-surface-container-high/60 pb-1">
                <span className="text-outline">Target Store IPA:</span>
                <span className="text-on-surface font-semibold">y0.market@instapay</span>
              </div>
              <div className="flex justify-between border-b border-surface-container-high/60 pb-1">
                <span className="text-outline">Transferred Value:</span>
                <strong className="text-tertiary-fixed text-sm">158,249.00 EGP</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Bank Reference ID:</span>
                <span className="text-on-surface">TXID: CIB-EG-8829410</span>
              </div>
            </div>

            <div className="bg-tertiary-container/20 p-3 rounded-lg border border-tertiary-fixed/30 text-xs text-tertiary-fixed flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>SHA-256 Hash signature matched InstaPay clearing node.</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAuthorizeInstapay}
                className="flex-1 bg-primary-container hover:bg-surface-tint text-on-primary-fixed py-2.5 rounded-lg font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>APPROVE &amp; RELEASE RIG</span>
              </button>
              <button
                onClick={handleFlagInstapay}
                className="flex-1 bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-error py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer border border-error/30 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>FLAG RECEIPT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
