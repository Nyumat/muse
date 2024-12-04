import { MultiSelect } from "@/components/multi-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GlobeIcon,
  HeartIcon,
  LockIcon,
  LogOut,
  Music,
  Shield,
  Trash2,
  User,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// Type definitions
type PrivacySettings = {
  profileVisibility: "private" | "friends" | "public";
  playlistVisibility: "private" | "friends" | "public";
  isRecommendationsEnabled: boolean;
};

type GenrePreference = {
  id: string;
  name: string;
};

type ArtistPreference = {
  id: string;
  name: string;
};

const GENRES: GenrePreference[] = [
  { id: "rock", name: "Rock" },
  { id: "pop", name: "Pop" },
  { id: "hip-hop", name: "Hip Hop" },
  { id: "electronic", name: "Electronic" },
  { id: "classical", name: "Classical" },
  { id: "jazz", name: "Jazz" },
  { id: "country", name: "Country" },
  { id: "indie", name: "Indie" },
];

const ARTISTS: ArtistPreference[] = [
  { id: "queen", name: "Queen" },
  { id: "metallica", name: "Metallica" },
  { id: "taylorSwift", name: "Taylor Swift" },
  { id: "radiohead", name: "Radiohead" },
  { id: "kendrickLamar", name: "Kendrick Lamar" },
  { id: "beethoven", name: "Beethoven" },
];

export function SettingsView() {
  const navigate = useNavigate();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "friends",
    playlistVisibility: "friends",
    isRecommendationsEnabled: true,
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const handleLogout = () => {
    // Remove auth token from local storage
    localStorage.removeItem("authToken");

    // Show logout toast
    toast.success("Logged out successfully");

    // Navigate to home page
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      // Implement account deletion logic here
      // This would typically involve calling an API endpoint
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const handlePrivacyChange = (
    type: keyof Pick<
      PrivacySettings,
      "profileVisibility" | "playlistVisibility"
    >,
    value: "private" | "friends" | "public"
  ) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const visibilityOptions = [
    { value: "private", icon: LockIcon, label: "Private" },
    { value: "friends", icon: UsersIcon, label: "Friends" },
    { value: "public", icon: GlobeIcon, label: "Public" },
  ];

  return (
    <>
      <Card className="h-full mx-auto bg-black/10 backdrop-blur-md border-none shadow-sm shadow-purple-500/50 border-t-2 border-t-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-3" /> Settings
          </CardTitle>
          <CardDescription>
            Manage your account settings, privacy preferences, and more
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="privacy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="privacy">
                <Shield className="mr-2 h-4 w-4" /> Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <HeartIcon className="mr-2 h-4 w-4" /> Preferences
              </TabsTrigger>
              <TabsTrigger value="account">
                <User className="mr-2 h-4 w-4" /> Account
              </TabsTrigger>
            </TabsList>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="mr-2" /> Profile Visibility
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    {visibilityOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          privacySettings.profileVisibility === option.value
                            ? "default"
                            : "outline"
                        }
                        className="flex items-center"
                        onClick={() =>
                          handlePrivacyChange(
                            "profileVisibility",
                            option.value as "private" | "friends" | "public"
                          )
                        }
                      >
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Music className="mr-2" /> Playlist Visibility
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    {visibilityOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          privacySettings.playlistVisibility === option.value
                            ? "default"
                            : "outline"
                        }
                        className="flex items-center"
                        onClick={() =>
                          handlePrivacyChange(
                            "playlistVisibility",
                            option.value as "private" | "friends" | "public"
                          )
                        }
                      >
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Switch
                    id="recommendations"
                    checked={privacySettings.isRecommendationsEnabled}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        isRecommendationsEnabled: checked,
                      }))
                    }
                  />
                  <Label htmlFor="recommendations">
                    Enable Personalized Recommendations
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Settings */}
            <TabsContent value="preferences">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Music className="mr-2" /> Favorite Genres
                  </h3>
                  <MultiSelect
                    options={GENRES.map((genre) => ({
                      label: genre.name,
                      value: genre.id,
                    }))}
                    onValueChange={setSelectedGenres}
                    defaultValue={selectedGenres}
                    placeholder="Select options"
                    variant="inverted"
                    animation={2}
                    maxCount={3}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <HeartIcon className="mr-2" /> Favorite Artists
                  </h3>
                  <MultiSelect
                    options={ARTISTS.map((artist) => ({
                      label: artist.name,
                      value: artist.id,
                    }))}
                    onValueChange={setSelectedArtists}
                    defaultValue={selectedArtists}
                    placeholder="Select options"
                    variant="inverted"
                    animation={2}
                    maxCount={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Logout</h3>
                    <p className="text-sm text-muted-foreground">
                      End your current session
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-black/10 hover:bg-black/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2" /> Logout
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-destructive">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently remove your account and all associated data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-red-500/20 hover:bg-red-500/30"
                      >
                        <Trash2 className="mr-2" /> Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
