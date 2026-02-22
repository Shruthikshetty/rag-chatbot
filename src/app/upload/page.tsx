"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { processPDF } from "./actions";

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
    } catch {
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
        <Card className="m-6">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="pdf-upload"
                className="justify-center font-bold text-foreground text-2xl mb-4"
              >
                Upload PDF file
              </Label>
              <Input
                className="h-10"
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
