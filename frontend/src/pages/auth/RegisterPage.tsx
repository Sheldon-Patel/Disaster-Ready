import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { INDIA_STATES } from '../../types';

// Password strength helper
const getPasswordStrength = (password: string): { label: string; color: string; width: string } => {
  if (!password) return { label: '', color: '', width: '0%' };
  if (password.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '25%' };
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [password.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: '33%' };
  if (score === 2) return { label: 'Fair', color: 'bg-yellow-400', width: '60%' };
  if (score === 3) return { label: 'Good', color: 'bg-blue-400', width: '80%' };
  return { label: 'Strong', color: 'bg-green-500', width: '100%' };
};

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher',
    phone: '',
    school: '',
    grade: '',
    district: '',
    emergencyContact: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) { setError('Please enter your full name.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }

    setIsLoading(true);
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        school: formData.school || undefined,
        grade: formData.grade ? parseInt(formData.grade) : undefined,
        profile: {
          district: formData.district || undefined,
          emergencyContact: formData.emergencyContact || undefined
        }
      };
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
        setError('An account with this email already exists. Try logging in instead.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const eyeOff = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
  const eyeOn = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-200">
            <span className="text-white font-bold text-xl">DR</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join Disaster Ready
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-gray-100">

          {error && (
            <div className="mb-8 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

              {/* Left Column (Basic) */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Basic Info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        name="name" type="text" required value={formData.name} onChange={handleChange}
                        placeholder="John Doe"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        name="email" type="email" required value={formData.email} onChange={handleChange}
                        placeholder="you@example.com"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
                      <select
                        name="role" required value={formData.role} onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                      <input
                        name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Security (Bottom Left) */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2 mt-8">
                    Security
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                      <div className="relative">
                        <input
                          name="password" type={showPassword ? 'text' : 'password'} required
                          value={formData.password} onChange={handleChange}
                          placeholder="Min. 6 characters"
                          className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                        />
                        <button
                          type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? eyeOff : eyeOn}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: passwordStrength.width }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Strength: <span className="font-medium">{passwordStrength.label}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                      <div className="relative">
                        <input
                          name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required
                          value={formData.confirmPassword} onChange={handleChange}
                          placeholder="Re-enter password"
                          className={`appearance-none block w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm text-gray-900 ${formData.confirmPassword && formData.confirmPassword !== formData.password
                            ? 'border-red-400 bg-red-50'
                            : formData.confirmPassword && formData.confirmPassword === formData.password
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300'
                            }`}
                        />
                        <button
                          type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showConfirmPassword ? eyeOff : eyeOn}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Demographics) */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    School & Region
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">School Name *</label>
                      <input
                        name="school" type="text" required value={formData.school} onChange={handleChange}
                        placeholder="E.g. Heritage High"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                    {formData.role === 'student' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade *</label>
                        <select
                          name="grade" required value={formData.grade} onChange={handleChange}
                          className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                        >
                          <option value="">Select Grade</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">State / UT *</label>
                      <select
                        name="district" required value={formData.district} onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                      >
                        <option value="">Select Location</option>
                        {INDIA_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Emergency Contact *</label>
                      <input
                        name="emergencyContact" type="tel" required value={formData.emergencyContact} onChange={handleChange}
                        placeholder="Family or guardian #"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-red-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating account...
                      </div>
                    ) : 'Create Account'}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
