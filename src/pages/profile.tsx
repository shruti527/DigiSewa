import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Shield,
  FileText,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    governmentId: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData({
            fullName: data.fullName || localStorage.getItem("fullName") || "",
            email: data.email || localStorage.getItem("email") || "",
            phone: data.phone || "",
            address: data.address || "",
            dob: data.dob || "",
            governmentId: data.governmentId || "",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleSave = () => {
    // Simulate API call
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    setIsEditing(false);
    // Update localStorage
    localStorage.setItem("fullName", userData.fullName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {isEditing ? (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Info Card */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <User className="mr-2 h-5 w-5" /> Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1">{userData.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled // Email often non-editable
                      />
                    ) : (
                      <p className="text-sm mt-1 flex items-center">
                        <Mail className="mr-2 h-4 w-4" /> {userData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1 flex items-center">
                        <Phone className="mr-2 h-4 w-4" />{" "}
                        {userData.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={userData.dob}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1 flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />{" "}
                        {userData.dob || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1 flex items-center">
                        <Home className="mr-2 h-4 w-4" />{" "}
                        {userData.address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government ID & Verification */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Shield className="mr-2 h-5 w-5" /> Government Verification
                </h2>

                <div>
                  <Label>Government ID</Label>
                  <p className="text-sm mt-1 flex items-center">
                    <FileText className="mr-2 h-4 w-4" />{" "}
                    {userData.governmentId || "Not linked"}
                  </p>
                </div>

                <div>
                  <Label>Verification Status</Label>
                  <Badge className="mt-1 bg-success text-success-foreground">
                    Verified
                  </Badge>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    View Linked Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Section */}
          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">My Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24">
                    <FileText className="mr-2 h-5 w-5" />
                    Upload New Document
                  </Button>
                  {/* Placeholder for user documents */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;