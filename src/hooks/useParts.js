import { useQuery } from '@tanstack/react-query';
import { partsApi } from '../api/partsApi';

export const useParts = (filters) => {
  return useQuery({
    queryKey: ['parts', filters],
    queryFn: () => partsApi.getParts(filters),
    keepPreviousData: true,
    staleTime: 30000, // Data remains "fresh" for 30 seconds
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: partsApi.getCategories,
  });
};