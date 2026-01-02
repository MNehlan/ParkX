import { useEffect, useState } from "react"
import { collection, doc, getDocs, onSnapshot, query, where, writeBatch } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { useAdmin } from "../context/useAdmin"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmModal from "../components/ConfirmModal"

function AdminFacilities() {
    const { isAdmin, loading: adminLoading } = useAdmin()
    const [facilities, setFacilities] = useState([])
    const [loading, setLoading] = useState(true)
    const [facilityToDelete, setFacilityToDelete] = useState(null)

    useEffect(() => {
        if (!isAdmin) return

        const unsub = onSnapshot(collection(db, "facilities"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setFacilities(data)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching facilities:", error)
            toast.error("Failed to load facilities")
            setLoading(false)
        })

        return () => unsub()
    }, [isAdmin])

    const handleDeleteFacility = async () => {
        if (!facilityToDelete) return

        try {
            const facilityId = facilityToDelete.id

            // 1. Delete associated vehicles
            const vehiclesQuery = query(collection(db, "vehicles"), where("facilityId", "==", facilityId))
            const vehiclesSnap = await getDocs(vehiclesQuery)

            const batch = writeBatch(db)
            vehiclesSnap.docs.forEach(vDoc => {
                batch.delete(vDoc.ref)
            })

            // 2. Delete the facility document
            const facilityRef = doc(db, "facilities", facilityId)
            batch.delete(facilityRef)

            await batch.commit()

            toast.success(`Facility "${facilityToDelete.name}" and its vehicles deleted`)
            setFacilityToDelete(null)
        } catch (error) {
            console.error("Error deleting facility:", error)
            toast.error("Failed to delete facility")
        }
    }

    if (adminLoading) return <p className="loading-text">Loading...</p>
    if (!isAdmin) return <Navigate to="/" />

    return (
        <>
            <Navbar adminView={true} />
            <div className="page-container">
                <h2 className="page-title">Manage Facilities</h2>

                {loading ? (
                    <p className="loading-text">Loading facilities...</p>
                ) : (
                    <div className="users-table-container"> {/* Reuse styling */}
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Facility Name</th>
                                    <th>Manager (Owner ID)</th>
                                    <th>Slots</th>
                                    <th>Rate/Hr</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facilities.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="no-data">No facilities found</td>
                                    </tr>
                                ) : (
                                    facilities.map(facility => (
                                        <tr key={facility.id}>
                                            <td><strong>{facility.name}</strong></td>
                                            <td style={{ fontSize: '0.85rem', color: '#888' }}>
                                                {facility.ownerId}
                                            </td>
                                            <td>{facility.totalSlots}</td>
                                            <td>₹{facility.rateFirstHour}</td>
                                            <td>
                                                <button
                                                    className="form-button delete-btn"
                                                    style={{ backgroundColor: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                                    onClick={() => setFacilityToDelete(facility)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <ConfirmModal
                    isOpen={!!facilityToDelete}
                    onClose={() => setFacilityToDelete(null)}
                    onConfirm={handleDeleteFacility}
                    title="Delete Facility"
                    message={`Are you sure you want to delete "${facilityToDelete?.name}"? This will permanently remove the facility and ALL associated vehicle records. The owner will need to create a new facility to continue using the app.`}
                    confirmText="Delete Facility"
                />
            </div>
        </>
    )
}

export default AdminFacilities
