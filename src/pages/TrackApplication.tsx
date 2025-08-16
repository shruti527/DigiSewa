import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  FileText, 
  Calendar, 
  User, 
  Building, 
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Smartphone,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationStep {
  title: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

interface ApplicationData {
  id: string;
  title: string;
  applicantName: string;
  phone: string;
  status: 'approved' | 'processing' | 'pending' | 'rejected';
  progress: number;
  department: string;
  submittedDate: string;
  approvedDate?: string;
  fees: string;
  blockchainHash: string;
  steps: ApplicationStep[];
}

const mockApplications: Record<string, ApplicationData> = {
  "SHE2024001": {
    id: "SHE2024001",
    title: "Shop & Establishment License",
    applicantName: "Rajesh Kumar Sharma",
    phone: "+91-9876543210",
    status: "approved",
    progress: 100,
    department: "Municipal Corporation",
    submittedDate: "2024-01-15",
    approvedDate: "2024-01-18",
    fees: "₹1,500",
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
    steps: [
      { title: "Application Submitted", date: "2024-01-15 10:30 AM", status: "completed" },
      { title: "Document Verification", date: "2024-01-16 02:15 PM", status: "completed" },
      { title: "Officer Review", date: "2024-01-17 11:45 AM", status: "completed" },
      { title: "Final Approval", date: "2024-01-18 04:20 PM", status: "completed" },
      { title: "Certificate Generated", date: "2024-01-18 04:25 PM", status: "completed" }
    ]
  },
  "VEH2024002": {
    id: "VEH2024002",
    title: "Vehicle Registration",
    applicantName: "Priya Patel",
    phone: "+91-9876543211",
    status: "processing",
    progress: 75,
    department: "Regional Transport Office",
    submittedDate: "2024-01-20",
    fees: "₹850",
    blockchainHash: "Pending - Will be generated on approval",
    steps: [
      { title: "Application Submitted", date: "2024-01-20 09:15 AM", status: "completed" },
      { title: "Document Verification", date: "2024-01-21 03:30 PM", status: "completed" },
      { title: "Physical Inspection", date: "2024-01-22 10:00 AM", status: "completed" },
      { title: "Final Processing", date: "In Progress", status: "current" },
      { title: "RC Generation", date: "Pending", status: "pending" }
    ]
  }
};

const TrackApplication = () => {
  const [applicationId, setApplicationId] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<ApplicationData | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an application ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const result = mockApplications[applicationId.toUpperCase()];
      if (result) {
        setSearchResult(result);
      } else {
        toast({
          title: "Not Found",
          description: "No application found with this ID",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case "pending":
        return <Badge className="bg-gray-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="applicationId">Application ID</Label>
                <Input
                  id="applicationId"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Enter application ID (e.g., SHE2024001)"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Searching..." : "Track Application"}
              </Button>
            </form>

            {searchResult && (
              <div className="mt-8 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{searchResult.title}</CardTitle>
                      {getStatusBadge(searchResult.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Applicant: {searchResult.applicantName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Department: {searchResult.department}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {searchResult.submittedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Fees: {searchResult.fees}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Progress value={searchResult.progress} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {searchResult.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {step.status === 'completed' && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {step.status === 'current' && (
                            <div className="h-5 w-5 rounded-full bg-yellow-500 animate-pulse" />
                          )}
                          {step.status === 'pending' && (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-gray-500">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TrackApplication;