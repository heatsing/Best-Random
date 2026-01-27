import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "Terms of Service – BestRandom",
  description: "BestRandom's terms of service and conditions.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using the BestRandom website, you agree to comply with these terms 
              of service. If you do not agree to these terms, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Usage</h2>
            <p className="text-muted-foreground">
              BestRandom provides free random generator tools. You are free to use these tools, 
              but you may not use them for any illegal, harmful, or inappropriate purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="text-muted-foreground">
              The tools and services provided on this website are provided "as is" without any 
              express or implied warranties. We do not guarantee the accuracy, reliability, or 
              suitability of the services. We are not liable for any loss or damage arising from 
              the use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on the BestRandom website, including but not limited to text, graphics, 
              logos, icons, and software, is our property or property we are authorized to use, 
              and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Responsibility</h2>
            <p className="text-muted-foreground">
              You are responsible for ensuring that your use of this website complies with all 
              applicable laws and regulations. You may not use this website for any activity that 
              may damage, disable, overload, or impair the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Changes</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or terminate this website or any part of it 
              at any time without prior notice. We are not liable for any modifications, suspensions, 
              or terminations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Terms Updates</h2>
            <p className="text-muted-foreground">
              We may update these terms of service from time to time. Any changes will be posted on 
              this page. We recommend that you review this page periodically to stay informed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these terms of service, please contact us through our 
              contact information.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
