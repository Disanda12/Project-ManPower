// src/utils/notify.tsx
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle } from 'lucide-react';
import React from 'react';

export const notify = {
  success: (msg: string) => 
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl flex border-l-8 border-emerald-500`}>
        <div className="flex-1 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <div className="ml-3">
              <p className="text-sm font-bold text-slate-900">Success!</p>
              <p className="text-xs text-slate-500">{msg}</p>
            </div>
          </div>
        </div>
      </div>
    )),

  error: (msg: string) => 
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl flex border-l-8 border-rose-500`}>
        <div className="flex-1 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-rose-500" />
            <div className="ml-3">
              <p className="text-sm font-bold text-slate-900">Error</p>
              <p className="text-xs text-slate-500">{msg}</p>
            </div>
          </div>
        </div>
      </div>
    ))
};