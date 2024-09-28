"use client";

import { profileSetting, TProfileSetting } from "@/helper/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-datepicker/dist/react-datepicker.css";
import { Bounce, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Tiptap = dynamic(() => import("@/app/component/ui/TextEditor/TipTap"), {
  ssr: false,
});
const UploadAvatar = dynamic(() => import("./UploadAvatar"), { ssr: false });

const ProfileSetting = ({ user }: any) => {
  const { data: session } = useSession();
  const [avatar, setAvatar] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, control } = useForm<TProfileSetting>({
    resolver: zodResolver(profileSetting),
    defaultValues: {
      displayName: user?.displayName,
      country: user?.country,
      gender: user?.gender || "",
      biography: user?.biography,
    },
  });

  const onSubmit = async (data: TProfileSetting) => {
    setLoading(true);
    try {
      const response = await fetch("/api/setting/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileAvatar: avatar && avatar,
          displayName: data?.displayName,
          country: data?.country,
          gender: data?.gender,
          dateOfBirth: data?.dateOfBirth,
          biography: data?.biography,
        }),
      });

      if (response.status === 200) {
        reset();
        router?.refresh();
        toast.success("Profile saved successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        reset();
        toast.error("Failed to save profile", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>
            Update your profile information here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6">
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label htmlFor="profile-picture">Profile Picture</Label>
            <div className="flex items-center space-x-4 relative">
              <UploadAvatar
                loading={loading}
                setLoading={setLoading}
                avatar={avatar}
                setAvatar={setAvatar}
                user={user}
                handleSubmit={handleSubmit}
                register={register}
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              {...register("displayName")}
              id="display-name"
              placeholder="Enter your display name"
            />
          </div>

          {/* Username (non-editable) */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={session?.user?.name || ""}
              disabled
            />{" "}
            <div className="text-muted-foreground dark:opacity-80 ml-1">
              <small>
                http://mijudramainfo.vercel.app/profile/
                {session?.user?.name || ""}
              </small>
            </div>
          </div>

          {/* Email (non-editable) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={session?.user?.email || ""}
              disabled
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Controller
              name="gender"
              control={control}
              defaultValue={user?.gender}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="gender">
                    <SelectValue
                      placeholder="Select gender"
                      defaultValue={user?.gender}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Country (now an input field) */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              {...register("country")}
              id="country"
              placeholder="Enter your country"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              {...register("dateOfBirth")}
              name="dateOfBirth"
              id="dob"
              type="date"
              defaultValue={
                user?.dateOfBirth?.toISOString()?.split("T")[0] || "YYYY-MM-DD"
              }
            />
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <div className="w-full">
              <Controller
                control={control}
                name="biography"
                render={({ field }) => {
                  return (
                    <Tiptap
                      description={user?.biography as string}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
            </div>{" "}
            <div>
              <span className="w-full md:w-[20%] lg:w-[15%]"></span>
              <p className="text-sm text-[#818a91]">
                Describe yourself in a sentence or two.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            {" "}
            <ClipLoader color="#fff" size={18} loading={loading} />
            <span className={`${loading && "ml-2"}`}>Submit</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProfileSetting;
