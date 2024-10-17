import React from "react";
import { Box, Button, Typography, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import Images from "./../assets/images/index";

// Styled Components similar to SmtpUI
const Container = styled(Box)({
  backgroundColor: "#1e1e1e",
  padding: "20px",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  border: "1px solid #444",
  height: "100vh", // Updated to fill full viewport height
  boxSizing: "border-box", // Ensure padding doesn't affect height
});

const InfoBox = styled(Box)({
  display: "flex",
  gap: "10px",
  alignItems: "center",
});

const StatusContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
});

const StatusItem = styled(Box)({
  backgroundColor: "#2a2a2a",
  padding: "10px",
  borderRadius: "8px",
  textAlign: "center",
  border: "1px solid #444",
  flex: 1,
});

const TableContainer = styled(Box)({
  marginTop: "10px",
  "& table": {
    width: "100%",
    color: "#fff",
    borderCollapse: "collapse",
    "& td": {
      padding: "10px",
      border: "1px solid #444",
    },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: "#1e90ff",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1c86ee",
  },
});

const ServerStatus = () => {
  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        {/* My Mail */}
      </Typography>

      <InfoBox>
        <Select
          defaultValue="pay"
          size="small"
          sx={{
            minWidth: 150,
            color: "#fff",
            backgroundColor: "#333",
            border: "1px solid #444",
          }}
        >
          <MenuItem value="pay">1 Pay as you go</MenuItem>
          <MenuItem value="pay">2 Pay as you go</MenuItem>
          <MenuItem value="pay">3 Pay as you go</MenuItem>
        </Select>
        <Box
          sx={{
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            padding: "10px 15px",
            border: "1px solid #444",
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          <img src={Images.CartIcon} alt="cart icon" width={20} height={20} />
          {/* Shopping cart icon can be added here */}
        </Box>
      </InfoBox>

      <TableContainer>
        <table>
          <tr>
            <td>IP</td>
            <td>18.123.342</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>Running</td>
          </tr>
          <tr>
            <td>Expires</td>
            <td>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">1</Typography>
                <img
                  src={Images.DeleteIcon}
                  alt="cart icon"
                  width={20}
                  height={20}
                />
              </Box>
            </td>
          </tr>
        </table>
      </TableContainer>

      <StyledButton variant="contained">Get New Server</StyledButton>
      <Box style={{ height: "12vh" }}></Box>

      <StatusContainer>
        <StatusItem>
          <Typography variant="subtitle1">Smtps</Typography>
          <Typography variant="h4" className="smtps">
            99
          </Typography>
        </StatusItem>
        <StatusItem>
          <Typography variant="subtitle1">Failed</Typography>
          <Typography variant="h4" className="failed">
            1
          </Typography>
          <Typography>Get log</Typography>
        </StatusItem>
        <StatusItem>
          <Typography variant="subtitle1">Sent</Typography>
          <Typography variant="h4" className="sent">
            9
          </Typography>
        </StatusItem>
        <StatusItem>
          <Typography variant="subtitle1">Failed</Typography>
          <Typography variant="h4" className="failed">
            1
          </Typography>
          <Typography>Get log</Typography>
        </StatusItem>
      </StatusContainer>

      <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          Delay in (ms)
        </Box>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Typography variant="body1">1</Typography>
            <img
              src={Images.TImerIcon}
              alt="cart icon"
              width={20}
              height={20}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "10px", marginTop: "2px" }}>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          Delay in (ms)
        </Box>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Typography variant="body1">1</Typography>
            <img
              src={Images.ConnectionIcon}
              alt="cart icon"
              width={20}
              height={20}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ServerStatus;
