import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { useAdmin } from "../context/useAdmin"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmModal from "../components/ConfirmModal"

function AdminUsers() {
    const { isAdmin, loading: adminLoading } = useAdmin()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [userToDelete, setUserToDelete] = useState(null)

    useEffect(() => {
        if (!isAdmin) return

        const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
        const unsub = onSnapshot(q, (snapshot) => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setUsers(userData)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching users:", error)
            toast.error("Failed to load users")
            setLoading(false)
        })

        return () => unsub()
    }, [isAdmin])

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        try {
            await deleteDoc(doc(db, "users", userToDelete.id))
            toast.success(`User ${userToDelete.email} removed from database`)
            setUserToDelete(null)
        } catch (error) {
            console.error("Error deleting user:", error)
            toast.error("Failed to delete user")
        }
    }

    if (adminLoading) return <p className="loading-text">Loading...</p>
    if (!isAdmin) return <Navigate to="/" />

    return (
        <>
            <Navbar adminView={true} />
            <div className="page-container">
                <h2 className="page-title">Manage Users</h2>

                {loading ? (
                    <p className="loading-text">Loading users...</p>
                ) : (
                    <div className="users-table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="no-data">No users found</td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`status-badge ${user.role === 'admin' ? 'status-in' : 'status-out'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                {user.createdAt?.toDate
                                                    ? user.createdAt.toDate().toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        className="form-button delete-btn"
                                                        style={{ backgroundColor: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                                        onClick={() => setUserToDelete(user)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <ConfirmModal
                    isOpen={!!userToDelete}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={handleDeleteUser}
                    title="Delete User"
                    message={`Are you sure you want to delete user ${userToDelete?.email}? This will remove their data records but NOT their login credentials (Auth).`}
                    confirmText="Delete User"
                />
            </div>
        </>
    )
}

export default AdminUsers
