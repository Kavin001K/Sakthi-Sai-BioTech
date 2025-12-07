import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { LogIn, Shield, AlertCircle, KeyRound, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/admin/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        toast({
          title: t('admin.login.success.title', 'Login Successful'),
          description: t('admin.login.success.description', 'Welcome to the admin dashboard'),
        });
        // Redirection handled by useEffect
      } else {
        setError(t('admin.login.error.credentials', 'Invalid username or password'));
      }
    } catch (error) {
      setError(t('admin.login.error.general', 'Login failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="w-full shadow-2xl border-white/20 backdrop-blur-md bg-white/80 dark:bg-black/40 overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-primary via-green-400 to-secondary" />

          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-green-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:rotate-6 transition-transform duration-300"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold text-foreground">
                {t('admin.login.title', 'Admin Portal')}
              </CardTitle>
              <p className="text-muted-foreground mt-2 text-sm max-w-[80%] mx-auto">
                {t('admin.login.subtitle', 'Secure access for Sakthi Sai Biotech Management')}
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="pt-6">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="username" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    {t('admin.login.username', 'Username or Email')}
                  </label>
                  <div className="relative group">
                    <Input
                      id="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder={t('admin.login.usernamePlaceholder', 'Enter credentials')}
                      className="pl-4 border-muted-foreground/20 focus:border-primary transition-all h-12 bg-background/50 group-hover:bg-background"
                      data-testid="admin-login-username"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-primary" />
                      {t('admin.login.password', 'Password')}
                    </label>
                  </div>
                  <div className="relative group">
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={t('admin.login.passwordPlaceholder', 'Enter password')}
                      className="pl-4 border-muted-foreground/20 focus:border-primary transition-all h-12 bg-background/50 group-hover:bg-background"
                      data-testid="admin-login-password"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  disabled={isSubmitting}
                  data-testid="admin-login-submit"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('admin.login.signing', 'Authenticating...')}
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      {t('admin.login.submit', 'Sign In to Dashboard')}
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-xs text-muted-foreground bg-muted/30 py-2 px-4 rounded-full inline-block border border-border/50">
                {t('admin.login.demo', 'Demo Access: admin / admin123')}
              </p>
            </motion.div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground opacity-60">
          <p>© 2024 Sakthi Sai BioTech. All rights reserved.</p>
          <p>Secure Admin Environment v1.0.0</p>
        </div>
      </motion.div>
    </div>
  );
}
