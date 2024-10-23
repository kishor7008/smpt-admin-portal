import React, { useState } from "react";
import Papa from "papaparse"; // Import PapaParse
import "../App.css";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import TextEditor from "./TextEditor";
import Images from "../assets/images";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
// Container styles
import "react-toastify/dist/ReactToastify.css";
import ModalContainer from "./ModalContainer";
import CustomTagForm from "./CustomTagForm";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  backgroundColor: "#2A2A2A",
  padding: "10px",
  borderRadius: "8px",
  color: "#FFFFFF",
});

// Row styles
const Row = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

// Button styles
const CsvButton = styled(Button)({
  textTransform: "none",
  color: "#00BFFF",
});

const RemoveButton = styled(Button)({
  backgroundColor: "#FF6F61",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FF4B30",
  },
});

const ModaleStyle = styled(Box)({
  width: "300px",
  height: "200px"
})


const SmtpUI = ({ setResult }) => {
  const [smtpReciver, setSmtpReciver] = useState([]);
  const [smtpSender, setSmtpSender] = useState([]);
  const [tags, setTags] = useState(["email", "name", "content"]);
  const [isTagInputVisible, setIsTagInputVisible] = useState(false); // State for showing/hiding input field
  const [newTag, setNewTag] = useState(""); // State for new tag input
  const auth = ["email", "pass"];
  const [typeServices, setTypeServices] = useState("GMAIL");
  const [fileType, setFileType] = useState("Pdf");
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [htmlFile, setHtmlFile] = useState("");
  const [check, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Handle hover events for table ... 
  const handleMouseEnter = () => setShowTable(true);
  const handleMouseLeave = () => setShowTable(false);


  const StyledButton = styled(Button)({
    backgroundColor: "#1e90ff",
    color: "#fff",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#1c86ee",
    },
    height: "10vh",
    padding: "10px 20px",
    width: "250px",
    fontWeight: "bold",
    fontSize: "19px",
  });
  function renderTemplate(obj, htmlString) {
    return htmlString.replace(/\{\{(\w+)\}\}/g, (match, key) => obj[key] || "");
  }
  const validateInputs = () => {
    if (!smtpSender.length) {
      toast.error("Please upload an SMTP file.");
      return false;
    }
    if (!smtpReciver.length) {
      toast.error("Please upload a recipient CSV file.");
      return false;
    }
    if (!senderName.trim()) {
      toast.error("Sender Name is required.");
      return false;
    }
    if (!subject.trim()) {
      toast.error("Subject is required.");
      return false;
    }
    if (!fileName.trim() && check) {
      toast.error("File Name is required when attachments are checked.");
      return false;
    }
    return true;
  };
  const handelSubmit = async () => {

    if (!validateInputs()) return;
    setLoading(true)
    let combined = [];
    smtpSender.forEach((sender) => {
      smtpReciver.forEach((receiver) => {
        const baseObject = {
          senderEmail: sender.email,
          senderPassword: sender.pass,
          receiverEmail: receiver.email,
          senderName: renderTemplate(receiver, senderName),
          receiverContent: renderTemplate(receiver, content),
          id: receiver.id,
          subject: renderTemplate(receiver, subject),
        };

        if (check) {
          // If check is true, add the additional properties
          combined.push({
            ...baseObject,
            // receiverContent: renderTemplate(receiver, content),
            receiverAttachment: renderTemplate(receiver, htmlFile), // Corrected typo: "receiverAttachememt" to "receiverAttachment"
            filename: renderTemplate(receiver, fileName),
            fileType: fileType,
          });
        } else {
          // If check is false, push the base object
          combined.push(baseObject);
        }
      });
    });
    console.log(combined, "combined");
    await axios
      .post("http://localhost:3002/send-email", combined)
      .then((response) => {
        // Handle success
        console.log("Response:", response.data);
        setResult(response.data);
        setSmtpReciver([]);
        setSmtpSender([]);
        setSenderName("");
        setSubject("");
        setFileName("");
        setContent("");
        setHtmlFile("");
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error:", error);
      });

    console.log(combined, "combined");
  };

  const handelRecipients = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: false, // Manually mapping headers
        skipEmptyLines: true,
        complete: (result) => {
          const formattedData = result.data.map((row) => {
            // Create an object where keys are from the tags array
            const rowObject = row.reduce((acc, value, index) => {
              acc[`${tags[index]}`] = value; // Maps the value to the corresponding tag
              return acc;
            }, {});
            // Add unique 12-character id to each object
            rowObject.id = uuidv4().replace(/-/g, "").slice(0, 12);
            return rowObject;
          });
          setSmtpReciver(formattedData);
        },
      });
    }
  };

  const handelSmtpCsv = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result) => {
          const formattedData = result.data.map((row) => {
            return row.reduce((acc, value, index) => {
              acc[`${auth[index]}`] = value;
              return acc;
            }, {});
          });
          setSmtpSender(formattedData);
        },
      });
    }
  };

  const handleAddTag = (data) => {
    console.log("save value", data, data.tagName)

    if (data.tagName.trim()) {
      setTags([...tags, data.tagName.trim()]);
      setNewTag("");
      // setIsTagInputVisible(false); // Hide input field after adding tag
      setOpen(false)
    }
  };

  console.log("smtpReciver", smtpReciver)
  return (
    <Box sx={{ padding: "9px", backgroundColor: "#1E1E1E" }}>
      <ToastContainer />
      {/* <CustomTagForm /> */}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "70%", marginRight: "10px" }}>
          <Container sx={{ marginBottom: "10px", gap: 0 }}>
            {/* First Row */}
            <Row>
              <Box fontWeight="bold">Recipients</Box>
            </Row>

            {/* File Upload Row */}
            <Row >
              <div className="input-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: "relative" }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handelRecipients}
                  style={{ display: "none" }}
                  className="hover-input"
                  id="csv-upload" // Hidden input for file upload
                />

                <label htmlFor="csv-upload"
                >
                  <CsvButton variant="text" component="span">
                    Select CSV
                  </CsvButton>
                </label>
                {/* table  */}
                {smtpReciver.length > 0 && showTable && (
                  <table className="hover-table"
                    style={{
                      position: "absolute", // Make table absolutely positioned
                      top: "70%", // Position it just outside the container
                      left: "0",
                      zIndex: 1000,
                      background: "#3c3c3c",
                      border: "1px solid black",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Content</th>
                      </tr>
                    </thead>
                    <tbody>
                      {smtpReciver.map((e) => (
                        <tr>
                          <td>{e.email}</td>
                          <td>{e.name}</td>
                          <td>{e.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <Typography variant="body2" color="#B0B0B0">
                Total Recipients {smtpReciver.length}{" "}
                {/* Display the number of recipients */}
              </Typography>
              {smtpReciver.length !== 0 && (
                <RemoveButton
                  variant="contained"
                  size="small"
                  onClick={() => setSmtpReciver([])}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle">Remove</Typography>
                    <img
                      src={Images.DeleteIcon}
                      alt="cart icon"
                      width={20}
                      height={20}
                    />
                  </Box>
                </RemoveButton>
              )}
            </Row>
          </Container>

          {/* Repeat of the above Container for demonstration */}
          <Container sx={{ marginBottom: "10px", gap: 0 }}>
            <Row>
              <Box fontWeight="bold">SMTP</Box>
            </Row>
            <Row>
              <Select
                value={typeServices}
                onChange={(e) => {
                  setTypeServices(e.target.value);
                }}
                size="small"
                sx={{
                  minWidth: 120,
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: "5px",
                  backgroundColor: "#333",
                  height: "35px",
                }}
              >
                <MenuItem value="GMAIL">GMAIL</MenuItem>
              </Select>

              <Row>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handelSmtpCsv}
                  style={{ display: "none" }}
                  id="smtp-upload" // Hidden input for file upload
                />
                <label htmlFor="smtp-upload">
                  <CsvButton variant="text" component="span">
                    Select CSV
                  </CsvButton>
                </label>
                <Typography variant="body2" color="#B0B0B0">
                  Total SMTP {smtpSender.length}{" "}
                  {/* Display the number of recipients */}
                </Typography>
                {smtpSender.length !== 0 && (
                  <RemoveButton
                    variant="contained"
                    size="small"
                    onClick={() => setSmtpSender([])}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="subtitle">Remove</Typography>
                      <img
                        src={Images.DeleteIcon}
                        alt="cart icon"
                        width={20}
                        height={20}
                      />
                    </Box>
                  </RemoveButton>
                )}
              </Row>
            </Row>
          </Container>

          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              backgroundColor: "#2A2A2A",
              borderRadius: "8px",
              color: "#FFFFFF",
              padding: "10px",
              paddingBottom: "20px",
              marginBottom: "5px",
            }}
          >
            {/* Sender Name Field */}
            <TextField
              id="outlined-start-adornment-1"
              variant="filled"
              size="small"
              onChange={(e) => {
                setSenderName(e.target.value);
              }}
              value={senderName}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "white" }}>
                    <Box sx={{ color: "white" }}>Sender Name :</Box>
                  </InputAdornment>
                ),
                style: { color: "#fff", backgroundColor: "#333" },
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "#333",
                },
                width: "100%",
                border: "1px solid #444",
                borderRadius: "5px",
                height: "35px",
              }}
            />

            {/* Another Sender Name Field */}
            <TextField
              id="outlined-start-adornment-2"
              variant="filled"
              size="small"
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              value={subject}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {" "}
                    <Box sx={{ color: "white" }}>Subject :</Box> :
                  </InputAdornment>
                ),
                style: { color: "#fff", backgroundColor: "#333" },
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "#333",
                },
                width: "100%",
                border: "1px solid #444",
                borderRadius: "5px",
                height: "35px",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "30%",
            backgroundColor: "#2C2C2C",
            border: "2px solid #444",
            borderRadius: "10px",
          }}
        >
          <Box sx={{ color: "#FFFFFF", padding: "5px", fontWeight: "bold" }}>
            Tags
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              p: 2,
              borderRadius: "8px",
              backgroundColor: "#3C3C3C",
              maxHeight: "200px",
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
            }}
          >
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                sx={{
                  borderRadius: "5px",
                  fontSize: "12px",
                  borderColor: "#00BFFF",
                  color: "#FFFFFF",
                }}
              />
            ))}

            {/* Add Tag Input */}
            {/* {isTagInputVisible && (
              <TextField
                size="small"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New Tag"
                sx={{
                  input: { color: "#fff" },
                  backgroundColor: "#333",
                  borderRadius: "5px",
                  height: "35px",
                  width: "120px",
                }}
              />
            )} */}



            {/* Add Tag and Save Button */}
            <Button
              onClick={() => {
                setIsTagInputVisible(true)
                setOpen(true)
              }}
              sx={{ color: "#00BFFF", textTransform: "none" }}
            >
              {open ? "" : "Add Tags+"}
            </Button>

            {open ? <>
              <ModaleStyle>
                <ModalContainer open={open} handleAddTagData={handleAddTag} setOpen={setOpen} style={{ width: "300px", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }} />
              </ModaleStyle>
            </> : ""}
            {/* {isTagInputVisible && (
              <Button
                onClick={handleAddTag}
                sx={{ color: "#00BFFF", textTransform: "none" }}
              >
                Save
              </Button>
            )} */}
          </Box>
        </Box>
      </Box>

      <TextEditor
        content={content}
        setContent={setContent}
        htmlFile={htmlFile}
        setHtmlFile={setHtmlFile}
        check={check}
        setChecked={setChecked}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "5px",
        }}
      >
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            backgroundColor: "#2A2A2A",
            borderRadius: "8px",
            color: "#FFFFFF",
            padding: "10px",
            paddingBottom: "20px",
            marginBottom: "5px",
            width: "70%",
          }}
        >
          {/* Sender Name Field */}
          <TextField
            id="outlined-start-adornment-1"
            variant="filled"
            size="small"
            InputLabelProps={{ style: { color: "#fff" } }}
            onChange={(e) => {
              setFileName(e.target.value);
            }}
            value={fileName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "white" }}>
                  <Box sx={{ color: "white" }}>File Name :</Box>
                </InputAdornment>
              ),
              style: { color: "#fff", backgroundColor: "#333" },
            }}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "#333",
              },
              width: "100%",
              border: "1px solid #444",
              borderRadius: "5px",
              height: "35px",
            }}
          />

          {/* Another Sender Name Field */}
          <Select
            value={fileType}
            onChange={(e) => {
              setFileType(e.target.value);
            }}
            size="small"
            sx={{
              minWidth: 120,
              color: "white",
              border: "1px solid #444",
              borderRadius: "5px",
              backgroundColor: "#333",
              height: "35px",
            }}
          >
            <MenuItem value="Image">Image</MenuItem>
            <MenuItem value="Pdf">Pdf</MenuItem>
          </Select>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledButton
            variant="contained"
            onClick={handelSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                size={24}
                className="loading-spinner"
              />
            ) : (
              'Send Email'
            )}
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SmtpUI;
