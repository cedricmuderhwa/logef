import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { findAgents } from "../redux/slices/agents";

export const LoadAgents = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    setisLoading(true);
    async function agentsFetch() {
      const res = await dispatch(findAgents(controller));
      if (res?.payload) {
        setData(res?.payload);
      }
      setisLoading(false);
    }
    agentsFetch();

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  return [isLoading, data];
};
