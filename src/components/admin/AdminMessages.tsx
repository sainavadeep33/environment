import React from 'react';
import { Mail, Clock, CheckCircle2, MessageSquare, Building, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const AdminMessages: React.FC = () => {
  const { contactMessages, updateMessageStatus } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Inquiries & Partnership Messages
        </h3>
        <p className="text-xs text-slate-500">
          Messages received via the public landing page contact form.
        </p>
      </div>

      {contactMessages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
          <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-semibold text-slate-700 text-sm">Inbox Empty</h4>
          <p className="text-xs text-slate-400 mt-1">
            New contact submissions will be displayed here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3 ${
                msg.status === 'unread'
                  ? 'border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-400/30'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{msg.name}</span>
                  <span className="text-xs text-slate-500">&lt;{msg.email}&gt;</span>
                  {msg.organization && (
                    <Badge variant="slate" size="sm" icon={<Building className="w-3 h-3" />}>
                      {msg.organization}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="mint" size="sm">
                    {msg.enquiry_type}
                  </Badge>
                  <Badge
                    variant={
                      msg.status === 'unread'
                        ? 'amber'
                        : msg.status === 'responded'
                        ? 'emerald'
                        : 'slate'
                    }
                    size="sm"
                  >
                    {msg.status}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">
                {msg.message}
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>Received {new Date(msg.created_at).toLocaleString()}</span>

                <div className="flex items-center gap-2">
                  {msg.status === 'unread' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMessageStatus(msg.id, 'read')}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {msg.status !== 'responded' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateMessageStatus(msg.id, 'responded')}
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Mark Responded
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
