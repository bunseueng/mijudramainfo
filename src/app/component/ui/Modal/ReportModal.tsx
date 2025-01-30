"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

type ReportModalType = {
  route: string;
  id: string;
  type: string;
};

export default function ReportModal({ route, id, type }: ReportModalType) {
  const [problemType, setProblemType] = useState<string>("");
  const [extraDetails, setExtraDetails] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!problemType) {
      toast.error("Please select a problem type");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/${route}/${id}/report`, {
        method: "PATCH",
        body: JSON.stringify({
          problemType,
          extraDetails,
          type,
        }),
      });

      if (response.ok) {
        toast.success("Report submitted successfully");
        setProblemType("");
        setExtraDetails("");
      } else if (response.status === 401) {
        toast.error("Unauthorized");
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting the report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Report a Problem</DialogTitle>
        <DialogDescription>
          Please provide details about the issue you&#39;ve encountered.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="problem-type">Type of Problem</Label>
            <RadioGroup
              id="problem-type"
              value={problemType}
              onValueChange={setProblemType}
              className="grid gap-2"
            >
              <div className="flex items-center space-x-2 my-1.5">
                <RadioGroupItem value="Duplicate" id="duplicate" />
                <Label htmlFor="duplicate" className="cursor-pointer">
                  Duplicate
                </Label>
              </div>
              <div className="flex items-center space-x-2 my-1.5">
                <RadioGroupItem value="Bad Image" id="bad_image" />
                <Label htmlFor="bad_image" className="cursor-pointer">
                  Bad Image
                </Label>
              </div>
              <div className="flex items-center space-x-2 my-1.5">
                <RadioGroupItem value="Functionality" id="functionality" />
                <Label htmlFor="functionality" className="cursor-pointer">
                  Design or Functionality Issue
                </Label>
              </div>
              <div className="flex items-center space-x-2 my-1.5">
                <RadioGroupItem value="Offensive or Spam" id="spam" />
                <Label htmlFor="spam" className="cursor-pointer">
                  Offensive or Spam
                </Label>
              </div>
              <div className="flex items-center space-x-2 my-1.5">
                <RadioGroupItem
                  value="Incorrect Content"
                  id="incorrect_content"
                />
                <Label htmlFor="incorrect_content" className="cursor-pointer">
                  Incorrect Content
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="extra-details">Extra Details</Label>
            <Textarea
              id="extra-details"
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              placeholder="Provide more information about the problem"
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isLoading ? true : false}
            className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
