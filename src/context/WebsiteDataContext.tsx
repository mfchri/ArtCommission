import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getWebsiteContent,
  getLocalBundle,
  CMS_CONTENT_UPDATED_EVENT,
  CMS_SYNC_STORAGE_KEY,
  CMS_BROADCAST_CHANNEL_NAME,
} from '../services/contentService';
import { WebsiteDataBundle } from '../types/cms';

interface WebsiteDataContextType {
  data: WebsiteDataBundle;
  isLoading: boolean;
  isError: boolean;
  isPreview: boolean;
  refetch: () => void;
}

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Segera anggap stale agar sinkronisasi data selalu instan
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true, // Re-sinkronisasi otomatis saat user berpindah tab
      refetchOnMount: 'always', // Selalu evaluasi data terbaru saat komponen dimount
      refetchOnReconnect: true,
    },
  },
});

export const WebsiteDataProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useQueryClient();

  // Check if preview mode is active in query string
  const isPreview = useMemo(() => {
    return window.location.search.includes('preview=true');
  }, []);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['websiteContent', isPreview],
    queryFn: () => getWebsiteContent(isPreview),
    // Ambil data langsung dari localStorage (bukan default statis) agar render awal langsung menampilkan hasil simpanan terbaru
    initialData: () => getLocalBundle(),
    initialDataUpdatedAt: 0, // Langsung picu pembaruan latar belakang jika ada
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  // Sinkronisasi reaktif multi-tab dan dalam sesi yang sama secara real-time
  useEffect(() => {
    // 1. Tangani event internal dari aksi simpan / publish di panel admin (same tab)
    const handleLocalUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<WebsiteDataBundle>;
      if (customEvent.detail) {
        // Update cache TanStack Query secara sinkron tanpa jeda
        client.setQueryData(['websiteContent', isPreview], customEvent.detail);
        client.setQueryData(['websiteContent', !isPreview], customEvent.detail);
      }
      refetch();
    };

    // 2. Tangani event 'storage' native (terpicu saat admin mengubah data di tab lain)
    const handleStorageEvent = (e: StorageEvent) => {
      if (
        e.key === 'kaien_art_cms_bundle_v1' ||
        e.key === CMS_SYNC_STORAGE_KEY ||
        !e.key
      ) {
        client.invalidateQueries({ queryKey: ['websiteContent'] });
        refetch();
      }
    };

    // 3. Tangani BroadcastChannel antar tab/window
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel(CMS_BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (event.data?.type === 'CMS_CONTENT_UPDATED') {
            client.invalidateQueries({ queryKey: ['websiteContent'] });
            refetch();
          }
        };
      }
    } catch {
      // Abaikan jika tidak didukung
    }

    // 4. Tangani saat window kembali aktif/fokus
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener(CMS_CONTENT_UPDATED_EVENT, handleLocalUpdate);
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener(CMS_CONTENT_UPDATED_EVENT, handleLocalUpdate);
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('focus', handleFocus);
      if (bc) {
        bc.close();
      }
    };
  }, [client, isPreview, refetch]);

  const value = useMemo(
    () => ({
      data: data ?? getLocalBundle(),
      isLoading,
      isError,
      isPreview,
      refetch,
    }),
    [data, isLoading, isError, isPreview, refetch]
  );

  return (
    <WebsiteDataContext.Provider value={value}>
      {children}
    </WebsiteDataContext.Provider>
  );
};

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WebsiteDataProviderInner>{children}</WebsiteDataProviderInner>
    </QueryClientProvider>
  );
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    throw new Error('useWebsiteData must be used within a WebsiteDataProvider');
  }
  return context;
};
