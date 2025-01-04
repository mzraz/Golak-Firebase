import React, { useState } from "react";
import { Box } from "@mui/material";

const TableView = ({ dataHead, dataBody }) => {
  return (
    <Box className="w-full">
      <table className="w-full flex flex-col">
        <thead className="w-full flex justify-between">
          <tr className="w-full flex justify-between table-style">
            {dataHead.map((item, index) => (
              <th key={index} className="font-fam w-14">
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="w-full">
          {dataBody.map((item, index) => (
            <>
              <tr
                key={index}
                className="flex flex-row justify-between mt-3 mb-3"
              >
                <td className="font-fam w-14">
                  {" "}
                  {item.id.length > 10
                    ? `${item.id.substring(0, 10)}...`
                    : item.id}
                </td>
                <td className="font-fam w-14">{item.name}</td>
                <td className="font-fam w-14">{item.contribType}</td>
                <td className="font-fam w-14">{item.totalAmount}</td>
                <td className="font-fam w-14">{item.involvedUsers.length}</td>
                <td className="font-fam w-14">
                  {new Date(item.startDate.seconds * 1000).toLocaleDateString()}
                </td>
                <td className="font-fam w-14">
                  {new Date(
                    item.updated_at.seconds * 1000
                  ).toLocaleDateString()}
                </td>
              </tr>
              <hr />
            </>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default TableView;
