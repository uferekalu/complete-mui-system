import React, { useState, useEffect } from 'react'

export default function useForm(initialFValues) {

    const [values, setValues] = useState(initialFValues);

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    return (
        values, 
        setValues,
        handleInputChange
    )
}
