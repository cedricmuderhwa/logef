import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { readSessions } from "../redux/slices/sessions";

export const LoadSessions = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setisLoading(true);
    async function sessionsFetch() {
      const res = await dispatch(readSessions());
      if (res?.payload) {
        setData(res?.payload);
      }
      setisLoading(false);
    }
    sessionsFetch();
  }, [dispatch]);

  return [isLoading, data];
};
