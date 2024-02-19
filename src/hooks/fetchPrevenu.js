import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findPrevenus } from '../redux/slices/prevenus';

export const LoadPrevenus = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function prevenusFetch(){
            
            const res = await dispatch(findPrevenus())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        prevenusFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}