import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"

export const Route = createFileRoute("/blog/")({ component: BlogPage })

function BlogPage() {
  return (
    <div>
      <PageHeader
        title="Blog"
        intro="Verhalen en updates van Wilhalla."
      />
    </div>
  )
}
