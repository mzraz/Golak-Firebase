import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PDFIMAGE from "../../Assets/Images/pdf.png";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import { fireStore, auth } from "../../Firebase/Firebase";
const style = {
  table: {
    borderCollapse: "collapse",
    width: "100%",
  },
  tr: {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
    fontFamily: "Nunito Sans",
  },
};

const Ledger = () => {
  const pdfRef = useRef();
  const { id } = useParams();

  const [usersData, setUsersData] = useState([]);
  const [circlesData, setCirclesData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [roundsData, setRoundsData] = useState([]);
  const [ledgerData, setLedgerData] = useState();

  useEffect(() => {
    fetchUsersData();
    fetchPaymentsData();
    fetchCirclesData();
    fetchRoundsData();
  }, []);

  useEffect(() => {
    if (
      paymentsData.length !== 0 &&
      circlesData.length !== 0 &&
      roundsData.length !== 0
    ) {
      const findCircle = circlesData.find((item) => item?.id === id);
      let users = [];
      if (findCircle) {
      }
      for (let i = 0; i < findCircle?.involvedUsers?.length; i++) {
        const findUser = usersData.find(
          (item) => item.id === findCircle.involvedUsers[i]
        );
        users.push(findUser);
      }
      users.forEach((obj) => delete obj?.ispay);
      const circleData = {
        ...findCircle,
        usersData: [...users],
      };
      if (
        circleData.id !== "" &&
        circleData.id !== undefined &&
        circleData.id !== null
      ) {
        const filterRounds = roundsData.filter(
          (item) => item?.circleId === circleData?.id
        );
        if (filterRounds.length !== 0) {
          let dataFinalization = [];
          let finalData = [];
          for (let j = 0; j < filterRounds.length; j++) {
            const findUser = circleData?.usersData.find(
              (item) => item?.id === filterRounds[j]?.recipientId
            );
            dataFinalization.push({
              ...findUser,
              ...filterRounds[j],
              roundId: filterRounds[j].id,
            });
          }

          if (dataFinalization.length !== 0) {
            for (let k = 0; k < dataFinalization.length; k++) {
              const findPayment = paymentsData.find(
                (item) => item.round === dataFinalization[k].roundId
              );
              if (findPayment !== undefined && findPayment !== null) {
                let obj = {
                  ...dataFinalization[k],
                  ...findPayment,
                };
                finalData.push(obj);
              } else {
                let obj = {
                  ...dataFinalization[k],
                  amount: 0,
                };
                finalData.push(obj);
              }
            }
          }
          const finalCircleData = {
            ...circleData,
            finalizingUserData: [...finalData],
          };
          setLedgerData(finalCircleData);
        }
      }
    }
  }, [paymentsData, circlesData, roundsData]);
  const fetchUsersData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const userData = { ...doc.data(), id: doc.id };

        usersData.push(userData);
        setUsersData(usersData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchCirclesData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Circles");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const circleData = { ...doc.data(), id: doc.id };

        usersData.push(circleData);
        setCirclesData(usersData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchPaymentsData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Payouts");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const paymentData = { ...doc.data(), id: doc.id };
        usersData.push(paymentData);
        setPaymentsData(usersData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchRoundsData = async () => {
    try {
      const usersCollectionRef = collection(fireStore, "Rounds");
      const querySnapshot = await getDocs(usersCollectionRef);
      const roundsData = [];
      querySnapshot.forEach((doc) => {
        const roundData = { ...doc.data(), id: doc.id };
        roundsData.push(roundData);
        setRoundsData(roundsData);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("Ledger.pdf");
    });
  };

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[250px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"/manage-circles"} className="breadcrumbs">
            Manage Circles
          </Link>
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Ledger
          </Link>
        </Box>
      </Box>
      <Box className="flex flex-row justify-between mb-4 items-center">
        <h1 className="heading">Circle Ledger</h1>

        <Button
          className="flex flex-row dropdown font-fam"
          style={{
            background: "#76D0B7",
            color: "black",
          }}
          onClick={() => handlePDF()}
        >
          <img src={PDFIMAGE} alt="" className="mr-2" />
          Generate PDF Report
        </Button>
      </Box>
      <Box
        className="box-shadow"
        style={{
          background: "white",
        }}
      >
        <table style={style.table} ref={pdfRef}>
          <tr>
            <th style={style.tr}>Circle ID</th>
            <th style={style.tr}>Circle Name</th>

            <th style={style.tr}>User Name</th>
            <th style={style.tr}>Draw Date</th>
            <th style={style.tr}>Paid</th>
            <th style={style.tr}>Outstanding Amount</th>
            <th style={style.tr}>Late Fee</th>
            <th style={style.tr}>Credit Scrore</th>
          </tr>

          {ledgerData?.finalizingUserData?.map((item, index) => (
            <tr key={index}>
              <td style={style.tr}>{item.circleId}</td>
              <td style={style.tr}>{ledgerData.name}</td>
              <td style={style.tr}>{item.username}</td>
              <td style={style.tr}>{item.start_date.split(" ")[0]}</td>
              <td style={style.tr}>{`$${item.amount}.0`}</td>
              <td style={style.tr}>N/A</td>
              <td style={style.tr}>N/A</td>
              <td style={style.tr}>N/A</td>
            </tr>
          ))}
        </table>
      </Box>
    </div>
  );
};

export default Ledger;
