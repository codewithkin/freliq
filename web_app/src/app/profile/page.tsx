"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Chrome,
  File,
  Hammer,
  Mail,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    occupation: "",
    website: "",
  });

  // Get the user's data
  const {
    data: user,
    isLoading: gettingUser,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data.fullUser;
    },
    onSuccess: (data) => {
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        occupation: data.occupation || "",
        website: data.website || "",
      });
    },
  });

  // Mutation for updating user data
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.put("/api/user", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      refetch();
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
  };

  return (
    <section className="md:p-8 p-4">
      <article className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold mb-8">My Profile</h3>
        {!gettingUser && (
          <Button
            variant={isEditing ? "destructive" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            className="flex gap-2"
          >
            <Pencil size={18} />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        )}
      </article>
      <Separator className="w-full fill-slate-00 mb-8" />

      {gettingUser ? (
        <Skeleton className="bg-slate-200 h-4 w-full rounded-xl" />
      ) : (
        <article>
          <Avatar className="w-32 h-32 rounded-full bg-slate-200">
            <AvatarImage
              className="w-32 h-32 rounded-full bg-slate-200 border border-primary"
              src={user?.image}
            />
            <AvatarFallback className="w-32 h-32 border border-primary rounded-full bg-slate-200">
              {user?.email.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Occupation
                </label>
                <Input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Website
                </label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  type="url"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <article className="flex flex-col my-2">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                {user?.name}{" "}
                {user?.emailVerified && (
                  <BadgeCheck size={38} className="fill-primary text-white" />
                )}
              </h3>

              {/* Data */}
              <article className="flex justify-between items-center my-1">
                <article className="flex items-center gap-2 text-md">
                  <span className="flex items-center gap-2">
                    <Hammer size={18} />
                    Projects:
                  </span>
                  {user?.projects.length}
                </article>

                <article className="flex items-center gap-2 text-md">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Tasks:
                  </span>
                  {user?.tasks.length}
                </article>

                <article className="flex items-center gap-2 text-md">
                  <span className="flex items-center gap-2">
                    <File size={18} />
                    Files:
                  </span>
                  {user?.files.length}
                </article>
              </article>

              <article className="flex items-center gap-2 mb-1 text-muted-foreground">
                <Mail size={18} />
                <p>{user?.email || "No email added"}</p>
              </article>

              <article className="flex items-center gap-2 mb-1 text-muted-foreground">
                <Briefcase size={18} />
                <p>{user?.occupation || "No occupation added"}</p>
              </article>

              <article className="flex items-center gap-2 mb-1 text-muted-foreground">
                <Chrome size="18" />
                <p>{user?.website || "No website added"}</p>
              </article>

              <p className="text-muted-foreground text-sm">
                {user?.bio ||
                  "No bio yet...you might wanna add one to improve your profile"}
              </p>

              {/* Plan info */}
              <Card className="my-8">
                <CardContent>
                  <article className="flex items-center justify-between gap-4">
                    <article className="flex gap-4 items-center">
                      <article className="h-full min-h-12 w-2 bg-primary rounded-full"></article>
                      <article className="flex flex-col">
                        <h3 className="capitalize text-xl font-semibold">
                          {user?.plan}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Member for{" "}
                          {formatDistanceToNow(new Date(user?.createdAt))}
                        </p>
                      </article>
                    </article>

                    {user.plan !== "pro" ? (
                      <Button asChild>
                        <Link href="/upgrade">Upgrade</Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          toast.info("You're already on the pro plan");
                        }}
                        variant="outline"
                      >
                        Max
                      </Button>
                    )}
                  </article>
                </CardContent>
              </Card>
            </article>
          )}
        </article>
      )}
    </section>
  );
}

export default MyProfile;
