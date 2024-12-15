import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Fetcher from "@/lib/fetcher";
import { useUserStore } from "@/stores/userStore";
import { z } from "zod";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import { ChevronLeft, Loader2, Music2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

const usernameSchema = z.string().min(3, "Username must be at least 3 characters");
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
        }
        throw new Error("An error occurred");
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
        }
        throw new Error("An error occurred");
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
        <section className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-4">
                        <Music2 className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe" {...field} />
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
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account?</span>{" "}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        Sign up
                    </Link>
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
        <section className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-4">
                        <Music2 className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Enter your details to get started</p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe" {...field} />
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
                                    <FormLabel>Full name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
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
                                        <Input type="email" placeholder="john@example.com" {...field} />
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
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
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

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account?</span>{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function AuthLayout() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background relative">
            <nav className="absolute top-6 left-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="group gap-2"
                >
                    <ChevronLeft className="h-4 w-4 transition-all group-hover:translate-x-[-2px]" />
                    <span>Back</span>
                </Button>
            </nav>
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="relative w-full max-w-2xl">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}