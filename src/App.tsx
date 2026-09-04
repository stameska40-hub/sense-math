import React, { useState, useEffect } from 'react';
import { AppMode, EstimationRecord } from './types';
import { Header } from './components/Header';
import { CalculatorMode } from './components/CalculatorMode';
import { SimulatorMode } from './components/SimulatorMode';
import { HowQamaWorksModal } from './components/HowQamaWorksModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { sounds } from './utils/soundEffects';

const STORAGE_KEY_RECORDS = 'qama_calc_records_v1';
const STORAGE_KEY_TOLERANCE = 'qama_calc_tolerance_v1';

export default function App() {
  const [mode, setMode] = useState<AppMode>('user-task');
  const [tolerance, setTolerance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TOLERANCE);
      return saved ? JSON.parse(saved) : 10;
    } catch {
      return 10;
    }
  });

  const [records, setRecords] = useState<EstimationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Save tolerance changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TOLERANCE, JSON.stringify(tolerance));
    } catch {}
  }, [tolerance]);

  // Save history records
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch {}
  }, [records]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  const handleRecordResult = (record: EstimationRecord) => {
    setRecords((prev) => [record, ...prev.slice(0, 49)]);
  };

  const handleClearHistory = () => {
    setRecords([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between py-8 px-4 selection:bg-indigo-600 selection:text-white">
      {/* Centered Main Container */}
      <main className="w-full max-w-md mx-auto space-y-4">
        <Header
          mode={mode}
          onModeChange={setMode}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          historyCount={records.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        />

        {/* Dynamic Mode Switch */}
        {mode === 'user-task' ? (
          <CalculatorMode
            tolerance={tolerance}
            onToleranceChange={setTolerance}
            onRecordResult={handleRecordResult}
          />
        ) : (
          <SimulatorMode
            tolerance={tolerance}
            onToleranceChange={setTolerance}
            onRecordResult={handleRecordResult}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-md mx-auto text-center text-xs text-slate-400 pt-6 space-y-1">
        <div>
          Based on the QAMA mental estimation philosophy by Ilan Samson.
        </div>
        <div>
          Keyboard shortcuts enabled
        </div>
      </footer>

      {/* Modals */}
      <HowQamaWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={records}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
