"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabaseClient"
import { Database } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Download, Trash2 } from "lucide-react"

type TaxDocument = Database["public"]["Tables"]["tax_documents"]["Row"]

export function TaxDocuments() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<TaxDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newDocument, setNewDocument] = useState({
    name: "",
    tax_year: new Date().getFullYear(),
    category: "receipt" as "w2" | "1099" | "receipt" | "other",
  })

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("tax_documents")
        .select("*")
        .eq("user_id", user?.id)
        .order("tax_year", { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (file: File) => {
    try {
      setUploading(true)
      
      // Upload file to storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`
      const { error: uploadError, data } = await supabase.storage
        .from("tax-documents")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Create document record
      const { error: dbError } = await supabase.from("tax_documents").insert([
        {
          name: newDocument.name || file.name,
          document_url: data?.path || "",
          tax_year: newDocument.tax_year,
          category: newDocument.category,
          user_id: user?.id,
        },
      ])

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })

      fetchDocuments()
      setNewDocument({
        name: "",
        tax_year: new Date().getFullYear(),
        category: "receipt",
      })
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadDocument = async (doc: TaxDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("tax-documents")
        .download(doc.document_url)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = doc.name
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading document:", error)
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      })
    }
  }

  const deleteDocument = async (document: TaxDocument) => {
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("tax-documents")
        .remove([document.document_url])

      if (storageError) throw storageError

      // Delete record from database
      const { error: dbError } = await supabase
        .from("tax_documents")
        .delete()
        .eq("id", document.id)
        .eq("user_id", user?.id)

      if (dbError) throw dbError

      setDocuments(documents.filter((d) => d.id !== document.id))
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading documents...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                value={newDocument.name}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, name: e.target.value })
                }
                placeholder="2023 W-2"
              />
            </div>
            <div>
              <Label htmlFor="tax_year">Tax Year</Label>
              <Input
                id="tax_year"
                type="number"
                value={newDocument.tax_year}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    tax_year: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newDocument.category}
                onValueChange={(value: "w2" | "1099" | "receipt" | "other") =>
                  setNewDocument({ ...newDocument, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w2">W-2</SelectItem>
                  <SelectItem value="1099">1099</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
              </div>
              <Input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadDocument(file)
                }}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-white"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{document.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {document.tax_year} • {document.category.toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadDocument(document)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDocument(document)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No documents yet. Upload some to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 