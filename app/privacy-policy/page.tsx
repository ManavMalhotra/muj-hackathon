import { SiteHeader } from "../components/site-header"
import { SiteFooter } from "../components/site-footer"

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">
          This is a placeholder Privacy Policy page. Provide your policy content and we’ll replace this text.
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
