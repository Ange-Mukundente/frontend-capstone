'use client';

import { useOfflineActions } from '@/hooks/useOfflineActions';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SyncStatusIndicator() {
  const { isOnline, pendingCount, syncing, triggerSync } = useOfflineActions();

  if (isOnline && pendingCount === 0 && !syncing) {
    // Everything is synced and online - don't show anything
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div>
            {syncing ? (
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            ) : isOnline ? (
              pendingCount > 0 ? (
                <AlertCircle className="w-6 h-6 text-orange-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )
            ) : (
              <CloudOff className="w-6 h-6 text-red-600" />
            )}
          </div>

          {/* Status Text */}
          <div className="flex-1">
            {syncing ? (
              <div>
                <p className="font-semibold text-sm text-blue-900">Syncing...</p>
                <p className="text-xs text-gray-600">Uploading changes</p>
              </div>
            ) : isOnline ? (
              pendingCount > 0 ? (
                <div>
                  <p className="font-semibold text-sm text-orange-900">
                    {pendingCount} change{pendingCount > 1 ? 's' : ''} pending
                  </p>
                  <p className="text-xs text-gray-600">Ready to sync</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-sm text-green-900">All synced</p>
                  <p className="text-xs text-gray-600">Up to date</p>
                </div>
              )
            ) : (
              <div>
                <p className="font-semibold text-sm text-red-900">Offline</p>
                <p className="text-xs text-gray-600">
                  {pendingCount} change{pendingCount !== 1 ? 's' : ''} saved locally
                </p>
              </div>
            )}
          </div>

          {/* Sync Button */}
          {isOnline && pendingCount > 0 && !syncing && (
            <Button
              size="sm"
              onClick={triggerSync}
              className="bg-green-600 hover:bg-green-700"
            >
              <Cloud className="w-4 h-4 mr-1" />
              Sync Now
            </Button>
          )}
        </div>

        {/* Pending Actions Badge */}
        {pendingCount > 0 && (
          <div className="mt-3 pt-3 border-t">
            <Badge variant="outline" className="text-xs">
              {pendingCount} action{pendingCount > 1 ? 's' : ''} will sync when online
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}