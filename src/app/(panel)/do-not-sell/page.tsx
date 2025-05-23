
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DoNotSellPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Do Not Sell or Share My Personal Information</CardTitle>
          </div>
          <CardDescription>
            Understand your rights regarding the selling or sharing of your personal information under applicable privacy laws (e.g., CCPA/CPRA).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            At Firebase Subscription Hub, we are committed to protecting your privacy. We do not "sell" your personal information in the traditional sense, such as exchanging it for monetary compensation.
          </p>
          <p>
            However, under certain privacy laws like the California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA), the term "sell" can also include sharing personal information with third parties for non-monetary benefits, such as for cross-context behavioral advertising or certain types of analytics.
          </p>
          
          <h3 className="text-lg font-semibold">Your Right to Opt-Out</h3>
          <p>
            You have the right to opt-out of the "sale" or "sharing" of your personal information. If you choose to opt-out, we will refrain from sharing your information with third parties in ways that might be considered a "sale" or "sharing" under these laws.
          </p>
          <p>
            To exercise your opt-out right, please use one of the following methods:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Global Privacy Control (GPC):</strong> We honor the Global Privacy Control signal. If your browser or browser extension broadcasts the GPC signal, we will automatically treat it as a valid request to opt-out of the sale or sharing of your personal information for that browser. You can learn more about GPC at <Link href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">globalprivacycontrol.org <ExternalLink className="inline-block h-3 w-3 ml-0.5" /></Link>.
            </li>
            <li>
              <strong>Submit a Request:</strong> You can submit an opt-out request by contacting our privacy team at <Link href="mailto:privacy@firebasesubscriptionhub.example.com" className="text-primary hover:underline">privacy@firebasesubscriptionhub.example.com</Link>. Please include sufficient information for us to identify you in our systems.
            </li>
          </ul>

          <h3 className="text-lg font-semibold">Authorized Agents</h3>
          <p>
            You may designate an authorized agent to make an opt-out request on your behalf. We will require written proof of the agent’s permission to do so and may verify your identity directly.
          </p>

          <p className="text-sm text-muted-foreground">
            Please note that opting out may affect your experience with certain personalized features or advertisements. For more details on how we handle your personal information, please review our full <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
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
