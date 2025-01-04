import React from "react";
import Modal from "react-modal";
import { Box, Button } from "@mui/material";
import Logo from "../Assets/Images/loginLogo.png";
import { MdCancel } from "react-icons/md";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalData = ({ modalOpen, setModalOpen, text }) => {
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
      style={{ ...customStyles, backgroundColor: "rgb(118, 208, 183, 0.75)" }}
      contentLabel="Example Modal"
    >
      <Box className="w-full flex flex-col justify-center items-center">
        <Box className="w-full flex flex-row justify-end mb-2">
          <button onClick={closeModal} className="dropdown">
            <MdCancel size={20} />
          </button>
        </Box>
        <img src={Logo} alt="" className="mb-2 w-[100px] h-[100px]"></img>
        <Box>
          <p>{text}</p>
        </Box>
        <Box className="flex flex-row items-center justify-center w-full mt-4">
          <Button variant="contained" className="mr-3 dropdown" color="success">
            Yes
          </Button>
          <Button
            variant="contained"
            color="error"
            className="ml-3 dropdown"
            onClick={closeModal}
          >
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalData;
