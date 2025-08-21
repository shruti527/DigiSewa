import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  governmentId: string;
  isVerified?: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(() => {
    const savedName = localStorage.getItem("fullName");
    const savedEmail = localStorage.getItem("email");
    return savedName || savedEmail ? {
      fullName: savedName || "",
      email: savedEmail || "",
      phone: "",
      address: "",
      dob: "",
      governmentId: "",
      isVerified: false,
    } : null;
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (Date.now() - lastFetchTime < 30000 && userData) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        setUserData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          dob: data.dob ? data.dob.split('T')[0] : "",
          governmentId: data.governmentId || "",
          isVerified: data.isVerified || false,
        });
        
        localStorage.setItem("fullName", data.fullName || "");
        localStorage.setItem("email", data.email || "");
        setLastFetchTime(Date.now());
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast({
            title: "Error",
            description: "Failed to fetch profile data",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast, lastFetchTime]);

  const handleSave = async () => {
    if (!userData) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          phone: userData.phone,
          address: userData.address,
          dob: userData.dob,
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setUserData(prev => ({
        ...prev!,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        dob: data.dob ? data.dob.split('T')[0] : "",
      }));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      localStorage.setItem("fullName", data.fullName || "");
      setLastFetchTime(Date.now());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev!, [name]: value }));
  };

  if (isLoading && !userData) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-8 pb-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex justify-between items-center">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 mr-2" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 mr-2" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  
                  <div className="pt-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Unable to load profile data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {isEditing ? (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" /> 
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-sm mt-1">{userData.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <p className="text-sm mt-1 flex items-center">
                      <Mail className="mr-2 h-4 w-4" /> {userData.email}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                  <Badge 
                    className="mt-1" 
                    variant={userData.isVerified ? "default" : "secondary"}
                  >
                    {userData.isVerified ? "Verified" : "Not Verified"}
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

          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">My Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24">
                    <FileText className="mr-2 h-5 w-5" />
                    Upload New Document
                  </Button>
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