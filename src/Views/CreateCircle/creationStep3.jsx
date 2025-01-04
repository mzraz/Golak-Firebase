import React, { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { RiDraggable } from "react-icons/ri";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import DataTable from "../../Components/DataGrid";
const CreationStep3 = ({ setMembers, members, step1Data }) => {
  const itemsWithIndex = members.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newNumbers = [...members];
    const [removed] = newNumbers.splice(result.source.index, 1);
    newNumbers.splice(result.destination.index, 0, removed);
    setMembers(newNumbers);
  };

  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleCheckboxChange = (event, rowData) => {
    const id = rowData.id;
    setSelectedRowId(id === selectedRowId ? null : id);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Circle No.",
        field: "index",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "User Name",
        field: "username",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          const userData = params.data.username;

          return <Link to={`/user-detail/${params.data.id}`}>{userData}</Link>;
        },
      },
      {
        headerName: "Email",
        field: "email",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Phone Number",
        field: "phone",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Facilitator",
        sortable: false,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          return (
            <input
              type="checkbox"
              style={{ width: "20px", height: "20px" }}
              checked={params.data.facilitator}
              name="facilitator"
              onChange={(event) =>
                handleStatusUpdate(event, "facilitator", params.data)
              }
            />
          );
        },
      },
    ],
    [members]
  );

  const handleStatusUpdate = (event, field, data) => {
    const value = event.target.checked;
    const findIndex = members.findIndex((item) => item.email === data.email);
    const checkedMember = members.find((item) => item.facilitator === true);
    if (event.target.checked) {
      const updatedMembers = [...members];
      updatedMembers[findIndex][field] = true;
      if (checkedMember !== undefined) {
        const findIndexChecked = members.findIndex(
          (item) => item.email === checkedMember.email
        );
        const updatedMember = [...updatedMembers];
        updatedMember[findIndexChecked][field] = false;
        setMembers(updatedMembers);
      } else {
        setMembers(updatedMembers);
      }
    } else {
      const updatedMembers = [...members];
      updatedMembers[findIndex][field] = false;
      setMembers(updatedMembers);
    }
  };
  return (
    <div className="mt-5 w-full">
      {step1Data.slot === "manual" ? (
        <DragDropContext onDragEnd={(results) => onDragEnd(results)}>
          <table className="w-full">
            <thead className="w-full flex    table-style">
              <tr className="w-full flex flex-row justify-between">
                <th className="w-25">Action</th>
                <th className="w-25">Rank</th>
                <th className="w-25">Name</th>
                <th className="w-25">Phone Number</th>
                <th className="w-25">Facilitator</th>
              </tr>
            </thead>

            <Droppable droppableId="tbody">
              {(provided) => (
                <tbody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full flex flex-col justify-between"
                >
                  {members &&
                    members.map((item, index) => (
                      <Draggable
                        draggableId={item.username}
                        index={index}
                        key={item.username}
                        className="w-full flex flex-row justify-between "
                        style={{ height: "100px", alignItems: "center" }}
                      >
                        {(provided) => (
                          <tr
                            key={index}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex flex-row justify-between"
                          >
                            <td
                              {...provided.dragHandleProps}
                              className="w-full flex flex-row justify-between "
                            >
                              <RiDraggable size={20} />
                            </td>
                            <td className="w-full flex flex-row justify-between ">
                              {index}
                            </td>
                            <td className="w-full flex flex-row justify-between ">
                              {item.username}
                            </td>
                            <td className="w-full flex flex-row justify-between ">
                              {item.email}
                            </td>
                            <td className="w-full flex flex-row justify-between ">
                              <input
                                type="checkbox"
                                style={{ width: "20px", height: "20px" }}
                                checked={item.facilitator}
                                name="facilitator"
                                onChange={(event) =>
                                  handleStatusUpdate(event, "facilitator", item)
                                }
                              />
                            </td>
                            {/* <td> */}
                            {/* <button
                    style={{
                      padding: "10px 20px",
                      background: "black",
                      color: "white",
                    }}
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button> */}
                            {/* data
                          </td> */}
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      ) : (
        <DataTable columnDefs={columnDefs} rowData={itemsWithIndex} />
      )}
    </div>
  );
};

export default CreationStep3;
