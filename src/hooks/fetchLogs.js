import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { findLogs } from "../redux/slices/logs";

export const LoadLogs = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setisLoading(true);
    async function logsFetch() {
      const res = await dispatch(findLogs());
      if (res?.payload) {
        setData(res?.payload);
      }
      setisLoading(false);
    }
    logsFetch();
  }, [dispatch]);

  return [isLoading, data];
};
