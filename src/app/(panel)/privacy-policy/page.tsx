
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          </div>
          <CardDescription>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <p>
            We may collect personal identification information (Name, email address, phone number, etc.) from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our Service.
          </p>
          
          <h3 className="text-lg font-semibold">How We Use Your Information</h3>
          <p>We may use the information we collect in the following ways:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>To personalize user's experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
            <li>To improve our website in order to better serve you.</li>
            <li>To allow us to better service you in responding to your customer service requests.</li>
            <li>To administer a contest, promotion, survey or other site feature.</li>
            <li>To quickly process your transactions.</li>
            <li>To send periodic emails regarding your order or other products and services.</li>
          </ul>

          <h2 className="text-xl font-semibold">Sharing Your Personal Information</h2>
          <p>
            We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
          </p>
          
          <h2 className="text-xl font-semibold">Contacting Us</h2>
          <p>
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:
          </p>
          <p>
            Firebase Subscription Hub<br />
            [Your Company Address]<br />
            <Link href="mailto:privacy@firebasesubscriptionhub.example.com" className="text-primary hover:underline">privacy@firebasesubscriptionhub.example.com</Link>
          </p>

          {/* Add more placeholder sections as needed */}
          <p className="text-sm text-muted-foreground pt-4">
            This is a placeholder Privacy Policy document. In a real application, this would contain comprehensive legal terms regarding data privacy.
          </p>

          <div className="pt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
