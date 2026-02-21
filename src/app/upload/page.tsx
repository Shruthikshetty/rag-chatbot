"use client";

import { useState } from "react";
import { processPDF } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PDFUploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>();

  // handler for file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // start loading
    setIsLoading(true);
    setMessage(null);

    // call our action
    try {
      const formdata = new FormData();
      formdata.append("pdf", file);

      const result = await processPDF(formdata);

      if (result.success) {
        setMessage({
          type: "success",
          text: result?.message ?? "PDF processed successfully",
        });
        e.target.value = "";
      } else {
        setMessage({
          type: "error",
          text: result?.error ?? "Error while processing PDF",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error while processing PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-background h-[calc(100vh-5rem)] pt-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
          PDF upload
        </h1>
        <Card className="m-6">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pdf-upload" className=" text-lg">
                Upload PDF file
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </div>
            {isLoading && <Spinner />}
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertTitle>
                  {message.type === "error" ? "Error" : "Success"}
                </AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
