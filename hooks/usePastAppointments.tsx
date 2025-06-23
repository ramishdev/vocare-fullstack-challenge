// hooks/usePastAppointments.ts
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { formatISO } from 'date-fns';
import fetcher from '@/lib/fetcher';
import { AppointmentWithCategory } from '@/types/types';
import React from 'react';

const PAGE_SIZE = 15;

export function usePastAppointments(selectedDate: Date) {
  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPage) => {
    // stop if last page was shorter than PAGE_SIZE
    if (previousPage && previousPage.length < PAGE_SIZE) return null;

    const cursor =
      pageIndex === 0
        ? formatISO(selectedDate)
        : previousPage[previousPage.length - 1].start;

    return `/api/appointments?view=list&direction=prev&date=${encodeURIComponent(cursor)}&limit=${PAGE_SIZE}`;
  };
  const shouldLoad = React.useRef(false);
  const { data, size, setSize, error, isValidating } = useSWRInfinite<AppointmentWithCategory[]>(getKey, fetcher, {
    // tell SWRf to start with zero pages
    initialSize: 0,
  });

  const pages = data ?? [];
  const appointments = pages.flat();
  const isLoading = (!data && !error) || isValidating;
  const hasMore =
    size === 0
      ? true
      : pages.length > 0 && pages[pages.length - 1].length === PAGE_SIZE;
  const loadMorePast = () => {
    if (!shouldLoad.current) {
      shouldLoad.current = true;
      setSize(1); // trigger fetching pageIndex=0
    } else {
      setSize(size + 1);
    }
  };
  return {
    appointments,
    loadMorePast,
    hasMorePast: hasMore,
    isLoadingPast: isLoading,
    errorPast: error,
  };
}
