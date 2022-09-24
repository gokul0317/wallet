import React, { useState, useMemo, useCallback } from 'react'
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
export default function useAlert() {
    const [alert, setAlert] = useState(null);
    const clearMessage = useCallback((timeMs = 2000) => {
        setTimeout(() => {
            setAlert(null)
        }, [timeMs])
    }, [])

    const setAlertMessage = useCallback(({ severity, title, message }) => {
        setAlert({ severity, title, message });
        clearMessage(5000);
    }, [clearMessage])

    const alertMessage = useMemo(() => {
        return (
            alert ? <Alert onClose={() => setAlert(false)} style={{ margin: "1rem" }} severity={alert.severity}>
                <AlertTitle>{alert.title}</AlertTitle>
                {alert.message ? alert.message : "" }
            </Alert> : <></>
        )
    }, [alert])

    return { alertMessage, setAlertMessage }
}
