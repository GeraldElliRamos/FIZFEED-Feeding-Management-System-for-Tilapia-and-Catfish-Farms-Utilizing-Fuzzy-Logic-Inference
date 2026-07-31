import Sidebar from "./Sidebar";
import "./Inventory.css";
import "./Sidebar.css";
import { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdOutlineAccessTime, MdOutlineInventory, MdOutlineToday, MdWarning } from "react-icons/md";

import { usePonds } from "./hooks/useFirestore";
import { useAuth } from "./hooks/useAuth";
import { db } from "./firebase";
import { addDoc, collection, doc, getDocs, query, where, writeBatch } from "firebase/firestore";

function Inventory() {
  const { ponds, loading } = usePonds();
  const { user } = useAuth();
  const [isAddingPond, setIsAddingPond] = useState(false);
  const [isDeletingPond, setIsDeletingPond] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [pondForm, setPondForm] = useState({
    name: "",
    fishType: "",
    capacity: "25",
    deviceName: "",
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a192f', color: '#fff' }}>Loading inventory...</div>;
  }

  const refillPonds = ponds
    .map((pond) => {
      const currentStock = Number(pond.currentStock) || 0;
      const dailyUsage = Number(pond.dailyUsage) || 0;
      const daysRemaining = dailyUsage > 0 ? Math.floor(currentStock / dailyUsage) : null;
      return { ...pond, daysRemaining };
    })
    .filter((pond) => pond.daysRemaining !== null && pond.daysRemaining <= 2);

  const closeModal = () => setModalOpen(false);

  const handleAddPond = async () => {
    if (!user) {
      window.alert("Please sign in first.");
      return;
    }

    const name = pondForm.name.trim();
    const fishType = pondForm.fishType.trim();
    const capacity = Number(pondForm.capacity);
    const deviceName = pondForm.deviceName.trim();

    if (!name || !fishType || !deviceName) {
      window.alert("Please enter a pond name, fish type, and device name.");
      return;
    }

    if (Number.isNaN(capacity) || capacity <= 0) {
      window.alert("Please enter a valid capacity greater than zero.");
      return;
    }

    if (capacity > 10) {
      const confirmed = window.confirm(
        `⚠️ Feed Limit Warning\n\nThe feeder drum holds 20 kg, but the system is configured to a 10 kg operational limit per session for safe dispensing.\n\nYou entered ${capacity} kg which exceeds the recommended 10 kg limit.\n\nDo you still want to proceed?`
      );
      if (!confirmed) return;
    }

    setIsAddingPond(true);

    try {
      const pondRef = await addDoc(collection(db, "users", user.uid, "ponds"), {
        name,
        fishType,
        capacity,
        currentStock: 0,
        dailyUsage: 0,
      });

      const deviceData = {
        name: deviceName,
        pondId: pondRef.id,
        pondName: name,
        fishType,
        status: "offline",
        batteryLevel: 100,
      };

      await addDoc(collection(db, "users", user.uid, "devices"), deviceData);
      await addDoc(collection(db, "users", user.uid, "ponds", pondRef.id, "devices"), deviceData);

      setPondForm({ name: "", fishType: "", capacity: "25", deviceName: "" });
      closeModal();
    } finally {
      setIsAddingPond(false);
    }
  };

  const handleDeletePond = async (pondId: string) => {
    if (!user) {
      window.alert("Please sign in first.");
      return;
    }

    const pond = ponds.find((item) => String(item.id) === pondId);
    setDeleteTarget({ id: pondId, name: pond?.name || "this pond" });
  };

  const confirmDeletePond = async () => {
    if (!user || !deleteTarget) {
      return;
    }

    setIsDeletingPond(true);

    try {
      const batch = writeBatch(db);

      const rootDevicesQuery = query(collection(db, "users", user.uid, "devices"), where("pondId", "==", deleteTarget.id));
      const rootDevicesSnapshot = await getDocs(rootDevicesQuery);
      rootDevicesSnapshot.forEach((deviceDoc) => batch.delete(deviceDoc.ref));

      const pondDevicesSnapshot = await getDocs(collection(db, "users", user.uid, "ponds", deleteTarget.id, "devices"));
      pondDevicesSnapshot.forEach((deviceDoc) => batch.delete(deviceDoc.ref));

      batch.delete(doc(db, "users", user.uid, "ponds", deleteTarget.id));
      await batch.commit();
      setDeleteTarget(null);
    } finally {
      setIsDeletingPond(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>Feed Inventory</h1>
            <p>Monitor feed levels across all active ponds</p>
          </div>
        </header>

        {/* ⚠️ Feed Drum Limit Notice */}
        <div className="feed-limit-banner">
          <MdWarning size={20} className="feed-limit-icon" />
          <div>
            <strong>Feeder Drum Capacity Notice</strong>
            <p>
              The physical drum holds <strong>20 kg</strong>, but the operational dispensing limit per session is set to{" "}
              <strong>10 kg</strong> to prevent overfeeding, motor overload, and water quality degradation.
              Contact your system administrator to adjust this threshold.
            </p>
          </div>
        </div>

        <section className="inventory-summary" style={{ marginTop: 8, marginBottom: 28 }}>
          <div className="summary-card">
            <div className="icon-box blue">
              <MdOutlineInventory className="icon" />
            </div>

            <h2>--</h2>
            <p>Total (kg)</p>
          </div>

          <div className="summary-card">
            <div className="icon-box blue">
              <MdOutlineToday className="icon" />
            </div>

            <h2>--</h2>
            <p>Daily avg (kg)</p>
          </div>

          <div className="summary-card">
            <div className="icon-box warning">
              <MdOutlineAccessTime className="icon" />
            </div>

            <h2>--</h2>
            <p>Days left</p>
          </div>
        </section>

        {refillPonds.length > 0 && (
          <div className="refill-alert">
            <div className="alert-icon">!</div>

            <div className="alert-content">
              <strong>Refill Alert</strong>
              <p>
                {refillPonds
                  .map((pond) => `${pond.name || "Unnamed pond"} needs refilling soon`)
                  .join(". ")}
              </p>
            </div>
          </div>
        )}

        <section className="pond-section">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
            <h3>FEED LEVELS BY POND</h3>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inventory-action-button primary"
            >
              <MdAdd />
              Add Pond
            </button>
          </div>

          {ponds.length > 0 ? (
            ponds.map((pond, index) => {
              const currentStock = Number(pond.currentStock) || 0;
              const capacity = Number(pond.capacity) || 0;
              const percentage = capacity > 0 ? Math.round((currentStock / capacity) * 100) : 0;

              let colorClass = "green";
              if (percentage < 30) colorClass = "red";
              else if (percentage < 60) colorClass = "orange";

              return (
                <div key={pond.id || index} className="pond-card">
                  <div className="pond-header">
                    <div>
                      <h4>{pond.name}</h4>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        type="button"
                        className="pond-delete-button"
                        onClick={() => handleDeletePond(String(pond.id))}
                        aria-label={`Delete ${pond.name || "pond"}`}
                      >
                          <MdDeleteOutline />
                          Delete
                      </button>

                      <span className={`badge ${colorClass}`}>Level</span>
                    </div>
                  </div>

                  <div className="stock-row">
                    <span>Current Stock</span>
                    <strong>{currentStock} kg</strong>
                  </div>

                  <div className="progress">
                    <div className={`${colorClass}-fill`} style={{ width: `${percentage}%` }} />
                  </div>

                  <div className="pond-footer">
                    <div>
                      <label>CAPACITY</label>
                      <h5>{capacity} kg</h5>
                    </div>

                    <div className="right">
                      <label>FISH TYPE</label>
                      <h5>{pond.fishType || "--"}</h5>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#64748b", fontSize: 14 }}>No ponds added yet.</p>
          )}

        </section>

        {modalOpen ? (
          <div className="inventory-modal-backdrop" onClick={closeModal} role="presentation">
            <div
              className="inventory-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="inventory-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="inventory-modal-header">
                <div>
                  <h2 id="inventory-modal-title">Add Pond</h2>
                  <p>Create a pond and its device together.</p>
                </div>

                <button type="button" className="inventory-icon-button" onClick={closeModal} aria-label="Close dialog">
                  <MdClose />
                </button>
              </div>

              <div className="inventory-form-grid">
                <label className="inventory-field">
                  <span>Pond Name</span>
                  <input
                    value={pondForm.name}
                    onChange={(event) => setPondForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="e.g. Pond A"
                  />
                </label>

                <label className="inventory-field">
                  <span>Fish Type</span>
                  <input
                    value={pondForm.fishType}
                    onChange={(event) => setPondForm((current) => ({ ...current, fishType: event.target.value }))}
                    placeholder="e.g. Tilapia"
                  />
                </label>

                <label className="inventory-field">
                  <span>Device Name</span>
                  <input
                    value={pondForm.deviceName}
                    onChange={(event) => setPondForm((current) => ({ ...current, deviceName: event.target.value }))}
                    placeholder="e.g. Feeder A"
                  />
                </label>

                <label className="inventory-field full-width">
                  <span>Capacity (kg)</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={pondForm.capacity}
                    onChange={(event) => setPondForm((current) => ({ ...current, capacity: event.target.value }))}
                    placeholder="e.g. 10"
                    style={Number(pondForm.capacity) > 10 ? { borderColor: '#f59e0b', backgroundColor: '#fffbeb' } : {}}
                  />
                  {Number(pondForm.capacity) > 10 && (
                    <span className="inventory-field-warning">
                      <MdWarning size={13} /> Exceeds 10 kg session limit. Drum max is 20 kg — confirm before saving.
                    </span>
                  )}
                  <span className="inventory-field-hint">Drum holds 20 kg · Recommended max per session: 10 kg</span>
                </label>
              </div>

              <div className="inventory-modal-actions">
                <button type="button" className="inventory-secondary-button" onClick={closeModal}>
                  Cancel
                </button>

                <button
                  type="button"
                  className="inventory-primary-button"
                  onClick={handleAddPond}
                  disabled={isAddingPond}
                >
                  {isAddingPond ? "Saving..." : "Save Pond"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {deleteTarget ? (
          <div className="inventory-modal-backdrop" onClick={() => setDeleteTarget(null)} role="presentation">
            <div
              className="inventory-modal inventory-modal-danger"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="inventory-modal-header">
                <div>
                  <h2 id="delete-modal-title">Delete Pond</h2>
                  <p>This will remove {deleteTarget.name} from your inventory.</p>
                </div>

                <button type="button" className="inventory-icon-button" onClick={() => setDeleteTarget(null)} aria-label="Close dialog">
                  <MdClose />
                </button>
              </div>

              <div className="inventory-delete-warning">
                <MdDeleteOutline />
                <div>
                  <strong>Are you sure?</strong>
                  <p>This action cannot be undone.</p>
                </div>
              </div>

              <div className="inventory-modal-actions">
                <button type="button" className="inventory-secondary-button" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>

                <button type="button" className="inventory-danger-button" onClick={confirmDeletePond} disabled={isDeletingPond}>
                  {isDeletingPond ? "Deleting..." : "Delete Pond"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default Inventory;
