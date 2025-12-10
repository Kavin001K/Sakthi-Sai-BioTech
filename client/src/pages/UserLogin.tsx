import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { LogIn, User, AlertCircle, KeyRound, Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function UserLogin() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { userLogin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      const success = await userLogin(formData.email, formData.password);

      if (success) {
        toast({
          title: t('user.login.success.title', 'Login Successful'),
          description: t('user.login.success.description', 'Welcome back to Sakthi Sai Biotech'),
        });
        
        // Redirect to home
        setLocation('/');
      } else {
        setError(t('user.login.error.credentials', 'Please enter valid email and password'));
      }
    } catch (error) {
      setError(t('user.login.error.general', 'Login failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setLocation('/');
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
          <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-400 to-secondary" />

          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:rotate-6 transition-transform duration-300"
            >
              <User className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold text-foreground">
                {t('user.login.title', 'Customer Portal')}
              </CardTitle>
              <p className="text-muted-foreground mt-2 text-sm max-w-[80%] mx-auto">
                {t('user.login.subtitle', 'Access your Sakthi Sai Biotech account')}
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
                  <label htmlFor="email" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    {t('user.login.email', 'Email Address')}
                  </label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={t('user.login.emailPlaceholder', 'Enter your email')}
                      className="pl-4 border-muted-foreground/20 focus:border-primary transition-all h-12 bg-background/50 group-hover:bg-background"
                      data-testid="user-login-email"
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
                      {t('user.login.password', 'Password')}
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:text-primary/80"
                      onClick={() => setLocation('/forgot-password')}
                    >
                      {t('user.login.forgot', 'Forgot?')}
                    </Button>
                  </div>
                  <div className="relative group">
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={t('user.login.passwordPlaceholder', 'Enter your password')}
                      className="pl-4 border-muted-foreground/20 focus:border-primary transition-all h-12 bg-background/50 group-hover:bg-background"
                      data-testid="user-login-password"
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
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  disabled={isSubmitting}
                  data-testid="user-login-submit"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('user.login.signing', 'Signing in...')}
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      {t('user.login.submit', 'Sign In')}
                    </span>
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-4"
              >
                <p className="text-sm text-muted-foreground">
                  {t('user.login.noAccount', "Don't have an account?")}{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto font-semibold"
                    onClick={() => setLocation('/register')}
                  >
                    {t('user.login.register', 'Sign up now!')}
                  </Button>
                </p>
              </motion.div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 pt-6 border-t border-border/50"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="w-full text-muted-foreground hover:text-foreground transition-colors"
                data-testid="back-to-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('user.login.back', 'Back to Home')}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground opacity-60">
          <p>© 2024 Sakthi Sai BioTech. All rights reserved.</p>
          <p>Customer Portal v1.0.0</p>
        </div>
      </motion.div>
    </div>
  );
}