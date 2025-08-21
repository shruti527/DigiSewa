import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, Clock, CheckCircle2, AlertTriangle, 
  Eye, Download, Search, Filter, Users, BarChart3, 
  Settings, Shield, CheckSquare, XSquare, Building2, 
  Calendar, TrendingUp, FileCheck, UserCheck, RefreshCw
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_BASE = "http://localhost:5000"; // your backend with MongoDB

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    approvedToday: 0,
    rejectedApplications: 0,
    processingApplications: 0
  });
  const [departments] = useState([
    "Municipal Corporation",
    "RTO",
    "Food & Drug Administration", 
    "Police Department",
    "Public Works Department",
    "Revenue Department",
    "Education Department",
    "Health Department"
  ]);

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/applications`);
      const data = await res.json();

      const formatted = data.map((app: any) => ({
        id: app._id,
        user_name: app.user?.name || "Unknown User",
        user_email: app.user?.email || "No email",
        license_type: app.license_type,
        status: app.status,
        submission_date: app.submission_date,
        documents: app.documents || [],
        approvals: app.approvals || [],
        blockchain_tx_hash: app.blockchain_tx_hash,
        ipfs_hash: app.ipfs_hash
      }));

      setApplications(formatted);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({ title: "Error", description: "Failed to load applications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  // Handle approve
  const handleApproveApplication = async (applicationId: string) => {
    if (!approvalRemarks.trim()) {
      toast({ title: "Approval Remarks Required", description: "Please provide remarks.", variant: "destructive" });
      return;
    }
    try {
      await fetch(`${API_BASE}/applications/${applicationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remarks: approvalRemarks,
          approved_by: user?.id,
          department: departmentFilter !== "all" ? departmentFilter : "Admin"
        })
      });
      await fetchApplications();
      await fetchStats();
      setApprovalRemarks("");
      setSelectedApplication(null);
      toast({ title: "Application Approved", description: `Application ${applicationId} approved.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to approve.", variant: "destructive" });
    }
  };

  // Handle reject
  const handleRejectApplication = async (applicationId: string) => {
    if (!approvalRemarks.trim()) {
      toast({ title: "Rejection Reason Required", description: "Please provide remarks.", variant: "destructive" });
      return;
    }
    try {
      await fetch(`${API_BASE}/applications/${applicationId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remarks: approvalRemarks,
          rejected_by: user?.id,
          department: departmentFilter !== "all" ? departmentFilter : "Admin"
        })
      });
      await fetchApplications();
      await fetchStats();
      setApprovalRemarks("");
      setSelectedApplication(null);
      toast({ title: "Application Rejected", description: `Application ${applicationId} rejected.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to reject.", variant: "destructive" });
    }
  };

  // Handle set processing
  const handleSetProcessing = async (applicationId: string) => {
    try {
      await fetch(`${API_BASE}/applications/${applicationId}/processing`, {
        method: "POST"
      });
      await fetchApplications();
      await fetchStats();
      toast({ title: "Status Updated", description: `Application ${applicationId} set to processing.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.license_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // (UI remains unchanged ↓ – same as your original code)
  // ...

  return (
    <div className="min-h-screen bg-background">
      <Header/>
      {/* Entire UI code same as before – no design changes */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
