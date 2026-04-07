"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { ThemeLogo } from "@/components/layout/theme-logo";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      // Simulate sending contact form
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would send to your backend/email service
      console.log("Contact form submission:", data);
      
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      contactForm.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <ThemeLogo className="h-12" />
            </div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Contact Us
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              We're here to help and answer any questions you might have
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={contactForm.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...contactForm.register("name")}
                      />
                      {contactForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {contactForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...contactForm.register("email")}
                      />
                      {contactForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {contactForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={contactForm.watch("category")}
                      onValueChange={(value) => contactForm.setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payment</SelectItem>
                        <SelectItem value="professional">Professional Services</SelectItem>
                        <SelectItem value="safety">Safety & Security</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                      </SelectContent>
                    </Select>
                    {contactForm.formState.errors.category && (
                      <p className="text-sm text-red-500">
                        {contactForm.formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      {...contactForm.register("subject")}
                    />
                    {contactForm.formState.errors.subject && (
                      <p className="text-sm text-red-500">
                        {contactForm.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-32 resize-none"
                      {...contactForm.register("message")}
                    />
                    {contactForm.formState.errors.message && (
                      <p className="text-sm text-red-500">
                        {contactForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Reach out to us directly through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">support@dodo.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">+232 88 123 456</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Office</p>
                    <p className="text-sm text-muted-foreground">Freetown, Sierra Leone</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM</p>
                    <p className="text-sm text-muted-foreground">Sat-Sun: 10AM-4PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">How do I become a professional?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign up for an account and select "I'm a professional offering services" during registration.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Is my information secure?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we use industry-standard encryption and security measures to protect your data.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">How do payments work?</h4>
                  <p className="text-sm text-muted-foreground">
                    We use secure payment processing through Monime. Payments are held in escrow until services are completed.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Can I cancel my booking?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel bookings up to 24 hours before the scheduled time for a full refund.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  For urgent safety or security concerns, please contact us immediately:
                </p>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Emergency Hotline</p>
                    <p className="text-sm text-red-700">+232 77 999 999 (24/7)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
