
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sharerName: string;
  serviceName: string;
  onSubmit: (rating: number, comment: string) => void;
}

export function RatingDialog({
  isOpen,
  onOpenChange,
  sharerName,
  serviceName,
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
        // Optionally, show a toast or alert to select a star rating
        alert("Please select a star rating.");
        return;
    }
    onSubmit(rating, comment);
    // Reset state for next use
    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Share your feedback for {sharerName} regarding the {serviceName} group.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="rating" className="mb-2 block">Your Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  <Star
                    className={cn(
                      "h-7 w-7 cursor-pointer transition-colors",
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="comment">Optional Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={rating === 0}>Submit Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    