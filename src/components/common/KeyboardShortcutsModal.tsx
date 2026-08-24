import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, Command } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useWorkspace();

  if (!isShortcutsModalOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navigation & Views',
      shortcuts: [
        { key: 'Cmd / Ctrl + K', desc: 'Open Command Palette / Fast Search' },
        { key: 'G then I', desc: 'Go to Issues' },
        { key: 'G then C', desc: 'Go to Active Cycle' },
        { key: 'G then P', desc: 'Go to Projects' },
        { key: 'G then R', desc: 'Go to Strategic Roadmap' },
        { key: 'G then A', desc: 'Go to Insights & Velocity' },
        { key: 'G then W', desc: 'Go to Workflow Automations' },
        { key: 'G then S', desc: 'Go to Workspace Settings' }
      ]
    },
    {
      title: 'Issue Actions',
      shortcuts: [
        { key: 'C', desc: 'Create new Issue' },
        { key: 'S', desc: 'Change Status (Backlog, Todo, In Progress, In Review, Done)' },
        { key: 'P', desc: 'Change Priority (Urgent, High, Med, Low)' },
        { key: 'A', desc: 'Assign to Team Member' },
        { key: 'L', desc: 'Add / Remove Labels' },
        { key: 'E', desc: 'Set Estimate Story Points (1, 2, 3, 5, 8)' },
        { key: 'X', desc: 'Select / Deselect Issue in List' },
        { key: 'Backspace / Del', desc: 'Delete selected issue (with Undo)' }
      ]
    },
    {
      title: 'List & Board Controls',
      shortcuts: [
        { key: 'J / ↓', desc: 'Navigate down to next issue' },
        { key: 'K / ↑', desc: 'Navigate up to previous issue' },
        { key: 'Enter / Space', desc: 'Open Issue Details Drawer' },
        { key: 'Esc', desc: 'Close open modal or clear selection' },
        { key: '1, 2, 3', desc: 'Switch Layout: 1=List, 2=Board, 3=Timeline' },
        { key: '?', desc: 'Show this Keyboard Shortcuts helper' }
      ]
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                <Keyboard size={18} />
              </div>
              <h3 className="font-semibold text-zinc-100 text-base">Keyboard Shortcuts</h3>
            </div>
            <button
              onClick={() => setIsShortcutsModalOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 p-1.5 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-6">
            {shortcutGroups.map((group) => (
              <div key={group.title} className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.shortcuts.map((sc) => (
                    <div
                      key={sc.desc}
                      className="flex items-center justify-between p-2.5 bg-zinc-800/40 hover:bg-zinc-800/80 rounded-lg border border-zinc-800/80 transition-colors text-xs"
                    >
                      <span className="text-zinc-300">{sc.desc}</span>
                      <kbd className="px-2 py-1 bg-zinc-950 text-zinc-300 font-mono font-medium rounded border border-zinc-700/80 text-[11px] shadow-inner shrink-0 ml-2">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Command size={13} className="text-indigo-400" />
              Keyboard-first engineering issue tracking
            </span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 font-mono rounded text-[10px]">Esc</kbd> to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
