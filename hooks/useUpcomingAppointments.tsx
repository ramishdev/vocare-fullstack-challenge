// hooks/useUpcomingAppointments.ts
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { formatISO } from 'date-fns';
import fetcher from '@/lib/fetcher';
import { AppointmentWithCategory } from '@/types/types';

const PAGE_SIZE = 15;

export function useUpcomingAppointments(selectedDate: Date) {
  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPage) => {
    if (previousPage && previousPage.length < PAGE_SIZE) return null;
    console.log(pageIndex);

    const cursor =
      pageIndex === 0
        ? formatISO(selectedDate)
        : previousPage[previousPage.length - 1].start;

    return `/api/appointments?view=list${pageIndex > 0 ? '&direction=next' : ''}&date=${encodeURIComponent(cursor)}&limit=${PAGE_SIZE}`;
  };

  const { data, size, setSize, error, isValidating } = useSWRInfinite<
    AppointmentWithCategory[]
  >(getKey, fetcher);

  const pages = data ?? [];
  const appointments = pages.flat();
  const isLoading = (!data && !error) || isValidating;
  const hasMore =
    pages.length > 0 && pages[pages.length - 1].length === PAGE_SIZE;

  return {
    appointments,
    loadMoreUpcoming: () => setSize(size + 1),
    hasMoreUpcoming: hasMore,
    isLoadingUpcoming: isLoading,
    errorUpcoming: error,
  };
}
