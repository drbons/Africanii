import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole, UserProfile } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BusinessProfileForm from '@/components/BusinessProfileForm';
import { Mail, Lock, User, EyeOff, Eye, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { getFirebaseErrorMessage } from '@/lib/firebase';

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, profile, signInWithGoogle, signUpWithEmail, updateProfile, addBusinessProfile } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const [pendingProfile, setPendingProfile] = useState<Partial<UserProfile> | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileUpdateAttempts, setProfileUpdateAttempts] = useState(0);
  
  // Additional check to handle profile updates after authentication completes
  useEffect(() => {
    // Only proceed if user is authenticated and we have a pendingProfile
    if (user && pendingProfile) {
      console.log('User authenticated, now updating profile with:', pendingProfile);
      
      // Async function to update the profile
      const updateUserProfile = async () => {
        try {
          await updateProfile(pendingProfile);
          console.log('Profile updated successfully after authentication');
          
          // If pendingProfile has role, proceed with navigation based on role
          if (pendingProfile.role) {
            if (pendingProfile.role === 'general') {
              navigate('/profile');
            } else if (pendingProfile.role === 'business') {
              setStep(3);
            }
          }
          
          // Clear the pending profile since it's been processed
          setPendingProfile(null);
        } catch (error) {
          console.error('Error updating profile after authentication:', error);
          // Still clear the pending profile to avoid loops
          setPendingProfile(null);
          // Show error to user
          setError(getFirebaseErrorMessage(error) || 'Failed to update profile');
        }
      };
      
      updateUserProfile();
    }
  }, [user, pendingProfile, updateProfile, navigate]);
  
  // Existing effects
  useEffect(() => {
    if (user && step === 1) {
      setStep(2); // Move to role selection
    }
  }, [user, step]);
  
  // Additional check for completed profile
  useEffect(() => {
    // If user is authenticated AND has a role already set, redirect to profile
    if (user && profile?.role && step === 2) {
      // User already has a role set, so redirect based on that role
      if (profile.role === 'general') {
        navigate('/profile');
      } else if (profile.role === 'business') {
        // If business owner but no business profile yet, go to step 3
        if (!profile.businessProfile) {
          setStep(3);
        } else {
          navigate('/profile');
        }
      }
    }
  }, [user, profile, step, navigate]);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const validateConfirmPassword = (confirm: string) => {
    if (!confirm) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirm !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };
  
  const validateFullName = (name: string) => {
    if (!name.trim()) {
      setFullNameError('Full name is required');
      return false;
    }
    setFullNameError('');
    return true;
  };
  
  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isFullNameValid = validateFullName(fullName);
    
    return isEmailValid && isPasswordValid && isConfirmPasswordValid && isFullNameValid;
  };
  
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '' };
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;
    
    if (criteriaCount <= 2) return { strength: 1, text: 'Weak', color: 'text-red-500' };
    if (criteriaCount === 3) return { strength: 2, text: 'Fair', color: 'text-yellow-500' };
    if (criteriaCount === 4) return { strength: 3, text: 'Good', color: 'text-blue-500' };
    return { strength: 4, text: 'Strong', color: 'text-green-500' };
  };
  
  const passwordStrength = getPasswordStrength(password);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      setStep(2);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // First, create the user account
      await signUpWithEmail(email, password);
      console.log('User account created, waiting for auth state to update');
      
      // Store profile data to be applied once user auth state is available
      // Don't set role yet - we'll let the user choose
      setPendingProfile({
        fullName,
        email,
        // Don't set a default role so the user must select one
        updatedAt: new Date().toISOString()
      });
      
      // Move to role selection step (the profile will be updated by the effect)
      setStep(2);
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Function to delay execution (for retry mechanisms)
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleRoleSelect = async (selectedRole: UserRole) => {
    setLoading(true);
    setRole(selectedRole);
    
    try {
      console.log('Updating role to:', selectedRole);
      
      // First update the local state immediately for better UX
      setPendingProfile(prev => ({
        ...(prev || {}),
        role: selectedRole,
        updatedAt: new Date().toISOString()
      }));
      
      // Simplified approach - make a single update attempt with longer timeout
      try {
        // Update the user profile with the selected role
        await updateProfile({
          role: selectedRole,
          updatedAt: new Date().toISOString()
        });
        console.log('Role update successful');
      } catch (error) {
        console.error('Error updating profile:', error);
        // Continue with navigation even if profile update has issues
        // The profile will sync when connectivity is restored
      }
      
      // Immediately proceed with navigation
      console.log('Proceeding with navigation');
      if (selectedRole === 'general') {
        navigate('/profile');
      } else {
        setStep(3);
      }
    } catch (error: any) {
      console.error('Final error in role selection flow:', error);
      setError(getFirebaseErrorMessage(error) || 'Failed to update role. Please try again.');
      // Still allow user to proceed
      setTimeout(() => {
        if (selectedRole === 'general') {
          navigate('/profile');
        } else {
          setStep(3);
        }
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessProfileSubmit = async (businessProfile: any) => {
    try {
      setLoading(true);
      await addBusinessProfile(businessProfile);
      navigate('/profile');
    } catch (error: any) {
      console.error('Error creating business profile:', error);
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {step === 1 && (
          <Card className="shadow-lg border-t-4 border-t-green-500 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Create Your Account</CardTitle>
              <CardDescription className="text-center">
                Join our growing community of African business professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleEmailSignUp} className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="fullName" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={fullNameError ? "border-red-500" : ""}
                    placeholder="Enter your full name"
                  />
                  {fullNameError && (
                    <p className="mt-1 text-sm text-red-500">{fullNameError}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emailError ? "border-red-500" : ""}
                    placeholder="Enter your email"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={passwordError ? "border-red-500 pr-10" : "pr-10"}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {passwordError ? (
                    <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                  ) : (
                    <div className="mt-1 flex items-center gap-1">
                      <Info className="h-4 w-4 text-gray-500" />
                      <p className={`text-sm ${passwordStrength.color}`}>
                        Password Strength: {passwordStrength.text}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={confirmPasswordError ? "border-red-500 pr-10" : "pr-10"}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <img
                  src="/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign up with Google
              </Button>

              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Choose Your Role</CardTitle>
              <CardDescription className="text-center">
                Select how you want to use our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    console.log("General user button clicked");
                    handleRoleSelect('general');
                  }}
                  variant="outline"
                  className="w-full p-6 h-auto flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 focus:border-green-500 focus:bg-green-50"
                  disabled={loading}
                >
                  <User className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">General User</h3>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    Browse businesses, connect with others, and explore opportunities
                  </p>
                </Button>

                <Button
                  onClick={() => {
                    console.log("Business owner button clicked");
                    handleRoleSelect('business');
                  }}
                  variant="outline"
                  className="w-full p-6 h-auto flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 focus:border-blue-500 focus:bg-blue-50"
                  disabled={loading}
                >
                  <CheckCircle2 className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Business Owner</h3>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    Create and manage your business profile, reach more customers
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <BusinessProfileForm
            onSubmit={handleBusinessProfileSubmit}
            isEditing={false}
          />
        )}
      </div>
    </div>
  );
}