"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getSierraLeoneLocations } from "@/lib/locations";
import { ThemeLogo } from "@/components/layout/theme-logo";
import { SuccessPopup } from "@/components/ui/success-popup";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  isProfessional: z.boolean().default(false),
  location: z.string().min(1, "Please select a location"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;

export function AuthForms() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { signIn } = useAuth();
  const signUpMutation = useMutation(api.auth.signUp);
  const signInMutation = useMutation(api.auth.signIn);

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isProfessional: false,
      location: "Freetown", // Default to most active district
    },
  });

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      // Create account
      await signUpMutation({
        name: data.name,
        email: data.email,
        password: data.password,
        isProfessional: data.isProfessional,
        location: data.location,
      });

      // Auto-login after successful signup
      const signInResult = await signInMutation({
        email: data.email,
        password: data.password,
      });

      if (signInResult.success) {
        // Show success popup
        setShowSuccessPopup(true);
        
        // Sign in the user
        signIn(signInResult.user);
        
        // Redirect to profile page or return URL after popup
        const returnTo = new URLSearchParams(window.location.search).get("returnTo");
        const redirectUrl = returnTo || "/profile";
        
        // Redirect after popup closes
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 3500);
      } else {
        toast.error("Account created but failed to auto-login. Please sign in manually.");
        signUpForm.reset();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const result = await signInMutation({
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        toast.success("Signed in successfully!");
        signIn(result.user);
        // Redirect back to previous page or home
        const returnTo = new URLSearchParams(window.location.search).get("returnTo");
        window.location.href = returnTo || "/";
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center justify-center">
            <ThemeLogo className="h-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to Dodo</CardTitle>
          <CardDescription>
            Meet amazing women, chat & hang out
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    {...signInForm.register("email")}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    {...signInForm.register("password")}
                  />
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    {...signUpForm.register("name")}
                  />
                  {signUpForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    {...signUpForm.register("email")}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    {...signUpForm.register("password")}
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    {...signUpForm.register("confirmPassword")}
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-location">Location</Label>
                  <Select
                    value={signUpForm.watch("location")}
                    onValueChange={(value) => signUpForm.setValue("location", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSierraLeoneLocations().map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {signUpForm.formState.errors.location && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.location.message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-professional"
                    checked={signUpForm.watch("isProfessional")}
                    onCheckedChange={(checked) => 
                      signUpForm.setValue("isProfessional", checked as boolean)
                    }
                  />
                  <Label htmlFor="is-professional" className="text-sm">
                    I'm a professional offering services
                  </Label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Success Popup */}
      <SuccessPopup
        show={showSuccessPopup}
        message="Welcome to Dodo! Your account has been created successfully."
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
}
