"use client";

import { useState } from "react";
import {
  Dialog,
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

type ReportModalProps = {
  route: string;
  id: string;
  type: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ReportModal({
  route,
  id,
  type,
  isOpen,
  onClose,
}: ReportModalProps) {
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
        headers: {
          "Content-Type": "application/json",
        },
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
        onClose();
      } else if (response.status === 401) {
        toast.error("Unauthorized. Please log in and try again.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting the report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a Problem</DialogTitle>
          <DialogDescription>
            Please provide details about the issue you&#39;ve encountered.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Type of Problem</legend>
              <RadioGroup
                value={problemType}
                onValueChange={setProblemType}
                className="grid gap-2"
              >
                {[
                  { value: "Duplicate", label: "Duplicate" },
                  { value: "Bad Image", label: "Bad Image" },
                  {
                    value: "Functionality",
                    label: "Design or Functionality Issue",
                  },
                  { value: "Offensive or Spam", label: "Offensive or Spam" },
                  { value: "Incorrect Content", label: "Incorrect Content" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 my-1.5"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </fieldset>
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
              disabled={isLoading}
              className={isLoading ? "cursor-not-allowed" : "cursor-pointer"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
