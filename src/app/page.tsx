import Calculator from "@/components/calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Calculator</h1>
        <Calculator />
      </div>
    </main>
  )
}
