import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("applications");

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

  const prettyNameFromString = (raw: string | null) => {
    if (!raw) return "User";
    if (/\s/.test(raw)) {
      return raw
        .trim()
        .split(/\s+/)
        .map(capitalize)
        .join(" ");
    }
    if (raw.includes("@")) {
      const local = raw.split("@")[0];
      const parts = local.split(/[._-]/).filter(Boolean);
      return parts.map(capitalize).join(" ");
    }
    return capitalize(raw);
  };

  const [displayName, setDisplayName] = useState(() => {
    const full = localStorage.getItem("fullName");
    const nameKey =
      localStorage.getItem("username") || localStorage.getItem("name");
    const emailKey = localStorage.getItem("email");
    const raw = full || nameKey || emailKey || "User";
    return prettyNameFromString(raw);
  });

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const fetched = data.fullName || data.name || data.email;
          if (fetched) {
            localStorage.setItem("fullName", fetched);
            setDisplayName(prettyNameFromString(fetched));
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast({ title: "Logged out", description: "You have been logged out." });
    navigate("/login");
  };

  const applications = [
    {
      id: "APP001",
      title: "Shop & Establishment License",
      type: "Business License",
      status: "approved",
      submittedDate: "2024-01-15",
      progress: 100,
      applicationId: "SHE2024001",
      department: "Municipal Corporation",
      fees: "₹1,500",
      validUntil: "2025-01-18",
    },
    {
      id: "APP002",
      title: "Vehicle Registration",
      type: "Transport",
      status: "processing",
      submittedDate: "2024-01-20",
      progress: 75,
      applicationId: "VEH2024002",
      department: "RTO",
      fees: "₹850",
    },
    {
      id: "APP003",
      title: "FSSAI Food License",
      type: "Food Safety",
      status: "pending",
      submittedDate: "2024-01-22",
      progress: 25,
      applicationId: "FSS2024003",
      department: "Food & Drug Administration",
      fees: "₹2,000",
    },
    {
      id: "APP004",
      title: "Income Certificate",
      type: "Legal Document",
      status: "rejected",
      submittedDate: "2024-01-10",
      progress: 0,
      applicationId: "INC2024004",
      department: "Revenue Department",
      fees: "₹50",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground">Approved</Badge>
        );
      case "processing":
        return (
          <Badge className="bg-warning text-warning-foreground">
            Processing
          </Badge>
        );
      case "pending":
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "processing":
        return <Clock className="h-4 w-4 text-warning" />;
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const stats = [
    {
      label: "Total Applications",
      value: "4",
      icon: FileText,
      color: "text-blue-600",
    },
    { label: "Approved", value: "1", icon: CheckCircle2, color: "text-green-600" },
    { label: "Processing", value: "2", icon: Clock, color: "text-orange-600" },
    { label: "Rejected", value: "1", icon: AlertCircle, color: "text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {displayName}
            </h1>
            <p className="text-muted-foreground">
              Manage your applications and access government services
            </p>
            <Button
              onClick={handleLogout}
              className="mt-4"
              variant="destructive"
            >
              Logout
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </CardContent>
              </Card>
            ))}
          </div>

          <WalletConnect />

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6 mt-8"
          >
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              {applications.map((app) => (
                <Card key={app.id} className="mb-4">
                  <CardContent className="p-4 flex flex-col lg:flex-row justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(app.status)}
                        <h3>{app.title}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ID: {app.applicationId}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2 lg:mt-0">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      {app.status === "approved" && (
                        <Button variant="government" size="sm">
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="certificates">
              <p>No certificates available yet.</p>
            </TabsContent>

            <TabsContent value="notifications">
              <p>No new notifications.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;