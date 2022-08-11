import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(theme => {
    return {
        root: {
            '& .MuiDataGrid-columnHeader': {
                background: '#14ACFF',
                color: "white"
            }
        },

    }
})

export interface IProps {
    rows: any;
    columns: any;
    cbCellClick?: any;
}

export default function EchartsLineChartSettingsTable({ rows, columns, cbCellClick }: IProps) {
    const { classes } = useStyles();

    const handleCellClick = (e: any) => {
        cbCellClick && cbCellClick(e)
    }

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid
                className={classes.root}
                rows={rows}
                columns={columns}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                // checkboxSelection
                onCellClick={handleCellClick}
                hideFooter
            />
        </div>
    );
}
