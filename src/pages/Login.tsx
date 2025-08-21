import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({ email: "", password: "", adminCode: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      
      // Store token in httpOnly cookie instead of localStorage
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`;
      
      // Call context login function
      login(data.token, {
        id: data.user?.id || '',
        name: data.user?.name || data.user?.fullName || userForm.email,
        email: data.user?.email || userForm.email,
        role: 'citizen'
      });

      toast({
        title: "Login Successful", 
        description: `Welcome back ${data.user?.name || data.user?.fullName || userForm.email}!`,
        duration: 2000
      });
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({ 
        title: "Login Failed", 
        description: err.message, 
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Admin login failed");
      }

      const data = await res.json();
      
      // Store token in httpOnly cookie
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`;
      
      login(data.token, {
        id: data.user?.id || '',
        name: data.user?.name || data.user?.fullName || "Admin",
        email: data.user?.email || adminForm.email,
        role: 'admin'
      });

      toast({ 
        title: "Admin Login Successful", 
        description: "Access granted",
        duration: 2000
      });
      
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      toast({ 
        title: "Admin Login Failed", 
        description: err.message, 
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Access Portal</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your access level to continue to the digital government services platform
            </p>
          </div>

          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Citizen Login
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Admin Portal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <Card className="shadow-corporate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Citizen Login
                  </CardTitle>
                  <CardDescription>Enter your credentials to access services</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUserLogin} className="space-y-4">
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Login to Services"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Don't have an account?</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/register">
                        Register here <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="shadow-corporate border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" /> Admin Portal
                  </CardTitle>
                  <CardDescription>Authorized personnel only</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Official email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    <Input
                      type="password"
                      placeholder="Admin Code"
                      value={adminForm.adminCode}
                      onChange={(e) => setAdminForm({ ...adminForm, adminCode: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Access Admin Portal"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;