"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaxLiability } from "@/components/dashboard/tax-liability"
import { TaxDeductions } from "@/components/dashboard/tax-deductions"
import { TaxDocuments } from "@/components/dashboard/tax-documents"

export default function TaxesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Tax Management</h1>

      <Tabs defaultValue="liabilities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="liabilities">Tax Liabilities</TabsTrigger>
          <TabsTrigger value="deductions">Tax Deductions</TabsTrigger>
          <TabsTrigger value="documents">Tax Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="liabilities" className="space-y-4">
          <TaxLiability />
        </TabsContent>

        <TabsContent value="deductions" className="space-y-4">
          <TaxDeductions />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <TaxDocuments />
        </TabsContent>
      </Tabs>
    </div>
  )
}

