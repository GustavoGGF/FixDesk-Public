import { useEffect, useState, useContext, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TicketContext } from "../../context/TicketContext";
import "./ListTable.css";

export default function ListTable({ ticket }) {
  const { setTicketIDOpen, ticketList, setTicketList } =
    useContext(TicketContext);

  const [loading, setLoading] = useState(true);

  const colorBorder = useRef("");

  useEffect(() => {
    if (ticket) {
      setTicketList([])
      GenTable()
    }
    setLoading(false);
  }, [ticket]);

  function genDate(date) {
    return new Date(date).toLocaleString("pt-BR");
  }

  function GenTable(){
    ticket.forEach((tk) => {
      if (tk["open"] === false) {
        colorBorder.current = "ticket-close";
      } else if (
        tk["open"] === true &&
        tk["responsible_technician"] === null
      ) {
          var date = new Date(tk["start_date"]);
          const currentDate = new Date();
          const diferenceMilisecond = currentDate - date;
          const diferenceDays = diferenceMilisecond / (1000 * 60 * 60 * 24);

          if (diferenceDays >= 7) {
            colorBorder.current = "ticket-urgent";
          } else {
            colorBorder.current = "ticket-open-not-view";
          }
        } else if (
          tk["open"] === true &&
          tk["responsible_technician"] !== null
        ) {
          colorBorder.current = "ticket-open-in-view";
        } else if (tk["open"] === null) {
          colorBorder.current = "ticket-stop";
        }

        const Div = (
          <TableRow
            className={`tbl ${colorBorder.current}`}
            key={tk["id"]}
            onClick={() => {
              setTicketIDOpen(tk["id"]);
            }}
          >
            <TableCell className="user-select-none text-center">
              {tk["id"]}
            </TableCell>
            <TableCell className="user-select-none text-center" align="right">
              {tk["ticketRequester"]}
            </TableCell>
            <TableCell className="user-select-none text-center" align="right">
              {tk["occurrence"]}
            </TableCell>
            <TableCell className="user-select-none text-center" align="right">
              {tk["problemn"]}
            </TableCell>
            <TableCell className="user-select-none text-center" align="right">
              {tk.start_date ? genDate(tk.start_date) : "—"}
            </TableCell>
          </TableRow>
        );

        setTicketList((list) => [...list, Div]);
    });
  }

  return (
    <TableContainer className="w-60p" component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell className="text-center">Chamado</TableCell>
            <TableCell className="text-center" align="right">
              Usuario
            </TableCell>
            <TableCell className="text-center" align="right">
              Ocorrencia
            </TableCell>
            <TableCell className="text-center" align="right">
              problema
            </TableCell>
            <TableCell className="text-center" align="right">
              Data de Abertura
            </TableCell>
          </TableRow>
        </TableHead>
        {!loading && <TableBody>{ticketList}</TableBody>}
      </Table>
    </TableContainer>
  );
}
