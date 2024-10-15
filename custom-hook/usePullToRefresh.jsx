import { useCallback, useState } from 'react';

const usePullToRefresh = ({ onRefreshFunction }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefreshHandler = useCallback(async () => {
    try {
      setRefreshing(true);
      await onRefreshFunction();
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshFunction]);

  return { refreshing, onRefreshHandler };
};

export default usePullToRefresh;