import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { LogIn, Shield, AlertCircle, KeyRound } from "lucide-react";
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
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: "",
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
      const success = await login(formData.username, formData.password);
      
      if (success) {
        toast({
          title: t('admin.login.success.title', 'Login Successful'),
          description: t('admin.login.success.description', 'Welcome to the admin dashboard'),
        });
        setLocation('/admin/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#22C55E]/10 via-[#0288D1]/10 to-[#F57C00]/10 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-primary/20 backdrop-blur-sm bg-background/95">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-[#0288D1] to-[#F57C00] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#0288D1] to-[#F57C00] bg-clip-text text-transparent">
                {t('admin.login.title', 'Admin Login')}
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {t('admin.login.subtitle', 'Access the Sakthi Sai Biotech admin dashboard')}
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#0288D1]" />
                  {t('admin.login.username', 'Email / Username')}
                </label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder={t('admin.login.usernamePlaceholder', 'Enter your email or username')}
                  className="border-primary/20 focus:border-[#0288D1] transition-all"
                  data-testid="admin-login-username"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#0288D1]" />
                    {t('admin.login.password', 'Password')}
                  </label>
                  <a href="#" className="text-xs text-[#0288D1] hover:text-[#F57C00] transition-colors">
                    {t('admin.login.forgotPassword', 'Forgot Password?')}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t('admin.login.passwordPlaceholder', 'Enter your password')}
                  className="border-primary/20 focus:border-[#0288D1] transition-all"
                  data-testid="admin-login-password"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0288D1] to-[#0277BD] hover:from-[#F57C00] hover:to-[#E65100] text-white font-semibold py-6 text-lg shadow-lg transition-all duration-300"
                    disabled={isSubmitting}
                    data-testid="admin-login-submit"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        {t('admin.login.signing', 'Signing In...')}
                      </div>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        {t('admin.login.submit', 'Login')}
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>

            <motion.div
              className="mt-6 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="bg-muted/50 rounded-lg p-3">
                {t('admin.login.demo', 'Demo credentials: admin / admin123')}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
