/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { FaRegSave } from 'react-icons/fa'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from "yup"
import { useNotifications } from '@mantine/notifications';
import { useDispatch } from 'react-redux';

import { createTemplate, updateTemplate } from '../../redux/slices/templates';
import { BsCheck2, BsX } from 'react-icons/bs';


const createTemplateSchema = yup.object().shape({
    // Here goes the different fields of the schema
    // For instance :

    // first_name: yup.string().min(2).max(120).optional(),
    // last_name: yup.string().min(2).max(120).optional(),
})

function FormTemplate({status, data, handleClose}) {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    const notifications = useNotifications()

    const form = useForm({
        validate: yupResolver(createTemplateSchema),
        initialValues: {
            // Here goes the initial values of the fields 

            // first_name : '', 
            // last_name : '', 
        },
        
    })

    useEffect(() => {
        if(data !== null && status === 'edit') {
            form.setValues({
                // Modification values on load
                // first_name :  data?.first_name || '', 
                // last_name :  data?.last_name || '', 
            })
        }
    }, [data, status])

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);

        console.log('Found template values: ', values)

        // Handling DatePicker
        // const myDate = new Date(values.event_date);
        // myDate.setDate(myDate.getDate() + parseInt(1));

        if(status === 'create') {
            const dataToSubmit = { 
                ...values
            }

            setTimeout(() => {
                dispatch(createTemplate({ dataToSubmit }))
                    .then(res => {
                        if(res.payload) {
                            handleClose()
                            notifications.showNotification({
                                color: 'green',
                                title: 'Succés',
                                message: 'Enregistrement reussi!',
                                icon: <BsCheck2 size={18} />
                            })
                            setloading(false)
                        }
        
                        if(res.error) {
                            console.log('Err => ', res.error)
                            notifications.showNotification({
                                color: 'red',
                                title: 'Echec',
                                message: 'Enregistrement echoué...',
                                icon: <BsX size={18} />
                            })
                            setloading(false)
                        }
                    })
            }, 1000);
            
        }

        if(status === 'edit') {

            console.log('Updating template ... ', values)

            dispatch(updateTemplate({ _id: data?._id, dataToSubmit: { ...values }}))
            .then(res => {
                if(res.payload) {
                    handleClose()
                    notifications.showNotification({
                        color: 'green',
                        title: 'Succés',
                        message: 'Enregistrement reussi!',
                        icon: <BsCheck2 size={18} />
                    })
                    setloading(false)
                }

                if(res.error) {
                    console.log('Err => ', res.error)
                    notifications.showNotification({
                        color: 'red',
                        title: 'Echec',
                        message: 'Enregistrement echoué...',
                        icon: <BsX size={18} />
                    })
                    setloading(false)
                }
            })
        }
        
    }
    
    return (
        <div style={{borderTop:'1px solid #eaeaea', marginTop: -8}}> 
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className='dates'>
                    {/* Here goes the different fields of the our form */}
                    {/* <TextInput 
                        variant="filled" size="sm"   label="Template Names :" className='textinput' description="First Name" 
                        style={{width: '49%'}} 
                        {...form.getInputProps('first_name')}
                    />
                    <TextInput 
                        variant="filled" size="sm"   className='textinput' description="Last Name" 
                        style={{width: '49%'}} 
                        {...form.getInputProps('last_name')}
                    /> */}
                </div>
               

                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
                    <Button loading={loading} leftIcon={<FaRegSave size={18} />}  type='submit' color='blue' size='sm'>{status === 'create' ? 'Enregistrer' : 'Enregistrer modifications'}</Button>
                </div>
            </form>
        </div>
    )
}

export default FormTemplate