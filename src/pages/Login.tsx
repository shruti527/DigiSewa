import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/integrations/supabase/client";

const Login = () => {
  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({ email: "", password: "", adminCode: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.token) localStorage.setItem("token", data.token);

      const fullName =
        data.fullName ||
        data.name ||
        (data.user && (data.user.fullName || data.user.name)) ||
        null;

      if (fullName) {
        localStorage.setItem("fullName", fullName);
      } else if (data.email) {
        localStorage.setItem("email", data.email);
      } else {
        localStorage.setItem("email", userForm.email);
      }

      toast({ title: "Login Successful", description: `Welcome back ${fullName || userForm.email}!` });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Admin login failed");

      if (data.token) localStorage.setItem("token", data.token);

      const adminName = data.fullName || data.name || (data.user && (data.user.fullName || data.user.name)) || "Admin";
      localStorage.setItem("fullName", adminName);

      toast({ title: "Admin Login Successful", description: "Access granted" });
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast({ title: "Admin Login Failed", description: err.message, variant: "destructive" });
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

            {/* Citizen Login */}
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
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
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

            {/* Admin Login */}
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
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Admin Code"
                      value={adminForm.adminCode}
                      onChange={(e) => setAdminForm({ ...adminForm, adminCode: e.target.value })}
                      required
                    />
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
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