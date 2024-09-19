import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  MoreHorizontal,
  Link as LinkIcon,
  Image as ImageIcon,
  ThumbsUp,
  MessageCircle,
  Share2,
} from "lucide-react";
import { IList } from "@/helper/type";
import Image from "next/image";

export default function Feeds({ list }: IList) {
  const [postText, setPostText] = useState("");
  const [postLink, setPostLink] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPostImage(e.target.files[0]);
    }
  };

  const handlePost = () => {
    // Handle post submission here
    console.log({ postText, postLink, postImage });
    // Reset form
    setPostText("");
    setPostLink("");
    setPostImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Create a Post</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="mb-4"
          />
          <div className="flex gap-4 mb-4">
            <Input
              type="url"
              placeholder="Add a link"
              value={postLink}
              onChange={(e) => setPostLink(e.target.value)}
              className="flex-grow"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button variant="outline" className="w-full">
                <ImageIcon className="mr-2 h-4 w-4" /> Upload Image
              </Button>
            </label>
          </div>
          {postImage && (
            <p className="text-sm text-muted-foreground mb-4">
              Image selected: {postImage.name}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handlePost}>Post</Button>
        </CardFooter>
      </Card>

      <div className="space-y-8">
        {[1, 2, 3].map((feed) => (
          <Card key={feed}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${feed}`}
                      alt="User avatar"
                    />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">User Name</p>
                    <p className="text-xs text-muted-foreground">
                      Posted on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                This is a sample post content. It can be much longer and may
                include links or images.
              </p>
              {feed % 2 === 0 && (
                <Image
                  src={`https://picsum.photos/seed/${feed}/800/400`}
                  alt="Post image"
                  width={100}
                  height={100}
                  className="mt-4 rounded-md w-full"
                />
              )}
              <div className="flex flex-group">
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p>askdlaksdpwqie</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
