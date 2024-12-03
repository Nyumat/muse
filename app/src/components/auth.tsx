import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Fetcher from "@/lib/fetcher";
import { useUserStore } from "@/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2, Music2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

// TODO: Make more restrictive
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters");
const passwordSchema = z.string();
const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
const registerSchema = z.object({
  username: usernameSchema,
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const loginFn = async (data: LoginFormData) => {
  const api = Fetcher.getInstance();
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    } else {
      throw new Error("An error occurred");
    }
  }
};

const registerFn = async (data: RegisterFormData) => {
  const api = Fetcher.getInstance();
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    } else {
      throw new Error("An error occurred");
    }
  }
};

export function LoginCard() {
  const { setToken } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const response = await loginFn(data);
      toast.success(response.message);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="z-10 mx-auto w-full max-w-sm rounded-md bg-background px-6 py-12 shadow">
            <div className="flex flex-col items-center">
              <Music2 className="h-12 w-auto text-primary mb-2" />
              <p className="text-2xl font-bold">Login</p>
              <p className="text-muted-foreground">
                Welcome back! Log in to your account
              </p>
            </div>

            <div className="z-10 mx-auto w-full max-w-sm rounded-md bg-background px-6 py-12 shadow">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>Don't have an account?</p>
              <Link to="/register" className="font-medium text-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RegisterCard() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken } = useUserStore();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const response = await registerFn(data);
      toast.success(response.message);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="z-10 mx-auto w-full max-w-sm rounded-md bg-background px-6 py-12 shadow">
            <div className="mb-6 flex flex-col items-center">
              <Music2 className="h-12 w-auto text-primary mb-2" />
              <p className="text-2xl font-bold">Create an account</p>
              <p className="text-muted-foreground">
                Sign up in less than 2 minutes
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>Already have an account?</p>
              <Link to="/login" className="font-medium text-primary">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AuthLayout() {
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-3xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
