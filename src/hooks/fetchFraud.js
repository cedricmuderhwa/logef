import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findFrauds } from '../redux/slices/fraud_cases';

export const LoadFrauds = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const data = { page: 1, limit: 12, search: 'none'}

        async function fraudsFetch(){
            
            const res = await dispatch(findFrauds(data))
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        fraudsFetch()

        return () => {
            setisLoading(true)
            setData({})
        }
        
    }, [dispatch]);

    return [isLoading, data];
}