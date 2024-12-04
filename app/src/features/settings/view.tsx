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
  Settings,
  Shield,
  Trash2,
  User,
  UsersIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PrivacySettings = {
  profileVisibility: "private" | "friends" | "public";
  playlistVisibility: "private" | "friends" | "public";
  isRecommendationsEnabled: boolean;
};

type UserPreferences = {
  selectedGenres: string[];
  selectedArtists: string[];
};

interface SettingsState extends PrivacySettings, UserPreferences {
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetSettings: () => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      profileVisibility: "friends",
      playlistVisibility: "friends",
      isRecommendationsEnabled: true,
      selectedGenres: [],
      selectedArtists: [],

      updatePrivacySettings: (settings) =>
        set((state) => ({ ...state, ...settings })),

      updatePreferences: (preferences) =>
        set((state) => ({ ...state, ...preferences })),

      resetSettings: () =>
        set({
          profileVisibility: "friends",
          playlistVisibility: "friends",
          isRecommendationsEnabled: true,
          selectedGenres: [],
          selectedArtists: [],
        }),
    }),
    {
      name: "user-settings-storage",
    }
  )
);

const GENRES = [
  { id: "rock", name: "Rock" },
  { id: "pop", name: "Pop" },
  { id: "hip-hop", name: "Hip Hop" },
  { id: "electronic", name: "Electronic" },
  { id: "classical", name: "Classical" },
  { id: "jazz", name: "Jazz" },
  { id: "country", name: "Country" },
  { id: "indie", name: "Indie" },
];

const ARTISTS = [
  { id: "queen", name: "Queen" },
  { id: "metallica", name: "Metallica" },
  { id: "taylorSwift", name: "Taylor Swift" },
  { id: "radiohead", name: "Radiohead" },
  { id: "kendrickLamar", name: "Kendrick Lamar" },
  { id: "beethoven", name: "Beethoven" },
];

export function SettingsView() {
  const navigate = useNavigate();
  const settings = useSettingsStore();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    settings.resetSettings();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      // Implement account deletion logic here
      settings.resetSettings();
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Failed to delete account:", error);
      } else {
        toast.error("Server error. Please try again later.");
        console.error(error);
      }
    }
  };

  const handlePrivacyChange = (
    type: keyof Pick<
      PrivacySettings,
      "profileVisibility" | "playlistVisibility"
    >,
    value: "private" | "friends" | "public"
  ) => {
    settings.updatePrivacySettings({ [type]: value });
  };

  const visibilityOptions = [
    { value: "private", icon: LockIcon, label: "Private" },
    { value: "friends", icon: UsersIcon, label: "Friends" },
    { value: "public", icon: GlobeIcon, label: "Public" },
  ];

  return (
    <Card className="h-full mx-auto bg-black/10 backdrop-blur-md border-none shadow-sm shadow-purple-500/50 border-t-2 border-t-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2" /> Settings
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
                        settings.profileVisibility === option.value
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
                        settings.playlistVisibility === option.value
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
                  checked={settings.isRecommendationsEnabled}
                  onCheckedChange={(checked) =>
                    settings.updatePrivacySettings({
                      isRecommendationsEnabled: checked,
                    })
                  }
                />
                <Label htmlFor="recommendations">
                  Enable Personalized Recommendations
                </Label>
              </div>
            </div>
          </TabsContent>

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
                  onValueChange={(values) =>
                    settings.updatePreferences({ selectedGenres: values })
                  }
                  defaultValue={settings.selectedGenres}
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
                  onValueChange={(values) =>
                    settings.updatePreferences({ selectedArtists: values })
                  }
                  defaultValue={settings.selectedArtists}
                  placeholder="Select options"
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                />
              </div>
            </div>
          </TabsContent>

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
  );
}
