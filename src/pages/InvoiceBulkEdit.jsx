import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulkList } from "../redux/updateSlice";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
import { updateAll } from "../redux/invoicesSlice";
import { useNavigate } from "react-router-dom";
import { BiSolidPencil } from "react-icons/bi";

function InvoiceBulkEdit() {
  const multipleInvoices = useSelector(bulkList);
  const [bulkInvoicesData, setBulkInvoicesData] = useState([
    ...multipleInvoices,
  ]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [display, setDisplay] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [currentEditingInvoice, setCurrentEditingInvoice] = useState(-1);

  const handleInputChange = (index, field, value) => {
    const updatedInvoicesData = [...bulkInvoicesData];

    updatedInvoicesData[index] = {
      ...updatedInvoicesData[index],
      [field]: value,
    };

    updatedInvoicesData[index] = handleCalculateTotal(
      updatedInvoicesData[index]
    );
    setBulkInvoicesData(updatedInvoicesData);
  };

  const handleInputItem = (index, field, value) => {
    const updatedItems = [...editedItems];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    console.log("udpated", updatedItems);

    setEditedItems(updatedItems);
  };

  const handleCalculateTotal = (invoice) => {
    let sub_total_amount = 0;

    invoice.items.forEach((item) => {
      sub_total_amount +=
        parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
    });

    const taxAmount = parseFloat(
      sub_total_amount * (invoice.taxRate / 100)
    ).toFixed(2);
    const discountAmount = parseFloat(
      sub_total_amount * (invoice.discountRate / 100)
    ).toFixed(2);
    const total = (
      sub_total_amount -
      parseFloat(discountAmount) +
      parseFloat(taxAmount)
    ).toFixed(2);

    return {
      ...invoice,
      sub_total_amount: parseFloat(sub_total_amount).toFixed(2),
      taxAmount,
      discountAmount,
      total,
    };
  };

  const handleItemSave = () => {
    let index = bulkInvoicesData.findIndex(
      (invoice) => invoice.id == currentEditingInvoice
    );
    let bulk = [...bulkInvoicesData];
    bulk[index] = { ...bulk[index], items: [...editedItems] };

    bulk[index] = handleCalculateTotal(bulk[index]);

    setBulkInvoicesData(bulk);
    setDisplay(false);
    setEditedItems([]);
  };

  const deleteItem = (i) => {
    let item = [...editedItems];

    item.splice(i, 1);

    setEditedItems(item);
  };

  const handleUpdateAll = () => {
    dispatch(updateAll(bulkInvoicesData));
    navigate("/");
  };

  return (
    bulkInvoicesData.length && (
      <>
        <h3 className="fw-bold pb-2 pb-md-4 text-left pt-4">
          Swipe Assignment
        </h3>
        <Card className="d-flex p-3 p-md-4 p-sm-3">
          {/* <Card className=" d-flex flex-column p-3 p-md-4 my-3 my-md-4 p-sm-3"> */}
          <div className=" d-flex justify-content-between ">
            <p className="fw-bold fs-3 ">Bulk Edit</p>
            <Button
              variant="success mb-2 mb-md-4"
              className=" px-4"
              onClick={handleUpdateAll}
            >
              Update All
            </Button>
          </div>
          <Table responsive bordered hover className=" text-center ">
            <thead>
              <tr>
                <th style={{ backgroundColor: "#B8E1DD", color: "black" }}>
                  Invoice No
                </th>
                <th style={{ backgroundColor: "#B8E1DD", color: "black" }}>
                  Due Date
                </th>
                <th
                  style={{ backgroundColor: "#B8E1DD", color: "black" }}
                  colSpan={3}
                >
                  Bill To
                </th>
                <th
                  style={{ backgroundColor: "#B8E1DD", color: "black" }}
                  colSpan={3}
                >
                  Bill From
                </th>
                <th style={{ backgroundColor: "#B8E1DD", color: "black" }}>
                  items
                </th>
                <th style={{ backgroundColor: "#B8E1DD", color: "black" }}>
                  Currency
                </th>
                <th style={{ backgroundColor: "#B8E1DD", color: "black" }}>
                  Tax Rate
                </th>
                <th style={{ backgroundColor: "#B8E1DD", color: "black" }}>
                  Discount Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {bulkInvoicesData.map((invoice, index) => (
                <tr key={invoice.id}>
                  <td className=" p-0 ">
                    <Form.Control
                      className=" text-center bg-white "
                      type="text"
                      value={invoice.invoiceNumber}
                      name="invoiceNumber"
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "invoiceNumber",
                          +e.target.value
                        )
                      }
                      placeholder="invoice no"
                      min="1"
                      required
                    />
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      className=" text-center bg-white"
                      type="date"
                      value={invoice.dateOfIssue}
                      name="dateOfIssue"
                      onChange={(e) =>
                        handleInputChange(index, "dateOfIssue", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td className="p-0">
                    <Form.Control
                      type="text"
                      className=" text-center bg-white"
                      value={invoice.billTo}
                      name="billTo"
                      onChange={(e) =>
                        handleInputChange(index, "billTo", e.target.value)
                      }
                      placeholder="name"
                      required
                    />
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      type="email"
                      className=" text-center bg-white"
                      value={invoice.billToEmail}
                      name="billToEmail"
                      onChange={(e) =>
                        handleInputChange(index, "billToEmail", e.target.value)
                      }
                      placeholder="email"
                      required
                    />
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      type="text"
                      className=" text-center bg-white"
                      value={invoice.billToAddress}
                      name="billToAddress"
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "billToAddress",
                          e.target.value
                        )
                      }
                      placeholder="address"
                      required
                    />
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      type="text"
                      className=" text-center bg-white"
                      value={invoice.billFrom}
                      name="billFrom"
                      onChange={(e) =>
                        handleInputChange(index, "billFrom", e.target.value)
                      }
                      required
                      placeholder="name"
                    />
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      type="email"
                      className=" text-center bg-white"
                      value={invoice.billFromEmail}
                      name="billFromEmail"
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "billFromEmail",
                          e.target.value
                        )
                      }
                      placeholder="email"
                      required
                    />
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      type="text"
                      className=" text-center bg-white"
                      value={invoice.billFromAddress}
                      name="billFromAddress"
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "billFromAddress",
                          e.target.value
                        )
                      }
                      placeholder="address"
                      required
                    />
                  </td>
                  <td className=" p-0 d-flex align-items-center px-2">
                    <Form.Control
                      type="text"
                      className=" text-center bg-white"
                      value={invoice.items.length}
                      name="items"
                      required
                    />
                    <Button
                      variant="outline-primary"
                      className=" p-1 "
                      onClick={() => {
                        setCurrentEditingInvoice(invoice.id);
                        setEditedItems(invoice.items);
                        setDisplay(true);
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <BiSolidPencil />
                      </div>
                    </Button>
                    <Modal show={display}>
                      <Modal.Header
                        closeButton
                        onClick={() => {
                          setDisplay(false);
                        }}
                      >
                        <Modal.Title>Items</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                        <div className=" d-flex gap-2 align-items-center justify-content-between ">
                          <h5 className=" m-auto "> Name</h5>
                          <h5 className=" m-auto ">Description</h5>
                          <h5 className=" m-auto ">Quantity</h5>
                          <h5 className=" m-auto ">Price</h5>
                          <h5 className=" m-auto ">Actions</h5>
                        </div>
                        {editedItems.map((item, i) => (
                          <div
                            className=" d-flex gap-2 align-items-center mt-2 "
                            key={i}
                          >
                            <Form.Control
                              style={{ border: "1px solid gainsboro" }}
                              type="text"
                              className=" text-center"
                              value={item.itemName}
                              name="itemName"
                              onChange={(e) =>
                                handleInputItem(i, "itemName", e.target.value)
                              }
                              placeholder="item name"
                              required
                            />
                            <Form.Control
                              style={{
                                border: "1px solid gainsboro",
                              }}
                              type="text"
                              className=" text-center"
                              value={item.itemDescription}
                              name="itemDescription"
                              onChange={(e) =>
                                handleInputItem(
                                  i,
                                  "itemDescription",
                                  e.target.value
                                )
                              }
                              placeholder="item description"
                              required
                            />
                            <Form.Control
                              style={{
                                border: "1px solid gainsboro",
                              }}
                              type="number"
                              className=" text-center"
                              value={item.itemQuantity}
                              name="itemQuantity"
                              onChange={(e) =>
                                handleInputItem(
                                  i,
                                  "itemQuantity",
                                  e.target.value
                                )
                              }
                              placeholder="item quantity"
                              required
                            />
                            <Form.Control
                              style={{ border: "1px solid gainsboro" }}
                              type="number"
                              className=" text-center"
                              value={item.itemPrice}
                              name="itemPrice"
                              onChange={(e) =>
                                handleInputItem(i, "itemPrice", e.target.value)
                              }
                              placeholder="item price"
                              required
                            />
                            <Button
                              variant="danger"
                              onClick={() => deleteItem(i)}
                              className="d-flex align-items-center justify-content-center gap-2"
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="primary"
                          onClick={() => handleItemSave()}
                        >
                          Save
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </td>
                  <td className=" p-0">
                    <Form.Select
                      name="currency"
                      value={invoice.currency}
                      onChange={(e) =>
                        handleInputChange(index, "currency", e.target.value)
                      }
                      className="text-center rounded-0 "
                      aria-label="Change Currency"
                    >
                      <option value="$">USD (United States Dollar)</option>
                      <option value="£">GBP (British Pound Sterling)</option>
                      <option value="¥">JPY (Japanese Yen)</option>
                      <option value="$">CAD (Canadian Dollar)</option>
                      <option value="$">AUD (Australian Dollar)</option>
                      <option value="$">SGD (Singapore Dollar)</option>
                      <option value="¥">CNY (Chinese Renminbi)</option>
                      <option value="₿">BTC (Bitcoin)</option>
                    </Form.Select>
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      type="number"
                      className=" text-center bg-white"
                      value={invoice.taxRate}
                      name="taxRate"
                      onChange={(e) =>
                        handleInputChange(index, "taxRate", e.target.value)
                      }
                      placeholder="0.0 %"
                      required
                    />
                  </td>
                  <td className=" p-0">
                    <Form.Control
                      type="number"
                      className=" text-center bg-white "
                      value={invoice.discountRate}
                      name="discountRate"
                      onChange={(e) =>
                        handleInputChange(index, "discountRate", e.target.value)
                      }
                      placeholder="0.0 %"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </>
    )
  );
}

export default InvoiceBulkEdit;
