import { makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
    sideMenu: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        left: '0px',
        width: '320px',
        height: '100%',
        backgroundColor: '#253053'
    }
})

export default function SideMenu() {
    const classes = useStyles()
    console.log(classes)

    return (
        <div className={classes.sideMenu}>
            
        </div>
    )
}
