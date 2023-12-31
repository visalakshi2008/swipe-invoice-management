import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import { clearBulk, updateMultiple } from "../redux/updateSlice";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [bulk, setBulk] = useState([]);

  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };
  const bulkEditButtonStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
  };
  const handleBulkClick = () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      dispatch(updateMultiple(bulk));
      navigate("/bulk_edit");
    }
  };

  useEffect(() => {
    dispatch(clearBulk());

    if (selectAll) {
      setBulk([...invoiceList]);
    } else {
      setBulk([]);
    }
  }, [selectAll]);

  return (
    <Row className="justify-content-left ">
      <Col xs={24} sm={24} md={24} lg={24}>
        <h3 className="fw-bold pb-2 pb-md-4 " style={{ paddingTop: "20px" }}>
          Swipe Assignment
        </h3>
        <Card className=" d-flex flex-column p-3 p-md-4 my-3 my-md-4 p-sm-3">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary" className="d-flex align-items-center">
                  <span className="ms-2 me-2">+</span> Create Invoice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button
                    variant="primary mb-2 mb-md-4"
                    style={{ marginRight: "10px" }}
                  >
                    + Create Invoice
                  </Button>
                </Link>
                <div className="d-flex gap-3">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>
                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border  "
                    style={{
                      height: "40px",
                      paddingLeft: "20px",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th className={editMode ? "d-block" : "d-none"}>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={() => setSelectAll((pre) => !pre)}
                      />
                    </th>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                      bulk={bulk}
                      setBulk={setBulk}
                      editMode={editMode}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
        <Button
          disabled={editMode && !bulk.length ? true : false}
          variant={
            editMode ? "success mb-2 mb-md-4" : "secondary mb-2 mb-md-4 "
          }
          onClick={handleBulkClick}
        >
          {editMode ? "Next" : "Edit Multiple Invoices"}
        </Button>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({ invoice, navigate, bulk, setBulk, editMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const handleBulkEdit = (invoice) => {
    setBulk((prevBulk) => {
      if (prevBulk.includes(invoice)) {
        return prevBulk.filter((el) => el !== invoice);
      } else {
        return [...prevBulk, invoice];
      }
    });
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr>
      <td className={`align-middle ${editMode ? "d-block" : "d-none"}`}>
        <input
          type="checkbox"
          value={invoice}
          checked={bulk.includes(invoice)}
          onChange={() => handleBulkEdit(invoice)}
          style={{
            marginTop: "0px",
            textAlign: "middle",
            display: "flex",
          }}
        />
      </td>

      <td style={{ paddingTop: "20px" }}>{invoice.invoiceNumber}</td>
      <td className="fw-normal" style={{ paddingTop: "20px" }}>
        {invoice.billTo}
      </td>
      <td className="fw-normal" style={{ paddingTop: "20px" }}>
        {invoice.dateOfIssue}
      </td>
      <td className="fw-normal" style={{ paddingTop: "20px" }}>
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

export default InvoiceList;
