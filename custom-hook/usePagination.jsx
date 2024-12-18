import { useCallback, useState } from "react";

const usePagination = ({
  fetchFunction,
  totalPages,
  initialPage,
  setLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleEndReached = useCallback(
    ({ distanceFromEnd }) => {
      console.log(distanceFromEnd, "distanceFromEnd",
         currentPage, totalPages);
      if (distanceFromEnd < 0) return;
      if (currentPage < totalPages) {
        fetchFunction(currentPage);
        setCurrentPage((prevPage) => prevPage + 1);

        setLoading(true);
      } else {
        setLoading(false);
      }
    },
    [currentPage, fetchFunction, totalPages]
  );

  return { currentPage, handleEndReached, setCurrentPage };
};

export default usePagination;
