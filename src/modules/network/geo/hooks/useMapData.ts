/**
 * useMapData Hook
 * Custom hook for fetching and managing map infrastructure data
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { useState, useEffect } from 'react';
import { geoService } from '../services';
import { InfrastructureData } from '../types';

interface UseMapDataResult {
  data: InfrastructureData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useMapData = (): UseMapDataResult => {
  const [data, setData] = useState<InfrastructureData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await geoService.getAllInfrastructure();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch map data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
