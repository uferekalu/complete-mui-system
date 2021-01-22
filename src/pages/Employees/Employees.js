import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import EmployeeForm from './EmployeeForm'
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone'
import { 
    InputAdornment,
    makeStyles, 
    Paper, 
    TableBody, 
    TableCell, 
    TableRow, 
    Toolbar 
} from '@material-ui/core'
import useTable from '../../components/useTable'
import * as employeeService from '../../services/employeeService'
import { Controls } from '../../components/controls/Controls'
import { Search } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add'
import Popup from '../../components/controls/Popup'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import CloseIcon from '@material-ui/icons/Close'
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    { id:'fullName', label: 'Employee Name' },
    { id:'email', label: 'Email Address (Personal)' },
    { id:'mobile', label: 'Mobile Number' },
    { id:'department', label: 'Department' },
    { id:'actions', label: 'Actions', disableSorting:true },
]

export default function Employees() {

    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState(employeeService.getAllEmployees())
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; }})
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({ isOpen:false, message:'', type:'' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items
                else
                    return items.filter(x => x.fullName.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = (employee, resetForm) => {
        if (employee.id === 0)
            employeeService.insertEmployee(employee)
        else
            employeeService.updateEmployee(employee)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setRecords(employeeService.getAllEmployees())
        setNotify({
            isOpen: true,
            message: 'Submitted successfully',
            type: 'success'
        })
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const onDelete = id => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        employeeService.deleteEmployee(id);
        setRecords(employeeService.getAllEmployees())
        setNotify({
            isOpen: true,
            message: 'Deleted successfully',
            type: 'error'
        })
    }

    return (
        <>
            <PageHeader 
                title="New Employee"
                subTitle="Form design with validation"
                icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        className={classes.searchInput}
                        label="Search Employees"
                            InputProps = {{
                                startAdornment:(<InputAdornment position="start">
                                    <Search />
                                </InputAdornment>)
                            }}
                        onChange={handleSearch}
                    />
                    <Controls.Button 
                        text="Add New"
                        variant="outlined"
                        className={classes.newButton}
                        startIcon={<AddIcon />}
                        onClick={() => {setOpenPopup(true); setRecordForEdit(null); }}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.mobile}</TableCell>
                                    <TableCell>{item.departmentId}</TableCell>
                                    <Controls.ActionButton
                                        color="primary"
                                            onClick={() => {openInPopup(item)}}>
                                        <EditOutlinedIcon fontSize="small" />
                                    </Controls.ActionButton>
                                    <Controls.ActionButton
                                        color="secondary"
                                        onClick={() => {
                                            setConfirmDialog({
                                                isOpen: true,
                                                title: 'Are you sure to delete this record?',
                                                subTitle: "You can't undo this operation",
                                                onConfirm: () => {onDelete(item.id)}
                                            })
                                        }}>
                                        <CloseIcon fontSize="small" />
                                    </Controls.ActionButton>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Employee Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <EmployeeForm 
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit}
                />
            </Popup>
            <Notification 
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog 
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}
