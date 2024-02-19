import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findFraudeurs } from '../redux/slices/fraudeurs';

export const LoadFraudeurs = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function fraudeursFetch(){
            
            const res = await dispatch(findFraudeurs())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        fraudeursFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}