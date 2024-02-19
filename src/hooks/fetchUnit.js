import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findUnits } from '../redux/slices/units';

export const LoadUnits = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function unitsFetch(){
            
            const res = await dispatch(findUnits())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        unitsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}