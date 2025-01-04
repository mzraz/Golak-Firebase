import { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function DataTable({ rowData, columnDefs }) {
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      rowHeight: 36,
    };
  }, []);

  const headerCellRenderer = ({ value }) => {
    return (
      <div className="ag-cell-label-container">
        <span className="ag-header-cell-text">{value}</span>
      </div>
    );
  };

  const cellRenderer = ({ value }) => {
    return (
      <div className="ag-cell-value">
        <span>{value}</span>
      </div>
    );
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 797 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs.map((colDef) => ({
          ...colDef,
          headerComponentFramework: () => headerCellRenderer,
          cellRendererFramework: () => cellRenderer,
        }))}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
        rowHeight={70}
        className="custom-ag-grid"
      />
    </div>
  );
}
