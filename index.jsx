import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "react-hot-toast";

// 使用 Next.js API 路由代理
const API_BASE = "/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from:", API_BASE);
      const res = await fetch(API_BASE, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const text = await res.text();
      console.log("Raw response:", text);
      
      let data;
      try {
        data = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error("Error parsing JSON:", e);
        data = [];
      }
      
      console.log("Fetched data:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users: " + error.message);
    }
  };

  const handleSave = async () => {
    const method = editingUser ? "PUT" : "POST";
    const url = editingUser ? `${API_BASE}` : API_BASE;

    try {
      console.log(`${method} request to:`, url, "with data:", form);
      const res = await fetch(url, {
        method,
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        cache: 'no-cache',
        body: JSON.stringify(form),
      });
      console.log("Response status:", res.status);
      if (!res.ok) throw new Error(`Failed to save user. Status: ${res.status}`);
      toast.success("User saved successfully");
      setOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (email) => {
    try {
      console.log("DELETE request to:", `${API_BASE}?email=${email}`);
      const res = await fetch(`${API_BASE}?email=${email}`, { 
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache',
      });
      console.log("Response status:", res.status);
      if (!res.ok) throw new Error(`Failed to delete user. Status: ${res.status}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message);
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm(user);
    setOpen(true);
  };

  return (
    <div className="p-8">
      <Card>
        <CardContent>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button onClick={() => { setEditingUser(null); setForm({ email: "", first_name: "", last_name: "" }); setOpen(true); }}>Add User</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>
                    <Button className="mr-2" onClick={() => openEdit(user)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(user.email)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog for Add/Edit User */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={editingUser} />
          <Input placeholder="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <Input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <Button onClick={handleSave}>{editingUser ? "Update" : "Create"}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
