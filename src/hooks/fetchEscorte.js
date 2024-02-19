import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findEscortes } from '../redux/slices/escortes';

export const LoadEscortes = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function escortesFetch(){
            
            const res = await dispatch(findEscortes())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        escortesFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}