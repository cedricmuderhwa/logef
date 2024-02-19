import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findPvs } from '../redux/slices/pvs';

export const LoadPvs = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function pvsFetch(){
            const res = await dispatch(findPvs())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        pvsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}