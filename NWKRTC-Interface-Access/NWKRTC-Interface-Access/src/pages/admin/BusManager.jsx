import CrudManager from "../../components/CrudManager.jsx";

const fields = [
  { name: "number", label: "Bus number", required: true, placeholder: "Example: HD-101" },
  { name: "registration", label: "Registration number", required: true, placeholder: "Example: KA-25-F-1234" },
  { name: "type", label: "Bus type", type: "select", required: true, options: ["City Bus", "Express", "Electric", "Mini Bus"] },
  { name: "seats", label: "Seating capacity", type: "number", required: true, min: 10, max: 100 },
];

const columns = [
  { key: "number", label: "Bus number" },
  { key: "registration", label: "Registration" },
  { key: "type", label: "Type" },
  { key: "seats", label: "Seats" },
];

function BusManager() {
  function beforeSave(values, editing, items) {
    const clash = items.some(
      (b) => b.id !== editing?.id && b.number.toLowerCase() === values.number.toLowerCase()
    );
    if (clash) throw new Error("A bus with this number already exists.");
    return values;
  }

  return <CrudManager title="Buses" path="buses" fields={fields} columns={columns} beforeSave={beforeSave} />;
}

export default BusManager;
