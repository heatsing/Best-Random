import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy – BestRandom",
  description: "BestRandom's privacy policy explaining how we collect, use, and protect your data.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-muted-foreground">
              BestRandom values your privacy. We do not collect, store, or transmit any personally 
              identifiable information. All generation operations are completed locally in your browser, 
              and no data is sent to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Local Storage</h2>
            <p className="text-muted-foreground">
              To provide a better user experience, we use your browser's local storage (localStorage) 
              to save your generation history and favorites. This data is stored only on your device, 
              and we cannot access it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-muted-foreground">
              We may use necessary cookies to improve website functionality, but these cookies do not 
              contain personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We may use third-party analytics services to understand website usage, but these services 
              do not collect personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              Since we do not collect or store your personal data, there is no risk of data breaches. 
              All generation operations are completed locally in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. Any changes will be posted on this 
              page. We recommend that you review this page periodically to stay informed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this privacy policy, please contact us through our 
              contact information.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
