export function WorkspaceHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground text-balance">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}
